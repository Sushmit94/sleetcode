## Time-Locked Wallet

Build a wallet that only lets its owner withdraw after a fixed unlock time.

**Requirements:**
- Constructor accepts an `unlockTime` (unix timestamp) and records `msg.sender` as `owner`
- `deposit()` payable: accepts ETH from anyone
- `withdraw()`: sends the full contract balance to `owner`
- Revert if called before `unlockTime`
- Revert if called by anyone other than `owner`
