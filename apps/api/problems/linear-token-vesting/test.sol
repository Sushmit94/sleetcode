// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/Solution.sol";

contract TokenVestingTest is Test {
    TokenVesting vesting;
    address beneficiary = address(0xBEEF);

    uint256 startTime;
    uint256 constant CLIFF = 30 days;
    uint256 constant DURATION = 120 days;
    uint256 constant ALLOCATION = 12 ether;

    function setUp() public {
        startTime = block.timestamp;
        vesting = new TokenVesting{value: ALLOCATION}(beneficiary, startTime, CLIFF, DURATION);
    }

    function test_nothingBeforeCliff() public {
        vm.warp(startTime + 15 days);
        vm.expectRevert();
        vesting.release();
    }

    function test_vestedAmountAtCliff() public {
        assertEq(vesting.vestedAmount(startTime + CLIFF), (ALLOCATION * CLIFF) / DURATION);
    }

    function test_partialAfterCliff() public {
        vm.warp(startTime + 60 days);
        vesting.release();
        assertEq(beneficiary.balance, ALLOCATION / 2);
        assertEq(vesting.released(), ALLOCATION / 2);
    }

    function test_fullAfterEnd() public {
        vm.warp(startTime + 200 days);
        vesting.release();
        assertEq(beneficiary.balance, ALLOCATION);
    }

    function test_secondReleaseOnlyGetsDelta() public {
        vm.warp(startTime + 60 days);
        vesting.release();

        vm.warp(startTime + DURATION);
        vesting.release();

        assertEq(beneficiary.balance, ALLOCATION);
    }

    function test_revertNothingNewToRelease() public {
        vm.warp(startTime + 60 days);
        vesting.release();

        vm.expectRevert();
        vesting.release();
    }
}
