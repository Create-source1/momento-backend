const mongoose = require("mongoose");

const RSVPReminderLogSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  rsvpId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RSVP",
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  sentAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("RSVPReminderLog", RSVPReminderLogSchema);
