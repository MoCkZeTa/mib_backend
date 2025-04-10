const mongoose = require('mongoose');

const LogsSchema = new mongoose.Schema(
  {
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
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
    timestamp: {
      type: Date,
      default: Date.now, // ⬅️ Automatically set timestamp if not provided
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model('Logs', LogsSchema);
