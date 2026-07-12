## HTLC Atomic Swap

Implement a Hash Time-Locked Contract — the primitive that powers cross-chain atomic swaps and the Lightning Network. ETH is locked for a `receiver`, claimable only by revealing a secret whose hash matches a pre-committed `hashlock`, before a deadline; otherwise the `sender` can reclaim it.

**Requirements:**
- Constructor takes `_receiver`, `_hashlock`, and `_timelock` (a future timestamp), and is funded via `msg.value`; `sender` is `msg.sender`; revert if `msg.value` is 0 or `_timelock` isn't in the future
- `withdraw(bytes32 _preimage) external` — only `receiver`, only before `timelock`, only if not already settled; revert if `keccak256(abi.encodePacked(_preimage)) != hashlock`; on success, store `preimage`, mark `withdrawn = true`, and send the full balance to `receiver`
- `refund() external` — only `sender`, only at/after `timelock`, only if not already settled; marks `refunded = true` and sends the full balance back to `sender`
