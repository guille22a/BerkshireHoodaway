# Berkshire Hoodaway ($BRKHOOD) Smart Contracts

The official smart contract suite for **Berkshire Hoodaway** (`berkshirehood.fun`) on **Robinhood Chain** (Arbitrum Nitro L2), launched via **PONS Launchpad**.

---

## The "Never Sell" Perpetual Vault

Warren Buffett famously said: *"Our favorite holding period is forever."* 
Berkshire Hoodaway applies this philosophy to high-beta meme tokens on Robinhood Chain.

### Core Mechanics
1. **Fee Ingestion**:
   - Fees from token volume or PONS launchpad creator reward distributions arrive directly at `BerkshireVault`.
2. **Community Execution Trigger**:
   - Once accumulated balance reaches `minExecutionBalance` (~$100 / 0.03 ETH), **anyone** can trigger `executeBuyAndPool(...)` directly from the `berkshirehood.fun` website with max 5% slippage protection.
3. **The 50/50 Omaha Split**:
   - 50% of the ETH buys `$BRKHOOD` (Berkshire Hoodaway token).
   - 50% of the ETH buys the curated basket of Robinhood Chain memecoins according to active allocation weights (in Basis Points).
4. **Permanent Direct Liquidity Pairing**:
   - The Vault pairs `$BRKHOOD` with each curated meme and calls `router.addLiquidity(...)`.
   - The resulting LP tokens are held in the contract.
5. **The "Never Sell" Guarantee**:
   - The contract contains **NO** `withdraw()` function.
   - The contract contains **NO** `transfer()` or `burn()` functions for arbitrary extraction.
   - The keys are discarded; the assets are permanently locked in the vault forever.
6. **24-Hour Timelock for Meme Allocations (Owner Only)**:
   - **Proposals**: Strictly restricted to `onlyOwner` via `proposeAllocations(tokens, weights)`.
   - **Execution**: Strictly restricted to `onlyOwner` via `executeAllocations(proposalId)` after the mandatory 24-hour waiting period.
   - **Cancellation**: The owner can cancel a pending proposal anytime via `cancelProposal(proposalId)`.
   - The timelock ensures total community transparency: holders have 24 hours of advance on-chain notice before the owner can activate any portfolio changes, while ensuring no third party can manipulate or execute allocations.

---

## Deployment Parameters

When deploying `BerkshireVault.sol`:
```solidity
constructor(
    address _hoodToken,      // Deployed $BRKHOOD token address on PONS
    address _router,         // Robinhood Chain DEX Router (e.g. Uniswap V2 / PONS Router: 0xe33e9e479df8802cb0866d5d05258bec4cf62948)
    address[] memory _initialMemes,    // Array of curated memecoin contract addresses
    uint256[] memory _initialWeights   // Array of weights in basis points (must sum to 10000 = 100%)
)
```

Example initial allocation:
- Meme 1: 40% (4000 bps)
- Meme 2: 30% (3000 bps)
- Meme 3: 20% (2000 bps)
- Meme 4: 10% (1000 bps)
Total: 10,000 bps.
