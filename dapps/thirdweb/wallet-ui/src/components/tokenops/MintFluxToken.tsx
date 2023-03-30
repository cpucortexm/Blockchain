
import { useAddress, Web3Button } from "@thirdweb-dev/react";
import { useState } from "react";
import ft from "src/tokens/FluxToken";
const deployed_address = ft.deployed_address;

interface SendMintTokenProps {
    setShowMintContent: (show: boolean) => void;
}
export const MintFluxToken :React.FC<SendMintTokenProps> = ({setShowMintContent}) => {
    const [mintToAddress, setMintAddress] = useState('');
    const [amountToMint, setAmountToMint] = useState('');

    const backToWallet = () =>{
        setShowMintContent(false); // go back to the home page if back or after mint success
    }

    const address = useAddress(); // wallet address

    return(
        <div className="token-card">

            <div className="first-row">
                <span className="eth-account">ETH Account:<strong>{address? address : " not connected"}</strong></span>
            </div>

            <div className="token-second-row">
               <span>Mint FT</span>
               <span style={{opacity: 0.4}}>Only mint FT to an Ethereum address </span>
            </div>

            <div className="token-third-row">
                <input 
                    type="text" 
                    placeholder="Receiver Address" 
                    value={mintToAddress}
                    onChange={(e) => setMintAddress(e.target.value)}
                />
                <div className="input-container">
                    <input 
                        type="text" 
                        placeholder="Amount to mint" 
                        value={amountToMint}
                        onChange={(e) => setAmountToMint(e.target.value)}
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
                        action={(contract) =>contract.erc20.mintTo(mintToAddress, amountToMint)}
                        onSuccess={() => backToWallet()}
                        className="web3Button"
                    >
                        Mint
                    </Web3Button>
            </div>
 
        </div>
    )
}
