require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

// Alchemy network endpoints
const ROPSTEN_NODE_ENDPOINT = require("./cfg.json").ropstenNodeEndpoint;
const RINKEBY_NODE_ENDPOINT = require("./cfg.json").rinkebyNodeEndPoint;
const MAINNET_FORK_ENDPOINT = require("./cfg.json").forkmainnetNodeEndpoint;
// Metamask account Private keys
const PRIVATE_KEY1   = require("./cfg.json").PrivateKey1;
const PRIVATE_KEY2   = require("./cfg.json").PrivateKey2;
const PRIVATE_KEY3   = require("./cfg.json").PrivateKey3;
// Etherscan API keys
const RINKEBY_ETHERSCAN_API_KEY = require("./cfg.json").rinkebyEtherscanApi;
const MAINNET_ETHERSCAN_API_KEY = require("./cfg.json").mainnetEtherscanApi;
const ROPSTEN_ETHERSCAN_API_KEY = require("./cfg.json").ropstenEtherscanApi;

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});


task("deploy", "Deploy NFThing", async(taskArgs, hre) => {

  console.log("Starting Deployment");

  const Nfthing = await hre.ethers.getContractFactory("NFThing");

  // Follow the below example with name,symbol and ipfs link
  // const nft = await Nfthing.deploy("NFThing", "NT", "ipfs://QmXfkPA62p1d6dcibtUMP43JkrT8ttptKFMVK4wAPP928E/");

  const nft = await Nfthing.deploy("", "", "");
  await nft.deployed();
  console.log("deployed at:", nft.address);

});


// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.9",

  mocha: {
    timeout: 30000
  },

  settings: {
      optimizer: {
        enabled: true,
      }
  },
  networks: {

   localhost:{
      //chainId:1337,
    },

    hardhat: {
      forking: {
        url: MAINNET_FORK_ENDPOINT,
        blockNumber: 14157455,
        accounts: [PRIVATE_KEY1,PRIVATE_KEY2, PRIVATE_KEY3],
      },
      chainId:1,
    },

    rinkeby: {
        url: RINKEBY_NODE_ENDPOINT,
        accounts: [PRIVATE_KEY1,PRIVATE_KEY2, PRIVATE_KEY3],
    },

    ropsten: {
      url: ROPSTEN_NODE_ENDPOINT,
      accounts: [PRIVATE_KEY1,PRIVATE_KEY2, PRIVATE_KEY3],
    },
  }, // end of networks

   etherscan: {
    apiKey: {
        mainnet: MAINNET_ETHERSCAN_API_KEY,
        rinkeby: RINKEBY_ETHERSCAN_API_KEY,
        ropsten: ROPSTEN_ETHERSCAN_API_KEY,
    }
   }
};
