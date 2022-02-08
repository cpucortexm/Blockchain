# Basic Setup. First you must compile the contract

## 1. Assumes you have installed npm, npx and hardhat depending on the operating system you use.
## 2. Download this repo and unzip or git clone < github link >
## 3. open command line or console
```
 $ cd nfthing
 $ npm install 
 $ npx hardhat compile
```


# To deploy 
## Update scripts/deploy.js and hardhat.config.js files. Edit name, symbol and ipfs address. Follow the example, see comment for Nfthing.deploy
## Edit the cfg.json and fill the necessary details
*     a. Alchemy endpoints of ropsten, rinkeby and mainnet
*     b. Metamask private keys of the accounts (ensure to have atleast three metamask accounts)
*     c. Etherscan API keys of ropsten, mainnet and rinkeby. It will be the same for all.

## Edit scripts/arguments.js and fill with the same name, symbol and ipfs address used to deploy. This is needed for verification.

## on local blockchain using mainnet fork (simulates mainnet locally)
```
$ npx hardhat run scripts/deploy.js --network hardhat

```

## on testnet (rinkeby).If the network is busy, you may have to try a few times
```
$ npx hardhat deploy --network rinkeby     # Note down the deployed address
$ npx hardhat verify --constructor-args scripts/arguments.js < DEPLOYED ADDR > --network rinkeby  # if the network is busy, you may have to try multiple times

```

## on testnet (ropsten). If the network is busy, you may have to try a few times
```
$ npx hardhat deploy --network ropsten     # Note down the deployed address
$ npx hardhat verify --constructor-args scripts/arguments.js < DEPLOYED ADDR > --network ropsten

```
