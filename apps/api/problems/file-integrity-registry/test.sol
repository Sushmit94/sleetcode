// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/Solution.sol";

contract FileRegistryTest is Test {
    FileRegistry reg;

    function setUp() public {
        reg = new FileRegistry();
    }

    function test_registerAndVerify() public {
        bytes memory content = "hello world";
        bytes32 fileId = keccak256("file-1");
        reg.register(fileId, keccak256(content));

        assertTrue(reg.verify(fileId, content));
    }

    function test_tamperedContentFailsVerify() public {
        bytes memory content = "hello world";
        bytes32 fileId = keccak256("file-1");
        reg.register(fileId, keccak256(content));

        assertFalse(reg.verify(fileId, "tampered content"));
    }

    function test_cannotReRegister() public {
        bytes32 fileId = keccak256("file-1");
        reg.register(fileId, keccak256("a"));

        vm.expectRevert();
        reg.register(fileId, keccak256("b"));
    }

    function test_registeredByTracksSender() public {
        address alice = makeAddr("alice");
        bytes32 fileId = keccak256("file-1");
        vm.prank(alice);
        reg.register(fileId, keccak256("a"));

        assertEq(reg.registeredBy(fileId), alice);
    }
}
