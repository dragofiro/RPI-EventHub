const express = require('express');
const router = express.Router();
const Event = require('../models/Event'); // Adjust the path as necessary

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new event
router.post('/', async (req, res) => {
  const event = new Event({
    title: req.body.title,
    description: req.body.description,
    poster: req.body.poster,
    date: req.body.date,
    location: req.body.location,
    image: req.body.image,
    tags: req.body.tags,
  });

  try {
    const newEvent = await event.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


//Get the likes count
router.get('/events/:id/likes', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    res.json({ likes: event.likes });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get likes' });
  }
});

//Update the likes count
router.post('/events/:id/like', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    event.likes += 1;
    await event.save();
    res.json({ likes: event.likes });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update likes' });
  }
});

module.exports = router;
