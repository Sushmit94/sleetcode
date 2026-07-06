## Encrypted Message Board

Store off-chain-encrypted messages on-chain, readable only by their recipient. Encryption/decryption happens off-chain — the contract just stores and gates access to ciphertext bytes.

**Requirements:**
- `send(address to, bytes calldata ciphertext)`: appends a message to `to`'s inbox, recording `msg.sender` and `block.timestamp`
- `inboxLength(address user)`: returns how many messages a user has received
- `getMessage(address user, uint256 index)`: returns `(sender, ciphertext, timestamp)` for that message
- Revert `getMessage` if called by anyone other than `user` (the recipient)
