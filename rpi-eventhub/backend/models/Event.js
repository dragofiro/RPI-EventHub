const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  likes: { type: Number, default: 0 },
  creationTimestamp: { type: Date, default: Date.now },
  poster: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  image: {
    small: { type: String },
    medium: { type: String },
    large: { type: String }
  },
  tags: [String],
  time: { type: String, required: true },
  club: { type: String, required: true },
  rsvp: { type: String, required: false }
}, { timestamps: true });


const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
