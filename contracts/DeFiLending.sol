// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DeFiLending {
    IERC20 public token;
    mapping(address => uint256) public deposits;
    mapping(address => uint256) public borrowBalances;

    constructor(address _tokenAddress) {
        token = IERC20(_tokenAddress);
    }

    function depositETH() public payable {
        require(msg.value > 0, "Deposit must be greater than 0");
        deposits[msg.sender] += msg.value;
    }

    function borrow(uint256 _amount) public {
        require(deposits[msg.sender] > 0, "You must deposit ETH first");
        require(token.balanceOf(address(this)) >= _amount, "Not enough tokens in pool");

        borrowBalances[msg.sender] += _amount;
        token.transfer(msg.sender, _amount);
    }

    function repay(uint256 _amount) public {
        require(borrowBalances[msg.sender] >= _amount, "Repay amount exceeds debt");

        token.transferFrom(msg.sender, address(this), _amount);
        borrowBalances[msg.sender] -= _amount;
    }

    function withdrawETH() public {
        uint256 amount = deposits[msg.sender];
        require(amount > 0, "No ETH to withdraw");

        deposits[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }
}

