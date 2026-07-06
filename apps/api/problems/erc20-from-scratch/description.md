## ERC20 from Scratch

Implement the core ERC20 token standard **without** using OpenZeppelin.

**Required functions:**
- `totalSupply()`
- `balanceOf(address)`
- `transfer(address to, uint256 amount)`
- `approve(address spender, uint256 amount)`
- `allowance(address owner, address spender)`
- `transferFrom(address from, address to, uint256 amount)`

**Constructor:** mint 1,000,000 tokens to `msg.sender` (use 18 decimals).
