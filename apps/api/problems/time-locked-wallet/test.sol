// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/Solution.sol";

contract TimeLockedWalletTest is Test {
    TimeLockedWallet wallet;
    address owner = address(0xACE);
    uint256 unlockTime;

    function setUp() public {
        unlockTime = block.timestamp + 1 days;
        vm.prank(owner);
        wallet = new TimeLockedWallet(unlockTime);
        vm.deal(owner, 10 ether);
        vm.prank(owner);
        wallet.deposit{value: 5 ether}();
    }

    function test_revertBeforeUnlock() public {
        vm.prank(owner);
        vm.expectRevert();
        wallet.withdraw();
    }

    function test_withdrawAfterUnlock() public {
        vm.warp(unlockTime + 1);
        uint256 bal = owner.balance;
        vm.prank(owner);
        wallet.withdraw();
        assertEq(owner.balance, bal + 5 ether);
    }

    function test_nonOwnerReverts() public {
        vm.warp(unlockTime + 1);
        vm.prank(address(0xBEEF));
        vm.expectRevert();
        wallet.withdraw();
    }
}
