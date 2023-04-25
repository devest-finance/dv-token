// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "./DvToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DvTokenFactory is OwnableRevenue{

    event deployed(address indexed issuer_address, address indexed contract_address);

    bool private active = true;
    address[] internal tokens;

    constructor() OwnableRevenue(_msgSender()) {}

    function issue(string memory name, string memory symbol, uint8 decimals, uint256 initialSupply) public payable takeFee onlyOwner returns (address)
    {
        DvToken token = new DvToken(name, symbol, decimals, initialSupply, _msgSender());

        tokens.push(address(token));
        emit deployed(_msgSender(), address(token));

        return address(token);
    }

    // disable this deployer for further usage
    function terminate() public onlyOwner {
        active = false;
    }

}
