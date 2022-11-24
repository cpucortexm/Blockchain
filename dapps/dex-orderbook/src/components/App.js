import { useEffect } from 'react';
import {useDispatch} from 'react-redux';
import config from '../config.json';
import {
  loadProvider,
  loadNetwork,
  loadAccount, 
  loadTokens,
  loadExchange} from '../store/interactions';

function App() {
    const dispatch = useDispatch()

    const loadBlockchaindata = async() =>{
      // Connect Ethers to blockchain
      const provider = loadProvider(dispatch)
      // Fetch current network chain id (e.g hardhat:31337, Goerli:5)
      const chainId = await loadNetwork(provider, dispatch)

      // Fetch current account and balance from Metamask
      await loadAccount(provider, dispatch)
      // Load token smart contracts
      const contractAddrs = [
        config[chainId]["KN"].address,
        config[chainId]["fETH"].address,
        config[chainId]["fDAI"].address
      ]
      await loadTokens(provider, contractAddrs, dispatch)
      // Load exchange contract
      const exchangeAddr = config[chainId]["exchange"].address
      await loadExchange(provider, exchangeAddr, dispatch)

  }
  useEffect(() => {
    loadBlockchaindata()
  });
  return (
    <div>

      {/* Navbar */}

      <main className='exchange grid'>
        <section className='exchange__section--left grid'>

          {/* Markets */}

          {/* Balance */}

          {/* Order */}

        </section>
        <section className='exchange__section--right grid'>

          {/* PriceChart */}

          {/* Transactions */}

          {/* Trades */}

          {/* OrderBook */}

        </section>
      </main>

      {/* Alert */}

    </div>
  );
}

export default App;
