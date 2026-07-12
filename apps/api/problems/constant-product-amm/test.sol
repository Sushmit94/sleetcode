// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/Solution.sol";

contract MockERC20 {
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    function mint(address to, uint256 amount) external {
        balanceOf[to] += amount;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        return true;
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        require(balanceOf[msg.sender] >= amount, "insufficient balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        require(balanceOf[from] >= amount, "insufficient balance");
        require(allowance[from][msg.sender] >= amount, "insufficient allowance");
        allowance[from][msg.sender] -= amount;
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        return true;
    }
}

contract SimpleAMMTest is Test {
    SimpleAMM amm;
    MockERC20 tokenA;
    MockERC20 tokenB;

    address lp = address(0x111111);
    address trader = address(0x222222);

    function setUp() public {
        tokenA = new MockERC20();
        tokenB = new MockERC20();
        amm = new SimpleAMM(address(tokenA), address(tokenB));

        tokenA.mint(lp, 1000 ether);
        tokenB.mint(lp, 1000 ether);
        tokenA.mint(trader, 1000 ether);

        vm.startPrank(lp);
        tokenA.approve(address(amm), type(uint256).max);
        tokenB.approve(address(amm), type(uint256).max);
        vm.stopPrank();

        vm.prank(trader);
        tokenA.approve(address(amm), type(uint256).max);
    }

    function test_addLiquidity() public {
        vm.prank(lp);
        uint256 shares = amm.addLiquidity(100 ether, 100 ether);
        assertEq(shares, 100 ether);
        assertEq(amm.reserveA(), 100 ether);
        assertEq(amm.reserveB(), 100 ether);
        assertEq(amm.liquidity(lp), 100 ether);
    }

    function test_swapAForB() public {
        vm.prank(lp);
        amm.addLiquidity(1000 ether, 1000 ether);

        vm.prank(trader);
        uint256 out = amm.swapAForB(100 ether);

        assertGt(out, 0);
        assertLt(out, 100 ether); // fee + slippage means output < input in a 1:1 pool
        assertEq(tokenB.balanceOf(trader), out);
    }

    function test_swapPriceImpact() public {
        vm.prank(lp);
        amm.addLiquidity(1000 ether, 1000 ether);

        vm.prank(trader);
        uint256 out1 = amm.swapAForB(10 ether);

        tokenA.mint(trader, 10 ether);
        vm.prank(trader);
        uint256 out2 = amm.swapAForB(10 ether);

        assertLt(out2, out1); // same-size swap after the pool moved gets less out
    }

    function test_removeLiquidity() public {
        vm.startPrank(lp);
        amm.addLiquidity(100 ether, 100 ether);
        (uint256 outA, uint256 outB) = amm.removeLiquidity(50 ether);
        vm.stopPrank();

        assertEq(outA, 50 ether);
        assertEq(outB, 50 ether);
        assertEq(amm.liquidity(lp), 50 ether);
    }

    function test_revertRemoveMoreThanOwned() public {
        vm.startPrank(lp);
        amm.addLiquidity(100 ether, 100 ether);
        vm.expectRevert();
        amm.removeLiquidity(200 ether);
        vm.stopPrank();
    }

    function test_revertSwapZeroAmount() public {
        vm.prank(lp);
        amm.addLiquidity(100 ether, 100 ether);

        vm.prank(trader);
        vm.expectRevert();
        amm.swapAForB(0);
    }

    function test_proportionalSecondDeposit() public {
        vm.prank(lp);
        amm.addLiquidity(100 ether, 200 ether);

        address lp2 = address(0x333333);
        tokenA.mint(lp2, 100 ether);
        tokenB.mint(lp2, 200 ether);
        vm.startPrank(lp2);
        tokenA.approve(address(amm), type(uint256).max);
        tokenB.approve(address(amm), type(uint256).max);
        uint256 shares = amm.addLiquidity(50 ether, 100 ether);
        vm.stopPrank();

        assertEq(shares, amm.liquidity(lp) / 2);
    }
}
