// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.2;

contract Faucet {   
    uint256 public amountAllowed = 100;
    address public tokenContract;
    mapping (address => bool) requestedAddress;

    event SendToken(address indexed receiver, uint256 amount);

    constructor(address _tokenContract){
        tokenContract =_tokenContract;
    }

    function  requestToken() public{
        require(!requestedAddress[msg.sender]);
        IERC20 token = IERC20(tokenContract);
        require(token.balanceOf(address(this))>= 1);
        token.transfer(msg.sender,1);
        amountAllowed  -=1;
        emit SendToken(msg.sender, 1);
    }
    
}