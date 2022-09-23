
async function main() {
  const Token = await ethers.getContractFactory("TokenERC20");

  const token = await Token.deploy();
  await token.deployed();

  console.log(
    `ERC20 Token deployed at: ${token.address}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
