const express = require("express");
const router = express.Router();

const {
  getActivityLogs,
} = require("../controllers/activityController");

const {
  verifyToken,
  adminOnly,
} = require("../middleware/authMiddleware");

// Admin authentication
router.use(verifyToken);
router.use(adminOnly);

// Get activity logs
router.get("/", getActivityLogs);

module.exports = router;