## Simple Vault

Build a vault contract where users can deposit and withdraw ETH.

**Requirements:**
- `deposit()` payable: credits `msg.value` to `msg.sender`
- `withdraw(uint256 amount)`: sends `amount` ETH back to `msg.sender`
- `balanceOf(address)`: returns balance for any address
- Revert if withdrawing more than balance
