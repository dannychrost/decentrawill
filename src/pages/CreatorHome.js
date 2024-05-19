import React, { useState } from "react";
import {
  Form,
  Button,
  Col,
  Row,
  Card,
  InputGroup,
  Table,
} from "react-bootstrap";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth, functions } from "../firebase/Firebase"; // Import your Firebase configuration

import { Dropdown, Container } from "react-bootstrap";
import { DropdownButton } from "react-bootstrap";
import { useEffect, useContext } from "react";
import { WalletContext, WalletProvider } from "../contexts/WalletContext";
import { JsonRpcProvider, ethers, getDefaultProvider } from "ethers";
import dwArtifact from "../contracts/DecentraWill.json";
import IERC20Abi from "../contracts/IERC20.json";
import { Modal } from "react-bootstrap";

const tokens = [
  {
    symbol: "mUSDC",
    imageUrl:
      "https://dynamic-assets.coinbase.com/3c15df5e2ac7d4abbe9499ed9335041f00c620f28e8de2f93474a9f432058742cdf4674bd43f309e69778a26969372310135be97eb183d91c492154176d455b8/asset_icons/9d67b728b6c8f457717154b3a35f9ddc702eae7e76c4684ee39302c4d7fd0bb8.png",
    name: "Mock USD Coin",
    address: "0x71D02a2Ff4d84322d72B042e22dA8Deb2C44C84B", // Adding the address
  },
  {
    symbol: "mWETH",
    imageUrl:
      "https://dynamic-assets.coinbase.com/dbb4b4983bde81309ddab83eb598358eb44375b930b94687ebe38bc22e52c3b2125258ffb8477a5ef22e33d6bd72e32a506c391caa13af64c00e46613c3e5806/asset_icons/4113b082d21cc5fab17fc8f2d19fb996165bcce635e6900f7fc2d57c4ef33ae9.png",
    name: "Mock Wrapped Ether",
    address: "0x7a8bEaF97A80016E853363CDb529B9098C9FdcEb", // Adding the address
  },
  {
    symbol: "mWBTC",
    imageUrl:
      "https://dynamic-assets.coinbase.com/e785e0181f1a23a30d9476038d9be91e9f6c63959b538eabbc51a1abc8898940383291eede695c3b8dfaa1829a9b57f5a2d0a16b0523580346c6b8fab67af14b/asset_icons/b57ac673f06a4b0338a596817eb0a50ce16e2059f327dc117744449a47915cb2.png",
    name: "Mock Wrapped Bitcoin",
    address: "0x1f4D92c969ef635068ad91FcaA9849bEB84CD1e4", // Adding the address
  },
];

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

