## Simple Lending Pool

Build a single-asset (ETH) over-collateralized lending pool: deposit ETH as collateral, borrow against your own collateral from the pool's shared liquidity, accrue interest over time, then repay to unlock your collateral.

**Requirements:**
- `depositCollateral() external payable` — increases `collateral[msg.sender]`; revert on zero value
- `borrow(uint256 amount) external` — caller may borrow up to **50% of their own collateral** (`amount * 2 <= collateral[msg.sender]`); revert if the caller already has an open loan (`borrowed[msg.sender] != 0`), or if the pool doesn't hold enough ETH; records `borrowed[msg.sender]` and `borrowTimestamp[msg.sender]`, then sends `amount` to the caller
- `interestOwed(address user) public view returns (uint256)` — simple interest at a fixed **10% APR**: `borrowed[user] * 1000 * elapsedSeconds / (10000 * 365 days)`
- `repay() external payable` — caller must send at least `borrowed[msg.sender] + interestOwed(msg.sender)`; zeroes out their loan and refunds any excess `msg.value`; revert if there's no open loan or the repayment is insufficient
- `withdrawCollateral(uint256 amount) external` — withdraws from the caller's own collateral; revert if `amount` exceeds their collateral, or if the **remaining** collateral would no longer cover 2x their outstanding borrow (`borrowed[msg.sender] * 2 <= collateral[msg.sender] - amount`)
