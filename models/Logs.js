const mongoose = require('mongoose');

const LogsSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  action: {
    type: String,
    enum: ['created', 'updated', 'deleted'],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  date: {
    type: Date,
  },
  time: {
    type: String,
  },
  location: {
    type: String,
  },
  category: {
    type: String,
  },
  organiserName: {
    type: String,
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Logs', LogsSchema);
