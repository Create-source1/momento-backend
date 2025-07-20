const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    startDateTime: {
      type: Date,
      required: true,
    },
    endDateTime: {
      type: Date,
      required: true,
    },
    // date: {
    //   type: String,
    //   required: [true, "Event date is required"],
    // },
    // time: {
    //   type: String,
    //   required: true,
    // },
    location: {
      type: {
        type: String,
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
      },
      address: String,
    },
    // media: [
    //   {
    //     url: String, // URLs to images/videos         // URL from Cloudinary
    //     type: { type: String, enum: ["upload", "link"], default: "upload" },
    //   },
    // ],
    mediaUploads: [String], // Cloudinary URLs
    mediaLinks: [String], // URLs directly added by users

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isDraft: {
      type: Boolean,
      default: false,
    },
    invitedUsers: [
      {
        email: { type: String, required: true },
        message: { type: String },
        invitedAt: { type: Date, default: Date.now },
        status: {
          type: String,
          enum: ["invited", "rsvped"],
          default: "invited",
        },
      },
    ],

    // attendees: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User",
    //   },
    // ],
    tags: [String],
    coverImage: String,
    isPublic: {
      type: Boolean,
      default: true,
    },
    maxCapacity: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
