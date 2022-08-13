// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@uniswap/v2-periphery/contracts/interfaces/IERC20.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IWETH.sol";

contract CheckSwap {
    address constant Uniswap_V2_Router =
        0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    address immutable Weth;

    constructor() {
        Weth = IUniswapV2Router02(Uniswap_V2_Router).WETH();
    }

    // This is to check if we have all the correct addresses
    function get_contract_address() public view returns (address, address) {
        return (Uniswap_V2_Router, Weth);
    }

    function simulateSwap(
        address _tokenIn, // DAI
        address _tokenOut, // ANT
        uint256 _amountIn,
        uint256 _amountOutMin,
        address _to // address to where I should receive ANT tokens
    ) external {
        // transfer all token In to this contract
        IERC20(_tokenIn).transferFrom(msg.sender, address(this), _amountIn);
        // give approval for router to use the token in amount
        IERC20(_tokenIn).approve(Uniswap_V2_Router, _amountIn);

        address[] memory path;
        if (_tokenIn == Weth || _tokenOut == Weth) {
            path = new address[](2);
            path[0] = _tokenIn;
            path[1] = _tokenOut;
        } else {
            /*
            path = new address[](2);
            path[0] = _tokenIn;
            path[1] = _tokenOut;
        */
            path = new address[](3);
            path[0] = _tokenIn;
            path[1] = Weth;
            path[2] = _tokenOut;
        }

        IUniswapV2Router02(Uniswap_V2_Router).swapExactTokensForTokens(
            _amountIn,
            _amountOutMin,
            path,
            _to,
            block.timestamp
        );
    }
}
