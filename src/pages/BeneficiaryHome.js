import React, { useState, useEffect, useContext } from 'react';
import { Form, Button, Col, Row, Card, Container } from 'react-bootstrap';
import { WalletContext } from '../contexts/WalletContext';
import { ethers } from 'ethers';

const tokens = [
  {
    symbol: 'mUSDC',
    imageUrl:
      'https://dynamic-assets.coinbase.com/3c15df5e2ac7d4abbe9499ed9335041f00c620f28e8de2f93474a9f432058742cdf4674bd43f309e69778a26969372310135be97eb183d91c492154176d455b8/asset_icons/9d67b728b6c8f457717154b3a35f9ddc702eae7e76c4684ee39302c4d7fd0bb8.png',
    name: 'USD Coin',
    address: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
  },
  {
    symbol: 'wETH',
    imageUrl:
      'https://dynamic-assets.coinbase.com/dbb4b4983bde81309ddab83eb598358eb44375b930b94687ebe38bc22e52c3b2125258ffb8477a5ef22e33d6bd72e32a506c391caa13af64c00e46613c3e5806/asset_icons/4113b082d21cc5fab17fc8f2d19fb996165bcce635e6900f7fc2d57c4ef33ae9.png',
    name: 'Ethereum',
    address: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
  },
  {
    symbol: 'wBTC',
    imageUrl:
      'https://dynamic-assets.coinbase.com/e785e0181f1a23a30d9476038d9be91e9f6c63959b538eabbc51a1abc8898940383291eede695c3b8dfaa1829a9b57f5a2d0a16b0523580346c6b8fab67af14b/asset_icons/b57ac673f06a4b0338a596817eb0a50ce16e2059f327dc117744449a47915cb2.png',
    name: 'Bitcoin',
    address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
  },
];

function unixToEasternTime(unixTimestamp) {
  if (unixTimestamp === 0) return 0;
  const date = new Date(unixTimestamp * 1000);
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'America/New_York',
    timeZoneName: 'short',
  };
  return date.toLocaleString('en-US', options);
}

const BeneficiaryWills = ({ refreshCounter, onWillSelect }) => {
  const [beneficiaryWills, setBeneficiaryWills] = useState([]);
  const { contract, userAccount, isConnected } = useContext(WalletContext);

  useEffect(() => {
    const fetchBeneficiaryWills = async () => {
      if (!userAccount || !contract || !isConnected) {
        setBeneficiaryWills([]);
        return;
      }

      try {
        let creators = [];
        let index = 0;
        let errorOccurred = false;

        while (!errorOccurred) {
          try {
            const creatorAddress = await contract.creatorsForBeneficiary(
              ethers.getAddress(userAccount),
              index
            );
            creators.push(creatorAddress);
            index++;
          } catch (error) {
            errorOccurred = true;
          }
        }

        const willsData = [];
        for (const creator of creators) {
          const tokens = await contract.getAllocatedTokensByUser(creator);
          for (const token of tokens) {
            const amount = await contract.tokenAllocations(
              creator,
              token,
              userAccount
            );
            const tempDeadline = await contract.creatorDeadlines(creator);
            if (amount > 0) {
              willsData.push({
                creator,
                token,
                amount: ethers.formatEther(amount),
                creatorDeadline: unixToEasternTime(
                  ethers.formatUnits(tempDeadline, 'wei')
                ),
              });
            }
          }
        }
        setBeneficiaryWills(willsData);
      } catch (error) {
        console.error('Error fetching beneficiary wills:', error);
      }
    };

    fetchBeneficiaryWills();
  }, [userAccount, contract, isConnected, refreshCounter]);

  return (
    <Card className='mb-4'>
      <Card.Body>
        <Card.Title className='text-center mb-3'>Token Allocations</Card.Title>
        {beneficiaryWills.length > 0 ? (
          <Row xs={1} md={3} className='g-4'>
            {beneficiaryWills.map((will, idx) => (
              <Col key={idx}>
                <Card onClick={() => onWillSelect(will)}>
                  <Card.Header as='h5' className='text-center'>
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
                      {will.creatorDeadline === 0
                        ? 'Not set yet'
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
              <div className='alert alert-info text-center' role='alert'>
                You are currently not listed as a beneficiary in any wills.
              </div>
            </Col>
          </Row>
        )}
      </Card.Body>
    </Card>
  );
};

const BeneficiaryHome = () => {
  const [refreshCounter, setRefreshCounter] = useState(0);
  const { isConnected, userAccount, contract } = useContext(WalletContext);

  useEffect(() => {
    if (isConnected && contract) {
      console.log('We are connected to wallet');
      owner();
      console.log(userAccount);
    }
  }, [isConnected]);

  async function owner() {
    const tx = await contract.owner();
    console.log(tx);
  }

  const [creator, setCreator] = useState('');
  const [withdrawalToken, setWithdrawalToken] = useState('');
  const [withdrawalAmount, setWithdrawalAmount] = useState('');

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
      alert('Tokens withdrawn successfully!');
    } catch (error) {
      if (error.code === 4001) {
        alert('Transaction was cancelled by the user.');
        return;
      }
      let tempDeadline = await contract.creatorDeadlines(creator);
      tempDeadline = ethers.formatUnits(tempDeadline, 'wei');
      tempDeadline = parseInt(tempDeadline);

      if (tempDeadline === 0) {
        alert('The creator has not set a deadline for the withdrawal yet.');
      } else if (tempDeadline > Math.floor(Date.now() / 1000)) {
        alert('You may not withdraw yet.');
      } else {
        console.error('An error occurred:', error);
      }
    }
  };

  const handleWillSelect = (will) => {
    setCreator(will.creator);
    setWithdrawalToken(will.token);
    setWithdrawalAmount(will.amount);
  };

  return (
    <>
      <Container>
        <Row className='justify-content-center'>
          <Col md={8}>
            <h3 className='text-center mb-4'>Beneficiary Portal</h3>

            <Card className='mb-4 shadow-sm'>
              <Card.Body>
                <Card.Title className='text-center mb-3'>
                  Withdraw Tokens
                </Card.Title>
                <Form onSubmit={handleWithdrawSubmit}>
                  <Form.Group className='mb-3'>
                    <Form.Label>Creator Address</Form.Label>
                    <Form.Control
                      type='text'
                      value={creator}
                      placeholder="Enter creator's wallet address"
                      onChange={(e) => setCreator(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className='mb-3'>
                    <Form.Label>Token Address</Form.Label>
                    <Form.Control
                      type='text'
                      value={withdrawalToken}
                      placeholder='Enter token address'
                      onChange={(e) => setWithdrawalToken(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className='mb-3'>
                    <Form.Label>Amount</Form.Label>
                    <Form.Control
                      type='number'
                      value={withdrawalAmount}
                      placeholder='Amount to withdraw'
                      onChange={(e) => setWithdrawalAmount(e.target.value)}
                    />
                  </Form.Group>

                  <Button variant='primary' type='submit' block>
                    Withdraw
                  </Button>
                </Form>
              </Card.Body>
            </Card>

            <BeneficiaryWills
              refreshCounter={refreshCounter}
              onWillSelect={handleWillSelect}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default BeneficiaryHome;
