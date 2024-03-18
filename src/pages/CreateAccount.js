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

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validatePassword()) {
      console.log('Form submitted with password:', password);
    }
  };

  const isSubmitDisabled = password.length < 8;

  return (
    <Form>
      <Row className='mb-3'>
        <Form.Group as={Col} controlId='formGridEmail'>
          <Form.Label>Email</Form.Label>
          <Form.Control type='email' placeholder='Enter email' />
        </Form.Group>
      </Row>
      <Row className='mb-3'>
        <Form.Group className='mb-3' controlId='formBasicPassword'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Password'
            value={password}
            onChange={handlePasswordChange}
            onBlur={validatePassword} // Validate on blur
            isInvalid={!!passwordError} // Set isInvalid to true if passwordError is not empty
          />
          <Form.Control.Feedback type='invalid'>
            {passwordError}
          </Form.Control.Feedback>
          {password.length > 0 && password.length < 8 && (
            <Form.Text className='text-danger'>
              Password must be at least 8 characters long
            </Form.Text>
          )}
        </Form.Group>
      </Row>

      <Button variant='primary' type='submit' disabled={isSubmitDisabled}>
        Submit
      </Button>

      <Nav>
        <Nav.Link href='/signIn'>Already Have an Account</Nav.Link>
      </Nav>
    </Form>
  );
};

export default CreateAccount;
