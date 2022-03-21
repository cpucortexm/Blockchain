# Basic Setup. First you must compile the contract

## 1. Assumes you have installed npm, npx and hardhat depending on the operating system you use.

## 2. Download this repo and unzip or git clone < github link >

## 3. open command line or console

```
 $ cd nftV1
 $ npm install
 $ npx hardhat compile
```

# To deploy and verify

## Update hardhat.config.js file (basic config already done)

## Edit the cfg.json and fill the necessary details

-     a. Alchemy endpoints of ropsten, rinkeby and mainnet
-     b. Metamask private keys of the accounts (ensure to have atleast three metamask accounts with sufficient funds)
-     c. Etherscan API keys of ropsten, mainnet and rinkeby. It will be the same for all.
-     d. Edit the name, symbol and ipfs address.

## on local blockchain using mainnet fork (simulates mainnet locally)

```
$ npx hardhat run scripts/deploy.js --network hardhat

```

## on testnet (rinkeby).Ensure to have sufficient funds in accounts. If the network is busy, you may have to try a few times

```
$ npx hardhat run scripts/deploy.js --network rinkeby     # Note down the deployed address
$ npx hardhat Verify --address < DEPLOYED ADDR > --network rinkeby

```

## on testnet (ropsten). Ensure to have sufficient funds in accounts. If the network is busy, you may have to try a few times

```
$ npx hardhat run scripts/deploy.js --network ropsten     # Note down the deployed address
$ npx hardhat Verify --address < DEPLOYED ADDR > --network ropsten

```

# Testing

## Running tests for local network

```
$ npx hardhat test

```

## Running tests for testnet (rinkeby, ropsten etc) networks

### Ensure you have at least three metamask accounts with sufficient balance

### Note: Even with the delays added in the test cases, if the network is busy, it may sometimes throw transaction exceptions, you must re-run the tests

```
$ npx hardhat run runTestnetTests --network < network-name >        # network-name can be ropsten, rinkeby, etc.

```
