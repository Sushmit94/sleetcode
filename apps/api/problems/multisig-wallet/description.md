## Multisig Wallet

Build a 2-of-3 multisig wallet.

**Requirements:**
- Constructor accepts 3 owner addresses
- `submitTx(address to, uint256 value, bytes calldata data)` — any owner can propose a tx, returns `txId`
- `approveTx(uint256 txId)` — owner approves; auto-executes when 2/3 approved
- `executed[]` — public mapping tracking which txIds have been executed
- Revert if non-owner calls submit or approve
- Revert on double-approve by the same owner
