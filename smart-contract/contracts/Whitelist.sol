// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;
import "hardhat/console.sol";

contract Whitelists{
    uint public MaxWhitelisted;
    uint public numWhitelisted;

    mapping(address => bool) public whitelisted;
    address [] public whitelistedAddresses;




    constructor(uint _numTobeWhitelisted){
        MaxWhitelisted = _numTobeWhitelisted; 
    }

    function whitelistAddress()public {
        require(numWhitelisted < MaxWhitelisted, "whitelist full");
        require(!whitelisted[msg.sender], "already whitelisted");

        whitelisted[msg.sender] == true;
        whitelistedAddresses.push(msg.sender);
        numWhitelisted += 1;
        console.log("user whitelisted to", msg.sender);
    }

    function showWhitelistedStatus()public view returns(bool){
        return whitelisted[msg.sender];
    }

    
}


