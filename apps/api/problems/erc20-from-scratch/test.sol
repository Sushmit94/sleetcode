// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/Solution.sol";

contract ERC20Test is Test {
    ERC20 token;
    address alice = address(0xA);
    address bob   = address(0xB);

    function setUp() public {
        token = new ERC20();
    }

    function test_totalSupply() public {
        assertEq(token.totalSupply(), 1_000_000 * 1e18);
    }

    function test_transfer() public {
        token.transfer(alice, 100e18);
        assertEq(token.balanceOf(alice), 100e18);
    }

    function test_approve_transferFrom() public {
        token.transfer(alice, 500e18);
        vm.prank(alice);
        token.approve(bob, 100e18);

        vm.prank(bob);
        token.transferFrom(alice, bob, 100e18);
        assertEq(token.balanceOf(bob), 100e18);
    }

    function test_revertInsufficientBalance() public {
        vm.expectRevert();
        token.transfer(alice, type(uint256).max);
    }
}
