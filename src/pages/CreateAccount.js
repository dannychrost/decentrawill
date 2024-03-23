// Home2.js
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useEffect, useContext, useState } from 'react';
import { NavbarContext } from '../contexts/NavbarContext';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import React from 'react';
import { Nav } from 'react-bootstrap';
import SignIn from './/SignIn';
import '../firebase/Firebase';
import 'firebase/auth';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
// import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';

const CreateAccount = () => {
  const { setHeaderValue } = useContext(NavbarContext);

  useEffect(() => {
    setHeaderValue(0);
  }, [setHeaderValue]);

  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

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
      setPasswordError('Password must be at least 8 characters long');
    } else {
      setPasswordError('');
    }

    return isValidPassword;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validatePassword()) {
      console.log('Form submitted with password:', password);
    }
  };

  const isSubmitDisabled = password.length < 8;

  return (
    <Form onSubmit={handleSubmitFireBase}>
      <Row className='mb-3'>
        <Form.Group as={Col} controlId='formGridEmail'>
          <Form.Label>Email</Form.Label>
          <Form.Control type='email' placeholder='Enter email' />
        </Form.Group>
      </Row>
      <Row className='mb-3'>
        <Form.Group as={Col} controlId='formGridPassword'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Password'
            value={password}
            onChange={handlePasswordChange}
            onBlur={validatePassword} // Validate on blur
            isInvalid={!!passwordError} // Here, if passwordError is a non-empty string, it will make the form control invalid
          />
          <Form.Control.Feedback type='invalid'>
            {passwordError}
          </Form.Control.Feedback>
        </Form.Group>
      </Row>

      <Button variant='primary' type='submit'>
        Create Account
      </Button>

      <Nav>
        <Nav.Link href='/signIn'>Already Have an Account</Nav.Link>
      </Nav>
    </Form>
  );
};

export default CreateAccount;
