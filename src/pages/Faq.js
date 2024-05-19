// Faq.js
import { useEffect, useContext } from 'react';
import { NavbarContext } from '../contexts/NavbarContext';
import { Container, Row, Col, Accordion } from 'react-bootstrap';

const Faq = () => {
  const { setHeaderValue } = useContext(NavbarContext);

  useEffect(() => {
    setHeaderValue(0);
  }, [setHeaderValue]);

  return (
    <Container>
      <Row>
        <Col className='text-center'>
          <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>
            Frequently Asked Questions
          </h1>
          <Accordion defaultActiveKey='0'>
            <Accordion.Item eventKey='0'>
              <Accordion.Header>
                What is the purpose of this project?
              </Accordion.Header>
              <Accordion.Body>
                The purpose of this project is to provide a decentralized
                platform for creating and managing digital wills. It allows
                users to securely store and distribute their digital assets,
                ensuring that their wishes are carried out after their passing.
                By leveraging blockchain technology, this project aims to
                provide transparency, immutability, and trust in the execution
                of wills.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey='1'>
              <Accordion.Header>
                What network does Decentrawill use?
              </Accordion.Header>
              <Accordion.Body>Polygon's Amoy Testnet</Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey='2'>
              <Accordion.Header>
                What is Decentrawill's contract address?
              </Accordion.Header>
              <Accordion.Body>
                <a
                  href='https://amoy.polygonscan.com/address/0xbCE4bC934BeAa8D4a30f830e0f4857272A2508C6'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  0xbCE4bC934BeAa8D4a30f830e0f4857272A2508C6
                </a>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey='3'>
              <Accordion.Header>
                Where can I view the source code?
              </Accordion.Header>
              <Accordion.Body>
                You can view the source code of our project on{' '}
                <a
                  href='https://github.com/dannychrost/decentrawill'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  GitHub
                </a>
                .
                <br />
                Additionally, you can also view the smart contract's code on{' '}
                <a
                  href='https://amoy.polygonscan.com/address/0xbCE4bC934BeAa8D4a30f830e0f4857272A2508C6#code'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  PolygonScan
                </a>
                .
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey='4'>
              <Accordion.Header>
                Who are the creators behind the project?
              </Accordion.Header>
              <Accordion.Body>
                The project was initiated and developed by{' '}
                <a
                  href='https://www.linkedin.com/in/daniel-chrostowski/'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Daniel Chrostowski
                </a>{' '}
                and{' '}
                <a
                  href='https://www.linkedin.com/in/jassem-j-03037b228/'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Jassem Jahangir
                </a>
                , who are senior students specializing in Computer Science at
                Hunter College, as a requirement for their Capstone Class.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey='5'>
              <Accordion.Header>
                Why does this project surpass other decentralized will
                initiatives?
              </Accordion.Header>
              <Accordion.Body>
                This platform distinguishes itself in the realm of decentralized
                wills through its unparalleled versatility. It is engineered to
                accommodate any token that conforms to the ERC20 standard,
                utilizing OpenZeppelin's IERC20.sol interface to ensure broad
                compatibility.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey='6'>
              <Accordion.Header>Is the contract audited?</Accordion.Header>
              <Accordion.Body>
                No, the contract has not been audited. Please use our site at
                your own risk.
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
      </Row>
    </Container>
  );
};

export default Faq;
