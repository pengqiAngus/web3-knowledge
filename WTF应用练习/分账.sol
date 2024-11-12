// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.2;

contract PaymentSplit {
    event PayeeAdded(address account, uint256 amount);
    event PaymentReleased(address to, uint256 amount);
    event PaymentReceived(address from, uint256 amount); 

    uint256 public totalShares; // 总份额
    uint256 public totalReleased; // 总支出
    mapping (address => uint256) public shares; // 每个受益人的份额
    mapping (address => uint256) released; // 支付给每个受益人的金额

    address[] public payees; // 受益人数组
    constructor(address[] payees, uint256[] amounts) {
        require(payees.length>0);
        require(payees.length ==amounts.length);
        for (uint i = 0; i < payees.length; i++) {
            addPayee(payees[i],amounts[i]);
        }
    }
    
    receive() external payable virtual{
        emit PaymentRecieved(msg.sender, msg.value)
    }
    function release(address payable _account) public virtual  {
        require(shares[_account]>0);
        uint256 payment = releasable(_account);
        require(payment !=0);
        totalReleased +=payment;
        released[_account] +=payment;
        _account.transfer(payment);
        emit PaymentReleased(_account, payment);
    }

    function releasable(address _account) public view  returns (uint256) {
        uint256 share = shares[_account];
        uint256 totalRecieved = address(this).balance + totalReleased;
        uint256 payment = totalRecieved * share / totalShares -released[_account];
        return payment;
    }

    function addPayee(address _account, uint256 amount) private {
        require(_account != address(0));
        require(amount >0);
        require(shares[_account] ==0);
        payees.push(_account);
        shares[_account] = amount;
        totalShares +=amount;
        emit PaymentReceived(_account,amount);
    }
}