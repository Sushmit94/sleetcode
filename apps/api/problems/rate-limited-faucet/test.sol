// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/Solution.sol";

contract FaucetTest is Test {
    Faucet faucet;
    address alice = makeAddr("alice");
    address bob = makeAddr("bob");

    function setUp() public {
        faucet = new Faucet();
        vm.deal(address(faucet), 1 ether);
    }

    function test_claim() public {
        uint256 bal = alice.balance;
        vm.prank(alice);
        faucet.claim();
        assertEq(alice.balance, bal + 0.01 ether);
    }

    function test_cooldownReverts() public {
        vm.prank(alice);
        faucet.claim();
        vm.prank(alice);
        vm.expectRevert();
        faucet.claim();
    }

    function test_claimAgainAfterCooldown() public {
        vm.prank(alice);
        faucet.claim();
        vm.warp(block.timestamp + 1 days + 1);
        vm.prank(alice);
        faucet.claim();
        assertEq(alice.balance, 0.02 ether);
    }

    function test_perAddressIndependent() public {
        vm.prank(alice);
        faucet.claim();
        vm.prank(bob);
        faucet.claim();
        assertEq(bob.balance, 0.01 ether);
    }
}
