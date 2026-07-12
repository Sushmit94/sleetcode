// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/Solution.sol";

contract SolNFTTest is Test {
    SolNFT nft;
    address alice = address(0xA);
    address bob = address(0xB);

    function setUp() public {
        nft = new SolNFT();
    }

    function test_mintAndOwnerOf() public {
        nft.mint(alice, 1);
        assertEq(nft.ownerOf(1), alice);
        assertEq(nft.balanceOf(alice), 1);
    }

    function test_onlyOwnerCanMint() public {
        vm.prank(alice);
        vm.expectRevert();
        nft.mint(alice, 1);
    }

    function test_cannotMintTwice() public {
        nft.mint(alice, 1);
        vm.expectRevert();
        nft.mint(bob, 1);
    }

    function test_transferFromByOwner() public {
        nft.mint(alice, 1);
        vm.prank(alice);
        nft.transferFrom(alice, bob, 1);
        assertEq(nft.ownerOf(1), bob);
        assertEq(nft.balanceOf(alice), 0);
        assertEq(nft.balanceOf(bob), 1);
    }

    function test_approveAndTransferFrom() public {
        nft.mint(alice, 1);
        vm.prank(alice);
        nft.approve(bob, 1);
        assertEq(nft.getApproved(1), bob);

        vm.prank(bob);
        nft.transferFrom(alice, bob, 1);
        assertEq(nft.ownerOf(1), bob);
    }

    function test_revertTransferFromUnauthorized() public {
        nft.mint(alice, 1);
        vm.prank(bob);
        vm.expectRevert();
        nft.transferFrom(alice, bob, 1);
    }

    function test_revertOwnerOfNonexistent() public {
        vm.expectRevert();
        nft.ownerOf(999);
    }

    function test_revertMintToZero() public {
        vm.expectRevert();
        nft.mint(address(0), 1);
    }

    function test_approvalClearedAfterTransfer() public {
        nft.mint(alice, 1);
        vm.prank(alice);
        nft.approve(bob, 1);
        vm.prank(bob);
        nft.transferFrom(alice, bob, 1);
        assertEq(nft.getApproved(1), address(0));
    }
}
