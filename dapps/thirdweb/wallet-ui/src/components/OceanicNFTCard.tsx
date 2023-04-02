import { useAddress } from "@thirdweb-dev/react"
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { BigNumber } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import nft from "src/tokens/OceanicNFT";
import { ApproveOceanicNFT } from "./tokenops/ApproveOceanicNFT";
import { MintOceanicNFT } from "./tokenops/MintOceanicNFT";
import { SendOceanicNFT } from "./tokenops/SendOceanicNFT";
const deployed_address= nft.deployed_address


export const OceanicNFTCard = () =>{
    const [symbol, setSymbol] = useState('');
    const [metadata, setMetadata] = useState<Array<string>>([]); // Use an array to store metadata for all tokens
    const [tokenNumbers, setTokenNumbers] = useState<Array<number>>([])
    const address = useAddress() // wallet address
    const navigate = useNavigate();
    const [showSendContent, setShowSendContent] = useState(false);
    const [showApproveContent, setShowApproveContent] = useState(false);
    const [showMintContent, setShowMintContent] = useState(false);

    const [tokenId, setTokenId] = useState(0);

    // useMemo() for memoization ie optimization to ensure that it does not get created
    // everytime we load this component.
    const sdk = useMemo(() => new ThirdwebSDK("localhost"), []); // wrap sdk object in useMemo

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
    }, [address, showSendContent, showApproveContent, showMintContent]) // call fetchData when something in sdk changes e.g. wallet connected automatically or manually

    const sendToken = (id: number) =>{
        setTokenId(id);
        setShowSendContent(true)
    }

    const approveToken = (id: number) =>{
        setTokenId(id)
        setShowApproveContent(true)
    }

    const mintToken = () =>{
        setShowMintContent(true)
    }
    const handleNFTClick = (index: number ) => {

        navigate(`/nft/${index}`, { state: { metadata } });
    };

    return(
        <div>
            {
                showSendContent ? (
                    <SendOceanicNFT setShowSendContent={setShowSendContent} tokenId={tokenId} />
            ) : showApproveContent ? (
                    <ApproveOceanicNFT setShowApproveContent={setShowApproveContent} tokenId={tokenId} />
            ) : showMintContent ? (
                    <MintOceanicNFT setShowMintContent={setShowMintContent}/>
            ) :
            (
                    <div className="token-card">
                        <div className="first-row">
                            <span className="eth-account">ETH Account: <strong>{address? address : " not connected"}</strong></span>
                        </div>
                        <div className="second-row">
                        <span>Token</span>
                            <span>Symbol</span>
                            <span>MetaData</span>
                            <button className="tokenMintBtn" onClick={mintToken}>Mint</button>
                        </div>

                        {address && tokenNumbers.map((tokenId, index) =>(
                            <div className="third-row">
                            <img className="symbol-img" src={process.env.PUBLIC_URL + 'icons/OCNFT.png'} alt="" />
                            <span >{symbol}</span> 
                            <span >
                                <a 
                                    href="#" 
                                    onClick={(e) => { 
                                        e.preventDefault(); 
                                        handleNFTClick(index); 
                                    }} 
                                    style={{ textDecoration: 'underline', color: 'blue', cursor: 'pointer' }}
                                >
                                NFT{tokenId}
                                </a>
                            </span>
                            <button className="tokenOps" onClick={() => sendToken(tokenId)}>Send</button> 
                            <button className="tokenOps" onClick={() => approveToken(tokenId)}>Approve</button> 
                            </div>
                        ))
                        }
                    </div>
                )
            }
        </div>
    )
}