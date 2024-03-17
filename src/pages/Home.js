// Home.js
import { useEffect, useContext } from 'react';
import { NavbarContext } from '../contexts/NavbarContext';
import { Container } from 'react-bootstrap';
import Stack from 'react-bootstrap/Stack';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

const Home = () => {
  const { setHeaderValue } = useContext(NavbarContext);

  useEffect(() => {
    setHeaderValue(0);
  }, [setHeaderValue]);

  return (
    <>
      <Stack gap={5}>
        <h1>
          Create your Decentralized Will with Crypto and Blockchain Today!
        </h1>
        <Container>
          <Row>
            <Col>Created Wills</Col>
            <Col>Distibuted Assets</Col>
          </Row>
          <Row>
            <Col># of Wills</Col>
            <Col>$ of Assets</Col>
          </Row>
        </Container>

        <Container style={{ marginBottom: '150px' }}>
          <Row>
            <Col sm={6} style={{ marginBottom: '20px' }}>
              <Button href='/signIn' variant='primary'>
                Create Will
              </Button>{' '}
            </Col>
            <Col sm={-1}>
              <Button variant='outline-primary'>Buy Tokens</Button>{' '}
            </Col>
          </Row>
        </Container>

        <header className='bg-transparent text-primary py-4'>
          <div className='container text-center'>
            <h1 className='display-4'>How does it work?</h1>
          </div>
        </header>

        <Container>
          <Row>
            <Col xs={6} md={4}>
              Connect Wallet and Add Tokens
            </Col>
            <Col xs={6} md={4}>
              Create Will
            </Col>
            <Col xs={6} md={4}>
              If client has not confirmed status smart contract executes
            </Col>
          </Row>
        </Container>
      </Stack>
    </>
  );
};

export default Home;
