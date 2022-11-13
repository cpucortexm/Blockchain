// SPDX-License-Identifier: GPL-3.0
/*-----------------------------------------------------------
 @Filename:         OrderBookExchange.sol
 @Copyright Author: Yogesh K
 @Date:             11/11/2022
-------------------------------------------------------------*/
pragma solidity ^0.8.12;
import "hardhat/console.sol";
import "./TokenERC20.sol";

contract OrderBookExchange {
    address public feeAccount;
    uint256 public feePercent;
    // token addr => user addr => amount
    mapping(address => mapping(address => uint256)) public usertokens;
    event Deposit(address token, address user, uint256 amount, uint256 balance);
    event Withdraw(
        address token,
        address user,
        uint256 amount,
        uint256 balance
    );

    constructor(address _feeAccount, uint256 _feePercent) {
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }

    // Deposit tokens
    function depositToken(address _token, uint256 _amount) public {
        // Transfer tokens to exchange
        require(
            TokenERC20(_token).transferFrom(msg.sender, address(this), _amount),
            "transfer failed"
        );
        // Update user balance
        usertokens[_token][msg.sender] += _amount;
        // Emit event
        emit Deposit(
            _token,
            msg.sender,
            _amount,
            usertokens[_token][msg.sender]
        );
    }

    function withdrawToken(address _token, uint256 _amount) public {
        // ensure user has enough tokens to wihdraw
        require(
            usertokens[_token][msg.sender] >= _amount,
            "not enough tokens to withdraw"
        );
        // Transfer tokens to user
        TokenERC20(_token).transfer(msg.sender, _amount);
        // Update user balance
        usertokens[_token][msg.sender] -= _amount;

        // Emit event
        emit Withdraw(
            _token,
            msg.sender,
            _amount,
            usertokens[_token][msg.sender]
        );
    }

    // Check balances
    function balanceOf(address _token, address _user)
        public
        view
        returns (uint256)
    {
        return usertokens[_token][_user];
    }
}
