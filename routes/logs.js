const express = require("express");
const router = express.Router();

const { getAllLogs } = require("../controllers/logs");
const authentication = require("../middleware/authentication");

// Route to get all logs — only for authenticated users
router.route("/").get(authentication, getAllLogs);

module.exports = router;
