## Blind Auction

Implement a sealed-bid auction using the commit-reveal pattern: bidders commit to a hidden bid during the bidding phase, then reveal the real value during the reveal phase.

**Phases:** bidding (`block.timestamp < biddingEnd`) → reveal (`biddingEnd <= block.timestamp < revealEnd`) → ended (`block.timestamp >= revealEnd`).

**Requirements:**
- Constructor takes `_biddingEnd` and `_revealEnd`; `beneficiary` is `msg.sender`
- `bid(bytes32 blindedBid) external payable` — only during the bidding phase; the caller sends a deposit (`msg.value`) that must be at least as large as their real bid (revealed later); revert on a second bid from the same address
- `reveal(uint256 value, bool fake, bytes32 secret) external` — only during the reveal phase; recompute `keccak256(abi.encodePacked(value, fake, secret))` and compare it to the caller's stored blinded bid
  - If it doesn't match, or `fake` is true, or `value` exceeds the deposit, the reveal is **invalid** — the deposit is forfeited (stays in the contract) and nothing else happens
  - If it's valid and `value` is higher than the current `highestBid`, the previous highest bidder's amount moves to `pendingReturns` (so they can `withdraw()` it later), the caller becomes `highestBidder`/`highestBid`, and any deposit above `value` is refunded immediately
  - If it's valid but not higher than the current highest bid, the full deposit is refunded immediately
  - Revert if the caller never bid, or already revealed
- `withdraw() external` — sends the caller's `pendingReturns` balance and zeroes it; revert if there's nothing to withdraw
- `auctionEnd() external` — only after the reveal phase, only once; sends `highestBid` to `beneficiary`
