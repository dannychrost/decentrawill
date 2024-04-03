// WalletContext.js
import React, { createContext, useState } from "react";
import { ethers } from "ethers";
import dwArtifact from "../contracts/DecentraWill.json";

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [userAccount, setUserAccount] = useState(null);
  let [walletProvider, setWalletProvider] = useState(null);
  const [contract, setContract] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum == null) {
      console.log("Wallet not detected!");
    } else {
      try {
        const [account] = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const walletProvider = new ethers.BrowserProvider(window.ethereum);
        localStorage.removeItem("manuallyDisconnected");
        setIsConnected(true);
        setUserAccount(account);
        setWalletProvider(walletProvider);

        setContract(
          new ethers.Contract(
            dwArtifact.address,
            dwArtifact.abi,
            await walletProvider.getSigner()
          )
        );
      } catch (error) {
        console.log(error);
      }
    }
  };
  const disconnectWallet = () => {
    if (window.ethereum) {
      localStorage.setItem("manuallyDisconnected", "true");
      setIsConnected(false);
      setUserAccount(null);
    }
  };
  const handleWalletAction = isConnected ? disconnectWallet : connectWallet;

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        userAccount,
        walletProvider,
        handleWalletAction,
        connectWallet,
        disconnectWallet,
        walletProvider,
        contract,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
