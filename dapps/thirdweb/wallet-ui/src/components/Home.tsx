
import { Description } from "./Description";
import { Nav } from "./Nav";
import { TokenCardContainer } from "./TokenCardContainer";
export const Home = () =>{
    return(
        <div className="container">
            <Nav/>
            <Description/>
            <TokenCardContainer/>
        </div>
    );
}