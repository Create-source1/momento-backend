const express = require("express");
const nodemailer = require("nodemailer");
const {
  createEvent,
  getAllPublicEvents,
  getEventById,
  // rsvpToEvent,
  deleteEvent,
  getFilteredEventsTimeline,
  sendEventInvitations,
} = require("../controllers/eventController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMedia");
const { getAllRSVPsForEvent } = require("../controllers/rsvpController");

const router = express.Router();

router.get("/", getAllPublicEvents);
router.get("/:id", getEventById);
router.post("/", protect, upload.array("mediaUploads"), createEvent);
// router.post("/:id/rsvp", protect, rsvpToEvent);
router.delete("/:id", protect, deleteEvent);

// Fetching all rsvp's of an event in an organised way
router.get("/:eventId/rsvps", protect, getAllRSVPsForEvent);

// Using query parmaters to filter event timelines
router.get("/timeline", protect, getFilteredEventsTimeline);

// Custom invitations
router.post("/:eventId/invite", protect, sendEventInvitations);

module.exports = router;
