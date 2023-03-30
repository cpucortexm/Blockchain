import { useAddress } from "@thirdweb-dev/react"
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { BigNumber } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import nft from "../tokens/OceanicNFT";
const deployed_address= nft.deployed_address

export const OceanicNFTCard = () =>{
    const [symbol, setSymbol] = useState('');
    const [metadata, setMetadata] = useState<Array<string>>([]); // Use an array to store metadata for all tokens
    const [tokenNumbers, setTokenNumbers] = useState<Array<number>>([])
     const navigate = useNavigate();
    
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
        setSymbol(await contract.call("symbol"))

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
    }, [address]) // call fetchData when something in sdk changes e.g. wallet connected automatically or manually

    const TransferToken = () =>{
        console.log("transfer token")
    }

    const approveToken = () =>{
        console.log("approve token")
    }

    const mintToken = () =>{
        console.log("mint token")
    }
    const handleNFTClick = (index: number) => {
        navigate(`/nft/${index}`, { state: { metadata } });
    };

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
                <span style={{ marginLeft: '60px' }}>{symbol}</span> 
                {/* <span style={{ marginLeft: '60px' }}>{metadata[index]}</span> */}
                {/*
                <span style={{ marginLeft: '50px' }}
                      onClick={() => handleNFTClick(index)}>
                    NFT
                </span>
                */}
                <span style={{ marginLeft: '40px' }}>
                    <a 
                        href="#" 
                        onClick={(e) => { 
                            e.preventDefault(); 
                            handleNFTClick(index); 
                        }} 
                        style={{ textDecoration: 'underline', color: 'blue', cursor: 'pointer' }}
                    >
                    NFT{index}
                    </a>
                </span>
                 <button className="tokenOps" onClick={TransferToken}>Send</button> 
                <button className="tokenOps" onClick={approveToken}>Approve</button> 
                <button className="tokenOps" onClick={mintToken}>Mint</button> 
                </div>
            ))
            }
        </div>
    )
}