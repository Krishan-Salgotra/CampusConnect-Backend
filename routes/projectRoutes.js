const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createProject,
  getProjects,
} = require("../controllers/projectController");

router.post("/", protect, createProject);

router.get("/", getProjects);

module.exports = router;