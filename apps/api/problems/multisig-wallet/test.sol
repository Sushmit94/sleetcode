// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/Solution.sol";

contract MultisigTest is Test {
    MultisigWallet wallet;
    address a = address(0x1);
    address b = address(0x2);
    address c = address(0x3);
    address receiver = address(0x99);

    function setUp() public {
        wallet = new MultisigWallet(a, b, c);
        vm.deal(address(wallet), 10 ether);
    }

    function test_submitAndExecute() public {
        vm.prank(a);
        uint256 txId = wallet.submitTx(receiver, 1 ether, "");

        vm.prank(b);
        wallet.approveTx(txId);

        assertEq(wallet.executed(txId), true);
        assertEq(receiver.balance, 1 ether);
    }

    function test_noDoubleApprove() public {
        vm.prank(a);
        uint256 txId = wallet.submitTx(receiver, 1 ether, "");

        vm.prank(a);
        vm.expectRevert();
        wallet.approveTx(txId);
    }

    function test_nonOwnerReverts() public {
        vm.prank(address(0xDEAD));
        vm.expectRevert();
        wallet.submitTx(receiver, 1 ether, "");
    }
}
