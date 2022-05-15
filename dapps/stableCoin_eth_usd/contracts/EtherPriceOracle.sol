// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
/*-----------------------------------------------------------
 @Filename:         EtherPriceOracle.sol
 @Copyright Author: Yogesh K
 @Date:             15/05/2022
-------------------------------------------------------------*/

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract PriceConsumerV3 {

    AggregatorV3Interface internal priceFeed;

    /**
     * Network: Mainnet
     * Aggregator: ETH/USD
     * Address: 0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419
     */
    constructor(address _network_address) {
        priceFeed = AggregatorV3Interface(_network_address);
    }

    /**
     * Returns the latest actual mainnet price.
     * Enable this when use in production
     */

    function getLatestPrice() public view returns (int) {
        (
            /*uint80 roundID*/,
            int price,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        )
         = priceFeed.latestRoundData();

        return price;
    }


    function getdecimals() public view returns (uint8)
    {
        return priceFeed.decimals();
    }
}




contract MockOraclePriceFeed{
    int price;  // must be in cents(not dollars) and adjusted to chainlink needs
    constructor(int _price){ 
        price = _price; // set default price
    }

 function getLatestPrice() external view returns (int){
        return price;
 }

 function setLatestPrice(int _price) external {
        price = _price;  // set new price for simulation
 }

// we return 8 to simulate chainlink decimal places
 function getdecimals() external pure returns (uint8){
     return 8;
 }

}