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

const SignIn = () => {
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
          <Form.Control type='password' placeholder='Password' />
        </Form.Group>
      </Row>

      <Button variant='primary' type='submit'>
        Sign In
      </Button>
    </Form>
  );
};

export default SignIn;
