# Basic Setup. First you must compile the contract

## 1. Assumes you have installed npm, npx and hardhat depending on the operating system you use.

## 2. Download this repo and unzip or git clone < github link >

## 3. open command line or console

```
 $ cd nfthing
 $ npm install
 $ npx hardhat compile
```

# Deploy

## We first deploy the payment splitter and then the main contract (NFThing).

## Update hardhat.config.js file with necessary configuration(basics are already configured)

## Edit the cfg.json and fill the necessary details

-     a. Alchemy endpoints of ropsten, rinkeby and mainnet
-     b. Metamask private keys of the accounts (ensure to have atleast three metamask accounts with sufficient funds)
-     c. Etherscan API keys of ropsten, mainnet and rinkeby. It will be the same for all.
-     d. Edit the name, symbol and ipfs address.
-     e. At least have one payment split address and share percent
        You can always have more split addresses and their share
        percentages separated by a comma.

```
    e.g. "payAddr":["0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"],
         "sharePercent": ["100"]
```

```
    e.g. "payAddr":["0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
                    "0x70997970c51812dc3a010c7d01b50e0d17dc79c8"],
         "sharePercent": ["30",
                          "70"]
```

## on local blockchain using mainnet fork (simulates mainnet locally)

```
$ npx hardhat run scripts/deploy.js --network hardhat

```

## on testnet (rinkeby).Ensure to have sufficient funds in accounts. If the network is busy, you may have to try a few times

```
Deploy
$ npx hardhat run scripts/deploy.js --network rinkeby     # Note down the deployed address

Verify
< DEPLOYED ADDR > is the above deployed address
< contract name > is either NFThing or PaymentSplitterCloneFactory
$ npx hardhat Verify --address < DEPLOYED ADDR > --name < contract name > --network rinkeby
```

## on testnet (ropsten). Ensure to have sufficient funds in accounts. If the network is busy, you may have to try a few times

```
Deploy
$ npx hardhat run scripts/deploy.js --network ropsten     # Note down the deployed address

Verify
< DEPLOYED ADDR > is the above deployed address
< contract name > based on contract to verify, can be NFThing or PaymentSplitterCloneFactory
$ npx hardhat Verify --address < DEPLOYED ADDR > --name < contract name > --network ropsten

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
