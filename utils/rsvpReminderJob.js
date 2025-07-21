const cron = require("node-cron");
const nodemailer = require("nodemailer");
const Event = require("../models/Event");
const RSVP = require("../models/RSVP");
const User = require("../models/User");
const RsvpReminderLog = require("../models/RSVPReminderLog");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const sendRSVPReminder = async () => {
  try {
    const now = new Date();
    const upcomingEvents = await Event.find({
      date: {
        $gte: now,
        $lte: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
      }, // next 2 days
    });

    for (const event of upcomingEvents) {
      const rsvps = await RSVP.find({
        eventId: event._id,
        status: { $in: ["pending", "maybe"] },
      });

      for (const rsvp of rsvps) {
        let recipientEmail = null;
        let recipientName = "there";

        // For logged-in users
        if (rsvp.userId) {
          const user = await User.findById(rsvp.userId);
          if (!user) continue;
          recipientEmail = user.email;
          recipientName = user.name || "there";
        }

        // For guest RSVPs
        if (!rsvp.userId && rsvp.email) {
          recipientEmail = rsvp.email;
        }

        if (!recipientEmail) continue; // Skip if no valid email

        const mailOptions = {
          from: `"Momento Team" <${process.env.EMAIL_USER}>`,
          to: recipientEmail,
          subject: `Reminder: RSVP for "${event.title}"`,
          text: `Hi ${recipientName},\n\nYou have not confirmed your RSVP for "${event.title}" happening on ${event.date}.\nPlease update your status soon.\n\nVisit your dashboard or RSVP again.\n\n— Momento Team`,
        };

        await transporter.sendMail(mailOptions);

        await RsvpReminderLog.create({
          eventId: event._id,
          rsvpId: rsvp._id,
          email: recipientEmail,
        });
      }
    }

    console.log("✅ RSVP reminders sent.");
  } catch (err) {
    console.error("❌ Error in sending RSVP reminders:", err);
  }
};

// Schedule: everyday at 9 AM
const scheduleRSVPReminders = () => {
  cron.schedule("0 9 * * *", sendRSVPReminder); // 9:00 AM daily
  //   console.log("Reminder working");
};

module.exports = scheduleRSVPReminders;
