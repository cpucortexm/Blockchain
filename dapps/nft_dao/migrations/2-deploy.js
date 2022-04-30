const finxterNft = artifacts.require("FinxterNFT");
const fakeMarket = artifacts.require("PseudoNFTMarketplace");
const finxterDao = artifacts.require("FinxterDAO");

module.exports = async function (deployer) {
  // Set the current blockchain account
  const accounts = await web3.eth.getAccounts();
  // deploy FinxterNFT
  await deployer.deploy(finxterNft, {from: accounts[0]});
  //access information about your deployed contract instance
  const finxterNFTInstance = await finxterNft.deployed();



  // deploy pseudo NFT market place
  await deployer.deploy(fakeMarket, {from: accounts[0]});
  //access information about your deployed contract instance
  const fakeMarketInstance = await fakeMarket.deployed();

  // deploy DAO
  // This assumes your account has at least 1 ETH in it's account
  // Change this value as you want
  await deployer.deploy(finxterDao,
                        fakeMarketInstance.address,
                        finxterNFTInstance.address,                        
                        {from: accounts[0], value: "1000000000000000000"});

  await finxterDao.deployed();
};