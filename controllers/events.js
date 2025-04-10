const { StatusCodes } = require('http-status-codes');
const Event = require('../models/Event');
const Logs = require('../models/Logs');
const { NotFoundError, BadRequestError } = require('../errors');

// CREATE Event
const createEvent = async (req, res) => {
  req.body.organizedBy = req.user.userID;
  const event = await Event.create(req.body);

  try {
    await Logs.create({
      eventId: event._id,
      action: 'created',
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      category: event.category,
      organiserName: req.user.name,
      performedBy: req.user.userID,
    });
  } catch (logErr) {
    console.error('❌ Failed to create log:', logErr.message);
  }

  res.status(StatusCodes.CREATED).json({ event });
};

// DELETE Event
const deleteEvent = async (req, res) => {
  const { id: eventId } = req.params;
  const event = await Event.findOneAndDelete({
    _id: eventId,
  });

  if (!event) {
    throw new NotFoundError(`No event found with ID ${eventId}`);
  }

  try {
    await Logs.create({
      eventId: event._id,
      action: 'deleted',
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      category: event.category,
      organiserName: req.user.name,
      performedBy: req.user.userID,
    });
  } catch (logErr) {
    console.error('❌ Failed to log event deletion:', logErr.message);
  }

  res.status(StatusCodes.OK).json({ msg: 'Event deleted' });
};

// GET All Events
const getAllEvents = async (req, res) => {
  const events = await Event.find({})
    .populate({ path: 'organizedBy', select: 'name' });

  const modifiedEvents = events.map(event => {
    const eventObj = event.toObject();
    eventObj.organiserName = eventObj.organizedBy?.name || "Unknown";
    delete eventObj.organizedBy;
    return eventObj;
  });

  res.status(StatusCodes.OK).json({ events: modifiedEvents, count: modifiedEvents.length });
};

// UPDATE Event
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

  if (!event) {
    throw new NotFoundError(`No event found with ID ${eventId}`);
  }

  try {
    await Logs.create({
      eventId: event._id,
      action: 'updated',
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      category: event.category,
      organiserName: req.user.name,
      performedBy: req.user.userID,
    });
  } catch (logErr) {
    console.error('❌ Failed to log event update:', logErr.message);
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