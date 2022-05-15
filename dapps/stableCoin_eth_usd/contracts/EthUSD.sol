// SPDX-License-Identifier: MIT

/*-----------------------------------------------------------
 @Filename:         EthUSD.sol
 @Copyright Author: Yogesh K
 @Date:             15/05/2022
-------------------------------------------------------------*/
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./EtherPriceOracle.sol";


// Use this in production only
interface IEtherPriceOracle {
    function getLatestPrice() external view returns (int);
    function getdecimals() external view returns (uint8);
}

// To mock or simulate chainlink oracle to set/get different prices need for
// unit tests
interface IMockOraclePriceFeed{
  function getLatestPrice() external view returns (int);
  function setLatestPrice(int _price) external;
  function getdecimals() external view returns (uint8);
}
contract EthUSD is ERC20 {
  // enable this in production
  // IEtherPriceOracle priceOracle; 
  IMockOraclePriceFeed priceOracle;
  uint256 public _totalSupply;
  mapping(address => uint256) balances;
  // event emitted after finding ether price in cents
  event etherincents(uint256 amountInCents, uint256 priceinDollars);
  
  // needs deployed address of EtherPriceOracle contract
  constructor(address _etherPriceOracleAddress)
        ERC20("USD pegged Ether backed stablecoin", "ETH-USD") 
  {
    //priceOracle = IEtherPriceOracle(_etherPriceOracleAddress);
    priceOracle = IMockOraclePriceFeed(_etherPriceOracleAddress);
  }

  receive() external payable {}

  // issue() is the mint() of stable coin. What ever is done in mint, is done
  // in issue()
  function issue() external payable {
    uint256 priceinCents= getPrice();  // actually it will be in cents
    uint256 amountInCents = (msg.value * priceinCents) / 1 ether;
    _totalSupply += amountInCents;
    balances[msg.sender] += amountInCents;
    emit etherincents(amountInCents, priceinCents);
  }


  function totalSupply() public view override returns (uint256) {
    return _totalSupply;
  }
  
    function balanceOf(address account) public view override returns (uint256) {
        return balances[account];
    }

  // must return the 1 ETH amount in cents (dollars*100)
  function getPrice() public view returns (uint256) {
    // will be in int,  need to convert to uint
    int dollarprice = priceOracle.getLatestPrice();
    // Dont handle the negative <0 case, ie. Ether has become <0$ or -$ 
    require(dollarprice>=0, "Ether has gone -ve");
    // We divide by 10^6 because, as chainlink has 8 decimals for non-ETH pairs (ETH/USD, etc.) 
    // thus 10^8. But have to multiply by 100 to get it in cents, hence 100/10^8 = 10^6
    // (dollarprice*100)/10^8
    return (uint256(dollarprice)*100)/10**getDecimals();
  }
  
  
  // returns 8 for chainlink
  function getDecimals() internal view returns(uint8){
    return priceOracle.getdecimals();
  }


  function withdraw(uint amountInCents) public returns (uint amountInWei){
    require(amountInCents <= balanceOf(msg.sender), "withdrawal > balance");
    amountInWei = (amountInCents * 1 ether) / getPrice();

    // If we don't have enough Ether in the contract to pay out the full amount
    // pay an amount proportinal to what we have left.
    // this way user's net worth will never drop at a rate quicker than
    // the collateral itself.

    // For Example:
    // A user deposits 1 Ether when the price of Ether is $300
    // the price then falls to $150.
    // If we have enough Ether in the contract we cover ther losses
    // and pay them back 2 ether (the same amount in USD).
    // if we don't have enough money to pay them back we pay out
    // proportonailly to what we have left. In this case they'd
    // get back their original deposit of 1 Ether.
    if(address(this).balance <= amountInWei) {
      amountInWei = (amountInWei * address(this).balance * getPrice()) / (1 ether * _totalSupply);
    }

    balances[msg.sender] -= amountInCents;
    _totalSupply -= amountInCents;
    payable(msg.sender).transfer(amountInWei);
  }
}
