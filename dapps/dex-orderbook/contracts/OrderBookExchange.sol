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
    mapping(uint256 => _Order) public orders;

    //Order structure
    struct _Order {
        uint256 id; //unique order id
        address user; // Address who made the order
        address tokenGet; // Address of token to receive
        uint256 amountGet; // Amount to receive
        address tokenGive; // Address of token to give
        uint256 amountGive; // Amount to Give
        uint256 timestamp; // Order time creation
    }
    uint256 public orderCount;
    event Deposit(address token, address user, uint256 amount, uint256 balance);
    event Withdraw(
        address token,
        address user,
        uint256 amount,
        uint256 balance
    );
    event Order(
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        uint256 timestamp
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

    // Withdraw tokens
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

    // Make Order: token to exchange.
    // Token to give: which token and how much
    // Token to get or receive: which token and how much
    function makeOrder(
        address _tokenGet,
        uint256 _amountGet,
        address _tokenGive,
        uint256 _amountGive
    ) public {
        require(
            balanceOf(_tokenGive, msg.sender) >= _amountGive,
            "Insufficient Give token Balance"
        );
        orderCount += 1;
        // Create a new order
        orders[orderCount] = _Order(
            orderCount,
            msg.sender,
            _tokenGet,
            _amountGet,
            _tokenGive,
            _amountGive,
            block.timestamp
        );
        emit Order(
            orderCount,
            msg.sender,
            _tokenGet,
            _amountGet,
            _tokenGive,
            _amountGive,
            block.timestamp
        );
    }
}
