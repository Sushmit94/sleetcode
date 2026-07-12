// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SolNFT {
    string public name = "SolNFT";
    string public symbol = "SNFT";
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    // Your code here
}
