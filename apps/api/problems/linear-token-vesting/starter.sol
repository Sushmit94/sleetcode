// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TokenVesting {
    address public immutable beneficiary;
    uint256 public immutable start;
    uint256 public immutable cliffDuration;
    uint256 public immutable vestingDuration;

    constructor(address _beneficiary, uint256 _start, uint256 _cliffDuration, uint256 _vestingDuration) payable {
        beneficiary = _beneficiary;
        start = _start;
        cliffDuration = _cliffDuration;
        vestingDuration = _vestingDuration;
    }

    // Your code here
}
