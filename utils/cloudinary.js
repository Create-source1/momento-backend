const dotenv = require("dotenv")
const cloudinary = require("cloudinary").v2;

dotenv.config(); // MUST be called before using process.env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
console.log("Cloudinary API KEY:", process.env.CLOUDINARY_API_KEY);


module.exports = cloudinary;
