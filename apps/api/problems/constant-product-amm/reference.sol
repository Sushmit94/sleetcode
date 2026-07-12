// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract SimpleAMM {
    IERC20 public immutable tokenA;
    IERC20 public immutable tokenB;

    uint256 public reserveA;
    uint256 public reserveB;
    uint256 public totalLiquidity;
    mapping(address => uint256) public liquidity;

    constructor(address _tokenA, address _tokenB) {
        tokenA = IERC20(_tokenA);
        tokenB = IERC20(_tokenB);
    }

    function addLiquidity(uint256 amountA, uint256 amountB) external returns (uint256 shares) {
        require(amountA > 0 && amountB > 0, "zero amounts");

        require(tokenA.transferFrom(msg.sender, address(this), amountA), "transferFrom A failed");
        require(tokenB.transferFrom(msg.sender, address(this), amountB), "transferFrom B failed");

        if (totalLiquidity == 0) {
            shares = amountA;
        } else {
            uint256 sharesA = (amountA * totalLiquidity) / reserveA;
            uint256 sharesB = (amountB * totalLiquidity) / reserveB;
            shares = sharesA < sharesB ? sharesA : sharesB;
        }

        require(shares > 0, "zero shares");

        reserveA += amountA;
        reserveB += amountB;
        liquidity[msg.sender] += shares;
        totalLiquidity += shares;
    }

    function removeLiquidity(uint256 shares) external returns (uint256 amountA, uint256 amountB) {
        require(shares > 0 && liquidity[msg.sender] >= shares, "insufficient shares");

        amountA = (shares * reserveA) / totalLiquidity;
        amountB = (shares * reserveB) / totalLiquidity;

        liquidity[msg.sender] -= shares;
        totalLiquidity -= shares;
        reserveA -= amountA;
        reserveB -= amountB;

        require(tokenA.transfer(msg.sender, amountA), "transfer A failed");
        require(tokenB.transfer(msg.sender, amountB), "transfer B failed");
    }

    function swapAForB(uint256 amountIn) external returns (uint256 amountOut) {
        require(amountIn > 0, "zero amount in");
        require(tokenA.transferFrom(msg.sender, address(this), amountIn), "transferFrom failed");

        uint256 amountInWithFee = amountIn * 997;
        amountOut = (reserveB * amountInWithFee) / (reserveA * 1000 + amountInWithFee);
        require(amountOut > 0, "zero amount out");

        reserveA += amountIn;
        reserveB -= amountOut;

        require(tokenB.transfer(msg.sender, amountOut), "transfer failed");
    }

    function swapBForA(uint256 amountIn) external returns (uint256 amountOut) {
        require(amountIn > 0, "zero amount in");
        require(tokenB.transferFrom(msg.sender, address(this), amountIn), "transferFrom failed");

        uint256 amountInWithFee = amountIn * 997;
        amountOut = (reserveA * amountInWithFee) / (reserveB * 1000 + amountInWithFee);
        require(amountOut > 0, "zero amount out");

        reserveB += amountIn;
        reserveA -= amountOut;

        require(tokenA.transfer(msg.sender, amountOut), "transfer failed");
    }
}
