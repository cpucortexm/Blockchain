// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const configParams = require("../cfg.json")



task("Verify", "Verifies Contract on Etherscan")
  .addParam("address", "deployed address")
  .setAction(async (taskArgs) => {

    console.log("Verifying contract...")

    const name   = configParams.name;
    const symbol = configParams.symbol;
    const baseuri= configParams.baseuri;

    contractAddress = taskArgs.address;

    // We get the contract to verify
    await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [
            name,
            symbol,
            baseuri,
        ],
    });
});