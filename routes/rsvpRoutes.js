const express = require("express");
const {
  createOrUpdateRSVP,
  getAllRSVPsForEvent,
} = require("../controllers/rsvpController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/:eventId", protect, createOrUpdateRSVP);
router.get("/event/:eventId", protect, getAllRSVPsForEvent);

module.exports = router;
