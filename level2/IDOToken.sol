// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.2;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract IDOToken {
    uint256 public idoPrice = 0.1 * 10 ** 18;

    uint256 public maxBuyAmount = 100 * 10 ** 18;

    address public usdtAddress = 0x606D35e5962EC494EAaf8FE3028ce722523486D2;
    mapping(address => bool) private isBuy;

    function buyToken(uint256 amount) public {
        require(!isBuy[msg.sender]);
        require(amount<maxBuyAmount);
        IERC20(usdtAddress).transferFrom(msg.sender,address(to),amount);
        uint256 buyNum = amount / idoPrice * 10 ** 18;
        isBuy[msg.sender] = true;
        _mint(msg.sender, buyNum);
    }    
    function  withdraw() public Ownable{
        uint256 bal = IERC20(usdtAddress).balanceOf(msg.sender);
        IERC20(usdtAddress).transfer(msg.sender,bal);
    }
}
