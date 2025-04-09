const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide event title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide event description'],
  },
  date: {
    type: Date,
    required: [true, 'Please provide event date'],
  },
  time: {
    type: String,
    required: [true, 'Please provide event time'],
  },
  location: {
    type: String,
    required: [true, 'Please provide event location'],
  },
  category: {
    type: String,
    enum: ['Workshop', 'Seminar', 'Cultural', 'Tech Fest', 'Sports', 'Other'],
    default: 'Other',
  },
  organizedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Event', EventSchema);
