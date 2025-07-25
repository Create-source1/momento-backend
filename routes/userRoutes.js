const express = require("express");
const router = express.Router();
const { getUserProfile } = require("../controllers/userController");

router.get("/:userId/profile", getUserProfile);

module.exports = router;
