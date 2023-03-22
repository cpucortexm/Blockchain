import { Description } from "./components/Description";
import { Nav } from "./components/Nav";
import { TokenCardContainer } from "./components/TokenCardContainer";
import "./styles/Home.css";

export default function Home() {
  return (
    <div className="container">
        <Nav/>
        <Description/>
        <TokenCardContainer/>
   </div>
  );
}
