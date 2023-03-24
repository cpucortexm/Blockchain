import { FluxTokenCard } from "./FluxTokenCard";
import { OceanicNFTCard } from "./OceanicNFTCard";

export const TokenCardContainer =  () =>{
    return (
        <div className="token-card-container" >
            <FluxTokenCard />
            <OceanicNFTCard />
        </div>
  );
}