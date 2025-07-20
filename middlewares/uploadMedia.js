const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "momento-events",
    allowed_formats: ["jpg", "png", "jpeg", "mp4"],
    transformation: [{ width: 1200, crop: "limit" }],
  },
});

const upload = multer({ storage });

module.exports = upload;
