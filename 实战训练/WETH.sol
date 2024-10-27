// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2<0.9.0;

contract WETH {
   string public name = "wrapper Ether";
   string public  symbol = "WETH";
   uint8 public adcimals = 18;
    event Approval(address indexed src, address indexed delegatedAds, uint256 amount);
    event Transfer(address indexed src, address indexed delegatedAds, uint256 amount);
    event Deposit(address indexed toAds, uint256 amount);
    event Withdraw(address indexed src, uint256 amount);
    mapping(address=>uint256) balanceOf;
    mapping (address => mapping (address =>uint256)) public allowance;
    function deposit() public payable {
        balanceOf[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }
    function withdress(uint256 _amount) public  payable {
        require(balanceOf[msg.sender] >= _amount, "not enough amount");
        balanceOf[msg.sender] -= _amount;
        emit Withdraw(msg.sender, _amount);
    }
    function totalSupply() public view returns (uint256) {
        return address(this).balance;
    }
    function approve(address _src, address _to, uint256 _amount) public returns (bool) {
        allowance[_src][_to] = _amount;
        emit Approval(_src,_to,_amount);
        return  true;
    }
    function transfer(address _to, uint256 amount) public {
        transferFrom(msg.sender, _to, amount);
    }
    function transferFrom(address _src ,address _to, uint256 _amount) public returns(bool){
        require(balanceOf[_src] >= _amount, "not enough amount");
        if (_src != msg.sender){
            require(allowance[_src][_to] >= _amount);
            allowance[_src][_to] -= _amount;
        }
        balanceOf[_src] -= _amount;
        balanceOf[_to]  += _amount;
        emit Transfer(_src, _to, _amount);
    }
    fallback() external payable { 
        deposit();
    }
    receive() external payable {
        deposit();
     }
}