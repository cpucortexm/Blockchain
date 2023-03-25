import { useAddress } from "@thirdweb-dev/react"
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { BigNumber } from "ethers";
import { useEffect, useMemo, useState } from "react";
import nft from "../tokens/OceanicNFT";
const { ethers } = require("ethers");

const deployed_address= "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"

export const OceanicNFTCard = () =>{
    const [token, setToken] = useState('');
    //const [metadata, setMetadata] = useState('')
    const [metadata, setMetadata] = useState<Array<string>>([]); // Use an array to store metadata for all tokens
    const [tokenNumbers, setTokenNumbers] = useState<Array<number>>([])
    
    // useMemo() for memoization ie optimization to ensure that it does not get created
    // everytime we load this component.
    const sdk = useMemo(() => new ThirdwebSDK("localhost"), []); // wrap sdk object in useMemo
    const address = useAddress() // wallet address

    const fetchData = async () => {
        const contract = await sdk.getContract(
                                deployed_address,
                                nft.abi
                                );
        // set token info
        setToken(await contract.call("symbol"))

        // get all tokenids for the wallet address and metadata for each token id
        const allTokens = await contract.call("getTokenOwners", address)
        setTokenNumbers(allTokens.map((token:BigNumber) => token.toNumber()));

        const metadataArray: Array<string> = []; // create a new array to store metadata for all tokens
        for (let i = 0; i < allTokens.length; i++) {
            const data = await contract.call("tokenURI", allTokens[i]);
            metadataArray.push(data); // add metadata for current token id to the array
        }
        setMetadata(metadataArray); // update metadata for all tokens in state
    };

    // Trigger fetchData on wallet connect
    useEffect(() =>{
        fetchData()
    }, [sdk, address] ) // call fetchData when something in sdk changes e.g. wallet connected automatically or manually

    return(
        <div className="token-card">
             <div className="first-row">
                <span className="eth-account">ETH Account: <strong>{address? address : " not connected"}</strong></span>
            </div>
            <div className="second-row">
               <span>Symbol</span>
                <span>Token</span>
                <span>MetaData</span>
            </div>
  
                {address && tokenNumbers.map((token, index) =>(
                     <div className="third-row">
                        <img className="symbol-img" src={process.env.PUBLIC_URL + 'icons/OCNFT.png'} alt="" />
                        <span >{token}</span> 
                        <span style={{ marginLeft: '40px' }}>{metadata[index]}</span> 
                     </div>
                ))
                }
        </div>
    )
}