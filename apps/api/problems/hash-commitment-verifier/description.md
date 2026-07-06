## Hash Commitment Verifier

Implement a basic commit-reveal scheme using `keccak256`.

**Requirements:**
- `commit(bytes32 commitment)`: stores a commitment hash
- `reveal(uint256 value, bytes32 salt)`: verifies `keccak256(abi.encodePacked(value, salt)) == commitment`, then records `revealed = true` and `revealedValue = value`
- Revert if the revealed value/salt don't match the stored commitment
