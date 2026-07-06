// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/Solution.sol";

contract SimpleVaultTest is Test {
    SimpleVault vault;
    address alice = makeAddr("alice");

    function setUp() public {
        vault = new SimpleVault();
        vm.deal(alice, 10 ether);
    }

    function test_deposit() public {
        vm.prank(alice);
        vault.deposit{value: 1 ether}();
        assertEq(vault.balanceOf(alice), 1 ether);
    }

    function test_withdraw() public {
        vm.prank(alice);
        vault.deposit{value: 2 ether}();

        vm.prank(alice);
        vault.withdraw(1 ether);
        assertEq(vault.balanceOf(alice), 1 ether);
        assertEq(alice.balance, 9 ether);
    }

    function test_revertOnOverdraw() public {
        vm.prank(alice);
        vault.deposit{value: 1 ether}();

        vm.prank(alice);
        vm.expectRevert();
        vault.withdraw(2 ether);
    }
}
