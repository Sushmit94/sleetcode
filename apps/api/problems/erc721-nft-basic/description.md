## ERC721 from Scratch

Implement a minimal, hand-rolled NFT contract (no library imports).

**Requirements:**
- `owner` (the contract deployer) is the only address allowed to mint
- `mint(address to, uint256 tokenId)` — mints a new token; revert if `tokenId` already exists, if caller isn't `owner`, or if `to` is the zero address
- `ownerOf(uint256 tokenId)` — returns the token's owner; revert if the token doesn't exist
- `balanceOf(address account)` — returns how many tokens `account` holds; revert if `account` is the zero address
- `approve(address to, uint256 tokenId)` — only the token's current owner may approve; revert otherwise
- `getApproved(uint256 tokenId)` — returns the currently approved address (or the zero address); revert if the token doesn't exist
- `transferFrom(address from, address to, uint256 tokenId)` — caller must be the token's owner or its approved address; revert if `from` isn't the actual owner, if `to` is the zero address, or if the caller isn't authorized; clears the approval after a successful transfer
