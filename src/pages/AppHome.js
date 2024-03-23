import React, { useState } from 'react';
import { Form, Button, Col, Row, InputGroup } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

const AppHome = () => {
  const [successorRows, setSuccessorRows] = useState([{ id: 1 }]);
  const [trusteeRows, setTrusteeRows] = useState([{ id: 1 }]);

  const addSuccessorRow = () => {
    if (successorRows.length < 3) {
      const newId = successorRows.length + 1;
      setSuccessorRows([...successorRows, { id: newId }]);
    }
  };

  const addTrusteeRow = () => {
    if (trusteeRows.length < 3) {
      const newId = trusteeRows.length + 1;
      setTrusteeRows([...trusteeRows, { id: newId }]);
    }
  };

  return (
    <Form>
      <Form.Group className='mb-3 text-center' controlId='testamentName'>
        <Form.Label>Testament Name</Form.Label>
        <Row className='justify-content-center'>
          <Col xs={5}>
            <Form.Control type='email' placeholder='Enter Testament name' />
          </Col>
        </Row>
      </Form.Group>

      <Form.Group className='mb-3 text-center' controlId='successor'>
        <Form.Label>Enter Successor</Form.Label>
        <Row className='justify-content-center'>
          <Form.Text className='text-primary'>Min 1, Max 3</Form.Text>
        </Row>
        {successorRows.map((row) => (
          <React.Fragment key={row.id}>
            <Row className='justify-content-center'>
              <Col xs={5}>
                <Form.Control placeholder='Successor' />
              </Col>
            </Row>
            <Row className='justify-content-center'>
              <Col xs={5}>
                <Form.Control type='email' placeholder='Successor Email' />
              </Col>
            </Row>
          </React.Fragment>
        ))}
        {successorRows.length < 3 && (
          <Row className='justify-content-center'>
            <Button variant='primary' onClick={addSuccessorRow}>
              Add Successor
            </Button>
          </Row>
        )}
      </Form.Group>

      <Form.Group className='mb-3 text-center' controlId='trustee'>
        <Form.Label>Enter Trustee</Form.Label>
        <Row className='justify-content-center'>
          <Form.Text className='text-primary'>Min 1, Max 3</Form.Text>
        </Row>
        {trusteeRows.map((row) => (
          <React.Fragment key={row.id}>
            <Row className='justify-content-center'>
              <Col xs={5}>
                <Form.Control placeholder='Trustee' />
              </Col>
            </Row>
            <Row className='justify-content-center'>
              <Col xs={5}>
                <Form.Control type='email' placeholder='Trustee Email' />
              </Col>
            </Row>
          </React.Fragment>
        ))}
        {trusteeRows.length < 3 && (
          <Row className='justify-content-center'>
            <Button variant='primary' onClick={addTrusteeRow}>
              Add Trustee
            </Button>
          </Row>
        )}
      </Form.Group>

      <Form.Group className='mb-3' controlId='testamentName'>
        <Form.Label>Set Up A Quorum</Form.Label>
        <Row>
          <Col sm={2}>
            <InputGroup size='sm' className='mb-3'>
              <InputGroup.Text id='inputGroup-sizing-sm'>#</InputGroup.Text>
              <Form.Control
                type='email'
                aria-label='Small'
                aria-describedby='inputGroup-sizing-sm'
              />
            </InputGroup>
          </Col>
          <Form.Text className='text-primary'>
            At least one trustee. Max 2.
          </Form.Text>
        </Row>
      </Form.Group>

      <Dropdown>
        <Dropdown.Toggle variant='success' id='dropdown-basic'>
          Select Tokens from List
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item href='#/action-1'>Action</Dropdown.Item>
          <Dropdown.Item href='#/action-2'>Another action</Dropdown.Item>
          <Dropdown.Item href='#/action-3'>Something else</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <Row className='justify-content-center'>
        <Button variant='primary' type='submit'>
          Submit
        </Button>
      </Row>
    </Form>
  );
};

export default AppHome;
