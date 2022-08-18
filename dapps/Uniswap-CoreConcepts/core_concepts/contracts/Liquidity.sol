// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@uniswap/v2-periphery/contracts/interfaces/IERC20.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IWETH.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";

contract VerifyLiquidity {
    address constant Uniswap_V2_Router =
        0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    address constant Uniswap_V2_Factory =
        0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;
    address immutable Weth;

    event Log(string message, uint256 val);

    constructor() {
        Weth = IUniswapV2Router02(Uniswap_V2_Router).WETH();
    }

    // This is to check if we have all the correct addresses
    function get_contract_address()
        public
        view
        returns (
            address,
            address,
            address
        )
    {
        return (Uniswap_V2_Router, Uniswap_V2_Factory, Weth);
    }

    function simulateAddLiquidity(
        address _tokenA,
        address _tokenB,
        uint256 _amountA,
        uint256 _amountB
    ) external {
        // Transfer tokenA and tokenB to this contract
        IERC20(_tokenA).transferFrom(msg.sender, address(this), _amountA);
        IERC20(_tokenB).transferFrom(msg.sender, address(this), _amountB);

        // give approval for router to use tokenA and tokenB
        IERC20(_tokenA).approve(Uniswap_V2_Router, _amountA);
        IERC20(_tokenB).approve(Uniswap_V2_Router, _amountB);

        (uint256 amountA, uint256 amountB, uint256 liquidity) = IUniswapV2Router02(
            Uniswap_V2_Router
        ).addLiquidity(
                _tokenA,
                _tokenB,
                _amountA, // amountA desired
                _amountB, // amountB desired
                1, // amount min A
                1, // amount min B
                address(this), // to account
                block.timestamp // deadline
            );
        emit Log("amountA", amountA);
        emit Log("amountB", amountB);
        emit Log("liquidity", liquidity);
    }

    function simulateRemoveLiquidity(address _tokenA, address _tokenB)
        external
    {
        // get the pair address
        address pair = IUniswapV2Factory(Uniswap_V2_Factory).getPair(
            _tokenA,
            _tokenB
        );

        // get Liquidity
        uint256 liquidity = IERC20(pair).balanceOf(address(this));

        // give approval to router
        IERC20(pair).approve(Uniswap_V2_Router, liquidity);

        (uint256 amountA, uint256 amountB) = IUniswapV2Router02(
            Uniswap_V2_Router
        ).removeLiquidity(
                _tokenA,
                _tokenB,
                liquidity,
                1, // amountA min
                1, // amountB min
                address(this), // to account
                block.timestamp // deadline
            );
        emit Log("amountA", amountA);
        emit Log("amountB", amountB);
    }
}
