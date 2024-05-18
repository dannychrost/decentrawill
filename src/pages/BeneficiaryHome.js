import React, { useState } from "react";
import { Form, Button, Col, Row, Card, InputGroup } from "react-bootstrap";

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
    name: "USD Coin",
    address: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512", // Adding the address
  },
  {
    symbol: "wETH",
    imageUrl:
      "https://dynamic-assets.coinbase.com/dbb4b4983bde81309ddab83eb598358eb44375b930b94687ebe38bc22e52c3b2125258ffb8477a5ef22e33d6bd72e32a506c391caa13af64c00e46613c3e5806/asset_icons/4113b082d21cc5fab17fc8f2d19fb996165bcce635e6900f7fc2d57c4ef33ae9.png",
    name: "Ethereum",
    address: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0", // Adding the address
  },
  {
    symbol: "wBTC",
    imageUrl:
      "https://dynamic-assets.coinbase.com/e785e0181f1a23a30d9476038d9be91e9f6c63959b538eabbc51a1abc8898940383291eede695c3b8dfaa1829a9b57f5a2d0a16b0523580346c6b8fab67af14b/asset_icons/b57ac673f06a4b0338a596817eb0a50ce16e2059f327dc117744449a47915cb2.png",
    name: "Bitcoin",
    address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", // Adding the address
  },
];

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

const BeneficiaryWills = ({ refreshCounter }) => {
  const [beneficiaryWills, setBeneficiaryWills] = useState([]);
  const { contract, userAccount, walletProvider, isConnected } =
    useContext(WalletContext);

  useEffect(() => {
    const fetchBeneficiaryWills = async () => {
      if (!userAccount || !contract || !isConnected) {
        setBeneficiaryWills([]); // Reset the beneficiary wills if the user is not connected
        return;
      }

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
  }, [userAccount, contract, isConnected, refreshCounter]);

  return (
    <>
      <Card className="mb-4">
        <Card.Body>
          <Card.Title className="text-center mb-3">
            Token Allocations
          </Card.Title>
          {beneficiaryWills.length > 0 ? (
            <Row xs={1} md={3} className="g-4">
              {beneficiaryWills.map((will, idx) => (
                <Col key={idx}>
                  <Card>
                    <Card.Header as="h5" className="text-center">
                      Will Details
                    </Card.Header>
                    <Card.Body>
                      <Card.Subtitle>Token Address:</Card.Subtitle>
                      <Card.Text>{will.token}</Card.Text>

                      <Card.Subtitle>Creator Address:</Card.Subtitle>
                      <Card.Text>{will.creator}</Card.Text>

                      <Card.Subtitle>Amount:</Card.Subtitle>
                      <Card.Text>{will.amount} Tokens</Card.Text>

                      <Card.Subtitle>Deadline:</Card.Subtitle>
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
          ) : (
            <Row>
              <Col>
                <div className="alert alert-info text-center" role="alert">
                  You are currently not listed as a beneficiary in any wills.
                </div>
              </Col>
            </Row>
          )}
        </Card.Body>
      </Card>
      {/*
    <div>
      {beneficiaryWills.length > 0 ? (
        <Row xs={1} md={3} className="g-4">
          {beneficiaryWills.map((will, idx) => (
            <Col key={idx}>
              <Card>
                <Card.Header as="h5">Will Details</Card.Header>
                <Card.Body>
                  <Card.Subtitle>Token Address: </Card.Subtitle>
                  <Card.Text>{will.token}</Card.Text>
                  <Card.Subtitle>Creator Address: </Card.Subtitle>
                  <Card.Text>{will.creator}</Card.Text>
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
      ) : (
        <div className="alert alert-info" role="alert">
          You are currently not listed as a beneficiary in any wills.
        </div>
      )}
    </div>*/}
    </>
  );
};

const BeneficiaryHome = () => {
  // The following code is for the beneficiary portal
  const [refreshCounter, setRefreshCounter] = useState(0);
  const {
    isConnected,
    userAccount,

    contract,
  } = useContext(WalletContext);

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
      setRefreshCounter((prev) => prev + 1);
      alert("Tokens withdrawn successfully!");
    } catch (error) {
      // Check if the error is due to user rejection
      if (error.code === 4001) {
        alert("Transaction was cancelled by the user.");
        return;
      }
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

  return (
    <>
      <Container className="">
        <Row className="justify-content-center">
          <Col md={8}>
            <h3 className="text-center mb-4">Beneficiary Portal</h3>

            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <Card.Title className="text-center mb-3">
                  Withdraw Tokens
                </Card.Title>
                <Form onSubmit={handleWithdrawSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Creator Address</Form.Label>
                    <Form.Control
                      type="text"
                      value={creator}
                      placeholder="Enter creator's wallet address"
                      onChange={(e) => setCreator(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Token Address</Form.Label>
                    <Form.Control
                      type="text"
                      value={withdrawalToken}
                      placeholder="Enter token address"
                      onChange={(e) => setWithdrawalToken(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Amount</Form.Label>
                    <Form.Control
                      type="number"
                      value={withdrawalAmount}
                      placeholder="Amount to withdraw"
                      onChange={(e) => setWithdrawalAmount(e.target.value)}
                    />
                  </Form.Group>

                  <Button variant="primary" type="submit" block>
                    Withdraw
                  </Button>
                </Form>
              </Card.Body>
            </Card>

            <br />

            <BeneficiaryWills refreshCounter={refreshCounter} />
          </Col>
        </Row>
      </Container>
      {/*
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
      <BeneficiaryWills />*/}
    </>
  );
};

export default BeneficiaryHome;
