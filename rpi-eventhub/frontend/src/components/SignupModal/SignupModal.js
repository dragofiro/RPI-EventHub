import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

function SignupModal() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();  // Use the login method from AuthContext
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleClose = () => {
    setShow(false);
    setError('');  // Clear errors when closing modal
  };
  const handleShow = () => setShow(true);

  const handleSignup = async (e) => {

    e.preventDefault();
    if(isSubmitting) {
      return;
    }
    setIsSubmitting(true);    

    if (!email || !password || !username) {
      setError('Please fill in all fields.');
      return;
    }
    if (!(email.endsWith('@rpi.edu'))){
      setError('Please enter an RPI email'); 
      return;
    }
    // Optionally, add more specific validations here

    const user = {
      email,
      password,
      username
    };

    try {
      const response = await axios.post('https://rpi-eventhub-production.up.railway.app/signup', user);
      console.log('Signup successful');
      login(response.data.token);  
      localStorage.setItem('token', response.data.token); 


      localStorage.setItem('token', response.data.token);  // Save the token
      handleClose();
    } catch (error) {
      console.error('Signup failed:', error.response ? error.response.data : error.message);
      // Ensure error is always a string
      const errorMessage = error.response ? error.response.data.message || error.response.data : error.message;
      setError(errorMessage);
    }
  };

  return (
    <>
      <Button variant="secondary" onClick={handleShow}>
        Sign Up
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Sign Up</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form>
            <Form.Group controlId="signupUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="signupEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              
            </Form.Group>
            <Form.Group controlId="signupPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSignup} disabled={isSubmitting}>
            Sign Up
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default SignupModal;
