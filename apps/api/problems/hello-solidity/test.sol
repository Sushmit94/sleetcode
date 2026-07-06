// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/Solution.sol";

contract HelloSolidityTest is Test {
    HelloSolidity public c;

    function setUp() public {
        c = new HelloSolidity();
    }

    function test_getValue() public {
        assertEq(c.getValue(), 42);
    }

    function test_valueIsPublic() public {
        assertEq(c.value(), 42);
    }
}
