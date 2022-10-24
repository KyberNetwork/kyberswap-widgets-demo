import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { Widget } from "kyberswap-widgets";
import { init, useWallets, useConnectWallet } from "@web3-onboard/react";
import injectedModule from "@web3-onboard/injected-wallets";
import { ethers } from "ethers";

const injected = injectedModule();

// initialize Onboard
init({
  wallets: [injected],
  chains: [
    {
      id: "0x1",
      token: "ETH",
      label: "Ethereum Mainnet",
      rpcUrl: "https://ethereum.kyberengineering.io",
    },
    {
      id: "0x89",
      token: "MATIC",
      label: "Polygon",
      rpcUrl: "https://polygon.kyberengineering.io",
    },
  ],
});

function App() {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();

  // create an ethers provider
  let ethersProvider: any;

  if (wallet) {
    ethersProvider = new ethers.providers.Web3Provider(wallet.provider, "any");
  }

  const connectedWallets = useWallets();

  const [chainId, setChainId] = useState(1);

  useEffect(() => {
    ethersProvider?.getNetwork().then((res: any) => setChainId(res.chainId));
  }, [ethersProvider]);

  useEffect(() => {
    if (!connectedWallets.length) return;

    const connectedWalletsLabelArray = connectedWallets.map(
      ({ label }) => label
    );
    window.localStorage.setItem(
      "connectedWallets",
      JSON.stringify(connectedWalletsLabelArray)
    );
  }, [connectedWallets, wallet]);

  useEffect(() => {
    const previouslyConnectedWallets = JSON.parse(
      window.localStorage.getItem("connectedWallets") || "[]"
    );

    if (previouslyConnectedWallets?.length) {
      async function setWalletFromLocalStorage() {
        const walletConnected = await connect({
          autoSelect: previouslyConnectedWallets[0],
        });
      }
      setWalletFromLocalStorage();
    }
  }, [connect]);

  const lightTheme = {
    text: "#222222",
    subText: "#5E5E5E",
    background: "#FFFFFF",
    tab: "#FBFBFB",
    inputBackground: "#F5F5F5",
    interactive: "#E2E2E2",
    stroke: "#505050",
    accent: "#28E0B9",
    success: "#189470",
    warning: "#FF9901",
    error: "#FF537B",
    fontFamily: "Work Sans",
    borderRadius: "16px",
    buttonRadius: "999px",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.04)",
  };

  const darkTheme = {
    text: "#FFFFFF",
    subText: "#A9A9A9",
    background: "#1C1C1C",
    tab: "#313131",
    inputBackground: "#0F0F0F",
    interactive: "#292929",
    stroke: "#505050",
    accent: "#28E0B9",
    success: "#189470",
    warning: "#FF9901",
    error: "#FF537B",
    fontFamily: "Work Sans",
    borderRadius: "16px",
    buttonRadius: "999px",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.04)",
  };

  const [theme, setTheme] = useState<any>(darkTheme);

  return (
    <div className="App">
      <Widget
        theme={theme}
        tokenList={[]}
        provider={ethersProvider}
        defaultTokenOut={
          chainId === 1
            ? "0xdeFA4e8a7bcBA345F687a2f1456F5Edd9CE97202"
            : "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
        }
      />
      <h1>KyberSwap Widget Demo</h1>
      <div className="card">
        <button onClick={() => (wallet ? disconnect(wallet) : connect())}>
          {!wallet ? "connect wallet" : "disconnect"}
        </button>
      </div>
      <p className="read-the-docs">Choose theme</p>

      <input
        type="radio"
        id="dark"
        name="age"
        value="dark"
        onChange={(e) => {
          setTheme(darkTheme);
        }}
      />
      <label htmlFor="dark">Dark theme</label>
      <br />
      <input
        type="radio"
        id="light"
        name="age"
        value="light"
        onChange={(e) => {
          setTheme(lightTheme);
        }}
      />
      <label htmlFor="light">Light theme</label>
      <br />
      <input
        type="radio"
        id="custom"
        name="age"
        value="custom"
        onChange={(e) => {
          setTheme(undefined);
        }}
      />
      <label htmlFor="custom">Custom</label>
      <br />
      <br />
    </div>
  );
}

export default App;
