/*-----------------------------------------------------------
 @Filename:         deed_test.js
 @Copyright Author: Yogesh K
 @Date:             26/02/2022
-------------------------------------------------------------*/
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Simple Deed tests", function () {
  let lawyer;
  let beneficiary;
  let deed;
  let Deed;
  let deployer;

   // deploy and send 2 ethers to the constructor during deployment
  beforeEach(async() =>{
      Deed = await ethers.getContractFactory("simpleDeed");
      [ deployer,lawyer,beneficiary, ...addrs] = await ethers.getSigners();
      deed = await Deed.deploy(lawyer.address, beneficiary.address, 10, {value: ethers.utils.parseEther("2.0")});
      await deed.deployed()
  });

  describe("Withdraw after deployment", async() =>{
    it("withdraw", async function () {
      // intial beneficiary
      balance = await beneficiary.getBalance();
      initialBalance = ethers.utils.formatEther(balance)
      console.log(`${beneficiary.address} :${initialBalance} ETH`);

      // delay 10 secs because we set the fromNow time to 10 secs in constructor
      await new Promise(resolve => setTimeout(resolve, 10000));

      // call withdraw from lawyer
      await deed.connect(lawyer)['withdraw()']()

      // final beneficiary
      balance = await beneficiary.getBalance();
      finalBalance = ethers.utils.formatEther(balance)
      console.log(`${beneficiary.address} :${finalBalance} ETH`);

      expect(finalBalance-initialBalance).to.equal(2);
    });


    it("withdraw too early", async function () {
      await expect(
                    deed.connect(lawyer)['withdraw()']()
                  ).to.be.revertedWith("Too early to withdraw!")
    });

    it("Should not withdraw if caller is not lawyer", async function () {
     // delay 10 secs because we set the fromNow time to 10 secs in constructor
      await new Promise(resolve => setTimeout(resolve, 10000));

      await expect(
                    deed.connect(beneficiary)['withdraw()']()
                  ).to.be.revertedWith("Only Lawyer!")
    });

  }); // end of Withdraw after deployment

});
