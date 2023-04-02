import { useAddress, Web3Button } from "@thirdweb-dev/react";
import { useState } from "react";
import nft from "src/tokens/OceanicNFT";
const deployed_address= nft.deployed_address

interface ApproveOceanicNFTProps{
    setShowApproveContent : (show : boolean) => void
    tokenId : number
}

export const ApproveOceanicNFT :React.FC<ApproveOceanicNFTProps> = ({setShowApproveContent,tokenId}) => {
    const [receiverAddress, setReceiverAddress] = useState('')

    const backToWallet = () =>{
        setShowApproveContent(false); // go back to the home page if back or after transfer success
    }

    const address = useAddress(); // wallet address
    return(
        <div className="token-card">

            <div className="first-row">
                <span className="eth-account">ETH Account:<strong>{address? address : " not connected"}</strong></span>
            </div>

            <div className="token-second-row">
               <span>Approve NFT</span>
               <span style={{opacity: 0.4}}>Only Approve NFT to an Ethereum address </span>
            </div>

            <div className="token-third-row">
                <input 
                    type="text" 
                    placeholder="Receiver Address" 
                    value={receiverAddress}
                    onChange={(e) => setReceiverAddress(e.target.value)}
                />

                <input type="number" defaultValue={20} min={1} step="any" />
                <input type="number" defaultValue={200000} min={1} step="any" />
            </div>

            <div  className="button-container">
                    <button className="buttonBack" onClick={backToWallet}>Back</button>
                     <Web3Button 
                        contractAddress={deployed_address}
                        contractAbi={nft.abi}
                        action={(contract) => contract.call("approve", receiverAddress,tokenId)}
                        onSuccess={() => backToWallet()}
                        className="web3Button"
                    >
                        Approve
                    </Web3Button>
            </div>

        </div>
 
 
    )
}
