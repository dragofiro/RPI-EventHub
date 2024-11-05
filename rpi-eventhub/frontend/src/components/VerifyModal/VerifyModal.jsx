import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import {jwtDecode} from 'jwt-decode';
import config from '../../config';

function VerifyModal() {
  const [show, setShow] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const { isLoggedIn, login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleResend = async (req, res) => {
    const { email } = req.body;
    
    try { 
      const user = await user.findOne({email});
  
      if (!user){
        return res.status(404).json({message: "User not found"});
      }
    
      if (user.emailVerified){
        return res.status(400).json({message: "User email already verified"});
      }
    
      const now = new Date();
      const cooldownPeriod = 30 * 1000;
    
      if (user.lastVerificationEmailSent && now - user.lastVerificationEmailSent < cooldownPeriod){
        secondsLeft = (cooldownPeriod - (now - user.lastVerificationEmailSent))/1000
        return res.status(429).json({message: "please wait ${secondsLeft} seconds before trying to resend verification email."})
      }
    
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      user.verificationCode = verificationCode;
      user.lastVerificationEmailSent = now;
      await user.save();
    
      await sendEmail({
        to: email,
        subject: 'Resend: RPI EventHub Email Verification Code',
        text: `Dear User,\n\nHere is your new verification code:\n\nVerification Code: ${verificationCode}\n\nPlease enter this code in the app to verify your email address.\n\nBest regards,\nRPI EventHub Team`,
      });
    
      res.status(200).json({ message: "Verification email resent successfully. Please check your email." });
    } catch (error) {
      console.error("Error resending verification email:", error.message);
      res.status(500).json({ message: "Error resending verification email", error: error.message });
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      setIsSubmitting(false);
      return;
    }

    const decodedToken = jwtDecode(token);
    const email = decodedToken.email;

    try {
      const response = await axios.post(
        `${config.apiUrl}/verify-email`,
        { email, verificationCode },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const newToken = response.data.token;

        login(newToken);
        localStorage.setItem('token', newToken);

        handleClose();
      }
    } catch (error) {
      console.error('Verification failed:', error.response ? error.response.data : error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {isLoggedIn && (
        <Button variant="warning" onClick={handleShow}>
          Verify Email
        </Button>
      )}

      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Verify Email</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleVerify}>
            <Form.Group controlId="verificationCode">
              <Form.Label>Verification Code (check for email from rpieventhub@gmail.com, and check your spam folder!)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter verification code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="secondary" onClick={handleResend}>
            Resend Verification Code
          </Button>
          <Button variant="primary" type="submit" onClick={handleVerify} disabled={isSubmitting}>
            Verify
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default VerifyModal;
