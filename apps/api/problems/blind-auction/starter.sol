// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract BlindAuction {
    address public immutable beneficiary;
    uint256 public immutable biddingEnd;
    uint256 public immutable revealEnd;
    bool public ended;

    struct Bid {
        bytes32 blindedBid;
        uint256 deposit;
        bool revealed;
    }

    mapping(address => Bid) public bids;
    mapping(address => uint256) public pendingReturns;

    address public highestBidder;
    uint256 public highestBid;

    constructor(uint256 _biddingEnd, uint256 _revealEnd) {
        beneficiary = msg.sender;
        biddingEnd = _biddingEnd;
        revealEnd = _revealEnd;
    }

    // Your code here
}
