// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/Solution.sol";

contract HTLCTest is Test {
    address senderAddr = address(0x5E4DE5);
    address receiverAddr = address(0x2EC01);
    bytes32 secret = "correct-horse-battery-staple";
    bytes32 hashlock = keccak256(abi.encodePacked(secret));

    function _deploy(uint256 timelock, uint256 value) internal returns (HTLC) {
        vm.deal(senderAddr, 100 ether);
        vm.prank(senderAddr);
        return new HTLC{value: value}(receiverAddr, hashlock, timelock);
    }

    function test_withdrawWithCorrectPreimage() public {
        HTLC htlc = _deploy(block.timestamp + 1 days, 1 ether);

        uint256 before = receiverAddr.balance;
        vm.prank(receiverAddr);
        htlc.withdraw(secret);

        assertEq(receiverAddr.balance, before + 1 ether);
        assertTrue(htlc.withdrawn());
        assertEq(htlc.preimage(), secret);
    }

    function test_revertWithdrawWrongPreimage() public {
        HTLC htlc = _deploy(block.timestamp + 1 days, 1 ether);

        vm.prank(receiverAddr);
        vm.expectRevert();
        htlc.withdraw("wrong-secret");
    }

    function test_revertWithdrawByNonReceiver() public {
        HTLC htlc = _deploy(block.timestamp + 1 days, 1 ether);

        vm.prank(senderAddr);
        vm.expectRevert();
        htlc.withdraw(secret);
    }

    function test_revertWithdrawAfterTimelock() public {
        uint256 timelock = block.timestamp + 1 days;
        HTLC htlc = _deploy(timelock, 1 ether);

        vm.warp(timelock);
        vm.prank(receiverAddr);
        vm.expectRevert();
        htlc.withdraw(secret);
    }

    function test_revertDoubleWithdraw() public {
        HTLC htlc = _deploy(block.timestamp + 1 days, 1 ether);

        vm.prank(receiverAddr);
        htlc.withdraw(secret);

        vm.prank(receiverAddr);
        vm.expectRevert();
        htlc.withdraw(secret);
    }

    function test_refundAfterTimelock() public {
        uint256 timelock = block.timestamp + 1 days;
        HTLC htlc = _deploy(timelock, 1 ether);

        vm.warp(timelock);
        uint256 before = senderAddr.balance;
        vm.prank(senderAddr);
        htlc.refund();

        assertEq(senderAddr.balance, before + 1 ether);
        assertTrue(htlc.refunded());
    }

    function test_revertRefundBeforeTimelock() public {
        HTLC htlc = _deploy(block.timestamp + 1 days, 1 ether);

        vm.prank(senderAddr);
        vm.expectRevert();
        htlc.refund();
    }

    function test_revertRefundByNonSender() public {
        uint256 timelock = block.timestamp + 1 days;
        HTLC htlc = _deploy(timelock, 1 ether);

        vm.warp(timelock);
        vm.prank(receiverAddr);
        vm.expectRevert();
        htlc.refund();
    }

    function test_revertRefundAfterWithdrawn() public {
        uint256 timelock = block.timestamp + 1 days;
        HTLC htlc = _deploy(timelock, 1 ether);

        vm.prank(receiverAddr);
        htlc.withdraw(secret);

        vm.warp(timelock);
        vm.prank(senderAddr);
        vm.expectRevert();
        htlc.refund();
    }
}
