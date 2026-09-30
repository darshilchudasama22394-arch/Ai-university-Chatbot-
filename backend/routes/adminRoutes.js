const express = require("express");

const router = express.Router();
const {
  verifyToken,
  adminOnly,
} = require("../middleware/authMiddleware");

router.use(verifyToken, adminOnly);

// =====================================================
// ACTIVITY CONTROLLER
// =====================================================

const {
  getActivityLogs,
  getActivityLogById,
  updateActivityLog,
  deleteActivityLog,
  deleteAllActivityLogs,
} = require("../controllers/activityController");

// =====================================================
// ADMIN CONTROLLER
// =====================================================

const {
  getDashboardStats,

  students,
  createStudent,
  editStudent,
  removeStudent,

  // FAQ
  adminFAQs,
  createFAQ,
  editFAQ,
  removeFAQ,

  // Notices
  adminNotices,
  createNotice,
  editNotice,
  removeNotice,
} = require("../controllers/adminController");

// =====================================================
// DASHBOARD
// =====================================================

router.get(
  "/stats",
  getDashboardStats
);

// =====================================================
// STUDENTS
// =====================================================

router.get(
  "/students",
  students
);

router.post(
  "/student",
  createStudent
);

router.put(
  "/student/:id",
  editStudent
);

router.delete(
  "/student/:id",
  removeStudent
);

// =====================================================
// FAQS
// =====================================================

router.get(
  "/faqs",
  adminFAQs
);

router.post(
  "/faq",
  createFAQ
);

router.put(
  "/faq/:id",
  editFAQ
);

router.delete(
  "/faq/:id",
  removeFAQ
);

// =====================================================
// NOTICES
// =====================================================

router.get(
  "/notices",
  adminNotices
);

router.post(
  "/notice",
  createNotice
);

router.put(
  "/notice/:id",
  editNotice
);

router.delete(
  "/notice/:id",
  removeNotice
);

// =====================================================
// ACTIVITY LOGS
// =====================================================

// Get all activity logs
router.get(
  "/activity",
  getActivityLogs
);

// Get one activity log
router.get(
  "/activity/:id",
  getActivityLogById
);

// Edit activity log
router.put(
  "/activity/:id",
  updateActivityLog
);

// DeleteAll activity log
router.delete(
  "/activity",
  deleteAllActivityLogs
);

// Delete activity log
router.delete(
  "/activity/:id",
  deleteActivityLog
);



// =====================================================
// EXPORT
// =====================================================

module.exports = router;