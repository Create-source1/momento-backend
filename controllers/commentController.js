const Comment = require("../models/Comment");
const Event = require("../models/Event");

exports.createComment = async (req, res) => {
  const { eventId } = req.params;
  const { text, name, email, parentComment } = req.body;
  const userId = req.user ? req.user.userId : null;

  if (!text || !name) {
    return res.status(400).json({ message: "Name and text are required." });
  }

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found." });

    const newComment = await Comment.create({
      eventId,
      userId,
      name,
      email,
      text,
      parentComment: parentComment || null,
    });

    res.status(201).json({ message: "Comment added", comment: newComment });
  } catch (err) {
    console.error("Comment creation error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getCommentsForEvent = async (req, res) => {
  const { eventId } = req.params;

  try {
    const comments = await Comment.find({ eventId }).sort({ createdAt: -1 });
    res.status(200).json({ message: "Comments fetched", comments });
  } catch (err) {
    console.error("Fetching comments error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
