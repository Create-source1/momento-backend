const Event = require("../models/Event");
const RsvpReminderLog = require("../models/RSVPReminderLog");

exports.getRSVPRemindersByEvent = async (req, res) => {
  const { eventId } = req.params;
  const userId = req.user.userId;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Only the organizer of the event can view the reminder logs
    if (event.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const reminders = await RsvpReminderLog.find({ eventId })
      .sort({ sentAt: -1 }) // newest first
      .populate("rsvpId", "status note") // optional
      .select("email sentAt");

    res.status(200).json({
      message: "RSVP reminders fetched successfully",
      totalReminders: reminders.length,
      reminders,
    });
  } catch (err) {
    console.error("Error fetching RSVP reminders:", err);
    res.status(500).json({ message: "Server error" });
  }
}; 

