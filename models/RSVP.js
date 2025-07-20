// models/RSVP.js
const mongoose = require("mongoose");

const rsvpSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: {
      type: String,
      required: function () {
        return !this.userId; // required if guest
      },
    },
    status: {
      type: String,
      required: true,
      enum: ["attending", "maybe", "not_attending", "pending"],
      default: "pending",
    },
    note: {
      type: String,
      trim: true,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

rsvpSchema.index({ eventId: 1, userId: 1 }, { unique: true }); // One RSVP per user per event

module.exports = mongoose.model("RSVP", rsvpSchema);
