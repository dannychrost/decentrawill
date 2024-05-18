// Home2.js
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate,
} from "react-router-dom";
import { useEffect, useContext, useState } from "react";
import { NavbarContext } from "../contexts/NavbarContext";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { Button, Container, Card } from "react-bootstrap";
import { Nav } from "react-bootstrap";
import React from "react";
import "./SignIn.css";
import {
  doSignInWithEmailAndPassword,
  doSignInWithGoogle,
  doPasswordReset,
  doConfirmPasswordReset,
} from "../firebase/Auth";
import { useAuth } from "../contexts/AuthContext";

export default function SignIn() {
  const { userLoggedIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();

    await doSignInWithEmailAndPassword(email, password).catch((error) => {
      alert("Invalid credentials!");
      setErrorMessage(error.message);
    });
    //doSendEmailVerification()
  };

  const onGoogleSignIn = (e) => {
    e.preventDefault();

    doSignInWithGoogle().catch((err) => {});
  };
  const handlePasswordReset = (e) => {
    e.preventDefault();
    if (email) {
      // Ensure there's an email to send reset instructions to
      doPasswordReset(email)
        .then(() => {
          alert("Password reset email sent. Please check your inbox.");
        })
        .catch((error) => {
          setErrorMessage(error.message);
        });
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-80">
      {userLoggedIn && <Navigate to={"/appHome"} replace={true} />}

      <Card style={{ width: "24rem" }}>
        <Card.Body>
          <Card.Title>Welcome Back</Card.Title>
          <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            {errorMessage && (
              <div className="mb-3 text-danger">{errorMessage}</div>
            )}

            <Button variant="primary" type="submit" className="me-2">
              Sign In
            </Button>
            <Button
              variant="link"
              onClick={handlePasswordReset}
              disabled={!email}
            >
              Forgot Password?
            </Button>
          </Form>
          <Card.Text className="mt-3">
            Don't have an account? <Link to={"/createAccount"}>Sign up</Link>
          </Card.Text>
          <Button
            variant="outline-primary"
            className="text-left"
            style={{ width: "100%" }}
            onClick={(e) => onGoogleSignIn(e)}
          >
            <div className="d-flex align-items-center">
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                style={{
                  display: "block",
                  width: 24,
                  height: 24,
                  marginRight: 10,
                }}
              >
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                ></path>
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                ></path>
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                ></path>
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                ></path>
                <path fill="none" d="M0 0h48v48H0z"></path>
              </svg>
              Sign in with Google
            </div>
          </Button>
        </Card.Body>
      </Card>
      {/*
    <div>
      {userLoggedIn && <Navigate to={"/appHome"} replace={true} />}

      <div>
        <div>
          <div>
            <div>
              <h3>Welcome Back</h3>
            </div>
          </div>
          <form onSubmit={onSubmit}>
            <div>
              <label>Email</label>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>

            <div>
              <label>Password</label>
              <input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>

            {errorMessage && <span>{errorMessage}</span>}

            <button type="submit">Sign In</button>
            <button onClick={handlePasswordReset} disabled={!email}>
              Forgot Password?
            </button>
          </form>
          <p>
            Don't have an account? <Link to={"/createAccount"}>Sign up</Link>
          </p>

          <button
            onClick={(e) => {
              onGoogleSignIn(e);
            }}
            className="gsi-material-button"
          >
            <div className="gsi-material-button-state"></div>
            <div className="gsi-material-button-content-wrapper">
              <div className="gsi-material-button-icon">
                <svg
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  style={{ display: "block" }}
                >
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                  ></path>
                  <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                  ></path>
                  <path
                    fill="#FBBC05"
                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                  ></path>
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                  ></path>
                  <path fill="none" d="M0 0h48v48H0z"></path>
                </svg>
              </div>
              <span className="gsi-material-button-contents">
                Sign in with Google
              </span>
              <span style={{ display: "none" }}>Sign in with Google</span>
            </div>
            Continue with Google
          </button>
        </div>
      </div>
    </div>*/}
    </Container>
  );
}

{
  /*
const SignIn = () => {
  return (
    <div>
      <Form>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="Enter email" />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" />
          </Form.Group>
        </Row>

        <Button variant="primary" type="submit">
          Sign In
        </Button>
      </Form>
    </div>
  );
};*/
}
