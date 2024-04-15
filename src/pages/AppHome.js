import React, { useState } from "react";
import { Form, Button, Col, Row, InputGroup } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { useEffect, useContext } from "react";
import { WalletContext, WalletProvider } from "../contexts/WalletContext";
import { ethers } from "ethers";
import dwArtifact from "../contracts/DecentraWill.json";
import IERC20Abi from "../contracts/IERC20.json";
const AppHome = () => {
  // The following code is for the creator portal
  const [successorRows, setSuccessorRows] = useState([{ id: 1 }]);
  const [trusteeRows, setTrusteeRows] = useState([{ id: 1 }]);
  const [token, setToken] = useState("");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [tokenContractAddress, setTokenContractAddress] = useState("");
  const [allowanceAmount, setAllowanceAmount] = useState("");
  const {
    isConnected,
    userAccount,
    handleWalletAction,
    contract,
    walletProvider,
  } = useContext(WalletContext);
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const tokenAddress = token; // DAI token contract address on Ethereum mainnet
      const tokenContract = new ethers.Contract(
        tokenAddress,
        IERC20Abi.abi,
        await walletProvider.getSigner()
      );

      const tx = await contract.setAllocation(
        token,
        recipient,
        ethers.parseEther(amount)
      );

      await tx.wait();
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  /**
   * Handles the submission of the allowance form.
   * @param {Event} event - The event object.
   * @returns {Promise<void>} - A promise that resolves when the allowance is set.
   */
  const handleAllowanceSubmit = async (event) => {
    event.preventDefault();
    try {
      await setAllowance(
        tokenContractAddress,
        ethers.parseEther(allowanceAmount)
      );
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  /**
   * Sets the allowance for the DecentraWill contract.
   * @param {string} tokenContractAddressTemp - The address of the token contract.
   * @param {number} amount - The amount to set as allowance.
   * @returns {Promise<void>} - A promise that resolves when the allowance is set.
   */
  async function setAllowance(tokenContractAddressTemp, amount) {
    const tokenContract = new ethers.Contract(
      tokenContractAddressTemp,
      IERC20Abi.abi,
      await walletProvider.getSigner()
    );

    // The will creator sets the allowance for the DecentraWill contract
    const tx = await tokenContract.approve(dwArtifact.address, amount);
    await tx.wait();
  }

  const addSuccessorRow = () => {
    if (successorRows.length < 3) {
      const newId = successorRows.length + 1;
      setSuccessorRows([...successorRows, { id: newId }]);
    }
  };

  const addTrusteeRow = () => {
    if (trusteeRows.length < 3) {
      const newId = trusteeRows.length + 1;
      setTrusteeRows([...trusteeRows, { id: newId }]);
    }
  };

  useEffect(() => {
    if (isConnected && contract) {
      console.log("We are connected to wallet");
      owner();
      console.log(userAccount);
    }
  }, [isConnected]);

  async function owner() {
    const tx = await contract.owner();
    console.log(tx);
  }

  // The following code is for the beneficiary portal
  const [creator, setCreator] = useState("");
  const [withdrawalToken, setWithdrawalToken] = useState("");
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const handleWithdrawSubmit = async (event) => {
    event.preventDefault();

    try {
      const tx = await contract.withdrawTokenForBeneficiary(
        ethers.getAddress(creator),
        ethers.getAddress(withdrawalToken),
        ethers.parseEther(withdrawalAmount.toString())
      );

      await tx.wait();
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <>
      <h3>Creator Portal</h3>
      {/*Here we set the allowance for the DecentraWill contract*/}
      <h4 style={{ color: "#e056fd" }}>
        How much token control to give DecentraWill?
      </h4>
      <Form onSubmit={handleAllowanceSubmit}>
        <Form.Group>
          <Form.Label>Token Address</Form.Label>
          <Form.Control
            type="text"
            value={tokenContractAddress}
            onChange={(e) => setTokenContractAddress(e.target.value)}
            placeholder="Please specify the token address, e.g. USDC would be 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48 on the Ethereum mainnet."
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Allowance Amount</Form.Label>
          <Form.Control
            type="number"
            value={allowanceAmount}
            onChange={(e) => setAllowanceAmount(e.target.value)}
            placeholder="How many tokens should DecentraWill be able to access on your behalf?"
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Set Allowance
        </Button>
      </Form>
      <br />
      {/*Here we set the allocation for the beneficiary*/}
      <h4 style={{ color: "#e056fd" }}>
        How much tokens should this beneficiary receive?
      </h4>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Token Address</Form.Label>
          <Form.Control
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Please specify the token address, e.g. USDC would be 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48 on the Ethereum mainnet."
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Beneficiary Address</Form.Label>
          <Form.Control
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Please specify the address of the will's beneficiary for token withdrawal. For multiple beneficiaries, you will have to set the allocation for each beneficiary separately."
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Amount</Form.Label>
          <Form.Control
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Please specify the amount of tokens to allocate to this beneficiary."
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Set Allocation
        </Button>
      </Form>
      <br />
      <h4 style={{ color: "#e056fd" }}>Existing Wills</h4>
      <br />
      <h3>Beneficiary Portal</h3>

      <Form onSubmit={handleWithdrawSubmit}>
        <Form.Group>
          <Form.Label>Creator Address</Form.Label>
          <Form.Control
            type="text"
            value={creator}
            onChange={(e) => setCreator(e.target.value)}
            placeholder="Please specify the will creator's wallet address."
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Token Address</Form.Label>
          <Form.Control
            type="text"
            value={withdrawalToken}
            onChange={(e) => setWithdrawalToken(e.target.value)}
            placeholder="Please specify the token address, e.g. USDC would be 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48 on the Ethereum mainnet."
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Amount</Form.Label>
          <Form.Control
            type="number"
            value={withdrawalAmount}
            onChange={(e) => setWithdrawalAmount(e.target.value)}
            placeholder="Please specify the amount of tokens you'd like to withdraw."
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Withdraw
        </Button>
      </Form>
      <br />
      <h4 style={{ color: "#e056fd" }}>Tokens allocated to you</h4>
      {/*<Form>
        <Form.Group className="mb-3 text-center" controlId="testamentName">
          <Form.Label>Testament Name</Form.Label>
          <Row className="justify-content-center">
            <Col xs={5}>
              <Form.Control type="email" placeholder="Enter Testament name" />
            </Col>
          </Row>
        </Form.Group>

        <Form.Group className="mb-3 text-center" controlId="successor">
          <Form.Label>Enter Successor</Form.Label>
          <Row className="justify-content-center">
            <Form.Text className="text-primary">Min 1, Max 3</Form.Text>
          </Row>
          {successorRows.map((row) => (
            <React.Fragment key={row.id}>
              <Row className="justify-content-center">
                <Col xs={5}>
                  <Form.Control placeholder="Successor" />
                </Col>
              </Row>
              <Row className="justify-content-center">
                <Col xs={5}>
                  <Form.Control type="email" placeholder="Successor Email" />
                </Col>
              </Row>
            </React.Fragment>
          ))}
          {successorRows.length < 3 && (
            <Row className="justify-content-center">
              <Button variant="primary" onClick={addSuccessorRow}>
                Add Successor
              </Button>
            </Row>
          )}
        </Form.Group>

        <Form.Group className="mb-3 text-center" controlId="trustee">
          <Form.Label>Enter Trustee</Form.Label>
          <Row className="justify-content-center">
            <Form.Text className="text-primary">Min 1, Max 3</Form.Text>
          </Row>
          {trusteeRows.map((row) => (
            <React.Fragment key={row.id}>
              <Row className="justify-content-center">
                <Col xs={5}>
                  <Form.Control placeholder="Trustee" />
                </Col>
              </Row>
              <Row className="justify-content-center">
                <Col xs={5}>
                  <Form.Control type="email" placeholder="Trustee Email" />
                </Col>
              </Row>
            </React.Fragment>
          ))}
          {trusteeRows.length < 3 && (
            <Row className="justify-content-center">
              <Button variant="primary" onClick={addTrusteeRow}>
                Add Trustee
              </Button>
            </Row>
          )}
        </Form.Group>

        <Form.Group className="mb-3" controlId="testamentName">
          <Form.Label>Set Up A Quorum</Form.Label>
          <Row>
            <Col sm={2}>
              <InputGroup size="sm" className="mb-3">
                <InputGroup.Text id="inputGroup-sizing-sm">#</InputGroup.Text>
                <Form.Control
                  type="email"
                  aria-label="Small"
                  aria-describedby="inputGroup-sizing-sm"
                />
              </InputGroup>
            </Col>
            <Form.Text className="text-primary">
              At least one trustee. Max 2.
            </Form.Text>
          </Row>
        </Form.Group>

        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            Select Tokens from List
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
            <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
            <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <Row className="justify-content-center">
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Row>
          </Form>*/}
    </>
  );
};

export default AppHome;
