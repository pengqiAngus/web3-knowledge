// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.2;

contract Airdrop {   
    function getSum(uint256[] calldata _arr) public pure  returns (uint sum) {
        for (uint i = 0; i < _arr.length; i++) {
            sum += _arr[i]
        }
    }

    function multiTransferToken(address token, address[] calldata amounts, address[] calldata accounts )  returns () {
        require(amounts.length==accounts.length);
        IERC20 tokenContract = IERC20(token);
        require(tokenContract.allowance(address(this)) >getSum(amounts));
        for (uint i = 0; i < accounts.length; i++) {
            tokenContract.transferFrom(msg.sender,accounts[i],amounts[i]);
        }
    }
     function multiTransferToken(address[] calldata amounts, address[] calldata accounts )  returns () {
        require(amounts.length==accounts.length);
        require(msg.value >getSum(amounts));
        for (uint i = 0; i < accounts.length; i++) {
           (bool success, ) = amounts[i].call{value: amounts[i]}();
           if (!success) {
                failTransferList[_addresses[i]] = _amounts[i];
           }
        }
    }
    
}