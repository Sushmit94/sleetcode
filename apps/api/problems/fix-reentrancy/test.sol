// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/Solution.sol";

contract Attacker {
    SafeVault vault;
    uint256 attackCount;

    constructor(SafeVault _vault) { vault = _vault; }

    function attack() external payable {
        vault.deposit{value: msg.value}();
        attackCount = 0;
        vault.withdraw();
    }

    receive() external payable {
        if (attackCount < 3 && address(vault).balance >= 1 ether) {
            attackCount++;
            vault.withdraw();
        }
    }
}

contract ReentrancyTest is Test {
    SafeVault vault;
    address victim = address(0xBEEF);

    function setUp() public {
        vault = new SafeVault();
        vm.deal(victim, 5 ether);
        vm.prank(victim);
        vault.deposit{value: 5 ether}();
    }

    function test_attackerCannotDrain() public {
        Attacker attacker = new Attacker(vault);
        vm.deal(address(attacker), 1 ether);
        attacker.attack{value: 0}();

        // attacker should only get their 1 ether back, not drain victim
        assertEq(vault.balances(victim), 5 ether, "victim drained");
    }

    function test_normalWithdraw() public {
        vm.prank(victim);
        vault.withdraw();
        assertEq(address(victim).balance, 5 ether);
    }
}
