const { StatusCodes } = require('http-status-codes');
const Event = require('../models/Event');
const { NotFoundError, BadRequestError } = require('../errors');

// CREATE Event
const createEvent = async (req, res) => {
  req.body.organizedBy = req.user.userID; // authenticated user ID
  const event = await Event.create(req.body);
  res.status(StatusCodes.CREATED).json({ event });
};

// DELETE Event
const deleteEvent = async (req, res) => {
  const { id: eventId } = req.params;
  const event = await Event.findOneAndDelete({
    _id: eventId,
    organizedBy: req.user.userID,
  });

  if (!event) {
    throw new NotFoundError(`No event found with ID ${eventId}`);
  }

  res.status(StatusCodes.OK).json({ msg: 'Event deleted' });
};

// GET All Events (created by user)
const getAllEvents = async (req, res) => {
  const events = await Event.find({ organizedBy: req.user.userID });
  res.status(StatusCodes.OK).json({ events, count: events.length });
};

// UPDATE Event
const updateEvent = async (req, res) => {
  const { id: eventId } = req.params;
  const { title, date, time, location } = req.body;

  if (!title || !date || !time || !location) {
    throw new BadRequestError('Title, Date, Time, and Location are required');
  }

  const event = await Event.findOneAndUpdate(
    { _id: eventId, organizedBy: req.user.userID },
    req.body,
    { new: true, runValidators: true }
  );

  if (!event) {
    throw new NotFoundError(`No event found with ID ${eventId}`);
  }

  res.status(StatusCodes.OK).json({ event });
};

// GET Single Event
const getEvent = async (req, res) => {
  const { id: eventId } = req.params;
  const event = await Event.findOne({
    _id: eventId,
    organizedBy: req.user.userID,
  });

  if (!event) {
    throw new NotFoundError(`No event found with ID ${eventId}`);
  }

  res.status(StatusCodes.OK).json({ event });
};

module.exports = {
  createEvent,
  deleteEvent,
  getAllEvents,
  updateEvent,
  getEvent,
};
