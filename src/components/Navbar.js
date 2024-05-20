import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { doSignOut } from "../firebase/Auth";
import Nav from "react-bootstrap/Nav";
import { FaGithub, FaEthereum, FaEnvelope } from "react-icons/fa";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Navbar, Container, Row, Col, Form, Button } from "react-bootstrap";
import { WalletContext } from "../contexts/WalletContext";
import { useContext } from "react";
function MainNavbar() {
  const navigate = useNavigate();
  const { isConnected, userAccount, handleWalletAction } =
    useContext(WalletContext);
  const { userLoggedIn } = useAuth();
  return (
    <header>
      <Navbar
        expand="lg"
        className="bg-body-tertiary"
        variant="light"
        style={{ background: "purple" }}
      >
        <Container>
          <Navbar.Brand as={Link} to="/">
            DecentraWill
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/faq">
                FAQ
              </Nav.Link>
              <Nav.Link as={Link} to="/creator">
                Creator Portal
              </Nav.Link>
              <Nav.Link as={Link} to="/beneficiary">
                Beneficiary Portal
              </Nav.Link>
              {userLoggedIn ? (
                <>
                  <Nav.Link as={Link} to="/profile">
                    Profile
                  </Nav.Link>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <Button
                      variant="outline-danger"
                      onClick={() => {
                        doSignOut().then(() => {
                          navigate("/");
                        });
                      }}
                    >
                      Logout
                    </Button>
                    <Button variant="primary" onClick={handleWalletAction}>
                      {isConnected
                        ? `${userAccount.substring(
                            0,
                            6
                          )}...${userAccount.substring(userAccount.length - 4)}`
                        : "Connect Wallet"}
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/createAccount">
                    Create Account
                  </Nav.Link>
                  <Nav.Link as={Link} to="/signIn">
                    Sign In
                  </Nav.Link>
                  <Button variant="primary" onClick={handleWalletAction}>
                    {isConnected
                      ? `${userAccount.substring(
                          0,
                          6
                        )}...${userAccount.substring(userAccount.length - 4)}`
                      : "Connect Wallet"}
                  </Button>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}
function AppNavbar() {
  const navigate = useNavigate();
  const { userLoggedIn } = useAuth();
  return (
    <header>
      <Navbar expand="lg" className="bg-dark text-white py-4">
        <Container>
          <Navbar.Brand href="#" className="text-primary">
            DecentraWill
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {userLoggedIn ? (
                <button
                  onClick={() => {
                    doSignOut().then(() => {
                      navigate("/Home2");
                    });
                  }}
                  className="text-sm text-blue-600 underline"
                >
                  Logout
                </button>
              ) : (
                <div className="flex flex-column">
                  <Nav.Link as={Link} to="/createAccount">
                    Create Account
                  </Nav.Link>
                  <Nav.Link as={Link} to="/signIn">
                    Sign In
                  </Nav.Link>
                </div>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}
function FooterNavbar() {
  return (
    <footer className="bg-dark text-white py-4">
      <Container>
        <Row className="py-4 text-center">
          {/* Smart Contract Section */}
          <Col md={{ span: 4, offset: 0 }} className="mb-3">
            <h5>Smart Contract</h5>
            <p>
              <a
                href="https://amoy.polygonscan.com/address/0xbCE4bC934BeAa8D4a30f830e0f4857272A2508C6"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaEthereum size={30} />
              </a>
            </p>
          </Col>

          {/* GitHub Repository Section */}
          <Col md={{ span: 4, offset: 0 }} className="mb-3">
            <h5>GitHub</h5>
            <p>
              <a
                href="https://github.com/dannychrost/decentrawill"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub size={30} />
              </a>
            </p>
          </Col>

          {/* Contact Us Section */}
          <Col md={{ span: 4, offset: 0 }} className="mb-3">
            <h5>Contact Us</h5>
            <p>
              <a
                href="mailto:decentrawill@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaEnvelope size={30} />
              </a>
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
export { MainNavbar, AppNavbar, FooterNavbar };
