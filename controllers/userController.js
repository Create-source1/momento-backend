const Event = require("../models/Event");
const RSVP = require("../models/RSVP");
const Comment = require("../models/Comment");
const User = require("../models/User");

exports.getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    // 1. User Validation
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2. Created Events
    const createdEvents = await Event.find({ organizer: userId });

    // 3. RSVPs Made
    const rsvps = await RSVP.find({ userId }).populate("eventId", "title date");

    // 4. Comments Made
    const comments = await Comment.find({ userId }).populate("eventId", "title");

    // 5. Invitations Sent (from user's created events)
    let invitationsSent = [];
    createdEvents.forEach(event => {
      if (event.invitedUsers && event.invitedUsers.length > 0) {
        event.invitedUsers.forEach(invite => {
          invitationsSent.push({
            eventId: event._id,
            eventTitle: event.title,
            invitedEmail: invite.email,
            invitedName: invite.name || null,
            message: invite.message || null
          });
        });
      }
    });

    res.status(200).json({
      message: "User profile fetched successfully",
      profile: {
        user: {
          name: user.name,
          email: user.email,
          joinedOn: user.createdAt
        },
        createdEvents,
        rsvps,
        comments,
        invitationsSent
      }
    });
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ message: "Server error" });
  }
};
