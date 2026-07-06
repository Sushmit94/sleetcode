## Fix the Reentrancy Bug

The contract below has a critical reentrancy vulnerability. Fix it using the **checks-effects-interactions** pattern (do NOT use a mutex/ReentrancyGuard).

```solidity
function withdraw() external {
    uint256 bal = balances[msg.sender];
    require(bal > 0);
    (bool ok,) = msg.sender.call{value: bal}("");
    require(ok);
    balances[msg.sender] = 0; // bug: state updated AFTER external call
}
```

Implement the full fixed contract below.
