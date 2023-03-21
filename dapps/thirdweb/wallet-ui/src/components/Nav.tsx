
import { ConnectWallet } from "@thirdweb-dev/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoins } from "@fortawesome/free-solid-svg-icons";
export const Nav = () =>{
    return(
        <div>
            <div className="nav-bar">
                <span className="nav-bar-facoin">
                    <FontAwesomeIcon icon={faCoins}/>
                    {"  "}
                    TokenWallet
                </span>
                <ConnectWallet colorMode="light" accentColor="#9702c4"/> 
            </div>
        </div>
    )
}