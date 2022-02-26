require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("./tasks/test_testnet");

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
