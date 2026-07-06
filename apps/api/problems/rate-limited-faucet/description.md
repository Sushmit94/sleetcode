## Rate-Limited Faucet

Build a faucet that pays out a fixed amount of ETH to each address, at most once per cooldown window.

**Requirements:**
- `PAYOUT = 0.01 ether`, `COOLDOWN = 1 days` (constants)
- `claim()`: pays `PAYOUT` to `msg.sender`
- `lastClaim(address)`: public mapping of the last claim timestamp
- Revert if the caller claimed within the last `COOLDOWN` seconds
- Revert if the faucet doesn't hold enough balance to pay out
- Each address's cooldown is independent
