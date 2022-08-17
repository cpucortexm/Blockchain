const BN = require("bn.js");
const IERC20 = artifacts.require("IERC20");
const verifyLiquidity = artifacts.require("VerifyLiquidity");
const { DAI, WETH, DAI_WHALE, WETH_WHALE } = require("./config");


function sendEther(web3, from, to, amount) {
  return web3.eth.sendTransaction({
    from,
    to,
    value: web3.utils.toWei(amount.toString(), "ether"),
  });
}
contract("verifyLiquidity", (accounts) => {
  const TOKEN_A = DAI;
  const TOKEN_A_WHALE = DAI_WHALE;
  const TOKEN_B = WETH;
  const TOKEN_B_WHALE = WETH_WHALE;
  const TOKEN_A_AMOUNT = new BN(10).pow(new BN(18)).mul(new BN(1)); // 1 DAI
  const TOKEN_B_AMOUNT = new BN(10).pow(new BN(18)).mul(new BN(1)); // 1 WETH;

  let liquidityInstance;
  let tokenA;
  let tokenB;
  beforeEach(async () => {
    tokenA = await IERC20.at(TOKEN_A); // tokenA instance
    tokenB = await IERC20.at(TOKEN_B); // tokenB instance
    liquidityInstance = await verifyLiquidity.new(); // VerifyLiquidity contract instance

      // send ETH to WHALE contracts to cover tx fee
    await sendEther(web3, accounts[0], TOKEN_A_WHALE, 1);
    await sendEther(web3, accounts[0], TOKEN_B_WHALE, 1);

    // transfer or send tokens to accounts[0] from WHALE contracts
    console.log("whales:", TOKEN_A_WHALE, TOKEN_B_WHALE );
    await tokenA.transfer(accounts[0], TOKEN_A_AMOUNT, { from: TOKEN_A_WHALE });
    await tokenB.transfer(accounts[0], TOKEN_B_AMOUNT, { from: TOKEN_B_WHALE });
    // approve the liquidity contract to use the tokens from accounts[0]
    await tokenA.approve(liquidityInstance.address, TOKEN_A_AMOUNT, { from: accounts[0] });
    await tokenB.approve(liquidityInstance.address, TOKEN_B_AMOUNT, { from: accounts[0] });
  });

   it("add liquidity and remove liquidity", async () => {
    let tx = await liquidityInstance.simulateAddLiquidity(
      tokenA.address,
      tokenB.address,
      TOKEN_A_AMOUNT,
      TOKEN_B_AMOUNT,
      {
        from: accounts[0],
      }
    );
    // Verify the emitted events
    console.log("=== Add Liquidity ===");
    for (const log of tx.logs) {
      console.log(`${log.args.message} ${log.args.val}`);
    }

    tx = await liquidityInstance.simulateRemoveLiquidity(tokenA.address, tokenB.address, {
      from: accounts[0],
    });
    // Verify the emitted events
    console.log("=== Remove Liquidity ===");
    for (const log of tx.logs) {
      console.log(`${log.args.message} ${log.args.val}`);
    }
  });
});