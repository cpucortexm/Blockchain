import { ERC20TokensCard } from "./ERC20TokensCard";
import { ERC721TokensCard } from "./ERC721TokensCard";

export const TokenCardContainer = () =>{
    return (
        <div className="token-card-container" >
            <ERC20TokensCard />
            <ERC721TokensCard />
        </div>
  );
}