const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getProfile,
  updateProfile,
  getAllStudents,
} = require("../controllers/profileController");

router.get("/", protect, getProfile);

router.put("/", protect, updateProfile);

router.get("/students", getAllStudents);

module.exports = router;