const RSVP = require("../models/RSVP");
const Event = require("../models/Event");

exports.createOrUpdateRSVP = async (req, res) => {
  const { eventId } = req.params;
  const userId = req.user.userId || null; // extracted from JWT
  const { status, note } = req.body;

  if (!["attending", "maybe", "not_attending", "pending"].includes(status)) {
    return res.status(400).json({ message: "Invalid RSVP status." });
  }

  if (!userId && !email) {
    return res.status(400).json({ message: "Email required for guest RSVP." });
  }

  try {
    const query = userId ? { eventId, userId } : { eventId, email };

    let existingRSVP = await RSVP.findOne(query);

    if (existingRSVP) {
      existingRSVP.status = status;
      existingRSVP.note = note;
      await existingRSVP.save();
      return res
        .status(200)
        .json({ message: "RSVP updated", rsvp: existingRSVP });
    }

    const newRSVP = await RSVP.create({ eventId, userId, email, status, note });
    res.status(201).json({ message: "RSVP created", rsvp: newRSVP });
  } catch (err) {
    console.error("RSVP Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getAllRSVPsForEvent = async (req, res) => {
  const { eventId } = req.params;
  const userId = req.user.userId;

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Only the organizer can view all RSVPs
    if (event.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const rsvps = await RSVP.find({ eventId })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "RSVPs fetched successfully",
      rsvps,
      stats: {
        total: rsvps.length,
        attending: rsvps.filter((r) => r.status === "attending").length,
        maybe: rsvps.filter((r) => r.status === "maybe").length,
        not_attending: rsvps.filter((r) => r.status === "not_attending").length,
        pending: rsvps.filter((r) => r.status === "pending").length,
      },
    });
  } catch (err) {
    console.error("Error fetching RSVPs:", err);
    res.status(500).json({ message: "Server error" });
  }
};
