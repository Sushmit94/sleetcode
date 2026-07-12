// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MerkleAirdrop {
    bytes32 public immutable merkleRoot;
    mapping(uint256 => bool) public claimed;

    constructor(bytes32 _merkleRoot) payable {
        merkleRoot = _merkleRoot;
    }

    function claim(uint256 index, address account, uint256 amount, bytes32[] calldata merkleProof) external {
        require(!claimed[index], "already claimed");

        bytes32 leaf = keccak256(abi.encodePacked(index, account, amount));
        require(_verify(merkleProof, leaf), "invalid proof");

        claimed[index] = true;

        (bool ok, ) = account.call{value: amount}("");
        require(ok, "transfer failed");
    }

    function _verify(bytes32[] calldata proof, bytes32 leaf) internal view returns (bool) {
        bytes32 computed = leaf;
        for (uint256 i = 0; i < proof.length; i++) {
            bytes32 p = proof[i];
            if (computed <= p) {
                computed = keccak256(abi.encodePacked(computed, p));
            } else {
                computed = keccak256(abi.encodePacked(p, computed));
            }
        }
        return computed == merkleRoot;
    }
}
