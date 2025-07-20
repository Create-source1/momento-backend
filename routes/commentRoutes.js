const express = require("express");
const router = express.Router();
const {
  createComment,
  getCommentsForEvent,
} = require("../controllers/commentController");
const { protect } = require("../middlewares/authMiddleware");

// Public & authenticated route
router.post("/:eventId", protect, createComment);

// Public - anyone can view
router.get("/:eventId", getCommentsForEvent);

module.exports = router;
