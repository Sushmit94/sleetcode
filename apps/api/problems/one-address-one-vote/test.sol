// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/Solution.sol";

contract OneVoteTest is Test {
    OneVote v;
    address alice = address(0xA);
    address bob = address(0xB);
    address carol = address(0xC);

    function setUp() public {
        string[] memory names = new string[](2);
        names[0] = "Alice Party";
        names[1] = "Bob Party";
        v = new OneVote(names);
    }

    function test_voteCounts() public {
        vm.prank(alice);
        v.vote(0);
        vm.prank(bob);
        v.vote(0);
        vm.prank(carol);
        v.vote(1);
        assertEq(v.votes(0), 2);
        assertEq(v.votes(1), 1);
    }

    function test_noDoubleVote() public {
        vm.prank(alice);
        v.vote(0);
        vm.prank(alice);
        vm.expectRevert();
        v.vote(1);
    }

    function test_winner() public {
        vm.prank(alice);
        v.vote(1);
        vm.prank(bob);
        v.vote(1);
        vm.prank(carol);
        v.vote(0);
        assertEq(v.winner(), 1);
    }

    function test_invalidCandidateReverts() public {
        vm.prank(alice);
        vm.expectRevert();
        v.vote(5);
    }
}
