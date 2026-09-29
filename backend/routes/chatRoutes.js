const express = require("express");
const router = express.Router();

const {
  askAI,
  history,
  newSession,
  deleteChat,
  deleteAllChats,
} = require("../controllers/chatController");

const {
  verifyToken,
} = require("../middleware/authMiddleware");

// =====================================================
// AUTHENTICATION
// =====================================================

router.use(verifyToken);

// =====================================================
// ASK AI
// =====================================================

router.post("/ask", askAI);

// =====================================================
// NEW CHAT SESSION
// =====================================================

router.post("/new-session", newSession);

// =====================================================
// CHAT HISTORY
// =====================================================

router.get("/history", history);

// =====================================================
// DELETE SINGLE CHAT
// =====================================================

router.delete("/delete/:id", deleteChat);

// =====================================================
// DELETE ALL CHAT HISTORY
// =====================================================

router.delete("/delete-all", deleteAllChats);

module.exports = router;