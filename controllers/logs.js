const Logs = require('../models/Logs.js');

const getAllLogs = async (req, res) => {
  const logs = await Logs.find()
    .populate('performedBy', 'name email')
    .populate('eventId', 'title')
    .sort({ createdAt: -1 });

  res.status(200).json({ logs });
};

module.exports = { getAllLogs };
