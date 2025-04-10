const { StatusCodes } = require('http-status-codes');
const Event = require('../models/Event');
const Logs = require('../models/Logs');
const { NotFoundError, BadRequestError } = require('../errors');

const createEvent = async (req, res) => {
  req.body.organizedBy = req.user.userID;
  const event = await Event.create(req.body);

  await Logs.create({
    performedBy: req.user.userID,
    action: 'created',
    eventId: event._id,
    timestamp: new Date(), // ⬅️ Added
  });

  req.app.get('io').emit('logUpdated');
  res.status(StatusCodes.CREATED).json({ event });
};

const deleteEvent = async (req, res) => {
  const { id: eventId } = req.params;
  const event = await Event.findOneAndDelete({ _id: eventId });

  if (!event) throw new NotFoundError(`No event found with ID ${eventId}`);

  await Logs.create({
    performedBy: req.user.userID,
    action: 'deleted',
    eventId: event._id,
    timestamp: new Date(), // ⬅️ Added
  });

  req.app.get('io').emit('logUpdated');
  res.status(StatusCodes.OK).json({ msg: 'Event deleted' });
};

const updateEvent = async (req, res) => {
  const { id: eventId } = req.params;
  const {
    title,
    date,
    time,
    location,
    description,
    category
  } = req.body;

  // Only keep provided fields
  const fieldsToUpdate = {};
  if (title) fieldsToUpdate.title = title;
  if (date) fieldsToUpdate.date = date;
  if (time) fieldsToUpdate.time = time;
  if (location) fieldsToUpdate.location = location;
  if (description) fieldsToUpdate.description = description;
  if (category) fieldsToUpdate.category = category;

  // If no fields provided, return error
  if (Object.keys(fieldsToUpdate).length === 0) {
    throw new BadRequestError('At least one field must be provided to update');
  }

  const event = await Event.findOneAndUpdate(
    { _id: eventId},
    fieldsToUpdate,
    { new: true, runValidators: true }
  );

  if (!event) throw new NotFoundError(`No event found with ID ${eventId}`);

  await Logs.create({
    performedBy: req.user.userID,
    action: 'updated',
    eventId: event._id,
    timestamp: new Date(), // ⬅️ Added
  });

  req.app.get('io').emit('logUpdated');
  res.status(StatusCodes.OK).json({ event });
};


// GET Single Event
const getEvent = async (req, res) => {
  const { id: eventId } = req.params;
  const event = await Event.findOne({
    _id: eventId,
    organizedBy: req.user.userID,
  });

  if (!event) throw new NotFoundError(`No event found with ID ${eventId}`);
  res.status(StatusCodes.OK).json({ event });
};

module.exports = {
  createEvent,
  deleteEvent,
  getAllEvents,
  updateEvent,
  getEvent,
};
