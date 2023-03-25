// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@thirdweb-dev/contracts/base/ERC20Base.sol";

contract FluxToken is ERC20Base {
    uint max_supply = 1000;
    uint256 public unitsOneEthCanBuy = 10; // ie. 1 ETH = 10 Flux tokens
    address public tokenOwner; // the owner of the token

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC20Base(_name, _symbol) {
        tokenOwner = msg.sender;
        uint256 n = 1000;
        // mint the tokens
        _mint(msg.sender, n * 10 ** uint(decimals()));
    }

    // this function is called when someone sends ether to the
    // token contract and want a FluxToken in exchange
    receive() external payable {
        // msg.value (in Wei) is the ether sent to the
        // token contract
        // msg.sender is the account that sends the ether to the
        // token contract
        // amount is the token bought by the sender
        uint256 amount = msg.value * unitsOneEthCanBuy;
        // ensure you have enough tokens to sell
        require(balanceOf(tokenOwner) >= amount, "Not enough tokens");
        // transfer the token to the buyer
        _transfer(tokenOwner, msg.sender, amount);
        // emit an event to inform of the transfer
        emit Transfer(tokenOwner, msg.sender, amount);

        // send the ether earned to the token owner
        payable(tokenOwner).transfer(msg.value);
    }
}
