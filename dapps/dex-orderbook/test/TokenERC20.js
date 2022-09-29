const { ethers } = require("hardhat");
const { expect } = require('chai');


const tokens = (n) =>{
    return ethers.utils.parseUnits(n.toString(), 'ether');
}
describe('TokenERC20', () =>{

    let token

    beforeEach(async ()=>{
        const Token =  await ethers.getContractFactory('TokenERC20');
        // get deployed instance of contract
        token = await Token.deploy('KN Token', 'KNT', 1000000)
    })

    describe('Deployment', ()=>{
        const name = 'KN Token';
        const symbol = 'KNT';
        const decimals = 18;
        const totalSupply = tokens(1000000);
        it('has correct name',async ()=>{
            expect(await token.name()).to.equal(name);
        })
        it('has correct symbol',async ()=>{
            expect(await token.symbol()).to.equal(symbol);
        })
        it('has correct decimals',async ()=>{
            expect(await token.decimals()).to.equal(decimals);
        })
        it('has correct totalSupply',async ()=>{
            expect(await token.totalSupply()).to.equal(totalSupply);
        })
    })

    // Describe Spending

    // Describe Approving

    // 

})