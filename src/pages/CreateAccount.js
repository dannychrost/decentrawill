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

const CreateAccount = () => {
  const { setHeaderValue } = useContext(NavbarContext);

  useEffect(() => {
    setHeaderValue(0);
  }, [setHeaderValue]);

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const validateEmail = () => {
    const isValid = /\S+@\S+\.\S+/.test(email); // Basic email format check
    const endsWithCom = /\.com$/.test(email);
    const endsWithEdu = /\.edu$/.test(email); // this validation didnt work
    if (!isValid && endsWithCom) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
    return isValid;
  };

  const handleSubmitEmail = (event) => {
    event.preventDefault();
    if (validateEmail()) {
      console.log('Form submitted with email:', email);
    }
  };

  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const validatePassword = () => {
    const isValidPassword = password.length >= 8; // Check if password length is at least 8 characters

    if (!isValidPassword) {
      setPasswordError('Password must be at least 8 characters long');
    } else {
      setPasswordError('');
    }

    return isValidPassword;
  };

  const handleSubmitPass = (event) => {
    event.preventDefault();
    if (validatePassword()) {
      console.log('Form submitted with password:', password);
    }
  };
  return (
    <Form>
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
            isInvalid={!!passwordError}
          />
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
