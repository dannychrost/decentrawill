// Home.js
import { useEffect, useContext } from "react";
import { NavbarContext } from "../contexts/NavbarContext";
import { Container } from "react-bootstrap";
import Stack from "react-bootstrap/Stack";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import { ethers } from "ethers";
import { WalletContext } from "../contexts/WalletContext";

const Home2 = () => {
  const { isConnected, userAccount, handleWalletAction, contract } =
    useContext(WalletContext);

  if (isConnected) {
    console.log("We are connected to wallet");
    owner();
  }

  async function owner() {
    const tx = await contract.owner();
    console.log(tx);
  }

  const { setHeaderValue } = useContext(NavbarContext);

  useEffect(() => {
    setHeaderValue(1);
  }, [setHeaderValue]);

  return <div>Hello</div>;
};

export default Home2;
