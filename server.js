const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/mongoose.db");

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const rsvpRoute = require("./routes/rsvpRoutes");
const rsvpReminderRoute = require("./routes/rsvpReminderRoutes");
const commentRoutes = require("./routes/commentRoutes");
const userProfile = require("./routes/userRoutes");
const scheduleRSVPReminders = require("./utils/rsvpReminderJob");

dotenv.config();
// require("dotenv").config()
connectDB();

scheduleRSVPReminders();

const app = express();
// app.use(cors());
app.use(cors({
  origin: ['http://localhost:5173', 'https://your-frontend.netlify.app'],
  credentials: true
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/rsvp", rsvpRoute);
app.use("/api/reminders", rsvpReminderRoute);
app.use("/api/comments", commentRoutes);
app.use("/api/user", userProfile);

app.get("/test", (req, res) => {
  res.send("Test server is running.");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port http://localhost:${PORT}`)
);
