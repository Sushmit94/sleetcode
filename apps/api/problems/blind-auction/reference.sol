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
        require(_revealEnd > _biddingEnd, "reveal must be after bidding");
        beneficiary = msg.sender;
        biddingEnd = _biddingEnd;
        revealEnd = _revealEnd;
    }

    function bid(bytes32 blindedBid) external payable {
        require(block.timestamp < biddingEnd, "bidding is over");
        require(bids[msg.sender].blindedBid == bytes32(0), "already bid");
        bids[msg.sender] = Bid({blindedBid: blindedBid, deposit: msg.value, revealed: false});
    }

    function reveal(uint256 value, bool fake, bytes32 secret) external {
        require(block.timestamp >= biddingEnd, "bidding not over");
        require(block.timestamp < revealEnd, "reveal is over");

        Bid storage b = bids[msg.sender];
        require(b.blindedBid != bytes32(0), "no bid found");
        require(!b.revealed, "already revealed");
        b.revealed = true;

        bytes32 computed = keccak256(abi.encodePacked(value, fake, secret));
        if (computed != b.blindedBid) {
            return; // invalid reveal — deposit forfeited
        }

        if (!fake && b.deposit >= value) {
            if (_placeBid(msg.sender, value)) {
                if (b.deposit > value) {
                    (bool ok, ) = msg.sender.call{value: b.deposit - value}("");
                    require(ok, "refund failed");
                }
            } else {
                (bool ok, ) = msg.sender.call{value: b.deposit}("");
                require(ok, "refund failed");
            }
        }
        // else: invalid — deposit forfeited
    }

    function _placeBid(address bidder, uint256 value) internal returns (bool) {
        if (value <= highestBid) {
            return false;
        }
        if (highestBidder != address(0)) {
            pendingReturns[highestBidder] += highestBid;
        }
        highestBidder = bidder;
        highestBid = value;
        return true;
    }

    function withdraw() external {
        uint256 amount = pendingReturns[msg.sender];
        require(amount > 0, "nothing to withdraw");
        pendingReturns[msg.sender] = 0;
        (bool ok, ) = msg.sender.call{value: amount}("");
        require(ok, "withdraw failed");
    }

    function auctionEnd() external {
        require(block.timestamp >= revealEnd, "reveal not over");
        require(!ended, "already ended");
        ended = true;
        (bool ok, ) = beneficiary.call{value: highestBid}("");
        require(ok, "transfer failed");
    }
}
