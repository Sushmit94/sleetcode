// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract LendingPool {
    uint256 public constant RATE_BPS = 1000; // 10% APR
    uint256 public constant BPS_DENOM = 10000;
    uint256 public constant YEAR = 365 days;

    mapping(address => uint256) public collateral;
    mapping(address => uint256) public borrowed;
    mapping(address => uint256) public borrowTimestamp;

    function depositCollateral() external payable {
        require(msg.value > 0, "zero deposit");
        collateral[msg.sender] += msg.value;
    }

    function borrow(uint256 amount) external {
        require(amount > 0, "zero amount");
        require(borrowed[msg.sender] == 0, "existing loan");
        require(amount * 2 <= collateral[msg.sender], "insufficient collateral");
        require(address(this).balance >= amount, "insufficient liquidity");

        borrowed[msg.sender] = amount;
        borrowTimestamp[msg.sender] = block.timestamp;

        (bool ok, ) = msg.sender.call{value: amount}("");
        require(ok, "transfer failed");
    }

    function interestOwed(address user) public view returns (uint256) {
        if (borrowed[user] == 0) return 0;
        uint256 elapsed = block.timestamp - borrowTimestamp[user];
        return (borrowed[user] * RATE_BPS * elapsed) / (BPS_DENOM * YEAR);
    }

    function repay() external payable {
        uint256 principal = borrowed[msg.sender];
        require(principal > 0, "no loan");
        uint256 owed = principal + interestOwed(msg.sender);
        require(msg.value >= owed, "insufficient repayment");

        borrowed[msg.sender] = 0;
        borrowTimestamp[msg.sender] = 0;

        if (msg.value > owed) {
            (bool ok, ) = msg.sender.call{value: msg.value - owed}("");
            require(ok, "refund failed");
        }
    }

    function withdrawCollateral(uint256 amount) external {
        require(amount > 0 && amount <= collateral[msg.sender], "invalid amount");
        uint256 remaining = collateral[msg.sender] - amount;
        require(borrowed[msg.sender] * 2 <= remaining, "would undercollateralize");

        collateral[msg.sender] = remaining;
        (bool ok, ) = msg.sender.call{value: amount}("");
        require(ok, "transfer failed");
    }
}
