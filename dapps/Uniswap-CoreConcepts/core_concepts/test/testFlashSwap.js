const BN = require("bn.js");
const IERC20 = artifacts.require("IERC20");
const verifyFlashSwap = artifacts.require("VerifyFlashSwap");
const {USDC, USDC_WHALE } = require("./config");


function sendEther(web3, from, to, amount) {
  return web3.eth.sendTransaction({
    from,
    to,
    value: web3.utils.toWei(amount.toString(), "ether"),
  });
}
contract("verifyFlashSwap", (accounts) => {
  const WHALE = USDC_WHALE
  const TOKEN_BORROW = USDC
  const DECIMALS = 6  // USDC uses 6 decimal places and not 18 like other ERC20
  // We fund more because we need to pay back along with the fees during Flash swap.
  // So let us fund extra (2 million round figure to the calculations simple)
  const FUND_AMOUNT = new BN(10).pow(new BN(DECIMALS)).mul(new BN(2000000)); // 2 million USDC
  const BORROW_AMOUNT = new BN(10).pow(new BN(DECIMALS)).mul(new BN(1000000)); // 1 million USDC

  let flashSwapInstance
  let token
  beforeEach(async () => {
    token = await IERC20.at(TOKEN_BORROW)
    flashSwapInstance = await verifyFlashSwap.new()

    // send ether to USDC WHALE contract to cover tx fees
    await sendEther(web3, accounts[0], WHALE, 1)

    // send enough token to cover fee
    const bal = await token.balanceOf(WHALE)
    console.log("balance of USDC in Whale:", bal)
    assert(bal.gte(FUND_AMOUNT), "balance < FUND")
    // Send USDC tokens to verifyFlashSwap contract
    await token.transfer(flashSwapInstance.address, FUND_AMOUNT, {
      from: WHALE,
    })
  })

  it("flash swap", async () => {
    const tx = await flashSwapInstance.simulateFlashSwap(token.address, BORROW_AMOUNT, {
      from: WHALE,
    })

    for (const log of tx.logs) {
      console.log(log.args.message, log.args.val.toString())
    }
  })

});
