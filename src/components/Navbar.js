import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { doSignOut } from "../firebase/Auth";
import Nav from "react-bootstrap/Nav";

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
              {userLoggedIn ? (
                <div>
                  <button
                    onClick={() => {
                      doSignOut().then(() => {
                        navigate("/");
                      });
                    }}
                    className="text-sm text-blue-600 underline"
                  >
                    Logout
                  </button>
                  <Button variant="primary" onClick={handleWalletAction}>
                    {isConnected
                      ? `${userAccount.substring(
                          0,
                          6
                        )}...${userAccount.substring(userAccount.length - 4)}`
                      : "Connect Wallet"}
                  </Button>
                </div>
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
      {" "}
      {/* Add some margin top */}
      <Container>
        <Row className="py-4">
          {" "}
          {/* Add some padding */}
          {/* Subscribe Section */}
          <Col md={{ span: 4, offset: 0 }}>
            {" "}
            {/* Medium devices and up take half width, add margin bottom */}
            <h5>Sign up for updates</h5>
            <Form>
              <Form.Group controlId="formBasicEmail">
                <Form.Control type="email" placeholder="Enter email" />
              </Form.Group>
              <Button variant="primary" type="submit">
                Subscribe
              </Button>
            </Form>
          </Col>
          {/* Contact Us Section */}
          <Col md={{ span: 4, offset: 2 }}>
            {" "}
            {/* Medium devices and up take half width, add margin bottom */}
            <h5>Contact us</h5>
            <p>
              123 Main Street
              <br />
              City, State ZIP
              <br />
              Phone: 123-456-7890
              <br />
              Email: info@example.com
            </p>
          </Col>
          <Col md={{ span: 2, offset: 0 }}>
            {" "}
            {/* Medium devices and up take half width, add margin bottom */}
            <h5>Links</h5>
            <p>
              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png"
                  alt="LinkedIn Logo"
                  style={{ width: "30px", height: "30px" }}
                />
              </a>
              <br />
              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/768px-Instagram_icon.png"
                    alt="Instagram Logo"
                    style={{
                      width: "30px",
                      height: "30px",
                      marginRight: "10px",
                    }}
                  />
                </a>
              </a>
              <br />
              <a
                href="mailto:youremail@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg"
                  alt="Gmail Logo"
                  style={{ width: "30px", height: "30px" }}
                />
              </a>
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
export { MainNavbar, AppNavbar, FooterNavbar };
