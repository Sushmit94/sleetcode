// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/Solution.sol";

contract EncryptedMessageBoardTest is Test {
    EncryptedMessageBoard board;
    address alice = makeAddr("alice");
    address bob = makeAddr("bob");

    function setUp() public {
        board = new EncryptedMessageBoard();
    }

    function test_sendAndRetrieve() public {
        vm.prank(bob);
        board.send(alice, "ciphertext-1");

        assertEq(board.inboxLength(alice), 1);

        vm.prank(alice);
        (address sender, bytes memory ct, ) = board.getMessage(alice, 0);
        assertEq(sender, bob);
        assertEq(ct, "ciphertext-1");
    }

    function test_nonRecipientCannotRead() public {
        vm.prank(bob);
        board.send(alice, "secret");

        vm.prank(bob);
        vm.expectRevert();
        board.getMessage(alice, 0);
    }

    function test_multipleMessages() public {
        vm.prank(bob);
        board.send(alice, "msg1");
        vm.prank(bob);
        board.send(alice, "msg2");

        assertEq(board.inboxLength(alice), 2);
    }
}
