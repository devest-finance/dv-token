// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "./DeVest.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DvToken is ERC20, DeVest {

    uint8 private _decimals;

    /**
    * @dev Mints `initialSupply` amount of token and transfers them to `owner`.
     *
     * See {ERC20-constructor}.
     */
    constructor(string memory name, string memory symbol, uint8 __decimals, uint256 initialSupply, address owner, address _factory)
        ERC20(name, symbol) DeVest(owner, _factory) {
        _decimals = __decimals;
        _mint(owner, initialSupply);
    }

    /**
    * @dev See {IERC20-transfer}.
     *
     * Override transfer function and add tax contribution
     */
    function transfer(address to, uint256 amount) public virtual override returns (bool) {
        address owner = _msgSender();

        // calculate tax and transfer
        uint256 royalty = (amount * _royalty) / 1000;
        _transfer(owner, _royaltyRecipient, royalty);

        _transfer(owner, to, amount-royalty);
        return true;
    }

    /**
    * @dev Returns the number of decimals used to get its user representation.
     * For example, if `decimals` equals `2`, a balance of `505` tokens should
     * be displayed to a user as `5.05` (`505 / 10 ** 2`).
     *
     * Tokens usually opt for a value of 18, imitating the relationship between
     * Ether and Wei. This is the value {ERC20} uses, unless this function is
     * overridden;
     *
     * NOTE: This information is only used for _display_ purposes: it in
     * no way affects any of the arithmetic of the contract, including
     * {IERC20-balanceOf} and {IERC20-transfer}.
     */
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

}
