// WalletContext.js
import React, { createContext, useState } from "react";
import { ethers } from "ethers";

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [userAccount, setUserAccount] = useState(null);
  let [walletProvider, setWalletProvider] = useState(null);
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

        /*setContract(
          new ethers.Contract(
            contractArtifact.address,
            contractArtifact.abi,
            await walletProvider.getSigner()
          )
        );*/
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
        handleWalletAction,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
