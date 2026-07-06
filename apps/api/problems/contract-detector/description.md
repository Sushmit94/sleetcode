## Contract Detector

Write a function that checks whether a given address is a contract or an externally-owned account (EOA).

**Requirements:**
- `isContract(address account)`: returns `true` if the address has code deployed, `false` otherwise
- Should return `true` for the calling contract's own address
- Should return `false` for a plain EOA
