// Home.js
import { useEffect, useContext } from "react";
import { NavbarContext } from "../contexts/NavbarContext";
import logo from "./logo512.png";
import {
  Container,
  Row,
  Col,
  Button,
  Stack,
  Card,
  Image,
} from "react-bootstrap";
import {
  FaLock,
  FaFileAlt,
  FaGlobe,
  FaDollarSign,
  FaCheck,
  FaUsers,
  FaClock,
  FaSignInAlt,
  FaEnvelope,
  FaEye,
} from "react-icons/fa";

const cardStyle = {
  minHeight: "220px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
};

const cardBodyStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  height: "100%",
};

const Home = () => {
  const { setHeaderValue } = useContext(NavbarContext);

  useEffect(() => {
    setHeaderValue(0);
  }, [setHeaderValue]);

  return (
    <>
      <Stack gap={5}>
        <Container fluid className="text-center py-5 text-white">
          <Image
            src={logo}
            alt="DecentraWill Logo"
            className="mb-4"
            style={{
              width: "200px",
              border: "5px solid white",
              borderRadius: "15px",
              padding: "5px",
            }}
          />
          <h1>
            Create your Decentralized Will with Crypto and Blockchain Today!
          </h1>
          <p className="lead">Secure, Immutable, Accessible from Anywhere.</p>
        </Container>

        <Container className="text-center my-5">
          <h2 className="mb-4">Why Choose a Decentralized Will?</h2>
          <Row>
            <Col md={3}>
              <Card className="mb-4" style={cardStyle}>
                <Card.Body style={cardBodyStyle}>
                  <FaLock size={40} className="mb-3" />
                  <Card.Title>Security and Privacy</Card.Title>
                  <Card.Text>
                    Blockchain technology ensures your assets and information
                    remain secure.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="mb-4" style={cardStyle}>
                <Card.Body style={cardBodyStyle}>
                  <FaFileAlt size={40} className="mb-3" />
                  <Card.Title>Immutable Records</Card.Title>
                  <Card.Text>
                    Enjoy peace of mind with tamper-proof records.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="mb-4" style={cardStyle}>
                <Card.Body style={cardBodyStyle}>
                  <FaGlobe size={40} className="mb-3" />
                  <Card.Title>Global Accessibility</Card.Title>
                  <Card.Text>
                    Access your will from anywhere in the world.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="mb-4" style={cardStyle}>
                <Card.Body style={cardBodyStyle}>
                  <FaDollarSign size={40} className="mb-3" />
                  <Card.Title>Cost-Efficiency</Card.Title>
                  <Card.Text>
                    Save on fees and costs associated with traditional wills.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>

        <Container fluid className="py-5">
          <Container className="text-center">
            <h2 className="mb-4">How It Works for Creators</h2>
            <Row>
              <Col md={3}>
                <Card className="mb-4" style={cardStyle}>
                  <Card.Body style={cardBodyStyle}>
                    <FaSignInAlt size={40} className="mb-3" />
                    <Card.Title>Step 1: Sign In/Register</Card.Title>
                    <Card.Text>
                      Sign in or register to receive notifications about your
                      will’s deadlines.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="mb-4" style={cardStyle}>
                  <Card.Body style={cardBodyStyle}>
                    <FaCheck size={40} className="mb-3" />
                    <Card.Title>Step 2: Approve Tokens</Card.Title>
                    <Card.Text>
                      Connect your wallet and approve the tokens you want to
                      include in your will.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="mb-4" style={cardStyle}>
                  <Card.Body style={cardBodyStyle}>
                    <FaUsers size={40} className="mb-3" />
                    <Card.Title>Step 3: Set Allocations</Card.Title>
                    <Card.Text>
                      Specify the allocations for each token and designate the
                      beneficiaries.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="mb-4" style={cardStyle}>
                  <Card.Body style={cardBodyStyle}>
                    <FaClock size={40} className="mb-3" />
                    <Card.Title>Step 4: Set Deadline</Card.Title>
                    <Card.Text>
                      Set a deadline after which beneficiaries can withdraw the
                      tokens. Adjust the deadline if needed before it arrives.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </Container>

        <Container fluid className="py-5">
          <Container className="text-center">
            <h2 className="mb-4">How It Works for Beneficiaries</h2>
            <Row>
              <Col md={6}>
                <Card className="mb-4" style={cardStyle}>
                  <Card.Body style={cardBodyStyle}>
                    <FaEnvelope size={40} className="mb-3" />
                    <Card.Title>Email Notification</Card.Title>
                    <Card.Text>
                      Beneficiaries will receive an email once the funds are
                      available for withdrawal.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="mb-4" style={cardStyle}>
                  <Card.Body style={cardBodyStyle}>
                    <FaEye size={40} className="mb-3" />
                    <Card.Title>View Wills</Card.Title>
                    <Card.Text>
                      Beneficiaries can view the wills they are part of before
                      withdrawing.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </Container>

        <Container className="text-center my-5">
          <Row>
            <Col>
              <Button
                href="/signIn"
                variant="primary"
                size="lg"
                className="mr-2"
              >
                Create Will
              </Button>
            </Col>
          </Row>
        </Container>
      </Stack>
    </>
  );
};

export default Home;
