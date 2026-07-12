// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/Solution.sol";

contract MerkleAirdropTest is Test {
    MerkleAirdrop airdrop;

    address a = address(0xA1);
    address b = address(0xB2);
    address c = address(0xC3);
    address d = address(0xD4);

    uint256 amtA = 1 ether;
    uint256 amtB = 2 ether;
    uint256 amtC = 3 ether;
    uint256 amtD = 4 ether;

    bytes32 leaf0;
    bytes32 leaf1;
    bytes32 leaf2;
    bytes32 leaf3;
    bytes32 node01;
    bytes32 node23;
    bytes32 root;

    function _pairHash(bytes32 x, bytes32 y) internal pure returns (bytes32) {
        return x <= y ? keccak256(abi.encodePacked(x, y)) : keccak256(abi.encodePacked(y, x));
    }

    function setUp() public {
        leaf0 = keccak256(abi.encodePacked(uint256(0), a, amtA));
        leaf1 = keccak256(abi.encodePacked(uint256(1), b, amtB));
        leaf2 = keccak256(abi.encodePacked(uint256(2), c, amtC));
        leaf3 = keccak256(abi.encodePacked(uint256(3), d, amtD));

        node01 = _pairHash(leaf0, leaf1);
        node23 = _pairHash(leaf2, leaf3);
        root = _pairHash(node01, node23);

        vm.deal(address(this), 100 ether);
        airdrop = new MerkleAirdrop{value: 10 ether}(root);
    }

    function _proofFor0() internal view returns (bytes32[] memory p) {
        p = new bytes32[](2);
        p[0] = leaf1;
        p[1] = node23;
    }

    function _proofFor2() internal view returns (bytes32[] memory p) {
        p = new bytes32[](2);
        p[0] = leaf3;
        p[1] = node01;
    }

    function test_claimValid() public {
        airdrop.claim(0, a, amtA, _proofFor0());
        assertEq(a.balance, amtA);
        assertTrue(airdrop.claimed(0));
    }

    function test_claimAnotherLeaf() public {
        airdrop.claim(2, c, amtC, _proofFor2());
        assertEq(c.balance, amtC);
    }

    function test_revertDoubleClaim() public {
        airdrop.claim(0, a, amtA, _proofFor0());
        vm.expectRevert();
        airdrop.claim(0, a, amtA, _proofFor0());
    }

    function test_revertWrongAmount() public {
        vm.expectRevert();
        airdrop.claim(0, a, amtA + 1, _proofFor0());
    }

    function test_revertWrongProof() public {
        vm.expectRevert();
        airdrop.claim(0, a, amtA, _proofFor2());
    }

    function test_revertWrongAccount() public {
        vm.expectRevert();
        airdrop.claim(0, b, amtA, _proofFor0());
    }
}
