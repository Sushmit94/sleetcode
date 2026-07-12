// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MerkleAirdrop {
    bytes32 public immutable merkleRoot;

    constructor(bytes32 _merkleRoot) payable {
        merkleRoot = _merkleRoot;
    }

    // Your code here
}
