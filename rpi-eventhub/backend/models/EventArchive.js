const mongoose = require('mongoose');

const eventArchiveSchema = new mongoose.Schema({
   eventId: { type: Number, required: true, unique: true },
   title: { type: String, required: true },
   description: { type: String, required: true },
   likes: { type: Number, default: 0 },
   creationTimestamp: { type: Date, default: Date.now },
   poster: { type: String, required: true },
   startDateTime: { type: Date, required: true },
   endDateTime: { type: Date, required: true },
   location: { type: String, required: true },
   image: { type: String },
   tags: [String],
   club: { type: String, required: true },
   rsvp: { type: String }
}, { timestamps: true });

const EventArchive = mongoose.model('EventArchive', eventArchiveSchema);

module.exports = EventArchive;
