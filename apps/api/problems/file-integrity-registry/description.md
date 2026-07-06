## On-Chain File Integrity Registry

Store a file's content hash on-chain so anyone can later verify a given blob matches what was originally registered.

**Requirements:**
- `register(bytes32 fileId, bytes32 contentHash)`: records the hash for a `fileId`
- `verify(bytes32 fileId, bytes calldata content)`: returns `true` if `keccak256(content)` matches the registered hash
- `registeredBy(bytes32)`: public mapping of who registered each `fileId`
- Revert if `fileId` was already registered
