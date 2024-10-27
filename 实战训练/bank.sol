// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2<0.9.0;

contract Bank{
    address public immutable owner;
    uint256 public  customerBalance;
    event Deposit(address _ads, uint256 amount);
    event Widthdraw(uint256 amount);
    modifier isOwner() {
        require(msg.sender==owner, "not the owner of bank account");
        _;
    }
    constructor ()payable{
        owner = msg.sender;
    }
    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }
    function withdraw() public  payable isOwner{
        emit Widthdraw(address(this).balance);
        selfdestruct(payable(msg.sender));
    }

    function customerDeposit(uint256 _amount) public payable   {
        customerBalance += _amount;
    }
    function CustomerWithdraw() public  isOwner{
        uint256 amount = customerBalance;
        emit Widthdraw(amount);
        customerBalance = 0;
    }
    function getBalance() external view returns (uint256){
        return address(this).balance;
    }
}