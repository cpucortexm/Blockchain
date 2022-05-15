/*-----------------------------------------------------------
 @Filename:         ethUSD.js
 @Copyright Author: Yogesh K
 @Date:             13/05/2022
 @Description:     Test cases for eth USD stable coin
-------------------------------------------------------------*/
const { expect } = require("chai");
const { ethers } = require("hardhat");



describe("ETH USD tests", function () {
  let ethusd;
  let EthUsd;
  let deployer;
  let etherpriceoracle;

  /*  
  it("Should return the new greeting once it's changed", async function ()
  {
    const { ethers } = require("ethers") // for nodejs only
    let url = "https://eth-mainnet.alchemyapi.io/v2/2mTnjJ63S9fHQOuco_HxntHTBxbRsmGI";
    const provider = new ethers.providers.JsonRpcProvider(url)
    const aggregatorV3InterfaceABI = [{ "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "description", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint80", "name": "_roundId", "type": "uint80" }], "name": "getRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "latestRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "version", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }]
    const addr = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419";
    const priceFeed = new ethers.Contract(addr, aggregatorV3InterfaceABI, provider)
    let decimals = await priceFeed.decimals();
    let roundData = await priceFeed.latestRoundData();
    console.log(roundData)
    const [,price,,, ] = roundData;
    console.log("Latest Round Data", price.toString()/ Math.pow(10, decimals).toFixed(4) +`$`)
    console.log("Latest Round Data", price.toNumber())
  });
  */

  beforeEach(async function () {
      const priceOraclesByNework = {
        hardhat: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419", // this address is forked from mainnet
        ropsten: "x",
        rinkeby: "y",
        kovan: "z",
    };    
    [deployer] = await ethers.getSigners(); //get the account to deploy the contract
    
    // This is for production or mainnet contract.
  /*
    const Etherpriceoracle = await ethers.getContractFactory("PriceConsumerV3");
    const networkName = hre.network.name;

    const etherpriceoracle = await Etherpriceoracle.deploy(priceOraclesByNework[networkName]);
    await etherpriceoracle.deployed();
  */

    // Use this mock for testing locally
    const Etherpriceoracle = await ethers.getContractFactory("MockOraclePriceFeed");
    
    // set 1ETH = $2500
    etherpriceoracle = await Etherpriceoracle.deploy((2500)*10**8);
    EthUsd  = await ethers.getContractFactory("EthUSD");
    ethusd  = await EthUsd.deploy(etherpriceoracle.address);
    await ethusd.deployed();
    //console.log("EthUsd deployed to:", ethusd.address);
    provider      = ethers.provider;

  });

  it("Get USD price of Ether", async function ()
  {
    const price = await ethusd.getPrice();
    //let decimals = await ethusd.getDecimals();
    console.log("Latest Data", price.toString())
    //let dollars = (price.toString()/ Math.pow(10, decimals)).toFixed(2);
    console.log("Price in $:", price.toString()/100 +`$`)
    //let cents = Math.trunc( dollars*100);
    console.log("Price in cents:", price.toString());

  });

  it("should update the user's balance",  async ()  => 
  {
      await ethusd.issue({value: ethers.utils.parseEther("1.0")});
      const balance = await ethusd.balanceOf(deployer.address);
      const price = await ethusd.getPrice();
     /*
        let tx = await ethusd.issue({value: ethers.utils.parseEther("1.0")});
        const rc = await tx.wait()
        const event = rc.events.find(event => event.event === 'etherincents');
        const amount = event.args.amountInCents;  // ['amountInCents'];
        const priceinETh = event.args.priceinDollars;    //['priceinDollars'];
        console.log("amount from solidity:", amount, priceinETh);
      */
      expect(balance.toString()).to.equal(price.toString());
  });

  it("increments the total supply",  async ()  => {
      await ethusd.issue({value: ethers.utils.parseEther("1.0")});
      const totalSupply = await ethusd.totalSupply();
      const price = await ethusd.getPrice();
      expect(totalSupply.toNumber()).to.equal(price.toNumber());
    });


  it("won't let you withdraw more EthUSD than you have",  async ()  => {
      const price = await ethusd.getPrice();
      await ethusd.issue({value: ethers.utils.parseEther("1.0")});

      await expect(ethusd.withdraw(price + 1)).to.be.revertedWith("withdrawal > balance")
    });


  it("decrements the users balance",  async ()  => {
      const price = await ethusd.getPrice();
      await ethusd.issue({value: ethers.utils.parseEther("1.0")});
      await ethusd.withdraw(price);
      const balance = await ethusd.balanceOf(deployer.address);
      expect(balance.valueOf()). to.equal(0);
    });

  it("decrements the total supply",  async ()  => {
      const price = await ethusd.getPrice();
      await ethusd.issue({value: ethers.utils.parseEther("1.0")});
      await ethusd.withdraw(price);
      const totalSupply = await ethusd.totalSupply();
      expect(totalSupply.toNumber()).to.equal(0);
    });


    it("if the price hasn't changed you should get back what you put in",  async ()  => {
      
      const price = await ethusd.getPrice();
      await ethusd.issue({value: ethers.utils.parseEther("0.5")});
      // calculate the balance after issue
      let balancebefore = await provider.getBalance(deployer.address)
      let balanceEthbefore = ethers.utils.formatEther(balancebefore);

      // withdraw all the ether by giving back amount in cents
      const balance = await ethusd.balanceOf(deployer.address);
      await ethusd.withdraw(balance);

 
      let balanceafter = await provider.getBalance(deployer.address);
      let balanceEthafter = ethers.utils.formatEther(balanceafter);

      console.log("balanceEthbefore: ",balanceEthbefore);
      console.log("ethers: ",ethers.utils.parseEther("0.5").toString());
      console.log("balanceEthafter: ",balanceEthafter);
      let diff = balanceEthafter -  balanceEthbefore;
      // lets round off diff to 0.5 due to gas cut fees and to make calculations easier
      diff = (Math.round(diff / 0.5) * 0.5)
      expect(diff).to.equal(0.5);
    });


    it("if the price of Ether doubles you should get back half as much Ether (the same amount in USD)",  async ()  => {
      // by default ETH price was $2500 
      await ethusd.issue({value: ethers.utils.parseEther("1.0")});
      await etherpriceoracle.setLatestPrice((5000)*10**8);  // price doubles to $5000
      // calculate the balance after issue
      let balancebefore = await provider.getBalance(deployer.address)
      let balanceEthbefore = ethers.utils.formatEther(balancebefore);


      await ethusd.withdraw(2500*100);

      let balanceafter = await provider.getBalance(deployer.address);
      let balanceEthafter = ethers.utils.formatEther(balanceafter);

      let diff = balanceEthafter -  balanceEthbefore;
      // lets round off diff to 0.5 as you get back only half of 1 Eth
      diff = (Math.round(diff / 0.5) * 0.5)
      expect(diff).to.equal(0.5);

    });

    it("if the price of Ether gets cut in half and the contract can cover the your balance you should get back twice as much Ether (the same amount in USD)",  async ()  => {
       // first send 1 ETH to the contract
      tx = {
                to: ethusd.address,
                value: ethers.utils.parseEther('1', 'ether')
           };
      const transaction = await deployer.sendTransaction(tx);

      await ethusd.issue({value: ethers.utils.parseEther("1.0")});
      await etherpriceoracle.setLatestPrice((1250)*10**8);  // price halves to $1250

      // calculate the balance after issue
      let balancebefore = await provider.getBalance(deployer.address)
      let balanceEthbefore = ethers.utils.formatEther(balancebefore);

      await ethusd.withdraw(2500*100);

      let balanceafter = await provider.getBalance(deployer.address);
      let balanceEthafter = ethers.utils.formatEther(balanceafter);

      let diff = balanceEthafter -  balanceEthbefore;
      // lets round off diff to 2.0 as you get back twice (2ETH) of 1 Eth
      diff = (Math.round(diff / 2.0) * 2.0);
      expect(diff).to.equal(2);
    });


    it("if the price of Ether gets cut in half and the contract can't cover the your balance you should get back half as much Ether",  async ()  => {
      // default is $2500 for 1 ETH
      await ethusd.issue({value: ethers.utils.parseEther("1.0")});
      await etherpriceoracle.setLatestPrice((1250)*10**8);  // ETH price halves to $1250

      // calculate the balance after issue
      let balancebefore = await provider.getBalance(deployer.address)
      let balanceEthbefore = ethers.utils.formatEther(balancebefore);

      await ethusd.withdraw(2500*100);

      let balanceafter = await provider.getBalance(deployer.address);
      let balanceEthafter = ethers.utils.formatEther(balanceafter);

      let diff = balanceEthafter -  balanceEthbefore;
      // lets round off diff to 1.0 as you get back only what is available (1ETH)
      diff = (Math.round(diff / 1.0) * 1.0);
      expect(diff).to.equal(1);
    });
});

