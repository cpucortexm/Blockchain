import { useAddress } from "@thirdweb-dev/react"

export const ERC721TokensCard = () =>{
    const address = useAddress()
    return(
        <div className="token-card">
             <div className="first-row">
                <span className="eth-account"><strong>ETH Account: </strong>{address? address : " not connected"}</span>
            </div>
            <div className="second-row">
               <span>Symbol</span>
                <span>Token</span>
                <span>MetaData</span>
            </div>
        </div>
    )
}