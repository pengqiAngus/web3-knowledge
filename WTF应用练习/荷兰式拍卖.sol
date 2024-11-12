// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.2;

interface IERC721 {
    function  transferFrom(address from, address to, uint256 token Id) external
}

contract dutchAuction {   
    address payable public immutable seller;
    uint256 private constant DURATION = 7 *60 *60 *24;
    IERC721 public immutable nft ;
    uint256 public immutable tokenId;
    uint256 public immutable startPrice;
    uint256 public immutable endPrice;
    uint256 public immutable discountRate;
    uint256 public immutable startTime;
    uint256 public immutable endTime;
    
    constructor(
        uint _startPrice,
        uint _discountRate,
        address _nft,
        uint _tokenId
    ){
        seller = payable(msg.sender);
        nft=_nft;
        tokenId=_tokenId;
        startPrice =_startPrice;
        discountRate=_discountRate;
        startTime = block.timestamp;
        endTime = block.timestamp + DURATION;
    }
    function getPrice() public view  returns (uint256) {
        uint timePassed = block.timestamp - startTime;
        uint discount = discountRate*timePassed;
        return startPrice-discount;
    }
    function buy()  returns () {
        require(block.timestamp<endTime);
        uint price = getPrice();
        require(msg.value > price);
        nft.transferFrom(seller, msg.sender, tokenId);
        uint refund = msg.value - price;
        if (refund > 0) {
            payable(msg.sender).transfer{value: refund}()
        }
        selfdestruct(seller);
    }
}