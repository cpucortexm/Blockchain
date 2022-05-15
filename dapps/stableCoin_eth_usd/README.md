# ETH-USD stable coin

USD pegged Ether backed stablecoin, with the following features.
Chainlink oracle mainnet address for ETH/USD = 0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419

- if the price hasn't changed you should get back what you put in
- if the price of Ether doubles you should get back half as much Ether
- if the price of Ether gets cut in half and the contract can cover your balance you should get back twice as much Ether
- if the price of Ether gets cut in half and the contract can't cover the your balance you should get back half as much Ether

# Running the tests

For the tests we use a mock oracle to simulate different prices
In real time use case enable the chainlink oracle in the smart contract and disable certain tests

$ yarn
$ npx hardhat test
