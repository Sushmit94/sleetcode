## Linear Token Vesting

Build an ETH vesting vault with a cliff and linear release, modeled on OpenZeppelin's `VestingWallet` (implemented from scratch here).

**Requirements:**
- Constructor takes `beneficiary`, `start` (timestamp), `cliffDuration`, and `vestingDuration`, and is funded via `msg.value` (store this as the total allocation)
- `vestedAmount(uint256 timestamp)` — a view function of time:
  - `0` before `start + cliffDuration`
  - the full allocation at/after `start + vestingDuration`
  - linear interpolation in between: `totalAllocation * (timestamp - start) / vestingDuration`
- `released` — public counter of how much has been released so far
- `release()` — sends the currently releasable amount (`vestedAmount(block.timestamp) - released`) to `beneficiary` and updates `released`; revert if nothing is releasable yet
