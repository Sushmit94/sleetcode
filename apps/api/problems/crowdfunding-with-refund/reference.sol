// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Crowdfunding {
    address public immutable creator;
    uint256 public immutable goal;
    uint256 public immutable deadline;

    mapping(address => uint256) public contributions;
    uint256 public totalRaised;
    bool public withdrawn;

    constructor(uint256 _goal, uint256 _deadline) {
        require(_goal > 0, "zero goal");
        require(_deadline > block.timestamp, "deadline in past");
        creator = msg.sender;
        goal = _goal;
        deadline = _deadline;
    }

    function contribute() external payable {
        require(block.timestamp < deadline, "campaign ended");
        require(msg.value > 0, "zero contribution");
        contributions[msg.sender] += msg.value;
        totalRaised += msg.value;
    }

    function withdraw() external {
        require(msg.sender == creator, "not creator");
        require(block.timestamp >= deadline, "not ended");
        require(totalRaised >= goal, "goal not met");
        require(!withdrawn, "already withdrawn");
        withdrawn = true;
        (bool ok, ) = creator.call{value: address(this).balance}("");
        require(ok, "transfer failed");
    }

    function refund() external {
        require(block.timestamp >= deadline, "not ended");
        require(totalRaised < goal, "goal met");
        uint256 amount = contributions[msg.sender];
        require(amount > 0, "nothing to refund");
        contributions[msg.sender] = 0;
        (bool ok, ) = msg.sender.call{value: amount}("");
        require(ok, "transfer failed");
    }
}
