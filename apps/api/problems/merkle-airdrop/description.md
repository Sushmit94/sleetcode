## Merkle Airdrop

Distribute ETH to a pre-committed allowlist using a Merkle tree, without storing every recipient on-chain.

**Requirements:**
- Constructor takes the Merkle root and is `payable` (the contract is funded with the ETH to distribute)
- `claimed(uint256 index)` — public mapping/getter returning whether a given leaf index has already claimed
- `claim(uint256 index, address account, uint256 amount, bytes32[] calldata merkleProof) external` — verifies `keccak256(abi.encodePacked(index, account, amount))` against `merkleRoot` using the given proof, then sends `amount` wei to `account`
  - Use **sorted-pair hashing**: at each level, hash the smaller of the two 32-byte values first (`a <= b ? keccak256(a,b) : keccak256(b,a)`)
- Revert if the index was already claimed
- Revert if the proof is invalid
