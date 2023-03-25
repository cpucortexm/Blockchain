
import { useAddress } from "@thirdweb-dev/react";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { useEffect, useState } from "react";
import ft from "../tokens/FluxToken";
const { ethers } = require("ethers");
const deployed_address = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

export const FluxTokenCard = () =>{
    const [token, setToken] = useState('');
    const [balance, setBalance] = useState(0)
    const address = useAddress(); // wallet address
    const sdk = new ThirdwebSDK("localhost");

    const fetchData = async () => {
        const contract = await sdk.getContract(
                                deployed_address,
                                ft.abi
                                );
        //set token info
        setToken(await contract.call("symbol"))
        // set erc20 token balance for the wallet address
        const amount = await contract.call("balanceOf",address )
        setBalance(ethers.utils.formatEther(amount))
        //const name = await contract.call("name")
        //console.log("name:", name, amount)

    };
    
    useEffect(() => {
        fetchData();
    }, [fetchData]);
   return(
        <div className="token-card">
            <div className="first-row">
                <span className="eth-account">ETH Account: <strong>{address? address : " not connected"}</strong></span>
            </div>
            <div className="second-row">
               <span>Symbol</span>
                <span>Token</span>
                <span>Amount</span>
            </div>
            {address && (
                     <div className="third-row">
                        <img className="symbol-img" src={process.env.PUBLIC_URL + 'icons/FT.png'} alt="" />
                        <span >{token}</span> 
                        <span >{balance}</span> 
                     </div>
                    )
           }
        </div>
    )
}
