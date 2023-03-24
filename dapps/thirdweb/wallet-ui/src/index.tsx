import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ThirdwebProvider } from "@thirdweb-dev/react";

// This is the chain your dApp will work on.
// Change this to the chain your app is built for.
// You can also import additional chains from `@thirdweb-dev/chains` and pass them directly.
// const activeChain = "ethereum";

// Note: We are using our own local custom chain
/*
const activeChain = {
        // === Required information for connecting to the network === \\
        chainId: 313, // Chain ID of the network
        // Array of RPC URLs to use
        rpc: ["HTTP://127.0.0.1:8545"],

        // === Information for adding the network to your wallet (how it will appear for first time users) === \\
        // Information about the chains native currency (i.e. the currency that is used to pay for gas)
        nativeCurrency: {
          decimals: 18,
          name: "",
          symbol: "ETH",
        },
        shortName: "", // Display value shown in the wallet UI
        slug: "", // Display value shown in the wallet UI
        testnet: true, // Boolean indicating whether the chain is a testnet or mainnet
        chain: "", // Chain
        name: "ganache-local", // Name of the network
      }
*/
const activeChain = "localhost"
const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <ThirdwebProvider activeChain={activeChain}>
      <App />
    </ThirdwebProvider>
  </React.StrictMode>
);

