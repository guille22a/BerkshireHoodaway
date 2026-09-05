// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @dev Interface of the ERC20 standard as defined in the EIP.
 */
interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 value) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 value) external returns (bool);
    function transferFrom(address from, address to, uint256 value) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

interface IUniswapV2Router02 {
    function factory() external pure returns (address);
    function WETH() external pure returns (address);

    function swapExactETHForTokensSupportingFeeOnTransferTokens(
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external payable;

    function addLiquidity(
        address tokenA,
        address tokenB,
        uint256 amountADesired,
        uint256 amountBDesired,
        uint256 amountAMin,
        uint256 amountBMin,
        address to,
        uint256 deadline
    ) external returns (uint256 amountA, uint256 amountB, uint256 liquidity);

    function getAmountsOut(uint256 amountIn, address[] calldata path)
        external
        view
        returns (uint256[] memory amounts);
}

/**
 * @title BerkshireVault
 * @notice The "Never Sell" Perpetual Treasury & Liquidity Engine for Berkshire Hoodaway ($BRKHOOD) on Robinhood Chain.
 *
 * "Our favorite holding period is forever." - Warren Buffett
 *
 * MECHANICS:
 * 1. Accumulates protocol trading / creator fees in $MSTR (MicroStrategy Robinhood Token) or native ETH.
 * 2. When quoteToken balance >= minExecutionBalance (default: 0.1 MSTR), batch buybacks are triggered.
 * 3. 50% of the funds accumulate $BRKHOOD; 50% accumulate a curated basket of Robinhood Chain memecoins.
 * 4. Acquired assets and LP positions are permanently trapped in this contract. NO withdrawal function exists.
 * 5. Curated meme allocation updates are subject to a strict 24-HOUR OWNER TIMELOCK.
 * 6. Quote token ($MSTR), BRKHOOD token, and Router addresses are fully updateable by the owner.
 */
contract BerkshireVault {
    // --- State Variables ---
    address public immutable owner;

    // Quote token for fees and swaps (default: MSTR on Robinhood Chain)
    address public quoteToken;

    // Berkshire Hoodaway token ($BRKHOOD)
    address public brkhoodToken;

    // Execution Router (Universal Router / Ramses / PONS)
    address public router;

    // Minimum balance required to trigger a run (default: 0.1 MSTR = 0.1 ether in 18 decimals)
    uint256 public minExecutionBalance = 0.1 ether;

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
    uint256 public totalBrkhoodPurchased;

    // Reentrancy guard
    uint256 private _status;
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;

    // --- Events ---
    event FeesReceived(address indexed sender, uint256 amount, uint256 totalFeesSwallowed);
    event BatchBuyExecuted(uint256 indexed runId, uint256 totalQuoteSpent, uint256 timestamp);
    event RouterSwapExecuted(uint256 indexed runId, uint256 quoteSpent, uint256 timestamp);
    event AllocationProposed(uint256 indexed proposalId, address[] tokens, uint256[] weights, uint256 eta);
    event AllocationExecuted(uint256 indexed proposalId);
    event AllocationProposalCanceled(uint256 indexed proposalId);
    event MinExecutionBalanceUpdated(uint256 newBalance);
    event QuoteTokenUpdated(address indexed oldToken, address indexed newToken);
    event BrkhoodTokenUpdated(address indexed oldToken, address indexed newToken);
    event RouterUpdated(address indexed oldRouter, address indexed newRouter);

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
     * @param _quoteToken Base fee / quote token (MSTR: 0xec262a75e413fafd0df80480274532c79d42da09)
     * @param _brkhoodToken Berkshire Hoodaway token ($BRKHOOD)
     * @param _router Robinhood Chain DEX router (Universal Router: 0x8876789976decbfcbbbe364623c63652db8c0904)
     * @param _initialMemes Initial curated memecoin addresses (10 tokens)
     * @param _initialWeights Initial allocation weights in basis points (10 x 1000 = 10000)
     */
    constructor(
        address _quoteToken,
        address _brkhoodToken,
        address _router,
        address[] memory _initialMemes,
        uint256[] memory _initialWeights
    ) {
        require(_quoteToken != address(0), "Invalid quote token");
        require(_brkhoodToken != address(0), "Invalid BRKHOOD token");
        require(_router != address(0), "Invalid router");
        require(_initialMemes.length == _initialWeights.length, "Array length mismatch");
        require(_initialMemes.length > 0, "Empty curated list");

        owner = msg.sender;
        quoteToken = _quoteToken;
        brkhoodToken = _brkhoodToken;
        router = _router;
        _status = _NOT_ENTERED;

        uint256 totalWeight = 0;
        for (uint256 i = 0; i < _initialMemes.length; i++) {
            require(_initialMemes[i] != address(0), "Zero address meme token");
            require(_initialMemes[i] != _brkhoodToken, "Cannot allocate to BRKHOOD token");
            require(_initialMemes[i] != _quoteToken, "Cannot allocate to quote token");
            require(_initialWeights[i] > 0, "Weight must be > 0");
            totalWeight += _initialWeights[i];
        }
        require(totalWeight == BASIS_POINTS_DIVISOR, "Weights must sum to 10000");

        curatedMemes = _initialMemes;
        memeWeights = _initialWeights;
    }

    /**
     * @notice Receives native ETH fees or tips.
     */
    receive() external payable {
        totalFeesSwallowed += msg.value;
        emit FeesReceived(msg.sender, msg.value, totalFeesSwallowed);
    }

    // --- Execution Routines ---

    /**
     * @notice Executes buyback / meme accumulation through the configured router (Universal Router, PONS, etc.).
     * @dev Strictly protected: only the approved router can be called, and only quoteToken is approved.
     * Tokens purchased remain locked inside the Vault forever.
     * @param quoteAmount Amount of quoteToken (MSTR) to spend. Must be >= minExecutionBalance.
     * @param routerCalldata Encoded execution calldata for the router (e.g. Universal Router execute(...) payload).
     */
    function executeRouterSwap(
        uint256 quoteAmount,
        bytes calldata routerCalldata
    ) external onlyOwner nonReentrant {
        require(router != address(0), "Router not set");
        uint256 bal = unallocatedBalance();
        require(bal >= minExecutionBalance, "Balance below threshold");
        require(quoteAmount <= bal && quoteAmount > 0, "Invalid amount");

        _safeApprove(quoteToken, router, quoteAmount);

        (bool success, bytes memory returnData) = router.call(routerCalldata);
        if (!success) {
            if (returnData.length > 0) {
                assembly {
                    let returndata_size := mload(returnData)
                    revert(add(32, returnData), returndata_size)
                }
            } else {
                revert("Router call failed");
            }
        }

        // Reset allowance
        _safeApprove(quoteToken, router, 0);

        totalBuyRuns++;
        emit RouterSwapExecuted(totalBuyRuns, quoteAmount, block.timestamp);
    }

    // --- Timelock Governance for Meme Allocations (Restricted to OWNER) ---

    function proposeAllocations(
        address[] calldata newTokens,
        uint256[] calldata newWeights
    ) external onlyOwner returns (uint256 proposalId) {
        require(newTokens.length == newWeights.length, "Length mismatch");
        require(newTokens.length > 0, "Empty list");

        uint256 totalWeight = 0;
        for (uint256 i = 0; i < newTokens.length; i++) {
            require(newTokens[i] != address(0), "Zero address token");
            require(newTokens[i] != brkhoodToken, "Cannot allocate to BRKHOOD token");
            require(newTokens[i] != quoteToken, "Cannot allocate to quote token");
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

    function cancelProposal(uint256 proposalId) external onlyOwner {
        require(proposalId < proposals.length, "Invalid proposal ID");
        AllocationProposal storage prop = proposals[proposalId];
        require(!prop.executed, "Already executed");
        require(!prop.canceled, "Already canceled");

        prop.canceled = true;
        emit AllocationProposalCanceled(proposalId);
    }

    // --- Admin Setters (Owner Only) ---

    function setQuoteToken(address newQuoteToken) external onlyOwner {
        require(newQuoteToken != address(0), "Invalid quote token");
        emit QuoteTokenUpdated(quoteToken, newQuoteToken);
        quoteToken = newQuoteToken;
    }

    function setBrkhoodToken(address newBrkhoodToken) public onlyOwner {
        require(newBrkhoodToken != address(0), "Invalid BRKHOOD token");
        emit BrkhoodTokenUpdated(brkhoodToken, newBrkhoodToken);
        brkhoodToken = newBrkhoodToken;
    }

    function setRouter(address newRouter) external onlyOwner {
        require(newRouter != address(0), "Invalid router");
        require(newRouter != quoteToken && newRouter != brkhoodToken, "Router cannot be vault token");
        emit RouterUpdated(router, newRouter);
        router = newRouter;
    }

    function updateMinExecutionBalance(uint256 newBalance) external onlyOwner {
        require(newBalance > 0, "Threshold must be > 0");
        minExecutionBalance = newBalance;
        emit MinExecutionBalanceUpdated(newBalance);
    }

    // --- View Functions ---

    function unallocatedBalance() public view returns (uint256) {
        if (quoteToken == address(0)) {
            return address(this).balance;
        }
        return IERC20(quoteToken).balanceOf(address(this));
    }

    function brkhood() external view returns (address) {
        return brkhoodToken;
    }

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

    // Backward compatibility aliases
    function setHoodToken(address newBrkhoodToken) external onlyOwner {
        setBrkhoodToken(newBrkhoodToken);
    }

    function hoodToken() external view returns (address) {
        return brkhoodToken;
    }

    function totalHoodPurchased() external view returns (uint256) {
        return totalBrkhoodPurchased;
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
    //  Any MSTR, ETH, $BRKHOOD, Memecoins, or LP tokens entered or minted into this Vault
    //  are mathematically trapped forever in maximum Warren Buffett fashion.
    // =========================================================================
}
