## One Address, One Vote

Build a simple voting contract where each address can vote exactly once.

**Requirements:**
- Constructor accepts a list of candidate name strings
- `vote(uint256 candidateId)`: casts a vote for a candidate
- `votes(uint256)`: public mapping returning vote count for a candidate
- `hasVoted(address)`: public mapping tracking who has voted
- `winner()`: returns the id of the candidate with the most votes
- Revert if the caller has already voted
- Revert if `candidateId` is out of range
