import '../App.css';
import { useEffect } from 'react';
import { ethers } from 'ethers';
import config from '../config.json';
import TOKEN_ABI from '../abis/TokenERC20.json';
function App() {

  const loadBlockchaindata = async() =>{
    const accounts = await window.ethereum.request({method: 'eth_requestAccounts'})
    // Connect Ethers to blockchain
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const {chainId} = await provider.getNetwork()
    console.log(chainId)
    // Token Smart contract
    const token = new ethers.Contract(config[31337]["KN"].address, TOKEN_ABI , provider )
    console.log(token)
    const symbol = await token.symbol()
    console.log("symbol=",symbol)

  }
  useEffect(() => {
    loadBlockchaindata()
  },[]);
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
