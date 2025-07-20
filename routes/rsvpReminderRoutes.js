const express = require("express");
const router = express.Router();
const { getRSVPRemindersByEvent } = require("../controllers/rsvpReminderController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/:eventId", protect, getRSVPRemindersByEvent);

module.exports = router;
