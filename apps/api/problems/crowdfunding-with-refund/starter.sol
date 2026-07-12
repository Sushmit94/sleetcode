// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Crowdfunding {
    address public immutable creator;
    uint256 public immutable goal;
    uint256 public immutable deadline;

    constructor(uint256 _goal, uint256 _deadline) {
        creator = msg.sender;
        goal = _goal;
        deadline = _deadline;
    }

    // Your code here
}
