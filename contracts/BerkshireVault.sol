// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IERC20.sol";
import "./interfaces/IUniswapV2Router02.sol";

/**
 * @title BerkshireVault
 * @notice The "Never Sell" Perpetual Treasury & Liquidity Engine for Berkshire Hoodaway ($BRKHOOD).
 *
 * "Our favorite holding period is forever." — Warren Buffett
 *
 * MECHANICS:
 * 1. Accumulates protocol trading fees from Robinhood Chain / PONS.
 * 2. When fees exceed minExecutionBalance (~$100 / 0.03 ETH), ANYONE can trigger executeBuyAndPool().
 * 3. 50% of ETH is swapped for the project token ($BRKHOOD).
 * 4. 50% of ETH is swapped across a curated basket of Robinhood Chain memecoins according to active allocation weights.
 * 5. Pairs $BRKHOOD directly with each curated meme and deposits into Liquidity Pools.
 * 6. LP tokens and acquired tokens are permanently held in this contract. NO withdrawal function exists.
 * 7. Curated meme allocation updates are subject to a strict 24-HOUR TIMELOCK and can ONLY be proposed and executed by the OWNER.
 */
contract BerkshireVault {
    // --- State Variables ---
    address public immutable owner;
    address public immutable hoodToken;
    IUniswapV2Router02 public immutable router;

    // Minimum balance required to trigger a batch run (e.g. 0.03 ETH =~ $100)
    uint256 public minExecutionBalance = 0.03 ether;

    // Strict 24-hour timelock for meme allocation adjustments
    uint256 public constant TIMELOCK_DURATION = 24 hours;
    uint256 public constant PROPOSAL_EXPIRY_GRACE = 7 days;
    uint256 public constant BASIS_POINTS_DIVISOR = 10000;

    // Curated memes & allocations
    address[] public curatedMemes;
    uint256[] public memeWeights; // in basis points, sum must be 10000

    // Timelock Proposals
    struct AllocationProposal {
        address[] tokens;
        uint256[] weights;
        uint256 eta;
        bool executed;
        bool canceled;
    }

    AllocationProposal[] public proposals;

    // Lifetime Stats
    uint256 public totalFeesSwallowed;
    uint256 public totalBuyRuns;
    uint256 public totalHoodPurchased;

    // Reentrancy guard
    uint256 private _status;
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;

    // --- Events ---
    event FeesReceived(address indexed sender, uint256 amount, uint256 totalFeesSwallowed);
    event BatchBuyAndPoolExecuted(
        uint256 indexed runId,
        uint256 totalEthSpent,
        uint256 hoodAcquired,
        uint256 timestamp
    );
    event LiquidityAddedForMeme(
        address indexed memeToken,
        uint256 hoodAmount,
        uint256 memeAmount,
        uint256 liquidityCreated
    );
    event AllocationProposed(
        uint256 indexed proposalId,
        address[] tokens,
        uint256[] weights,
        uint256 eta
    );
    event AllocationExecuted(uint256 indexed proposalId);
    event AllocationProposalCanceled(uint256 indexed proposalId);
    event MinExecutionBalanceUpdated(uint256 newBalance);

    // --- Modifiers ---
    modifier onlyOwner() {
        require(msg.sender == owner, "BerkshireVault: caller is not the owner");
        _;
    }

    modifier nonReentrant() {
        require(_status != _ENTERED, "BerkshireVault: reentrant call");
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }

    /**
     * @param _hoodToken Address of the Berkshire Hoodaway token ($BRKHOOD)
     * @param _router Address of the Robinhood Chain DEX router (e.g. Uniswap V2 / PONS Router)
     * @param _initialMemes Initial curated memecoin addresses
     * @param _initialWeights Initial allocation weights in basis points (sum = 10000)
     */
    constructor(
        address _hoodToken,
        address _router,
        address[] memory _initialMemes,
        uint256[] memory _initialWeights
    ) {
        require(_hoodToken != address(0), "Invalid hood token");
        require(_router != address(0), "Invalid router");
        require(_initialMemes.length == _initialWeights.length, "Array length mismatch");
        require(_initialMemes.length > 0, "Empty curated list");

        owner = msg.sender;
        hoodToken = _hoodToken;
        router = IUniswapV2Router02(_router);
        _status = _NOT_ENTERED;

        uint256 totalWeight = 0;
        for (uint256 i = 0; i < _initialMemes.length; i++) {
            require(_initialMemes[i] != address(0), "Zero address meme token");
            require(_initialMemes[i] != _hoodToken, "Cannot allocate meme weight to hood token");
            require(_initialWeights[i] > 0, "Weight must be > 0");
            totalWeight += _initialWeights[i];
        }
        require(totalWeight == BASIS_POINTS_DIVISOR, "Weights must sum to 10000");

        curatedMemes = _initialMemes;
        memeWeights = _initialWeights;
    }

    /**
     * @notice Receives native ETH fees from Robinhood Chain trading / PONS creator fees.
     */
    receive() external payable {
        totalFeesSwallowed += msg.value;
        emit FeesReceived(msg.sender, msg.value, totalFeesSwallowed);
    }

    // --- Public Automation / Execution ---

    /**
     * @notice Executes the 50/50 buy and liquidity deposit.
     * Open to anyone (community or team) when unallocated balance >= minExecutionBalance (~$100).
     * @param minHoodOut Minimum amount of $BRKHOOD to receive from the 50% ETH swap (calculated with max 5% slippage on frontend).
     * @param minMemesOut Minimum amounts of curated meme tokens to receive (calculated with max 5% slippage).
     * @param minHoodLp Minimum $BRKHOOD amounts acceptable when adding liquidity.
     * @param minMemeLp Minimum Meme amounts acceptable when adding liquidity.
     * @param deadline Transaction expiration timestamp.
     */
    function executeBuyAndPool(
        uint256 minHoodOut,
        uint256[] calldata minMemesOut,
        uint256[] calldata minHoodLp,
        uint256[] calldata minMemeLp,
        uint256 deadline
    ) external nonReentrant {
        require(block.timestamp <= deadline, "BerkshireVault: transaction expired");
        uint256 currentBalance = address(this).balance;
        require(currentBalance >= minExecutionBalance, "BerkshireVault: balance below execution threshold");
        require(minMemesOut.length == curatedMemes.length, "Invalid minMemesOut length");
        require(minHoodLp.length == curatedMemes.length, "Invalid minHoodLp length");
        require(minMemeLp.length == curatedMemes.length, "Invalid minMemeLp length");

        // 1. Calculate the 50/50 split
        uint256 ethForHood = currentBalance / 2;
        uint256 ethForMemes = currentBalance - ethForHood;

        address weth = router.WETH();

        // 2. Buy $BRKHOOD with 50% of the ETH
        uint256 hoodBefore = IERC20(hoodToken).balanceOf(address(this));
        address[] memory hoodPath = new address[](2);
        hoodPath[0] = weth;
        hoodPath[1] = hoodToken;

        router.swapExactETHForTokensSupportingFeeOnTransferTokens{value: ethForHood}(
            minHoodOut,
            hoodPath,
            address(this),
            deadline
        );

        uint256 hoodBought = IERC20(hoodToken).balanceOf(address(this)) - hoodBefore;
        require(hoodBought > 0, "BerkshireVault: zero hood bought");
        totalHoodPurchased += hoodBought;

        // 3. Buy Curated Memecoins with remaining 50% of ETH
        uint256 memeCount = curatedMemes.length;
        uint256[] memory memeAmountsBought = new uint256[](memeCount);

        for (uint256 i = 0; i < memeCount; i++) {
            uint256 memeEth = (ethForMemes * memeWeights[i]) / BASIS_POINTS_DIVISOR;
            if (memeEth == 0) continue;

            address memeToken = curatedMemes[i];
            uint256 memeBalBefore = IERC20(memeToken).balanceOf(address(this));

            address[] memory memePath = new address[](2);
            memePath[0] = weth;
            memePath[1] = memeToken;

            router.swapExactETHForTokensSupportingFeeOnTransferTokens{value: memeEth}(
                minMemesOut[i],
                memePath,
                address(this),
                deadline
            );

            memeAmountsBought[i] = IERC20(memeToken).balanceOf(address(this)) - memeBalBefore;
        }

        // 4. Pair $BRKHOOD with each Memecoin and add to Liquidity Pools
        for (uint256 i = 0; i < memeCount; i++) {
            address memeToken = curatedMemes[i];
            uint256 memeAmount = memeAmountsBought[i];
            if (memeAmount == 0) continue;

            uint256 hoodPortion = (hoodBought * memeWeights[i]) / BASIS_POINTS_DIVISOR;
            if (hoodPortion == 0) continue;

            // Approve router
            _safeApprove(hoodToken, address(router), hoodPortion);
            _safeApprove(memeToken, address(router), memeAmount);

            // Add liquidity directly between $BRKHOOD and MemeToken
            // LP tokens are minted to address(this) where they are permanently locked!
            (, , uint256 liquidityCreated) = router.addLiquidity(
                hoodToken,
                memeToken,
                hoodPortion,
                memeAmount,
                minHoodLp[i],
                minMemeLp[i],
                address(this), // Permanently locked in the Vault!
                deadline
            );

            emit LiquidityAddedForMeme(memeToken, hoodPortion, memeAmount, liquidityCreated);
        }

        totalBuyRuns++;
        emit BatchBuyAndPoolExecuted(totalBuyRuns, currentBalance, hoodBought, block.timestamp);
    }

    // --- Timelock Governance for Meme Allocations (Restricted to OWNER) ---

    /**
     * @notice Propose a new curated list of memecoins and weights.
     * ONLY THE OWNER can propose changes.
     * Enforces a mandatory 24-hour waiting period before execution.
     */
    function proposeAllocations(
        address[] calldata newTokens,
        uint256[] calldata newWeights
    ) external onlyOwner returns (uint256 proposalId) {
        require(newTokens.length == newWeights.length, "Length mismatch");
        require(newTokens.length > 0, "Empty list");

        uint256 totalWeight = 0;
        for (uint256 i = 0; i < newTokens.length; i++) {
            require(newTokens[i] != address(0), "Zero address token");
            require(newTokens[i] != hoodToken, "Cannot allocate to hood token");
            require(newWeights[i] > 0, "Weight must be > 0");
            totalWeight += newWeights[i];
        }
        require(totalWeight == BASIS_POINTS_DIVISOR, "Weights must sum to 10000");

        proposalId = proposals.length;
        uint256 eta = block.timestamp + TIMELOCK_DURATION;

        proposals.push(
            AllocationProposal({
                tokens: newTokens,
                weights: newWeights,
                eta: eta,
                executed: false,
                canceled: false
            })
        );

        emit AllocationProposed(proposalId, newTokens, newWeights, eta);
    }

    /**
     * @notice Executes an allocation proposal once the 24-hour timelock has elapsed.
     * ONLY THE OWNER can execute the changes.
     */
    function executeAllocations(uint256 proposalId) external onlyOwner {
        require(proposalId < proposals.length, "Invalid proposal ID");
        AllocationProposal storage prop = proposals[proposalId];
        require(!prop.executed, "Already executed");
        require(!prop.canceled, "Proposal canceled");
        require(block.timestamp >= prop.eta, "Timelock: 24h delay not met yet");
        require(block.timestamp <= prop.eta + PROPOSAL_EXPIRY_GRACE, "Proposal expired");

        prop.executed = true;
        curatedMemes = prop.tokens;
        memeWeights = prop.weights;

        emit AllocationExecuted(proposalId);
    }

    /**
     * @notice Cancels a pending proposal if you decide not to proceed.
     * ONLY THE OWNER can cancel.
     */
    function cancelProposal(uint256 proposalId) external onlyOwner {
        require(proposalId < proposals.length, "Invalid proposal ID");
        AllocationProposal storage prop = proposals[proposalId];
        require(!prop.executed, "Already executed");
        require(!prop.canceled, "Already canceled");

        prop.canceled = true;
        emit AllocationProposalCanceled(proposalId);
    }

    /**
     * @notice Updates the minimum execution threshold (default: 0.03 ETH =~ $100).
     */
    function updateMinExecutionBalance(uint256 newBalance) external onlyOwner {
        require(newBalance >= 0.005 ether, "Threshold too low");
        minExecutionBalance = newBalance;
        emit MinExecutionBalanceUpdated(newBalance);
    }

    // --- View Functions ---

    function getCuratedMemes() external view returns (address[] memory) {
        return curatedMemes;
    }

    function getMemeWeights() external view returns (uint256[] memory) {
        return memeWeights;
    }

    function getProposalCount() external view returns (uint256) {
        return proposals.length;
    }

    function getProposal(uint256 proposalId)
        external
        view
        returns (
            address[] memory tokens,
            uint256[] memory weights,
            uint256 eta,
            bool executed,
            bool canceled
        )
    {
        require(proposalId < proposals.length, "Invalid proposal ID");
        AllocationProposal storage prop = proposals[proposalId];
        return (prop.tokens, prop.weights, prop.eta, prop.executed, prop.canceled);
    }

    function unallocatedBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // --- Internal Helpers ---

    function _safeApprove(address token, address spender, uint256 amount) internal {
        (bool success, bytes memory data) = token.call(
            abi.encodeWithSelector(IERC20.approve.selector, spender, amount)
        );
        require(success && (data.length == 0 || abi.decode(data, (bool))), "Approve failed");
    }

    // =========================================================================
    //  NOTE: THE "NEVER SELL" GUARANTEE
    //  There are NO withdrawal, extraction, or token transfer functions in this contract.
    //  Any ETH, $BRKHOOD, Memecoins, or LP tokens entered or minted into this Vault
    //  are mathematically trapped forever in maximum Warren Buffett fashion.
    // =========================================================================
}
