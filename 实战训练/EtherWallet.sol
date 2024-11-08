// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;


contract EtherWallet  {
    address payable public immutable owner;
    event Log(string fullname, address from, uint256 value, bytes data);
    modifier isOwner{
        require(msg.sender == owner);
        _;
    }
    constructor(){
        owner = payable(msg.sender);
    }
    receive() external payable {
        emit Log("recieve", msg.sender, msg.value,"");
    }
    function withdraw() public isOwner{
          // owner.transfer 相比 msg.sender 更消耗Gas
        // owner.transfer(address(this).balance);
        payable(msg.sender).transfer(100);
    }
     function withdra2() public isOwner{
      bool success =  payable(msg.sender).send(100);
      assert(success);
    }
      function withdra3() public isOwner{
     ( bool success, )=  msg.sender.call{value: address(this).balance, gas: 100}("");
      assert(success);
    }
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}