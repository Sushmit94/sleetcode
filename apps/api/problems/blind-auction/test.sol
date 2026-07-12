// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/Solution.sol";

contract BlindAuctionTest is Test {
    BlindAuction auction;

    // Addresses below 0x0A collide with EVM precompiles and can't receive a
    // plain value transfer, so every actor here uses a larger address.
    address beneficiary = address(0xBEEF01);
    address alice = address(0xA11CE);
    address bob = address(0xB0B01);
    address carol = address(0xCA501);

    uint256 biddingEnd;
    uint256 revealEnd;

    function setUp() public {
        biddingEnd = block.timestamp + 3 days;
        revealEnd = biddingEnd + 3 days;

        vm.prank(beneficiary);
        auction = new BlindAuction(biddingEnd, revealEnd);

        vm.deal(alice, 20 ether);
        vm.deal(bob, 20 ether);
        vm.deal(carol, 20 ether);
    }

    function _blind(uint256 value, bool fake, bytes32 secret) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(value, fake, secret));
    }

    function test_fullAuctionFlow() public {
        // alice bids 5 ether for real, bob bids 8 ether for real,
        // carol places a fake decoy bid.
        vm.prank(alice);
        auction.bid{value: 5 ether}(_blind(5 ether, false, "alice-secret"));

        vm.prank(bob);
        auction.bid{value: 8 ether}(_blind(8 ether, false, "bob-secret"));

        vm.prank(carol);
        auction.bid{value: 1 ether}(_blind(100 ether, true, "carol-secret"));

        vm.warp(biddingEnd);

        vm.prank(alice);
        auction.reveal(5 ether, false, "alice-secret");
        assertEq(auction.highestBidder(), alice);
        assertEq(auction.highestBid(), 5 ether);

        vm.prank(bob);
        auction.reveal(8 ether, false, "bob-secret");
        assertEq(auction.highestBidder(), bob);
        assertEq(auction.highestBid(), 8 ether);
        assertEq(auction.pendingReturns(alice), 5 ether);

        vm.prank(carol);
        auction.reveal(100 ether, true, "carol-secret");

        uint256 aliceBefore = alice.balance;
        vm.prank(alice);
        auction.withdraw();
        assertEq(alice.balance, aliceBefore + 5 ether);

        vm.warp(revealEnd);
        uint256 beneficiaryBefore = beneficiary.balance;
        auction.auctionEnd();
        assertEq(beneficiary.balance, beneficiaryBefore + 8 ether);
        assertTrue(auction.ended());
    }

    function test_revertDoubleBid() public {
        vm.startPrank(alice);
        auction.bid{value: 5 ether}(_blind(5 ether, false, "s1"));
        vm.expectRevert();
        auction.bid{value: 1 ether}(_blind(1 ether, false, "s2"));
        vm.stopPrank();
    }

    function test_revertBidAfterBiddingEnd() public {
        vm.warp(biddingEnd);
        vm.prank(alice);
        vm.expectRevert();
        auction.bid{value: 5 ether}(_blind(5 ether, false, "s1"));
    }

    function test_revertRevealBeforeBiddingEnd() public {
        vm.prank(alice);
        auction.bid{value: 5 ether}(_blind(5 ether, false, "s1"));

        vm.prank(alice);
        vm.expectRevert();
        auction.reveal(5 ether, false, "s1");
    }

    function test_revertRevealAfterRevealEnd() public {
        vm.prank(alice);
        auction.bid{value: 5 ether}(_blind(5 ether, false, "s1"));

        vm.warp(revealEnd);
        vm.prank(alice);
        vm.expectRevert();
        auction.reveal(5 ether, false, "s1");
    }

    function test_revertDoubleReveal() public {
        vm.prank(alice);
        auction.bid{value: 5 ether}(_blind(5 ether, false, "s1"));

        vm.warp(biddingEnd);
        vm.prank(alice);
        auction.reveal(5 ether, false, "s1");

        vm.prank(alice);
        vm.expectRevert();
        auction.reveal(5 ether, false, "s1");
    }

    function test_invalidRevealForfeitsDeposit() public {
        vm.prank(alice);
        auction.bid{value: 5 ether}(_blind(5 ether, false, "s1"));

        vm.warp(biddingEnd);
        uint256 before = alice.balance;
        // wrong secret -> hash mismatch -> invalid reveal, no refund
        vm.prank(alice);
        auction.reveal(5 ether, false, "wrong-secret");

        assertEq(alice.balance, before);
        assertEq(auction.highestBidder(), address(0));
    }

    function test_revertWithdrawNothingPending() public {
        vm.prank(alice);
        vm.expectRevert();
        auction.withdraw();
    }

    function test_revertAuctionEndBeforeRevealEnd() public {
        vm.expectRevert();
        auction.auctionEnd();
    }

    function test_revertDoubleAuctionEnd() public {
        vm.warp(revealEnd);
        auction.auctionEnd();
        vm.expectRevert();
        auction.auctionEnd();
    }
}
