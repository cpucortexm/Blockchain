import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loadBalances, transferTokens } from '../store/interactions';
import logo from '../assets/logo.jpg';

const Balance = () => {

    const [token0TransferAmount, setToken0TransferAmount] = useState(0);
    const provider = useSelector(state=>state.provider.provider)
    const account = useSelector(state => state.provider.account)
    const symbols = useSelector(state => state.tokens.symbols)
    const exchange = useSelector(state => state.exchange.contracts)
    const exchangeBalances = useSelector(state => state.exchange.balances)
    const transferInProgress = useSelector(state => state.exchange.transferInProgress)
    const tokens = useSelector(state => state.tokens.contracts)
    const tokenBalances = useSelector(state => state.tokens.balances)
    const dispatch = useDispatch()

    const amountHandler = (e, token) =>{
        if(token.address === tokens[0].address){
            setToken0TransferAmount(e.target.value)
        }
    }
    // For deposit
    // 1. do deposit
    // 2. Notify app transfer is pending
    // 3. Get blockchain confirmation that deposit was successful
    // 4. Notify app deposit is successful
    // 5. handle Transfer failed
    const depositHandler = (e, token) =>{
        e.preventDefault()  // stops page refreshing which is the default behavior
        if(token.address === tokens[0].address){
            transferTokens(provider, exchange, 'Deposit', token, token0TransferAmount, dispatch)
            setToken0TransferAmount(0)
        }
    }
    useEffect(()=>{
        if (exchange && account && tokens[0] && tokens[1]){
            loadBalances(exchange, tokens, account, dispatch)
        }
    }, [exchange, tokens, account, transferInProgress])
    return (
        <div className='component exchange__transfers'>
        <div className='component__header flex-between'>
            <h2>Balance</h2>
            <div className='tabs'>
            <button className='tab tab--active'>Deposit</button>
            <button className='tab'>Withdraw</button>
            </div>
        </div>

        {/* Deposit/Withdraw Component 1 (KNT) */}

        <div className='exchange__transfers--form'>
            <div className='flex-between'>
                <p><small>Token</small><br/><img src={logo} className='logo2' alt="Token Logo"/>{symbols && symbols[0]}</p>
                <p><small>Wallet</small><br/>{tokenBalances && tokenBalances[0]}</p>
                <p><small>Exchange</small><br/>{exchangeBalances && exchangeBalances[0]}</p>
            </div>

            <form onSubmit={(e) =>depositHandler(e,tokens[0])}>
            <label htmlFor="token0">{symbols && symbols[0]} Amount</label>
            <input type="text" 
                   id='token0' 
                   placeholder='0.0000'
                   value={token0TransferAmount === 0 ? '':token0TransferAmount}
                   onChange={(e)=>amountHandler(e, tokens[0])} />

            <button className='button' type='submit'>
                <span>Deposit</span>
            </button>
            </form>
        </div>

        <hr />

        {/* Deposit/Withdraw Component 2 (fETH) */}

        <div className='exchange__transfers--form'>
            <div className='flex-between'>

            </div>

            <form>
            <label htmlFor="token1"></label>
            <input type="text" id='token1' placeholder='0.0000'/>

            <button className='button' type='submit'>
                <span></span>
            </button>
            </form>
        </div>

        <hr />
        </div>
    );
}

export default Balance;