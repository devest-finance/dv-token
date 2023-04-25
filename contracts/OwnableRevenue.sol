// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/utils/Context.sol";

/**
 * @dev Contract module which provides ownership and a revenue model for a beneficary
 *
 * By default, the owner account will be the one that deploys the contract. This
 * can later be changed with {transferOwnership}.
 *
 * This module is used through inheritance. It will make available the modifier
 * `onlyOwner`, which can be applied to your functions to restrict their use to
 * the owner.
 */
contract OwnableRevenue is Context {

    address internal _owner;
    address internal _beneficiary;
    address internal _host;

    uint256 internal _fees = 0;
    uint256 internal _tax = 0;

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    constructor(address __owner) {
        _transferOwnership(__owner);
        _beneficiary = __owner;

        _host = _msgSender();
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        _checkOwner();
        _;
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyHost() {
        _checkHost();
        _;
    }

    /**
     * Verify enough fee (value) was provided and take
     */
    modifier takeFee() {
        // check for fee and transfer to owner
        require(msg.value >= _fees, "Please provide enough fee");
        payable(_beneficiary).transfer(_fees);
        _;
    }

    /**
     * @dev set the native fee, only owner
     */
    function setFee(uint256 fees) public onlyHost {
        _fees = fees;
    }

    /**
     * @dev set the tax, only owner
     */
    function setTax(uint256 tax) public onlyOwner {
        _tax = tax;
    }

    /*
     * Set the beneficiary address, only owner
     */
    function setBeneficiary(address beneficiary) public onlyOwner {
        _beneficiary = beneficiary;
    }

    /**
     * @dev Set the host address, only host
     */
    function setHost(address __host) public onlyHost {
        _host = __host;
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function host() public view virtual returns (address) {
        return _host;
    }

    /**
     * @dev Throws if the sender is not the owner.
     */
    function _checkOwner() internal view virtual {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
    }

    /**
     * @dev Throws if the sender is not the owner.
     */
    function _checkHost() internal view virtual {
        require(host() == _msgSender(), "Ownable: caller is not the owner");
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Internal function without access restriction.
     */
    function _transferOwnership(address newOwner) internal virtual {
        _owner = newOwner;
    }
}
