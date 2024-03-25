// Home2.js
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Link,
  useNavigate,
} from "react-router-dom";
import { useEffect, useContext, useState } from "react";
import { NavbarContext } from "../contexts/NavbarContext";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import React from "react";
import { Nav } from "react-bootstrap";
import SignIn from ".//SignIn";
import "../firebase/Firebase";
import "firebase/auth";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

import { useAuth } from "../contexts/AuthContext";
import { doCreateUserWithEmailAndPassword } from "../firebase/Auth";
// import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';

const CreateAccount = () => {
  const { setHeaderValue } = useContext(NavbarContext);
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { userLoggedIn } = useAuth();
  const [email, setEmail] = useState("");
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
  useEffect(() => {
    setHeaderValue(0);
  }, [setHeaderValue]);
  useEffect(() => {
    if (userLoggedIn) {
      navigate("/home"); // Or the path you wish to redirect to after successful login
    }
  }, [userLoggedIn, navigate]);

  // const handleSubmitFireBase = async (event) => {
  //   event.preventDefault();
  //   try {
  //     const email = event.target.elements.email.value;
  //     const password = event.target.elements.password.value;
  //     // Sign up the user with email and password
  //     //await firebase.auth().createUserWithEmailAndPassword(email, password);
  //     console.log('User signed up successfully');
  //   } catch (error) {
  //     console.error('Error signing up:', error.message);
  //   }
  // };

  const handleSubmitFireBase = (event) => {
    const auth = getAuth();
    const email = event.target.elements.email.value;
    const password = event.target.elements.password.value;
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  };

  const validatePassword = () => {
    const isValidPassword = password.length >= 8; // Check if password length is at least 8 characters
    // More password requirements
    if (!isValidPassword) {
      setPasswordError("Password must be at least 8 characters long");
    } else {
      setPasswordError("");
    }

    return isValidPassword;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validatePassword()) {
      console.log("Form submitted with password:", password);
    }
  };

  const isSubmitDisabled = password.length < 8;
  const handleRegistration = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }
    if (!isRegistering) {
      setIsRegistering(true);
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          navigate("/appHome"); // Or wherever you want to navigate after successful registration
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setErrorMessage(errorMessage);
          setIsRegistering(false);
        });
    }
  };
  return (
    <>
      <Form onSubmit={handleRegistration}>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isRegistering}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formGridConfirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isRegistering}
            />
          </Form.Group>
        </Row>

        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

        <Button variant="primary" type="submit" disabled={isRegistering}>
          {isRegistering ? "Signing Up..." : "Create Account"}
        </Button>
      </Form>

      <Nav>
        <Nav.Link href="/signIn">Already Have an Account</Nav.Link>
      </Nav>
    </>
  );
};
export default CreateAccount;
