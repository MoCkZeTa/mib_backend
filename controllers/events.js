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
  const { title, date, time, location } = req.body;

  if (!title || !date || !time || !location) {
    throw new BadRequestError('All fields are required');
  }

  const event = await Event.findOneAndUpdate(
    { _id: eventId, organizedBy: req.user.userID },
    req.body,
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

const getAllEvents = async (req, res) => {
  const events = await Event.find({}).populate({
    path: 'organizedBy',
    select: 'name',
  });

  const modifiedEvents = events.map(event => {
    const obj = event.toObject();
    obj.organiserName = obj.organizedBy?.name || 'Unknown';
    delete obj.organizedBy;
    return obj;
  });

  res.status(StatusCodes.OK).json({ events: modifiedEvents, count: modifiedEvents.length });
};

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
