import { useAddress } from "@thirdweb-dev/react";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { useEffect, useMemo, useState } from "react";
import ft from "src/tokens/FluxToken";
import { ethers } from 'ethers';
import {SendFluxToken} from './tokenops/SendFluxToken';
import { ApproveFluxToken } from "./tokenops/ApproveFluxToken";
import { MintFluxToken } from "./tokenops/MintFluxToken";

const deployed_address = ft.deployed_address;

export const FluxTokenCard = () =>{
    const [symbol, setSymbol] = useState('');
    const [balance, setBalance] = useState('')
    const address = useAddress(); // wallet address
    const [showSendContent, setShowSendContent] = useState(false);
    const [showApproveContent, setShowApproveContent] = useState(false);
    const [showMintContent, setShowMintContent] = useState(false);

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
    }, [address, showSendContent, showApproveContent, showMintContent]);

    const sendToken = () =>{
        setShowSendContent(true) // display the send flux token content
    }

    const approveToken = () =>{
        setShowApproveContent(true) // disply the approve flux token content
    }

    const mintToken = () =>{
        setShowMintContent(true)
    }
    return(
        <div>

            {
                showSendContent ? (
                    <SendFluxToken setShowSendContent={setShowSendContent}/>
            ) : showApproveContent ? (
                    <ApproveFluxToken setShowApproveContent={setShowApproveContent} />
            ) : showMintContent ? (
                    <MintFluxToken setShowMintContent={setShowMintContent} />
            ) :
            (
                    <div className="token-card">
                        <div className="first-row">
                            <span className="eth-account">ETH Account: <strong>{address? address : " not connected"}</strong></span>
                        </div>
                        <div className="second-row">
                            <span>Token</span>
                            <span>Symbol</span>
                            <span>Amount</span>
                            <button className="tokenMintBtn" onClick={mintToken}>Mint</button> 
                        </div>
                        {address && (parseInt(balance)>0) && (
                            <div className="third-row">
                                <img className="symbol-img" src={process.env.PUBLIC_URL + 'icons/FT.png'} alt="" />
                                <span>{symbol}</span> 
                                <span>{balance}</span>
                                <button className="tokenOps" onClick={sendToken}>Send</button>
                                <button className="tokenOps" onClick={approveToken}>Approve</button> 
                            </div>
                            )
                        }
                    </div>
                )
            }
        </div>
    )
}
