const express = require("express");

const router = express.Router();

const {
  createEvent,
  deleteEvent,
  getAllEvents,
  updateEvent,
  getEvent,
} = require("../controllers/events"); // Make sure this path matches your project structure

// Route for creating a new event and getting all events

router.route("/").post(createEvent).get(getAllEvents);

// Route for operations on a specific event by ID
router.route("/:id").get(getEvent).delete(deleteEvent).patch(updateEvent);

module.exports = router;
