// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import { Base64 } from "./libraries/Base64.sol";

import "hardhat/console.sol";
contract Barrel is ERC721 {

    address public owner;
    uint256 public totalSupply;
    uint256 public expectedSupply;
    uint256 public releaseTime;
    uint256 public expiryTime;
    uint256 public startPrice;
    uint256 public endPrice;
    uint256 public increments;

    using Counters for Counters.Counter;
    Counters.Counter private tokenIds;

    struct tokenDetails {
        uint256 tokenId;
        uint256 mintTime;
    }

    mapping(uint256 => tokenDetails) private tokenDetailsMap;

    constructor(uint256 _totalSupply, uint256 _expectedSupply, uint256 _releaseTime, uint256 _expiryTime, uint256 _startPrice, uint256 _endPrice, uint256 _increments) ERC721("Barrel","BBL") {
        owner = payable(msg.sender);
        totalSupply = _totalSupply;
        expectedSupply = _expectedSupply;
        releaseTime = _releaseTime;
        expiryTime = _expiryTime;
        startPrice = _startPrice;
        endPrice = _endPrice;
        increments = _increments;
    }

    function getPrice() public view returns (uint256) {
        if (block.timestamp >= (releaseTime + (increments+1) * 3600)){
            return endPrice;
        } else {
            return (increments-(block.timestamp-releaseTime)/3600) * (startPrice-endPrice)/increments + endPrice;
        }
        
    }

    function generateNFT() public payable{
        uint256 price = getPrice();
        require(msg.value >= price, "You need to pay the correct price");
        require(tokenIds.current() < totalSupply, "Allocation exhausted");

        require(block.timestamp<expiryTime, "NFTs can only br produced before expiry time");
        require(block.timestamp>=releaseTime, "NFTs can only br produced after release time");

        uint256 newItemId = tokenIds.current();
        _safeMint(msg.sender, newItemId);

        //Store details
        tokenDetailsMap[newItemId] = tokenDetails(newItemId, block.timestamp);

        // Increment the counter for when the next NFT is minted.
        tokenIds.increment();
    }

    function generateURI(uint256 id) public view returns (string memory) {

        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "Barrel Portion (',Strings.toString(id),')", "description": "A Porion of the barrel.",',
                        '"attributes": [ {"trait_type": "Mint Time", "value": "',Strings.toString(tokenDetailsMap[id].mintTime),'" }',
                        ']}'
                    )
                )
            )
        );

        string memory finalTokenUri = string(
            abi.encodePacked("data:application/json;base64,", json)
        );
            
        return finalTokenUri;
    }

    function tokenURI(uint256 _tokenId) public view override returns (string memory) { 
        return generateURI(_tokenId);
    }

    function getPosition(uint256 _tokenId) public view returns (bool, uint256) {
        if (_tokenId > expectedSupply) {
            return (false, _tokenId - expectedSupply);
        } else {
            return (true, expectedSupply-_tokenId);
        }
    }

    function getTokenTime(uint256 _tokenId) public view returns (uint256) {
        return tokenDetailsMap[_tokenId].mintTime;
    }

}