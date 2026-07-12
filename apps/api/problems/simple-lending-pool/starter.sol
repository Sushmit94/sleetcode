// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract LendingPool {
    uint256 public constant RATE_BPS = 1000; // 10% APR
    uint256 public constant BPS_DENOM = 10000;
    uint256 public constant YEAR = 365 days;

    mapping(address => uint256) public collateral;
    mapping(address => uint256) public borrowed;
    mapping(address => uint256) public borrowTimestamp;

    // Your code here
}
