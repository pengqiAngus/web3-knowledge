// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;


contract CrowdFunding {
    address public  immutable beneficiary;
    uint256 public immutable fundingGoals;
    uint256 public currentFundingAmount;
    mapping (address=>uint256) public  funders;
    bool public AVAILABELD = true;
    constructor(address _beneficiary, uint256 _fundingGoals){
        beneficiary = _beneficiary;
        fundingGoals = _fundingGoals;
    }
    function contribute() external payable {
        uint256 potentailAmount = currentFundingAmount + msg.value;
        if (potentailAmount>fundingGoals){
            uint256 refund = potentailAmount-fundingGoals;
            uint256 actualFund = msg.value - refund;
            if (funders[msg.sender] !=0){
                funders[msg.sender] +=actualFund;
                currentFundingAmount +=actualFund;
            } else {
                 funders[msg.sender] =actualFund;
            }
            payable(msg.sender).transfer(refund);
        }else {
            if (funders[msg.sender] !=0){
                funders[msg.sender] +=msg.value;
                currentFundingAmount +=msg.value;
            } else {
                 funders[msg.sender] =msg.value;
            }
        }
    }
    function close() public  returns( bool){
        if (fundingGoals>currentFundingAmount){
            return  false;
        }
        uint256 amount = currentFundingAmount;
        currentFundingAmount = 0;
        payable(beneficiary).transfer(amount);
        return  true;
    }
}