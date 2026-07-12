// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SolNFT {
    string public name = "SolNFT";
    string public symbol = "SNFT";
    address public owner;

    mapping(uint256 => address) private _owners;
    mapping(address => uint256) private _balances;
    mapping(uint256 => address) private _tokenApprovals;

    constructor() {
        owner = msg.sender;
    }

    function mint(address to, uint256 tokenId) external {
        require(msg.sender == owner, "not owner");
        require(to != address(0), "mint to zero");
        require(_owners[tokenId] == address(0), "already minted");
        _owners[tokenId] = to;
        _balances[to] += 1;
    }

    function ownerOf(uint256 tokenId) public view returns (address) {
        address o = _owners[tokenId];
        require(o != address(0), "nonexistent token");
        return o;
    }

    function balanceOf(address account) public view returns (uint256) {
        require(account != address(0), "zero address");
        return _balances[account];
    }

    function approve(address to, uint256 tokenId) external {
        address tokenOwner = ownerOf(tokenId);
        require(msg.sender == tokenOwner, "not token owner");
        _tokenApprovals[tokenId] = to;
    }

    function getApproved(uint256 tokenId) public view returns (address) {
        require(_owners[tokenId] != address(0), "nonexistent token");
        return _tokenApprovals[tokenId];
    }

    function transferFrom(address from, address to, uint256 tokenId) external {
        require(ownerOf(tokenId) == from, "from not owner");
        require(to != address(0), "transfer to zero");
        require(msg.sender == from || msg.sender == _tokenApprovals[tokenId], "not authorized");

        delete _tokenApprovals[tokenId];
        _balances[from] -= 1;
        _balances[to] += 1;
        _owners[tokenId] = to;
    }
}
