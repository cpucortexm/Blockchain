import { useAddress } from "@thirdweb-dev/react";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { useEffect, useMemo, useState } from "react";
import ft from "../tokens/FluxToken";
const { ethers } = require("ethers");
const deployed_address = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

export const FluxTokenCard = () =>{
    const [symbol, setSymbol] = useState('');
    const [balance, setBalance] = useState(0)
    const address = useAddress(); // wallet address

    // useMemo() for memoization ie optimization to ensure that it does not get created
    // everytime we load this component.
    const sdk = useMemo(() => new ThirdwebSDK("localhost"), []); // wrap sdk object in useMemo

    const fetchData = async () => {
        const contract = await sdk.getContract(
                                deployed_address,
                                ft.abi
                                );
        //set token info
        setSymbol(await contract.call("symbol"))
        // set erc20 token balance for the wallet address
        const amount = await contract.call("balanceOf",address )
        setBalance(ethers.utils.formatEther(amount))

    };

    useEffect(() => {
        fetchData();
    }, [address]);

    const TransferToken = () =>{
        console.log("transfer token")
    }

    const approveToken = () =>{
        console.log("approve token")
    }

    const mintToken = () =>{
        console.log("mint token")
    }
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
            {address && (balance>0) && (
                <div className="third-row">
                    <img className="symbol-img" src={process.env.PUBLIC_URL + 'icons/FT.png'} alt="" />
                    <span style={{ marginLeft: '60px' }}>{symbol}</span> 
                    <span style={{ marginLeft: '60px' }}>{balance}</span>
                    <button className="tokenOps" onClick={TransferToken}>Send</button> 
                    <button className="tokenOps" onClick={approveToken}>Approve</button> 
                    <button className="tokenOps" onClick={mintToken}>Mint</button> 
                </div>
                )
            }
        </div>
    )
}
