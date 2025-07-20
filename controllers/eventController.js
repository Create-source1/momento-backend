const Event = require("../models/Event");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer")

// Create Event
// const createEvent = async (req, res) => {
//   try {
//     const mediaUrl = req.file ? req.file.path : null;
//     const event = await Event.create({
//       ...req.body,
//       createdBy: req.user.userId,
//       media: mediaUrl,
//     });
//     res.status(201).json(event);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      startDateTime,
      endDateTime,
      location,
      isPublic,
      isDraft,
      invitedUsers,
      tags,
      mediaLinks = [],
      maxCapacity,
    } = req.body;

    // Prepare uploaded media
    let media = [];
    if (req.files && req.files.length) {
      media = req.files.map((f) => ({ url: f.path, type: "upload" }));
    }

    // Handle manual media links
    if (mediaLinks) {
      const links = Array.isArray(mediaLinks) ? mediaLinks : [mediaLinks];
      links.forEach((link) => media.push({ url: link, type: "link" }));
    }

    const event = await Event.create({
      title,
      description,
      startDateTime,
      endDateTime,
      location,
      isPublic,
      isDraft,
      invitedUsers,
      tags,
      maxCapacity,
      media,
      createdBy: req.user.userId,
    });

    res.status(201).json({ success: true, data: event });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get All Public Events
const getAllPublicEvents = async (req, res) => {
  try {
    const events = await Event.find({ isPublic: true }).populate(
      "organizer",
      "name"
    );
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Single Event
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "organizer attendees",
      "name email"
    );
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// RSVP to Event
// const rsvpToEvent = async (req, res) => {
//   const { status } = req.body; // e.g., "yes", "no"
//   try {
//     const event = await Event.findById(req.params.id);
//     if (!event) return res.status(404).json({ message: "Event not found" });

//     if (status === "yes") {
//       if (!event.attendees.includes(req.user.userId)) {
//         event.attendees.push(req.user.userId);
//         await event.save();
//       }
//     } else {
//       event.attendees = event.attendees.filter(
//         (id) => id.toString() !== req.user.userId
//       );
//       await event.save();
//     }

//     res.status(200).json({ message: `RSVP updated to '${status}'` });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// Delete Event (Only Organizer)
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.organizer.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this event" });
    }

    await event.deleteOne();
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Sorting and filtering user dashboard
// GET /api/events/timeline?type=tech,fun&visibility=public&status=attending&from=2025-07-01&to=2025-12-31&page=2&limit=5&sort=title&order=desc

const getFilteredEventsTimeline = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      type,
      visibility,
      status,
      from,
      to,
      page = 1,
      limit = 10,
      sort = "date",
      order = "asc",
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOrder = order === "desc" ? -1 : 1;

    let eventQuery = {
      $or: [
        { createdBy: userId },
        { isPublic: true },
      ],
    };

    if (type) {
      const tagsArray = type.split(",").map(tag => tag.trim());
      eventQuery.tags = { $in: tagsArray };
    }

    if (visibility === "public") eventQuery.isPublic = true;
    if (visibility === "private") eventQuery.isPublic = false;

    if (from || to) {
      eventQuery.date = {};
      if (from) eventQuery.date.$gte = new Date(from);
      if (to) eventQuery.date.$lte = new Date(to);
    }

    // Step 1: Get events (before RSVP filtering)
    let events = await Event.find(eventQuery)
      .sort({ [sort]: sortOrder });

    // Step 2: Filter by RSVP status if provided
    if (status) {
      const filteredEventIds = await RSVP.find({
        userId: mongoose.Types.ObjectId(userId),
        status,
      }).distinct("eventId");

      events = events.filter((event) =>
        filteredEventIds.some((id) => id.toString() === event._id.toString())
      );
    }

    const total = events.length;

    // Step 3: Apply pagination on the final event list
    const paginatedEvents = events.slice(skip, skip + parseInt(limit));

    res.status(200).json({
      message: "Filtered events timeline",
      pagination: {
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit)
      },
      events: paginatedEvents,
    });
  } catch (err) {
    console.error("Timeline fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


const sendEventInvitations = async (req, res) => {
  const { eventId } = req.params;
  const { invitations } = req.body; // [{ email, message }]
  const organizerId = req.user.userId;

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found." });

    if (event.createdBy.toString() !== organizerId.toString()) {
      return res.status(403).json({ message: "Unauthorized." });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    for (const invite of invitations) {
      const { email, message } = invite;
      await transporter.sendMail({
        from: `"Momento" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: `You're invited to ${event.title}`,
        text: `Hi,\n\n${
          message || "You're invited to an event!"
        }\n\nView details: https://momento.com/events/${event._id}`,
      });

      event.invitedUsers.push({
        email,
        message,
        status: "invited",
      });
    }

    await event.save();
    res.status(200).json({ message: "Invitations sent successfully." });
  } catch (err) {
    console.error("Invite error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createEvent,
  getAllPublicEvents,
  getEventById,
  // {rsvpToEvent}
  deleteEvent,
  getFilteredEventsTimeline,
  sendEventInvitations,
};
