const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  sendRequest,
  getMyRequests,
  updateRequestStatus,
} = require("../controllers/requestController");

router.post("/", protect, sendRequest);

router.get("/", protect, getMyRequests);

router.put("/:requestId", protect, updateRequestStatus);

module.exports = router;