import "./styles/Home.css";
import { NFTLink } from "./components/NFTLink";
import {Routes, Route } from "react-router-dom";
import { Home } from "./components/Home";



export default function App() {
/*
    return (
    <div className="container">
        <Nav/>
        <Description/>
        <TokenCardContainer/>
   </div>
  );
  */
 
  return (
    <div>
      <Routes>
        <Route path="/" element={ <Home/> } />
        <Route path="/nft/:index" element={< NFTLink/>} />
      </Routes>
      </div>

  );

}