const WillCards = ({ refreshCounter }) => {
  const [allocations, setAllocations] = useState([]); // State to hold allocations for the user
  const { contract, userAccount, walletProvider, isConnected } =
    useContext(WalletContext);
  const [allowances, setAllowances] = useState([]); // Holds allowances data
  useEffect(() => {
    const fetchWills = async () => {
      if (!userAccount || !isConnected || !contract) {
        setAllocations([]); // Reset the allocations state
        setAllowances([]); // Reset the allowances state
        return;
      } // Ensure userAccount is available
      const tokens = await contract.getAllocatedTokensByUser(userAccount);

      for (let a = 0; a < tokens.length; a++) {
        console.log(tokens[a]);
      }
      if (tokens.length == 0) {
        return;
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
      fetchAllowances(tokens); // Fetch allowances for these tokens
    };

    console.log("Fetching wills");
    fetchWills();
  }, [contract, userAccount, refreshCounter, isConnected]); // Depend on contract and userAccount to refresh data
  const fetchAllowances = async (tokenAddresses) => {
    try {
      const allowancesPromises = tokenAddresses.map(async (address) => {
        const tokenContract = new ethers.Contract(
          address,
          IERC20Abi.abi,
          await walletProvider.getSigner()
        );
        console.log("Fetching allowance for token:", address);
        const allowance = await tokenContract.allowance(
          userAccount,
          dwArtifact.address
        );
        console.log("Allowance:", ethers.formatEther(allowance));
        return {
          tokenAddress: address,
          allowance: ethers.formatEther(allowance),
        };
      });
      const results = await Promise.all(allowancesPromises);
      setAllowances(results);
    } catch (error) {
      console.error("Error fetching allowances:", error);
    }
  };
  return (
    <div>
      <br />
      <Card className="mb-4">
        <Card.Body>
          <Card.Title className="text-center mb-3">
            Allocations Created
          </Card.Title>
          {allocations.length > 0 ? (
            <Row xs={1} md={3} className="g-4">
              {allocations.map((alloc, idx) => (
                <Col key={idx}>
                  <Card>
                    <Card.Header as="h5" className="text-center">
                      Beneficiary:{" "}
                      <Card.Subtitle>{alloc.recipient}</Card.Subtitle>
                    </Card.Header>
                    <Card.Body>
                      <Card.Subtitle>Token:</Card.Subtitle>
                      <Card.Text>{alloc.token}</Card.Text>
                      <Card.Subtitle>Amount:</Card.Subtitle>
                      <Card.Text>{alloc.amount} Tokens</Card.Text>
                      <Card.Subtitle>Deadline:</Card.Subtitle>
                      <Card.Text>
                        {alloc.creatorDeadline === 0
                          ? "Not set yet"
                          : alloc.creatorDeadline}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <div className="alert alert-info" role="alert">
              You have not created any wills yet.
            </div>
          )}
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <Card.Title className="text-center mb-3">
            Allowances For Allocations
          </Card.Title>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Token Address</th>
                <th>Allowance (Tokens)</th>
              </tr>
            </thead>
            <tbody>
              {allowances.map((allowance, idx) => (
                <tr key={idx}>
                  <td>{allowance.tokenAddress}</td>
                  <td>{allowance.allowance}</td>
                </tr>
              ))}
              {allowances.length === 0 && (
                <tr>
                  <td colSpan="2" className="text-center">
                    No allowances found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

const CreatorHome = () => {
  // The following code is for the creator portal

  const [successorRows, setSuccessorRows] = useState([{ id: 1 }]);
  const [trusteeRows, setTrusteeRows] = useState([{ id: 1 }]);
  const [refreshCounter, setRefreshCounter] = useState(0);
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

  const [selectedToken, setSelectedToken] = useState("");

  const handleTokenChange = (e) => {
    setSelectedToken(e.target.value);
  };

  const [showModal, setShowModal] = useState(false); // For controlling the display of the modal

  const checkAndProceedWithAllocation = async () => {
    console.log(`Token: ${tokenContractAddress}`);
    const tokenContract = new ethers.Contract(
      tokenContractAddress,
      IERC20Abi.abi,
      await walletProvider.getSigner()
    );
    const balance = await tokenContract.balanceOf(
      ethers.getAddress(userAccount)
    );
    const balanceInEther = ethers.formatEther(balance);
    console.log(balanceInEther);

    if (parseFloat(balanceInEther) < parseFloat(amount)) {
      setShowModal(true); // Show modal to ask for user confirmation
    } else {
      proceedWithAllocation(); // Directly proceed if balance is sufficient
    }
  };
  /*
  const AllocationListener = () => {
    const handler = (user, token, recipient, amount, event) => {
      console.log(
        `Allocation Set: ${user} allocated ${ethers.formatEther(
          amount
        )} of ${token} to ${recipient}`
      );
      console.log(event);
    };

    // Register the event listener
    contract.on("AllocationSet", handler);

    // Setup a timer to remove the listener after 5 minutes
    const timer = setTimeout(() => {
      contract.removeListener("AllocationSet", handler);
      console.log("Listener has been removed after 5 minutes.");
    }, 300000); // 300000 ms = 5 minutes

    // Return a function to manually remove the event listener when needed
    return () => {
      clearTimeout(timer); // Clear the timer if manually removing the listener
      contract.removeListener("AllocationSet", handler);
      console.log("Listener has been removed manually.");
    };
  };
*/
  const proceedWithAllocation = async () => {
    //let removeListener; // Variable to hold the cleanup function

    try {
      // Register the event listener and get the cleanup function
      //removeListener = AllocationListener();

      const tx = await contract.setAllocation(
        tokenContractAddress,
        recipient,
        ethers.parseEther(amount)
      );
      await tx.wait(); // Wait for the transaction to be mined

      console.log("Allocation set successfully.");
      // Optionally remove the listener early if a certain condition is met
      // if (conditionToStopEarly) {
      //   removeListener();
      // }
      // Increment the refresh counter to trigger a re-render of WillCards
      setRefreshCounter((prev) => prev + 1);
      alert("Allocation set successfully.");
    } catch (error) {
      console.error("An error occurred:", error);
      // Check if the transaction was rejected by the user
      if (
        error.code === "ACTION_REJECTED" ||
        (error.error && error.error.code === 4001)
      ) {
        alert("Transaction was cancelled by the user.");
      } else {
        // Display generic error message or other specific errors based on `error.data`
        alert(
          "Failed to set allocation: " +
            (error.data ? error.data.message : error.message)
        );
      }
    }
    // Do not place removeListener() here if you want it to stay active for 5 minutes
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
      setRefreshCounter((prev) => prev + 1);
      alert("Allowance set successfully.");
    } catch (error) {
      console.error("Failed to set allowance:", error);

      // Check if the transaction was rejected by the user
      if (
        error.code === "ACTION_REJECTED" ||
        (error.error && error.error.code === 4001)
      ) {
        alert("Transaction was cancelled by the user.");
      } else {
        // If the error is something else, display a more generic error message
        alert(
          "Failed to set allowance: " +
            (error.data ? error.data.message : error.message)
        );
      }
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

  const handleTokenSelect = (key) => {
    const token = tokens.find((t) => t.symbol === key);
    if (token) {
      setTokenContractAddress(token.address);
      setSelectedToken(token);
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
      setRefreshCounter((prev) => prev + 1);
      alert("Deadline has been successfully set.");
      // Call the Cloud Function to send an email notification
      const sendDeadlineNotification = httpsCallable(
        functions,
        "sendDeadlineNotification"
      );
      await sendDeadlineNotification({ deadlineDate: deadline });
    } catch (error) {
      console.error("Failed to set deadline:", error);
      // Check if the transaction was rejected by the user
      if (
        error.code === "ACTION_REJECTED" ||
        (error.error && error.error.code === 4001)
      ) {
        alert("Transaction was cancelled by the user.");
        return;
      }
      if (error.data) {
        try {
          const cInterface = new ethers.Interface(dwArtifact.abi);
          // Decode the error using the contract's ABI
          const decodedError = cInterface.parseError(error.data);
          if (decodedError.name === "InvalidDeadline") {
            alert(
              "Invalid deadline: The deadline must be set to a future date/time."
            );
          } else {
            alert("Error setting deadline: " + decodedError.reason);
          }
        } catch (decodingError) {
          // If the error cannot be decoded, fall back to a generic error message
          alert("Error setting deadline: " + error.message);
        }
      } else {
        alert("Error setting deadline: " + error.message);
      }
    }
  }

  return (
    <>
      <Container className="">
        <Row className="justify-content-center">
          <Col md={8}>
            <h3 className="text-center mb-4">Creator Portal</h3>

            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <Card.Title
                  className="text-center mb-3"
                  style={{ color: "black" }}
                >
                  Authorize Token Control to DecentraWill
                </Card.Title>
                <Form onSubmit={handleAllowanceSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Token Address</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        placeholder="Enter or select a token address"
                        value={tokenContractAddress}
                        onChange={(e) => {
                          setTokenContractAddress(e.target.value);
                          setSelectedToken("^");
                        }}
                        required
                      />
                      <Dropdown onSelect={handleTokenSelect}>
                        <Dropdown.Toggle variant="outline-secondary">
                          {selectedToken
                            ? selectedToken.symbol
                            : "Select Token"}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {tokens.map((token) => (
                            <Dropdown.Item
                              key={token.symbol}
                              eventKey={token.symbol}
                            >
                              <img
                                src={token.imageUrl}
                                alt={token.symbol}
                                style={{
                                  width: 20,
                                  height: 20,
                                  marginRight: 10,
                                }}
                              />
                              {token.symbol}
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Allowance Amount</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Specify the number of tokens"
                      value={allowanceAmount}
                      onChange={(e) => setAllowanceAmount(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Button variant="primary" type="submit">
                    Set Allowance
                  </Button>
                </Form>
              </Card.Body>
            </Card>

            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <Card.Title
                  className="text-center mb-3"
                  style={{ color: "black" }}
                >
                  Allocate Tokens To Beneficiaries
                </Card.Title>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Token Address</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        placeholder="Enter or select a token address"
                        value={tokenContractAddress}
                        onChange={(e) =>
                          setTokenContractAddress(e.target.value)
                        }
                        required
                      />
                      <Dropdown onSelect={handleTokenSelect}>
                        <Dropdown.Toggle variant="outline-secondary">
                          {selectedToken
                            ? selectedToken.symbol
                            : "Select Token"}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {tokens.map((token) => (
                            <Dropdown.Item
                              key={token.symbol}
                              eventKey={token.symbol}
                            >
                              <img
                                src={token.imageUrl}
                                alt={token.symbol}
                                style={{
                                  width: 20,
                                  height: 20,
                                  marginRight: 10,
                                }}
                              />
                              {token.symbol}
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Beneficiary Address</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Please specify the address of the will's beneficiary for token withdrawal."
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Amount</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Please specify the amount of tokens to allocate."
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Button variant="primary" type="submit">
                    Set Allocation
                  </Button>
                </Form>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                <Card.Title
                  className="text-center mb-3"
                  style={{ color: "black" }}
                >
                  Token Availability Date
                </Card.Title>
                <Form onSubmit={setDeadlineHandler}>
                  <Form.Group className="mb-3">
                    <Form.Label>Date and Time</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      placeholder="Select date and time"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Set Deadline
                  </Button>
                </Form>
              </Card.Body>
            </Card>

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

            <WillCards refreshCounter={refreshCounter} />
          </Col>
        </Row>
      </Container>

      {/*
      <h3>Creator Portal</h3>
     
      <h4 style={{ color: "#e056fd" }}>
        How much token control to give DecentraWill?
      </h4>
      <Form onSubmit={handleAllowanceSubmit}>
        <Form.Group>
          <Form.Label>Token Contact Address</Form.Label>
          <InputGroup>
            <Form.Control
              type='text'
              value={tokenContractAddress}
              onChange={(e) => setTokenContractAddress(e.target.value)}
              placeholder='Enter or select a token address'
            />
            <Dropdown onSelect={handleTokenSelect}>
              <Dropdown.Toggle variant='outline-secondary' id='dropdown-basic'>
                {selectedToken ? selectedToken.symbol : 'Select Token'}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {tokens.map((token) => (
                  <Dropdown.Item key={token.symbol} eventKey={token.symbol}>
                    <img
                      src={token.imageUrl}
                      alt={token.symbol}
                      style={{ width: 20, height: 20, marginRight: 10 }}
                    />
                    {token.symbol}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </InputGroup>
          {selectedToken && ( // Show the selected token address if a token is selected
            <Form.Text>
              Selected Token Address: {selectedToken.address}
            </Form.Text>
          )}
        </Form.Group>

        <Form.Group>
          <Form.Label>Allowance Amount</Form.Label>
          <Form.Control
            type='number'
            value={allowanceAmount}
            onChange={(e) => setAllowanceAmount(e.target.value)}
            placeholder='Specify the number of tokens'
          />
        </Form.Group>

        <Button variant='primary' type='submit'>
          Set Allowance
        </Button>
      </Form>
      <br />
      
      <h4 style={{ color: "#e056fd" }}>
        How much tokens should this beneficiary receive?
      </h4>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Token Address</Form.Label>
          <InputGroup>
            <Form.Control
              type='text'
              value={tokenContractAddress}
              onChange={(e) => setTokenContractAddress(e.target.value)}
              placeholder='Enter or select a token address'
            />
            <Dropdown onSelect={handleTokenSelect}>
              <Dropdown.Toggle variant='outline-secondary' id='dropdown-basic'>
                {selectedToken ? selectedToken.symbol : 'Select Token'}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {tokens.map((token) => (
                  <Dropdown.Item key={token.symbol} eventKey={token.symbol}>
                    <img
                      src={token.imageUrl}
                      alt={token.symbol}
                      style={{ width: 20, height: 20, marginRight: 10 }}
                    />
                    {token.symbol}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </InputGroup>
          {selectedToken && ( // Show the selected token address if a token is selected
            <Form.Text>
              Selected Token Address: {selectedToken.address}
            </Form.Text>
          )}
        </Form.Group>

        <Form.Group>
          <Form.Label>Beneficiary Address</Form.Label>
          <Form.Control
            type='text'
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Please specify the address of the will's beneficiary for token withdrawal. For multiple beneficiaries, you will have to set the allocation for each beneficiary separately."
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Amount</Form.Label>
          <Form.Control
            type='number'
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder='Please specify the amount of tokens to allocate to this beneficiary.'
          />
        </Form.Group>

        <Button variant='primary' type='submit'>
          Set Allocation
        </Button>
      </Form>
      <br />
      <h4 style={{ color: '#e056fd' }}>
        At what point should beneficiaries be able to withdraw their tokens?
      </h4>
      
      <Form onSubmit={setDeadlineHandler}>
        <Form.Group>
          <Form.Label>Date and Time</Form.Label>
          <Form.Control
            type='datetime-local'
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            placeholder='Select date and time'
          />
        </Form.Group>
        <Button variant='primary' type='submit'>
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
              console.log('User cancelled the operation.');
            }
          }}
          title='Confirm Allocation'
          message='The allocation amount exceeds your balance. Do you want to proceed?'
        />
      )}
      <br />
      <h4 style={{ color: "#e056fd" }}>Existing Wills</h4>
      <WillCards refreshCounter={refreshCounter} />*/}
    </>
  );
};

export default CreatorHome;
