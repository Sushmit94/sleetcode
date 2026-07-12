// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract HTLC {
    address public immutable sender;
    address public immutable receiver;
    bytes32 public immutable hashlock;
    uint256 public immutable timelock;

    bool public withdrawn;
    bool public refunded;
    bytes32 public preimage;

    constructor(address _receiver, bytes32 _hashlock, uint256 _timelock) payable {
        require(msg.value > 0, "zero value");
        require(_timelock > block.timestamp, "timelock in past");
        sender = msg.sender;
        receiver = _receiver;
        hashlock = _hashlock;
        timelock = _timelock;
    }

    function withdraw(bytes32 _preimage) external {
        require(msg.sender == receiver, "not receiver");
        require(block.timestamp < timelock, "timelock expired");
        require(!withdrawn && !refunded, "already settled");
        require(keccak256(abi.encodePacked(_preimage)) == hashlock, "wrong preimage");

        withdrawn = true;
        preimage = _preimage;

        (bool ok, ) = receiver.call{value: address(this).balance}("");
        require(ok, "transfer failed");
    }

    function refund() external {
        require(msg.sender == sender, "not sender");
        require(block.timestamp >= timelock, "timelock not expired");
        require(!withdrawn && !refunded, "already settled");

        refunded = true;

        (bool ok, ) = sender.call{value: address(this).balance}("");
        require(ok, "transfer failed");
    }
}
