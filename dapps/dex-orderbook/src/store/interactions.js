import {ethers} from 'ethers'
import TOKEN_ABI from '../abis/TokenERC20.json';
import EXCHANGE_ABI from '../abis/OrderBookExchange.json';

export const loadProvider = (dispatch)=>{
    const connection = new ethers.providers.Web3Provider(window.ethereum)
    dispatch({type: 'PROVIDER_LOADED', connection})
    return connection
}

export const loadNetwork = async (provider, dispatch)=>{
    const {chainId} = await provider.getNetwork()
    dispatch({type: 'NETWORK_LOADED', chainId})
    return chainId
}

export const loadAccount = async (provider, dispatch)=>{
    const accounts = await window.ethereum.request({method: 'eth_requestAccounts'})
    const account = ethers.utils.getAddress(accounts[0])
    dispatch({type: 'ACCOUNT_LOADED', account})

    let balance = await provider.getBalance(account)
    balance = ethers.utils.formatEther(balance)
    dispatch({type: 'ETHER_BALANCE_LOADED', balance})
    return account
}

export const loadTokens = async (provider, addresses, dispatch)=>{
    let token, symbol
    token = new ethers.Contract(addresses[0], TOKEN_ABI , provider )
    symbol = await token.symbol()
    dispatch({type: 'TOKEN_1_LOADED', token, symbol})

    token = new ethers.Contract(addresses[1], TOKEN_ABI , provider )
    symbol = await token.symbol()
    dispatch({type: 'TOKEN_2_LOADED', token, symbol})

    return token
}

export const loadExchange = async (provider, address, dispatch)=>{
    const exchange  = new ethers.Contract(address, EXCHANGE_ABI , provider)
    dispatch({type: 'EXCHANGE_LOADED', exchange})

    return exchange
}


export const subscribeToEvents = async (exchange, dispatch) =>{
    await exchange.on('Deposit', (token, user, amount, balance, event)=>{
        // Notify app that transfer was successful
        dispatch({type: 'TRANSFER_COMPLETE', event})
    })
    await exchange.on('Withdraw', (token, user, amount, balance, event)=>{
        // Notify app that transfer was successful
        dispatch({type: 'TRANSFER_COMPLETE', event})
    })

    await exchange.on('Order', (id, user, tokenGet, amountGet, tokenGive, amountGive, timestamp, event) => {
    const order = event.args
    dispatch({ type: 'NEW_ORDER_SUCCESS', order, event })
  })
}

//-----------------------------------------------------------------
// LOAD USER BALANCES (WALLET token and Exchange balances)
export const loadBalances = async (exchange, tokens, account, dispatch)=>{
    let balance = await tokens[0].balanceOf(account)
    balance = ethers.utils.formatUnits(balance,18)
    dispatch({type: 'TOKEN_1_BALANCE_LOADED', balance})

    balance = await exchange.balanceOf(tokens[0].address, account)
    balance = ethers.utils.formatUnits(balance,18)
    dispatch({type: 'EXCHANGE_TOKEN_1_BALANCE_LOADED', balance})


    balance = await tokens[1].balanceOf(account)
    balance = ethers.utils.formatUnits(balance,18)
    dispatch({type: 'TOKEN_2_BALANCE_LOADED', balance})

    balance = await exchange.balanceOf(tokens[1].address, account)
    balance = ethers.utils.formatUnits(balance,18)
    dispatch({type: 'EXCHANGE_TOKEN_2_BALANCE_LOADED', balance})
}

//-----------------------------------------------------------------
// TOKEN TRANSFERS (WITHDRAW and DEPOSITS)

export const transferTokens = async(provider, exchange, transferType, token, amount, dispatch) =>{
    let tx
    dispatch({type:'TRANSFER_PENDING'})
    try {
        const signer = await provider.getSigner()
        const amountToTransfer = ethers.utils.parseUnits(amount.toString(),'ether');
        if(transferType === 'Deposit'){
            tx = await token.connect(signer).approve(exchange.address,amountToTransfer)
            await tx.wait()
            tx = await exchange.connect(signer).depositToken(token.address,amountToTransfer)
        }
        else{
            tx = await exchange.connect(signer).withdrawToken(token.address,amountToTransfer)
        }
        await tx.wait()
    } catch (error) {
        dispatch({type:'TRANSFER_FAIL'})
    }

}
//-----------------------------------------------------------------
// ORDERS (BUY and SELL)

export const makeBuyOrder = async(provider, exchange, tokens, order, dispatch) =>{
    const tokenGet = tokens[0].address
    const amountGet = ethers.utils.parseUnits(order.amount,'ether');
    const tokenGive = tokens[1].address
    const amountGive = ethers.utils.parseUnits((order.amount * order.price).toString(), 'ether')

    dispatch({ type: 'NEW_ORDER_REQUEST'})
    try {
        const signer = await provider.getSigner()
        const tx = await exchange.connect(signer).makeOrder(tokenGet, amountGet, tokenGive, amountGive)
        await tx.wait()
    } catch (error) {
        dispatch({ type: 'NEW_ORDER_FAIL' })
  }
}

export const makeSellOrder = async (provider, exchange, tokens, order, dispatch) => {
  const tokenGet = tokens[1].address
  const amountGet = ethers.utils.parseUnits((order.amount * order.price).toString(), 'ether')
  const tokenGive = tokens[0].address
  const amountGive = ethers.utils.parseUnits(order.amount, 'ether')

  dispatch({ type: 'NEW_ORDER_REQUEST' })

  try {
    const signer = await provider.getSigner()
    const tx = await exchange.connect(signer).makeOrder(tokenGet, amountGet, tokenGive, amountGive)
    await tx.wait()
  } catch (error) {
    dispatch({ type: 'NEW_ORDER_FAIL' })
  }
}