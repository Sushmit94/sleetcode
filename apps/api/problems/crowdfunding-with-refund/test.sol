// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/Solution.sol";

contract CrowdfundingTest is Test {
    Crowdfunding cf;
    // Addresses below 0x0A collide with EVM precompiles (e.g. 0x0A is the
    // point-evaluation precompile) and can't receive a plain value transfer.
    address creator = address(0xC0FFEE);
    address alice = address(0xA11CE);
    address bob = address(0xB0B);

    uint256 constant GOAL = 10 ether;
    uint256 deadline;

    function setUp() public {
        deadline = block.timestamp + 7 days;
        vm.prank(creator);
        cf = new Crowdfunding(GOAL, deadline);
        vm.deal(alice, 20 ether);
        vm.deal(bob, 20 ether);
    }

    function test_contribute() public {
        vm.prank(alice);
        cf.contribute{value: 5 ether}();
        assertEq(cf.contributions(alice), 5 ether);
        assertEq(cf.totalRaised(), 5 ether);
    }

    function test_revertContributeAfterDeadline() public {
        vm.warp(deadline + 1);
        vm.prank(alice);
        vm.expectRevert();
        cf.contribute{value: 1 ether}();
    }

    function test_withdrawWhenGoalMet() public {
        vm.prank(alice);
        cf.contribute{value: 6 ether}();
        vm.prank(bob);
        cf.contribute{value: 5 ether}();

        vm.warp(deadline + 1);
        uint256 before = creator.balance;
        vm.prank(creator);
        cf.withdraw();
        assertEq(creator.balance, before + 11 ether);
    }

    function test_revertWithdrawByNonCreator() public {
        vm.prank(alice);
        cf.contribute{value: 11 ether}();
        vm.warp(deadline + 1);

        vm.prank(alice);
        vm.expectRevert();
        cf.withdraw();
    }

    function test_revertWithdrawGoalNotMet() public {
        vm.prank(alice);
        cf.contribute{value: 3 ether}();
        vm.warp(deadline + 1);
        vm.prank(creator);
        vm.expectRevert();
        cf.withdraw();
    }

    function test_refundWhenGoalNotMet() public {
        vm.prank(alice);
        cf.contribute{value: 3 ether}();
        vm.warp(deadline + 1);

        uint256 before = alice.balance;
        vm.prank(alice);
        cf.refund();
        assertEq(alice.balance, before + 3 ether);
        assertEq(cf.contributions(alice), 0);
    }

    function test_revertRefundWhenGoalMet() public {
        vm.prank(alice);
        cf.contribute{value: 11 ether}();
        vm.warp(deadline + 1);

        vm.prank(alice);
        vm.expectRevert();
        cf.refund();
    }
}
