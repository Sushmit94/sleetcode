// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TokenVesting {
    address public immutable beneficiary;
    uint256 public immutable start;
    uint256 public immutable cliffDuration;
    uint256 public immutable vestingDuration;
    uint256 public immutable totalAllocation;
    uint256 public released;

    constructor(address _beneficiary, uint256 _start, uint256 _cliffDuration, uint256 _vestingDuration) payable {
        require(_beneficiary != address(0), "zero beneficiary");
        require(_vestingDuration > 0, "zero duration");
        require(_cliffDuration <= _vestingDuration, "cliff > duration");
        beneficiary = _beneficiary;
        start = _start;
        cliffDuration = _cliffDuration;
        vestingDuration = _vestingDuration;
        totalAllocation = msg.value;
    }

    function vestedAmount(uint256 timestamp) public view returns (uint256) {
        if (timestamp < start + cliffDuration) {
            return 0;
        } else if (timestamp >= start + vestingDuration) {
            return totalAllocation;
        } else {
            return (totalAllocation * (timestamp - start)) / vestingDuration;
        }
    }

    function release() external {
        uint256 releasable = vestedAmount(block.timestamp) - released;
        require(releasable > 0, "nothing to release");
        released += releasable;
        (bool ok, ) = beneficiary.call{value: releasable}("");
        require(ok, "transfer failed");
    }
}
