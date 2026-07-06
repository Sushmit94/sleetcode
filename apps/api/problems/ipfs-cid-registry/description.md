## On-Chain IPFS CID Registry

Store a pointer (IPFS content identifier) on-chain per publisher, with owner-only updates.

**Requirements:**
- `publish(string calldata cid)`: stores a new entry, returns an incrementing `id` starting at 0
- `cids(uint256)` / `owners(uint256)`: public mappings of id => CID string / id => publisher address
- `update(uint256 id, string calldata newCid)`: only the original publisher may update their entry
- Revert if a non-owner calls `update`
