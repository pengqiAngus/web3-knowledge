// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.2;

contract ERC20 {
    string public name;
    string public symbol;
    uint256 public decimal;
    uint256 public _totalSuplly;
    address public onlyOwer;
    mapping(address => uint) _balances;
    mapping(address => mapping(address => uint)) _allowances;
    event Transfer(address from, address to, uint256 amount);
    event Approve(address owner, address approver, uint256 amount);

    constructor() {
        name = "token";
        symbol = "$";
        onlyOwer = msg.sender;
        decimal = 18;
    }

    modifier isOwner() {
        require(onlyOwer == msg.sender);
        _;
    }

    function getBalance(address owner) external view returns (uint256) {
        require(owner != address(0));
        return _balances[owner];
    }

    function approve(address approver, uint256 amount) external {
        require(approver != address(0));
        _allowances[msg.sender][approver] += amount;
        emit Approve( msg.sender,  approver, amount);

    }

    function transfer(address to, uint256 amount) external {
        require(_balances[msg.sender] > amount);
        _balances[to] += amount;
        _balances[msg.sender] -= amount;
        emit Transfer(msg.sender, to, amount);
    }

    function transferFrom(address from, address to, uint256 amount) external {
        require(_allowances[from][msg.sender] > amount);
        require(_balances[msg.sender] > amount);
        _allowances[from][msg.sender] -= amount;
        _balances[to] += amount;
        _balances[msg.sender] -= amount;
        emit Transfer(from, to, amount);
    }

    function mint(address account, uint256 amount) external isOwner {
        _balances[account] += amount;
        _totalSuplly += amount;
        emit Transfer(address(0), msg.sender, amount);
    }

    function burn(address account, uint256 amount) external isOwner {
        _balances[account] -= amount;
        _totalSuplly -= amount;
        emit Transfer(msg.sender, address(0), amount);
    }
}
