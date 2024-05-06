import React, { useState } from "react";
import { Form, Button, Col, Row, Card, InputGroup } from "react-bootstrap";

import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { useEffect, useContext } from "react";
import { WalletContext, WalletProvider } from "../contexts/WalletContext";
import { JsonRpcProvider, ethers, getDefaultProvider } from "ethers";
import dwArtifact from "../contracts/DecentraWill.json";
import IERC20Abi from "../contracts/IERC20.json";
import { Modal } from "react-bootstrap";

function CustomAlert({ show, onClose, title, message }) {
  return (
    <Modal show={show} onHide={() => onClose(false)}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => onClose(false)}>
          No
        </Button>
        <Button variant="primary" onClick={() => onClose(true)}>
          Yes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
function unixToEasternTime(unixTimestamp) {
  // Create a new Date object from the UNIX timestamp
  // UNIX timestamp is expected to be in seconds, JavaScript Date expects milliseconds
  if (unixTimestamp == 0) return 0;
  const date = new Date(unixTimestamp * 1000);

  // Format options to display the date as a string
  const options = {
    weekday: "long", // e.g., Monday
    year: "numeric", // e.g., 2021
    month: "long", // e.g., July
    day: "numeric", // e.g., 31
    hour: "2-digit", // e.g., 02
    minute: "2-digit", // e.g., 59
    second: "2-digit", // e.g., 59
    timeZone: "America/New_York", // Set timezone to Eastern Time
    timeZoneName: "short", // Display short timezone name e.g., EST
  };

  // Convert to locale string with specified options
  return date.toLocaleString("en-US", options);
}
const WillCards = () => {
  const [allocations, setAllocations] = useState([]); // State to hold allocations for the user
  const { contract, userAccount } = useContext(WalletContext);

  useEffect(() => {
    const fetchWills = async () => {
      if (!userAccount) return; // Ensure userAccount is available
      const tokens = await contract.getAllocatedTokensByUser(userAccount);
      for (let a = 0; a < tokens.length; a++) {
        console.log(tokens[a]);
      }

      const userAllocations = await Promise.all(
        tokens.map(async (token) => {
          const recipients = await contract.getRecipientsByToken(
            userAccount,
            token
          );
          const tempDeadline = await contract.creatorDeadlines(userAccount);
          const details = await Promise.all(
            recipients.map(async (recipient) => {
              const amount = await contract.tokenAllocations(
                userAccount,
                token,
                recipient
              );
              return {
                token,
                recipient,
                amount: ethers.formatEther(amount), // Ensuring proper use of ethers formatting
                creatorDeadline: unixToEasternTime(
                  ethers.formatUnits(tempDeadline, "wei")
                ),
              };
            })
          );
          return details.flat(); // Flatten to handle nested arrays properly
        })
      );
      setAllocations(userAllocations.flat()); // Set the allocations state
    };

    if (contract && userAccount) {
      console.log("Fetching wills");
      fetchWills();
    }
  }, [contract, userAccount]); // Depend on contract and userAccount to refresh data

  return (
    <Row xs={1} md={3} className="g-4">
      {allocations.map((alloc, idx) => (
        <Col key={idx}>
          <Card>
            <Card.Header as="h5">
              Beneficiary:<Card.Subtitle> {alloc.recipient}</Card.Subtitle>
            </Card.Header>

            <Card.Body>
              <Card.Subtitle>Token:</Card.Subtitle>
              <Card.Text>{alloc.token}</Card.Text>
              <Card.Subtitle>Amount:</Card.Subtitle>
              <Card.Text>{alloc.amount} Tokens</Card.Text>
              <Card.Subtitle>Deadline: </Card.Subtitle>
              <Card.Text>
                {alloc.creatorDeadline == 0
                  ? "Not set yet"
                  : alloc.creatorDeadline}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

const BeneficiaryWills = () => {
  const [beneficiaryWills, setBeneficiaryWills] = useState([]);
  const { contract, userAccount, walletProvider } = useContext(WalletContext);

  useEffect(() => {
    const fetchBeneficiaryWills = async () => {
      if (!userAccount || !contract) return;

      try {
        // Fetch creators who have allocated tokens to the beneficiary
        let creators = [];
        let index = 0; // Start index from 0
        let errorOccurred = false;

        while (!errorOccurred) {
          try {
            const creatorAddress = await contract.creatorsForBeneficiary(
              ethers.getAddress(userAccount),
              index
            );
            creators.push(creatorAddress);
            index++; // Increment index to fetch next creator
          } catch (error) {
            errorOccurred = true; // Stop the loop if an error occurs
          }
        }
        const willsData = [];

        for (const creator of creators) {
          // For each creator, fetch the tokens they have allocated to this beneficiary
          const tokens = await contract.getAllocatedTokensByUser(creator);

          for (const token of tokens) {
            // Check the allocation for the beneficiary
            const amount = await contract.tokenAllocations(
              creator,
              token,
              userAccount
            );
            /*const tokenContract = new ethers.Contract(
              token,
              IERC20Abi.abi,
              await walletProvider.getSigner()
            );*/
            //const balance = await tokenContract.symbol();
            //console.log(balance);
            const tempDeadline = await contract.creatorDeadlines(creator);

            if (amount > 0) {
              willsData.push({
                creator: creator,
                token: token,
                amount: ethers.formatEther(amount), // Convert amount from Wei to Ether
                creatorDeadline: unixToEasternTime(
                  ethers.formatUnits(tempDeadline, "wei")
                ),
              });
            }
          }
        }

        setBeneficiaryWills(willsData);
      } catch (error) {
        //console.error("Error fetching beneficiary wills:", error);
      }
    };

    fetchBeneficiaryWills();
  }, [userAccount, contract]);

  return (
    <Row xs={1} md={3} className="g-4">
      {beneficiaryWills.map((will, idx) => (
        <Col key={idx}>
          <Card>
            <Card.Header as="h5">Will Details</Card.Header>
            <Card.Body>
              <Card.Subtitle>Token Address: </Card.Subtitle>
              <Card.Text>{will.token} </Card.Text>
              <Card.Subtitle>Creator Address: </Card.Subtitle>
              <Card.Text>{will.creator} </Card.Text>
              <Card.Subtitle>Amount: </Card.Subtitle>
              <Card.Text>{will.amount} Tokens</Card.Text>
              <Card.Subtitle>Deadline: </Card.Subtitle>
              <Card.Text>
                {will.creatorDeadline == 0
                  ? "Not set yet"
                  : will.creatorDeadline}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

const AppHome = () => {
  // The following code is for the creator portal
  const [successorRows, setSuccessorRows] = useState([{ id: 1 }]);
  const [trusteeRows, setTrusteeRows] = useState([{ id: 1 }]);
  const [token, setToken] = useState("");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [tokenContractAddress, setTokenContractAddress] = useState("");
  const [allowanceAmount, setAllowanceAmount] = useState("");
  const [showAlert, setShowAlert] = useState(false); // Initialize showAlert state to false
  const {
    isConnected,
    userAccount,
    handleWalletAction,
    contract,
    walletProvider,
  } = useContext(WalletContext);

  const [showModal, setShowModal] = useState(false); // For controlling the display of the modal

  const checkAndProceedWithAllocation = async () => {
    const tokenContract = new ethers.Contract(
      token,
      IERC20Abi.abi,
      await walletProvider.getSigner()
    );
    const balance = await tokenContract.balanceOf(userAccount);
    const balanceInEther = ethers.formatEther(balance);

    if (parseFloat(balanceInEther) < parseFloat(amount)) {
      setShowModal(true); // Show modal to ask for user confirmation
    } else {
      proceedWithAllocation(); // Directly proceed if balance is sufficient
    }
  };
  const proceedWithAllocation = async () => {
    try {
      const tx = await contract.setAllocation(
        token,
        recipient,
        ethers.parseEther(amount)
      );
      await tx.wait();
      console.log("Allocation set successfully.");
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    await checkAndProceedWithAllocation();
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
      let tempDeadline = await contract.creatorDeadlines(creator);
      tempDeadline = ethers.formatUnits(tempDeadline, "wei");
      tempDeadline = parseInt(tempDeadline);

      if (tempDeadline == 0) {
        alert("The creator has not set a deadline for the withdrawal yet.");
      } else if (tempDeadline > Math.floor(Date.now() / 1000)) {
        alert("You may not withdraw yet.");
      } else {
        console.error("An error occurred:", error);
      }
    }
  };
  const [deadline, setDeadline] = useState("");
  async function setDeadlineHandler(event) {
    event.preventDefault();

    if (!deadline) {
      alert("Please select a valid date and time for the deadline.");
      return;
    }

    const timestamp = Math.floor(new Date(deadline).getTime() / 1000); // Convert date to UNIX timestamp
    try {
      const tx = await contract.setCreatorDeadline(timestamp);
      await tx.wait(); // Wait for the transaction to be mined
      console.log("Deadline set successfully.");
      alert("Deadline has been successfully set.");
    } catch (error) {
      console.error("Failed to set deadline:", error);
      alert("Error setting deadline: " + error.message);
    }
  }

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
      <h4 style={{ color: "#e056fd" }}>
        At what point should beneficiaries be able to withdraw their tokens?
      </h4>
      {/* The following code is for setting the deadline */}
      <Form onSubmit={setDeadlineHandler}>
        <Form.Group>
          <Form.Label>Date and Time</Form.Label>
          <Form.Control
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            placeholder="Select date and time"
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Set Deadline
        </Button>
      </Form>
      {showModal && (
        <CustomAlert
          show={showModal}
          onClose={(userConfirmed) => {
            setShowModal(false); // Always close the modal
            if (userConfirmed) {
              proceedWithAllocation(); // Proceed only if user confirms
            } else {
              console.log("User cancelled the operation.");
            }
          }}
          title="Confirm Allocation"
          message="The allocation amount exceeds your balance. Do you want to proceed?"
        />
      )}

      <br />
      <h4 style={{ color: "#e056fd" }}>Existing Wills</h4>
      <WillCards />
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
      <BeneficiaryWills />
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
