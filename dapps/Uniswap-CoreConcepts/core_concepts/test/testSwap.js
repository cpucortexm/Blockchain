const BN = require("bn.js");
const IERC20 = artifacts.require("IERC20");
const verifySwap = artifacts.require("VerifySwap");
const { DAI, WETH, ANT, GTC, AAVE, TETHER,DAI_WHALE } = require("./config");


contract("verifySwap", (accounts) =>{
  const AMOUNT_IN = new BN(10).pow(new BN(18)).mul(new BN(1000)); // 1000 DAI
  const AMOUNT_OUT_MIN = 1;
  const TOKEN_IN = DAI;
  const TOKEN_OUT = AAVE;//TETHER; // ; //ANT;
  const TO = accounts[9];
  const WHALE = DAI_WHALE;

  let SwapInstance;
  let tokenIn;
  let tokenOut;

  beforeEach(async () => {
    tokenIn = await IERC20.at(TOKEN_IN); // create in token instance
    tokenOut = await IERC20.at(TOKEN_OUT); // create out token instance
    SwapInstance = await verifySwap.new(); // create Swap contract instance
    await tokenIn.approve(SwapInstance.address, AMOUNT_IN, { from: WHALE });
  });

 it("Deployed addresses", async () => {

    console.log("tokenIn:",tokenIn.address);
    console.log("tokenOut:",tokenOut.address);
    console.log("Swap instance:",SwapInstance.address);
    const {0: variable_1, 1: variable_2} = await SwapInstance.get_contract_address({from: accounts[0]});
    console.log("Router, WETH :",variable_1, variable_2);
    console.log("WHALE:",WHALE);
     
    await SwapInstance.simulateSwap(
      tokenIn.address,
      tokenOut.address,
      AMOUNT_IN,
      AMOUNT_OUT_MIN,
      TO,
      {
        from: WHALE,
      }
    );

    console.log(`in ${AMOUNT_IN}`);
    console.log(`out ${await tokenOut.balanceOf(TO)}`);

 });

});