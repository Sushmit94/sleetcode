// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/Solution.sol";

contract LendingPoolTest is Test {
    LendingPool pool;

    // Addresses below 0x0A collide with EVM precompiles and can't receive a
    // plain value transfer, so every actor here uses a larger address.
    address alice = address(0xA11CE);
    address bob = address(0xB0B01);

    function setUp() public {
        pool = new LendingPool();
        vm.deal(alice, 100 ether);
        vm.deal(bob, 100 ether);
    }

    function test_depositAndBorrow() public {
        vm.prank(alice);
        pool.depositCollateral{value: 10 ether}();
        assertEq(pool.collateral(alice), 10 ether);

        uint256 before = alice.balance;
        vm.prank(alice);
        pool.borrow(5 ether);
        assertEq(alice.balance, before + 5 ether);
        assertEq(pool.borrowed(alice), 5 ether);
    }

    function test_revertBorrowTooMuch() public {
        vm.prank(alice);
        pool.depositCollateral{value: 10 ether}();

        vm.prank(alice);
        vm.expectRevert();
        pool.borrow(6 ether);
    }

    function test_revertBorrowNoCollateral() public {
        vm.prank(bob);
        vm.expectRevert();
        pool.borrow(1 ether);
    }

    function test_revertDoubleBorrow() public {
        vm.startPrank(alice);
        pool.depositCollateral{value: 10 ether}();
        pool.borrow(2 ether);
        vm.expectRevert();
        pool.borrow(1 ether);
        vm.stopPrank();
    }

    function test_interestAccrual() public {
        vm.startPrank(alice);
        pool.depositCollateral{value: 10 ether}();
        pool.borrow(5 ether);
        vm.stopPrank();

        vm.warp(block.timestamp + 365 days);
        assertEq(pool.interestOwed(alice), 0.5 ether);
    }

    function test_repayWithInterest() public {
        vm.startPrank(alice);
        pool.depositCollateral{value: 10 ether}();
        pool.borrow(5 ether);
        vm.stopPrank();

        vm.warp(block.timestamp + 365 days);

        vm.prank(alice);
        pool.repay{value: 5.5 ether}();
        assertEq(pool.borrowed(alice), 0);
    }

    function test_repayRefundsExcess() public {
        vm.startPrank(alice);
        pool.depositCollateral{value: 10 ether}();
        pool.borrow(5 ether);
        vm.stopPrank();

        vm.warp(block.timestamp + 365 days);

        uint256 before = alice.balance;
        vm.prank(alice);
        pool.repay{value: 6 ether}();
        // owed = 5.5 ether, paid 6 ether -> 0.5 ether refunded
        assertEq(alice.balance, before - 5.5 ether);
    }

    function test_revertRepayInsufficient() public {
        vm.startPrank(alice);
        pool.depositCollateral{value: 10 ether}();
        pool.borrow(5 ether);
        vm.stopPrank();

        vm.warp(block.timestamp + 365 days);

        vm.prank(alice);
        vm.expectRevert();
        pool.repay{value: 5 ether}();
    }

    function test_withdrawCollateralAfterRepay() public {
        vm.startPrank(alice);
        pool.depositCollateral{value: 10 ether}();
        pool.borrow(5 ether);
        pool.repay{value: 5 ether}(); // no time elapsed -> no interest
        uint256 before = alice.balance;
        pool.withdrawCollateral(10 ether);
        vm.stopPrank();

        assertEq(alice.balance, before + 10 ether);
        assertEq(pool.collateral(alice), 0);
    }

    function test_revertWithdrawWhileUndercollateralized() public {
        vm.startPrank(alice);
        pool.depositCollateral{value: 10 ether}();
        pool.borrow(5 ether);
        // remaining would be 9, but 2x borrowed = 10 > 9
        vm.expectRevert();
        pool.withdrawCollateral(1 ether);
        vm.stopPrank();
    }
}
