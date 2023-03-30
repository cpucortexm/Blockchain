import { useAddress, Web3Button } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { useState } from "react";
import ft from "src/tokens/FluxToken";

const deployed_address = ft.deployed_address;

interface ApproveFluxTokenProps {
    setShowApproveContent: (show: boolean) => void;
}

export const ApproveFluxToken :React.FC<ApproveFluxTokenProps> = ({setShowApproveContent}) => {
    const [receiverAddress, setReceiverAddress] = useState('');
    const [amountToApprove, setAmountToApprove] = useState('');

    const backToWallet = () =>{
        setShowApproveContent(false); // go back to the home page if back or after approve success
    }

    const address = useAddress(); // wallet address


return (
        <div className="token-card">

            <div className="first-row">
                <span className="eth-account">ETH Account:<strong>{address? address : " not connected"}</strong></span>
            </div>

            <div className="token-second-row">
               <span>Approve FT</span>
               <span style={{opacity: 0.4}}>Only Approve FT to an Ethereum address </span>
            </div>

            <div className="token-third-row">
                <input 
                    type="text" 
                    placeholder="Receiver Address" 
                    value={receiverAddress}
                    onChange={(e) => setReceiverAddress(e.target.value)}
                />

                <div className="input-container">
                    <input 
                        type="text" 
                        placeholder="Amount to approve" 
                        value={amountToApprove}
                        onChange={(e) => setAmountToApprove(e.target.value)}
                    />
                    <span className="ft-symbol">FT</span>
                </div>

                <input type="number" defaultValue={20} min={1} step="any" />
                <input type="number" defaultValue={200000} min={1} step="any" />
            </div>

             <div  className="button-container">
                    <button className="buttonBack" onClick={backToWallet}>Back</button>
                     <Web3Button 
                        contractAddress={deployed_address}
                        contractAbi={ft.abi}
                        action={(contract) => contract.call("approve", receiverAddress, ethers.utils.parseEther(amountToApprove))}
                        onSuccess={() => backToWallet()}
                        className="web3Button"
                    >
                        Approve
                    </Web3Button>
            </div>
 
        </div>
 
    )
}