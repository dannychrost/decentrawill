// WalletContext.js
import React, { createContext, useState } from "react";
import { ethers } from "ethers";
import dwArtifact from "../contracts/DecentraWill.json";
import { Modal, Button, Image } from "react-bootstrap";
import Metamask from "./metamask.png";
export const WalletContext = createContext();
const polygonAmoiChainId = "0x13882"; // Polygon Amoi Testnet Chain ID
export const WalletProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [userAccount, setUserAccount] = useState(null);
  let [walletProvider, setWalletProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const connectWallet = async () => {
    if (window.ethereum == null) {
      console.log("Wallet not detected!");
      setShowModal(true);
    } else {
      try {
        const [account] = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const walletProvider = new ethers.BrowserProvider(window.ethereum);
        const network = await walletProvider.getNetwork();

        if (String(Number(network.chainId)) !== "80002") {
          // Use "80001" for Polygon Mumbai Testnet
          console.log("Switching to Polygon Amoi");
          await switchToPolygonAmoi();
        }

        const newNetwork = await walletProvider.getNetwork();
        if (String(Number(newNetwork.chainId)) === "80002") {
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
        }
      } catch (error) {
        console.log(error);
        const newNetwork = await walletProvider.getNetwork();
        const [account] = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const walletProvider = new ethers.BrowserProvider(window.ethereum);
        if (String(Number(newNetwork.chainId)) === "80002") {
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
        }
      }
    }
  };

  const switchToPolygonAmoi = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: polygonAmoiChainId }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: polygonAmoiChainId,
                chainName: "Polygon Amoi Testnet",
                nativeCurrency: {
                  name: "MATIC",
                  symbol: "MATIC",
                  decimals: 18,
                },
                rpcUrls: ["https://rpc-amoy.polygon.technology/"], // Use the appropriate RPC URL
                blockExplorerUrls: ["https://amoy.polygonscan.com/"],
              },
            ],
          });
        } catch (addError) {
          console.log(addError);
        }
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
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>MetaMask Required</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <Image src={Metamask} className="mb-3" style={{ width: "100%" }} />
          <p>Please install MetaMask to connect your wallet.</p>
          <Button
            variant="primary"
            href="https://metamask.io/download/"
            target="_blank"
          >
            Download MetaMask
          </Button>
        </Modal.Body>
      </Modal>
    </WalletContext.Provider>
  );
};
