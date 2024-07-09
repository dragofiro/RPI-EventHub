import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useEvents } from '../../context/EventsContext';
import Snackbar from '@mui/material/Snackbar'; // Import Snackbar from Material-UI
import CheckIcon from '@mui/icons-material/Check';
import { TextField } from '@mui/material';

const clientId = process.env.REACT_APP_IMGUR_CLIENT_ID;
const imgBB_API_KEY = process.env.REACT_APP_imgBB_API_KEY;


function CreateEventModal() {
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(null); // null means no message, true means success, false means error
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState('');
  const [success, setSuccess] = useState('');
  const [errorOpen, setErrorOpen] = useState({});
  const [error, setError] = useState('');

  const { addEvent } = useEvents(); // Use addEvent from EventsContext

  const handleClose = () => {
    setShow(false);
    setError('');  // Clear errors when closing modal
    setSuccess(''); //Clear success message when closing modal
  };

  const handleShow = () => setShow(true);

  const uploadImage = async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const response = await axios.post(`https://api.imgbb.com/1/upload?key=${imgBB_API_KEY}`, formData);
      return response.data.data.url; // Return URL of uploaded image
    } catch (error) {
      console.error('Failed to upload image:', error);
      return ''; // Return empty string if upload fails
    }
  };

  const handleCreateEvent = async () => {
    let imageUrl = await uploadImage(file);
  

    if (!description || !title || !location || !date) {
      setError('Please fill in all fields. Tags and File are optional!');
      return;
    }

       
      const eventData = {
        title,
        description,
        poster: "admin", // Temporary hardcode
        image: imageUrl || 'default-placeholder-image-url', // Use placeholder if upload fails
        date,
        location,
        tags: tags.split(',').map(tag => tag.trim()),
      };

      try {
        const { data } = await axios.post('http://localhost:5000/events', eventData);
        addEvent(data); // Add the new event to the global context
        setSuccess('Event successfully created!');
        setSuccess(success.response ? success.response.data : success.message);
        handleClose(); // Close the modal
      } catch (error) {
        //alert("not working");
        console.error('Event creation failed:', error.response ? error.response.data : error.message);
        setError(error.response ? error.response.data : error.message);
       // setIsSuccess(null); //If there is an error don't show the success alert.
      }
    
  };


  return (
    <>
      <Button variant="success" onClick={handleShow}>
        Create Event
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Create an Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
          <Form>
            <Form.Group controlId="eventTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                required
                placeholder="Enter event title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="eventDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                required
                rows={3}
                placeholder="Event description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="eventFile">
              <Form.Label>File (Poster or PDF)</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </Form.Group>

            <Form.Group controlId="eventDate">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                placeholder="Event date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="eventLocation">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                required
                placeholder="Event location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="eventTags">
              <Form.Label>Tags (comma separated)</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g., workshop, seminar"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreateEvent}>
            Create Event
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CreateEventModal;
