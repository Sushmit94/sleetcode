// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/Solution.sol";

contract RoleGatedTest is Test {
    RoleGated r;
    address alice = address(0xA);

    function setUp() public {
        r = new RoleGated();
    }

    function test_ownerCanGrant() public {
        r.grantMinter(alice);
        assertTrue(r.isMinter(alice));
    }

    function test_minterCanMint() public {
        r.grantMinter(alice);
        vm.prank(alice);
        r.mint();
        assertEq(r.mintedCount(), 1);
    }

    function test_nonMinterReverts() public {
        vm.prank(alice);
        vm.expectRevert();
        r.mint();
    }

    function test_nonOwnerCannotGrant() public {
        vm.prank(alice);
        vm.expectRevert();
        r.grantMinter(alice);
    }

    function test_revokeRemovesAccess() public {
        r.grantMinter(alice);
        r.revokeMinter(alice);
        vm.prank(alice);
        vm.expectRevert();
        r.mint();
    }
}
