// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/Solution.sol";

contract HashCommitmentTest is Test {
    HashCommitment hc;

    function setUp() public {
        hc = new HashCommitment();
    }

    function test_commitAndReveal() public {
        uint256 value = 12345;
        bytes32 salt = keccak256("mysalt");
        bytes32 commitment = keccak256(abi.encodePacked(value, salt));

        hc.commit(commitment);
        hc.reveal(value, salt);

        assertTrue(hc.revealed());
        assertEq(hc.revealedValue(), value);
    }

    function test_wrongRevealReverts() public {
        uint256 value = 12345;
        bytes32 salt = keccak256("mysalt");
        bytes32 commitment = keccak256(abi.encodePacked(value, salt));
        hc.commit(commitment);

        vm.expectRevert();
        hc.reveal(999, salt);
    }

    function test_wrongSaltReverts() public {
        uint256 value = 12345;
        bytes32 salt = keccak256("mysalt");
        bytes32 commitment = keccak256(abi.encodePacked(value, salt));
        hc.commit(commitment);

        vm.expectRevert();
        hc.reveal(value, keccak256("wrongsalt"));
    }
}
