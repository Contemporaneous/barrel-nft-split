// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "hardhat/console.sol";
contract Barrel is ERC721 {

    address private owner;
    uint256 public totalSupply;
    uint256 public expectedSupply;

constructor(uint256 _totalSupply, uint256 _expectedSupply) payable ERC721("Barrel","BBL") {
        owner = payable(msg.sender);
        totalSupply = _totalSupply;
        expectedSupply = _expectedSupply;
    }
}