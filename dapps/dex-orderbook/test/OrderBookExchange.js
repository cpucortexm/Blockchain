/*-----------------------------------------------------------
 @Filename:         OrderBookExchange.js
 @Copyright Author: Yogesh K
 @Date:             11/11/2022
-------------------------------------------------------------*/
const { ethers } = require("hardhat");
const { expect } = require('chai');


const tokens = (n) =>{
    return ethers.utils.parseUnits(n.toString(), 'ether');
}
describe('OrderBookExchange', () =>{

    let exchange, accounts, deployer, feeAccount
    const feePercent = 10

    beforeEach(async ()=>{
        const Exchange =  await ethers.getContractFactory('OrderBookExchange');
        const Token =  await ethers.getContractFactory('TokenERC20');

        accounts = await ethers.getSigners()
        deployer = accounts[0]
        feeAccount = accounts[1]
        user1 = accounts[2]

        // get deployed instance of contract
        exchange = await Exchange.deploy(feeAccount.address, feePercent)
        token1 = await Token.deploy('KN Token', 'KNT', 1000000) // 1 million tokens

        // transfer some tokens to user1
        let tx = await token1.connect(deployer).transfer(user1.address,tokens(100))
        await tx.wait() // wait for tx to mine
    })

    describe('Deployment', ()=>{
        it('tracks the fee account',async ()=>{
            expect(await exchange.feeAccount()).to.equal(feeAccount.address);
        })
        it('tracks the fee percent',async ()=>{
            expect(await exchange.feePercent()).to.equal(feePercent);
        })
    })

    describe('Depositing tokens', ()=>{
        let tx, result
        let amount = tokens(10)
        describe('Success', () =>{
            beforeEach(async() =>{
                // Approve token
                tx = await token1.connect(user1).approve(exchange.address,amount)
                result = await tx.wait() // wait for tx to mine
                // Deposit token
                tx = await exchange.connect(user1).depositToken(token1.address,amount)
                result = await tx.wait() // wait for tx to mine
            })
            it('tracks token deposit', async()=>{
                expect(await token1.balanceOf(exchange.address)).to.equal(amount)
                expect(await exchange.usertokens(token1.address, user1.address)).to.equal(amount)
                expect(await exchange.balanceOf(token1.address, user1.address)).to.equal(amount)
            })
            it('emits a Deposit event', async ()=>{
                const event = result.events[1] //2 events are emitted
                expect(event.event).to.equal('Deposit')

                const args = event.args
                expect(args.token).to.equal(token1.address)
                expect(args.user).to.equal(user1.address)
                expect(args.amount).to.equal(amount)
                expect(args.balance).to.equal(amount)
            })
        })
        describe('Failure', () =>{

            it('fails when no tokens are approved',async ()=>{
               await expect(exchange.connect(user1).depositToken(token1.address,amount)).to.be.reverted
            })
       })
    })


    describe('Withdrawing tokens', ()=>{
        let tx, result
        let amount = tokens(10)
        describe('Success', () =>{
            beforeEach(async() =>{
                //Deposit some tokens before withdrawal
                // Approve token
                tx = await token1.connect(user1).approve(exchange.address,amount)
                result = await tx.wait() // wait for tx to mine
                // Deposit token
                tx = await exchange.connect(user1).depositToken(token1.address,amount)
                result = await tx.wait() // wait for tx to mine
                // Finally withdraw tokens
                tx = await exchange.connect(user1).withdrawToken(token1.address,amount)
                result = await tx.wait() // wait for tx to mine
            })
            it('withdraw tokens', async()=>{
                expect(await token1.balanceOf(exchange.address)).to.equal(0)
                expect(await exchange.usertokens(token1.address, user1.address)).to.equal(0)
                expect(await exchange.balanceOf(token1.address, user1.address)).to.equal(0)
            })

            it('emits a Withdraw event', async ()=>{
                const event = result.events[1] //2 events are emitted
                expect(event.event).to.equal('Withdraw')

                const args = event.args
                expect(args.token).to.equal(token1.address)
                expect(args.user).to.equal(user1.address)
                expect(args.amount).to.equal(amount)
                expect(args.balance).to.equal(0)
            })
        })
        describe('Failure', () =>{
            it('fails for insufficient balances',async ()=>{
               await expect(exchange.connect(user1).withdrawToken(token1.address,amount)).to.be.reverted
            })
       })
    })

    describe('Token balances', ()=>{
        let tx, result
        let amount = tokens(21)
        beforeEach(async() =>{
            // Approve token
            tx = await token1.connect(user1).approve(exchange.address,amount)
            result = await tx.wait() // wait for tx to mine
            // Deposit token
            tx = await exchange.connect(user1).depositToken(token1.address,amount)
            result = await tx.wait() // wait for tx to mine
        })
        it('tracks token balances', async()=>{
            expect(await exchange.balanceOf(token1.address, user1.address)).to.equal(amount)
        })
    })
})