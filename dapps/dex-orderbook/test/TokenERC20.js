const { ethers } = require("hardhat");
const { expect } = require('chai');


const tokens = (n) =>{
    return ethers.utils.parseUnits(n.toString(), 'ether');
}
describe('TokenERC20', () =>{

    let token, accounts, deployer, receiver

    beforeEach(async ()=>{
        const Token =  await ethers.getContractFactory('TokenERC20');
        // get deployed instance of contract
        token = await Token.deploy('KN Token', 'KNT', 1000000)
        accounts = await ethers.getSigners()
        deployer = accounts[0]
        receiver = accounts[1]
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
        it('assigns total supply to deployer',async ()=>{
            expect(await token.balanceOf(deployer.address)).to.equal(totalSupply);
        })

    })

    // Describe Spending
    describe('Sending Token ', ()=>{
        let amount, tx, result
        describe('Success', ()=>{

            beforeEach(async ()=>{
                amount = tokens(100)
                tx = await token.connect(deployer).transfer(receiver.address,amount)
                result = await tx.wait() // wait till tx is part of blockchain
            })

            it('transfer token balances', async ()=>{
                expect(await token.balanceOf(deployer.address)).to.equal(tokens(999900))
                expect(await token.balanceOf(receiver.address)).to.equal(amount)
            })

            it('emits a Transfer event', async ()=>{
                const event = result.events[0]
                expect(event.event).to.equal('Transfer')

                const args = event.args
                expect(args.from).to.equal(deployer.address)
                expect(args.to).to.equal(receiver.address)
                expect(args.value).to.equal(amount)
            })
        })

        describe('Failure', ()=>{
            it('reject insufficient balances', async ()=>{
              const invalidAmount =  tokens(10000000) // 10 M
              await expect(token.connect(deployer).transfer(receiver.address,invalidAmount)).to.be.reverted
            })

            it('reject invalid recipient', async ()=>{
              const amount =  tokens(100) // 10 M
              await expect(token.connect(deployer).transfer('0x0000000000000000000000000000000000000000',amount)).to.be.reverted
            })
        })
    })

    // Describe Approving

    // 

})