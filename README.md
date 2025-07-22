# 🧰 Project Name – _Momento_

An event management backend RESTful API built with **Node.js** and **Express**, featuring secure **JWT-based authentication**, **MongoDB** integration with **Mongoose**, support for media uploads via **Cloudinary**, and email invitations, enabling robust event management functionality.


---

## 🚀 Live API

📡 **Base URL**: `https://momento-backend-ys6c.onrender.com/api`

---

## 📁 Project Structure

```
momento-backend/
├── controllers/         # Route handlers
├── routes/              # API route definitions
├── models/              # Mongoose models / DB schema
├── middlewares/         # Authentication, error handling
├── config/              # DB & env configs
├── utils/               # Helpers and utilities
├── .env                 # Environment variables
├── server.js            # App entry point
└── README.md
```

---

## 📦 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Environment Variables**: dotenv
- **Validation**: Custom middleware: _authMiddleware_
- **Email Service**: Nodemailer
- **Cloud Media Storage**: Cloudinary with multer-storage-cloudinary
- **File Uploads**: Multer
- **CORS**: cors middleware
- **Scheduled Tasks**: node-cron
- **Crypto Utilities**: crypto
---

## 🧠 Features

- **User Authentication**: Secure login and registration using JWT tokens and password hashing with ```bcryptjs```.
- **Event Management**: CRUD events with support for visibility (public/private), scheduling, and attendee capacity.
- **Media Handling**: Upload and store event-related media files securely using Multer and Cloudinary.
- **Location Integration**: Events include address and geolocation data (lat, lng) for mapping and filtering.
- **Invitations & RSVP**: Send personalized event invitations via email and track attendee responses with RSVP status.
- **Comments System**: Add, view, and manage comments on events for user engagement and feedback.
- **Dashboard Metrics**: Fetch analytics such as total events, RSVPs, comments, and invitations for each organizer.
- **Scheduled Tasks**: Use ```node-cron``` to run automated jobs like email reminders or cleanup operations.
- **Protected routes**: All sensitive endpoints are secured using JSON Web Tokens.
- **Input Validation and Sanitization**

---

## 🔌 Environment Variables

```env
PORT= 1507
MONGO_URI= "mongodb://localhost:27017/momento"
MONGO_URI_CLOUD = "mongodb+srv://jaiswalpj13:<password>@cluster0.isfkvrv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
JWT_SECRET=your_secret
GMAIL_USER="your_email@gmail.com"
GMAIL_PASS="password"
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloud_key
CLOUDINARY_API_SECRET=your_secret
```

---

## 💻 Getting Started Locally

1. **Clone the repository:**

```bash
git clone https://github.com/your-username/project-name.git
cd project-name
```

2. **Install dependencies:**

```bash
npm install
```

3. **Set up environment variables:**

```bash
cp .env.example .env
# edit .env with your own config
```

4. **Run the server:**

```bash
# for production
npm server.js
```

---

## 🔐 Authentication Flow

1. **POST api//auth/register** – Register a new user
2. **POST api/auth/login** – Login and get JWT
3. Use `Authorization: Bearer <token>` in protected routes

---

## 📘 API Reference (Example Routes)

### 🧑 User

| Method | Endpoint         | Description       | Auth Required |
| ------ | ---------------- | ----------------- | ------------- |
| POST   | `/auth/register` | Register user     | ❌            |
| POST   | `/auth/login`    | Login & get token | ✅            |
| GET    | `/user/:userId/profile`      | Get user profile  | ✅            |

### 🗂️ Events (Sample Resource)

| Method | Endpoint     | Description    | Auth |
| ------ | ------------ | -------------- | ---- |
| GET    | `/events/`     | List all events | ✅   |
| POST   | `/events/`     | Create an event  | ✅   |
| GET    | `/events/:id` | Get event by ID | ✅   |
| DELETE | `/events/:id` | Delete event    | ✅   |

---

## 🧪 Testing

Use **Postman**, **Insomnia**, or **cURL** for testing.


---

## 🛡 Security Features

- CORS configuration
- Password hashing with bcrypt
- Environment variable management via dotenv

---

## 🗃 Database Design

> Example for MongoDB using Mongoose

### User Schema

```
json
{
  username: String,
  email: String,
  password: String (hashed)
}
```

### Event Schema

```
json
{
  title: String,
  description: String,
  createdBy: ObjectId (ref: 'User'),
  startDateTime: Date,
  endDateTime: Date,
  location:{
    type: String,
    coordinates: Number,
    address: String,
  },
  mediaUploads: String,
  mediaLinks: String,
  isDraft: Boolean,
  invitedUsers:{
    email: String,
    message: String,
    invitedAt: Date,
    status: String,
  },
  tags: String,
  isPublic: Boolean,
  maxCapacity: Number
}
```

---

## 👨‍💻 Author : Pooja Jaiswal
