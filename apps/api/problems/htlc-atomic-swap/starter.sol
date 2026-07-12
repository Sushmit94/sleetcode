// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract HTLC {
    address public immutable sender;
    address public immutable receiver;
    bytes32 public immutable hashlock;
    uint256 public immutable timelock;

    bool public withdrawn;
    bool public refunded;
    bytes32 public preimage;

    constructor(address _receiver, bytes32 _hashlock, uint256 _timelock) payable {
        sender = msg.sender;
        receiver = _receiver;
        hashlock = _hashlock;
        timelock = _timelock;
    }

    // Your code here
}
