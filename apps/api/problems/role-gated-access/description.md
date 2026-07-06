## Role-Gated Access

Implement a minimal role system: the owner grants/revokes a `MINTER` role, and only minters can call a protected action.

**Requirements:**
- Constructor sets `msg.sender` as `owner`
- `grantMinter(address)` / `revokeMinter(address)`: owner-only, toggle `isMinter[account]`
- `isMinter(address)`: public mapping
- `mint()`: only callable by an address with the minter role; increments `mintedCount`
- Revert if a non-owner calls grant/revoke
- Revert if a non-minter calls `mint()`
