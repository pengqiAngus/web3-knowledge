// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;


contract MultiSigWallet   {
    address[] public owners;
    mapping(address=> bool) isOwner;
    uint public requiredApprovCount;
    struct Transaction{
        address to;
        uint value;
        bytes data;
        bool exected;
    }
    Transaction[] public  transactions ;
    mapping (uint => mapping (address=>bool)) trasacationsApproved;
    event Deposit(address indexed sender, uint amount);
    event Submit(uint indexed txId);
    event Approve(address indexed owner, uint indexed txId);
    event Revoke(address indexed owner, uint indexed txId);
    event Execute(uint indexed txId);

    receive() external payable {
        emit Deposit(msg.sender, msg.value);
     }

     modifier onlyOwner(){
        require(isOwner[msg.sender], "not owner");
        _;
     }

     modifier txExists(uint _txId){
        require(_txId < transactions.length, "tx doesn't exist" );
        _;
     }

     modifier notApprpoved(uint _txId){
        require(!trasacationsApproved[_txId][msg.sender], "tx already approved");
        _;
     }

    modifier notExecuted(uint256 _txId) {
        require(!transactions[_txId].exected, "tx is exected");
        _;
    }
    constructor(address[] memory _owners, uint _requiredApprovCount){
        require(_owners.length>0);
        require(_requiredApprovCount>0 && _requiredApprovCount<_owners.length);
        for (uint i; i<_owners.length; i++) {
            address owner = _owners[i];       
            require(owner!=address(0));  
            require(!isOwner[owner]);  
            isOwner[owner] = true;
        }
        requiredApprovCount =_requiredApprovCount;
    }
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
    function submit(address _to, uint _value,bytes calldata _data)  external onlyOwner{
        transactions.push(
            Transaction({
                to : _to,
                value : _value,
                data : _data,
                exected : false
            })
        );
       emit Submit(transactions.length-1);
    }
    function approve(uint _txId) external onlyOwner txExists(_txId) notApprpoved(_txId) notExecuted(_txId){
        trasacationsApproved[_txId][msg.sender] =true;
        emit Approve(msg.sender, _txId);
    }

    function excute(uint _txId) external onlyOwner txExists(_txId)  notExecuted(_txId){
        require(getApprovedCount(_txId)>=requiredApprovCount);
       Transaction storage transaction =  transactions[_txId];
        transaction.exected =true;
        (bool success,) = transaction.to.call{value:transaction.value}(transaction.data);
        require(success);
        emit Execute(_txId);
    }
    function getApprovedCount(uint _txId) public view  returns(uint){
        uint count = 0;
        for (uint i; i<owners.length; i++) {
            if(trasacationsApproved[_txId][owners[i]]){
                count+=1;
            }
        }
        return  count;
    }
     function revoke(uint _txId) external onlyOwner txExists(_txId) notApprpoved(_txId) notExecuted(_txId){
        trasacationsApproved[_txId][msg.sender] =false;
        emit Revoke(msg.sender, _txId);
    }
    
}