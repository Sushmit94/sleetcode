// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/Solution.sol";

contract Caller {}

contract ContractDetectorTest is Test {
    ContractDetector d;

    function setUp() public {
        d = new ContractDetector();
    }

    function test_eoaIsNotContract() public {
        assertFalse(d.isContract(makeAddr("eoa")));
    }

    function test_contractIsContract() public {
        Caller c = new Caller();
        assertTrue(d.isContract(address(c)));
    }

    function test_selfIsContract() public {
        assertTrue(d.isContract(address(d)));
    }
}
