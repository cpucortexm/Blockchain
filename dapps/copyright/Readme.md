## Smart Contract for copyright content protection

## Assumes you have truffle installed using npm

### Install HDWalletProvider as below in the same folder as the truffle project
```
$ npm install @truffle/hdwallet-provider
```

### To build and deploy the smart contract, first create a .secret file that stores mnemonics because the connector HDWallet needs mnemonics
```
$ npx truffle migrate --network ropsten
```
### To test the smart contract, first Open truffle console, we will use ropsten test network
```
$ npx truffle console --network ropsten
```
### Check if the contract is already deployed
```
truffle(ropsten)> cr = await Copyright.deployed()

#### You may get undefined on the console, but not a problem
```

### Interact with smart contract
```
truffle(ropsten)> await cr.addContent("0xe6c45159aaa3aad1ad2c5eca40ebf571eadb42dc9e3f38747d1ab272ce93dd54",
                                      "https://docs.google.com/spreadsheets/",
                                      "xyz@gmail.com",
                                      "some terms of use")

### where the params are as follows
1. Hash of the document
2. link to the document which needs to be copyright protected
3. email ID
4. terms of use
```

### More tests can be written in test folder using JS or python
