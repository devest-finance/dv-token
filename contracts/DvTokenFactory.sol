// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "./DvToken.sol";
import "@devest/contracts/DvFactory.sol";

contract DvTokenFactory is DvFactory {

    constructor() DvFactory() {}

    /**
     * @dev detach a token from this factory
     */
    function detach(address payable _tokenAddress) external payable onlyOwner {
        DvToken token = DvToken(_tokenAddress);
        token.detach();
    }

    function issue(string memory name, string memory symbol, uint8 decimals, uint256 initialSupply) public payable isActive returns (address)
    {
        require(decimals >= 0 && decimals <= 18, "DvTokenFactory: decimals must be less than or equal to 18");
        require(initialSupply > 0, "DvTokenFactory: initialSupply must be greater than 0");
        // take fee
        require(msg.value >= _issueFee, "Please provide enough fee");
        if (_issueFee > 0)
            payable(_feeRecipient).transfer(_issueFee);

        // issue token
        DvToken token = new DvToken(name, symbol, decimals, initialSupply, address(this), _msgSender());

        emit deployed(_msgSender(), address(token));
        return address(token);
    }

}
