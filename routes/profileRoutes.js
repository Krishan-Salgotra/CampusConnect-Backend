const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const upload = require(
  "../middleware/uploadMiddleware"
);

const {
  getProfile,
  updateProfile,
  getAllStudents,
  uploadProfileImage,
} = require("../controllers/profileController");

router.get("/", protect, getProfile);

router.put("/", protect, updateProfile);

router.get("/students", getAllStudents);

router.post(
  "/upload-image",
  protect,
  upload.single("image"),
  uploadProfileImage
);

module.exports = router;