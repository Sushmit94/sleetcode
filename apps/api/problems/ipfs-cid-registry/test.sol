// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/Solution.sol";

contract IPFSRegistryTest is Test {
    IPFSRegistry reg;
    address alice = makeAddr("alice");

    function setUp() public {
        reg = new IPFSRegistry();
    }

    function test_publish() public {
        vm.prank(alice);
        uint256 id = reg.publish("QmHash1");
        assertEq(reg.cids(id), "QmHash1");
        assertEq(reg.owners(id), alice);
    }

    function test_ownerCanUpdate() public {
        vm.prank(alice);
        uint256 id = reg.publish("QmHash1");

        vm.prank(alice);
        reg.update(id, "QmHash2");
        assertEq(reg.cids(id), "QmHash2");
    }

    function test_nonOwnerCannotUpdate() public {
        vm.prank(alice);
        uint256 id = reg.publish("QmHash1");

        vm.prank(makeAddr("bob"));
        vm.expectRevert();
        reg.update(id, "QmHash2");
    }

    function test_idsIncrement() public {
        uint256 id1 = reg.publish("A");
        uint256 id2 = reg.publish("B");
        assertEq(id2, id1 + 1);
    }
}
