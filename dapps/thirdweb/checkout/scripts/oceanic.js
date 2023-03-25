// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const accounts = await hre.ethers.getSigners()
  const deployer = accounts[0].address
  const ONFT = await hre.ethers.getContractFactory("OceanicNFT");
  const onft = await ONFT.deploy("oceanic", "ONFT", deployer, 500);

  await onft.deployed();
  console.log(
    `onft deployed to ${onft.address}`
  );

   // mint two nfts to accounts[1].address
  let tx = await onft.createNFT(accounts[0].address, "first NFT")
  let receipt = await tx.wait();  
  let nftId = receipt.events[1].args[0].toNumber();
  console.log("nft id1:", nftId)

  tx = await onft.createNFT(accounts[0].address, "second NFT")
  receipt = await tx.wait();
  nftId = receipt.events[1].args[0].toNumber();
  console.log("nft id2:", nftId)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
