// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

// We dont need a router here, because in flashswap after we deliver the OUT token
// to the 'to' address, the callback get triggered, after which balances are checked
// for INPUT and OUTPUT
import "@uniswap/v2-periphery/contracts/interfaces/IERC20.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IWETH.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
// callee will be overriding in this contract
// call back function from Uniswap after we perform flash swap
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Callee.sol";

contract VerifyFlashSwap is IUniswapV2Callee {
    address constant Uniswap_V2_Factory =
        0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;

    address constant Weth = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;

    event Log(string message, uint256 val);

    function simulateFlashSwap(address _tokenBorrow, uint256 _amount) external {
        // get pair address
        address pair = IUniswapV2Factory(Uniswap_V2_Factory).getPair(
            _tokenBorrow,
            Weth
        );
        require(pair != address(0), "pair does not exist");

        // from pair get token0 and token1
        address token0 = IUniswapV2Pair(pair).token0();
        address token1 = IUniswapV2Pair(pair).token1();

        // either amount0Out or amount1Out will be 0
        uint256 amount0Out = _tokenBorrow == token0 ? _amount : 0;
        uint256 amount1Out = _tokenBorrow == token1 ? _amount : 0;

        // need to pass some data to trigger uniswapV2Call
        bytes memory data = abi.encode(_tokenBorrow, _amount);
        // Initiate Flash Swap
        IUniswapV2Pair(pair).swap(amount0Out, amount1Out, address(this), data);
    }

    // called by Uniswap pair contract before the swap is completed
    function uniswapV2Call(
        address _sender,
        uint256 _amount0,
        uint256 _amount1,
        bytes calldata _data
    ) external override {
        address token0 = IUniswapV2Pair(msg.sender).token0();
        address token1 = IUniswapV2Pair(msg.sender).token1();
        address pair = IUniswapV2Factory(Uniswap_V2_Factory).getPair(
            token0,
            token1
        );
        require(msg.sender == pair, "not pair");
        require(_sender == address(this), "not sender");

        (address tokenBorrow, uint256 amount) = abi.decode(
            _data,
            (address, uint256)
        );

        //  [(1 / (1 - 0.003)) - 1] = 3/997
        // about 0.3%
        uint256 fee = ((amount * 3) / 997) + 1;
        uint256 amountToRepay = amount + fee;

        // do stuff here
        emit Log("amount", amount);
        emit Log("amount0", _amount0);
        emit Log("amount1", _amount1);
        emit Log("fee", fee);
        emit Log("amount to repay", amountToRepay);
        // transfer it back to the pair contract
        IERC20(tokenBorrow).transfer(pair, amountToRepay);
    }
}
