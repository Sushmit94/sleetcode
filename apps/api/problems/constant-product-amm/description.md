## Constant Product AMM

Implement a minimal Uniswap-v2-style automated market maker for a single token pair, using the `x * y = k` invariant with a 0.3% swap fee.

**Requirements:**
- Constructor takes `_tokenA` and `_tokenB` addresses (both implement the given `IERC20` interface)
- `addLiquidity(uint256 amountA, uint256 amountB) external returns (uint256 shares)` — pulls both amounts in via `transferFrom`
  - **First deposit** (`totalLiquidity == 0`): `shares = amountA`
  - **Subsequent deposits**: `shares = min(amountA * totalLiquidity / reserveA, amountB * totalLiquidity / reserveB)`
  - Updates `reserveA`/`reserveB`, credits `liquidity[msg.sender]`, and increases `totalLiquidity`; revert if either amount is 0 or the computed shares are 0
- `removeLiquidity(uint256 shares) external returns (uint256 amountA, uint256 amountB)` — burns the caller's shares pro-rata (`shares * reserveX / totalLiquidity` for each token) and transfers both tokens back; revert if the caller doesn't have enough shares
- `swapAForB(uint256 amountIn) external returns (uint256 amountOut)` — pulls `amountIn` of token A, computes `amountOut` with a 0.3% fee using `amountInWithFee = amountIn * 997`, `amountOut = reserveB * amountInWithFee / (reserveA * 1000 + amountInWithFee)`, updates reserves, and sends `amountOut` of token B to the caller; revert if `amountIn` is 0 or `amountOut` would be 0
- `swapBForA(uint256 amountIn) external returns (uint256 amountOut)` — the symmetric swap in the other direction
