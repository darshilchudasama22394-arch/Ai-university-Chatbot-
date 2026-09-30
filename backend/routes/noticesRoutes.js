const express = require("express");
const router = express.Router();

const Notice = require("../models/Notice");
const logger = require("../utils/logger");
const { verifyToken, adminOnly } = require("../middleware/authMiddleware");

// ================= GET ALL NOTICES =================

router.get("/", async (req, res) => {
  try {
    const notices = await Notice.find()
      .sort({ date: -1 });

    res.json({
      success: true,
      notices: notices,
    });
  } catch (error) {
    logger.logError("Get Notices Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load notices",
    });
  }
});

// ================= ADD NOTICE =================

router.post("/", verifyToken, adminOnly, async (req, res) => {
  try {
    const {
      title,
      description,
      category,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    const notice = new Notice({
      title,
      description,
      category: category || "General",
    });

    await notice.save();

    res.status(201).json({
      success: true,
      message: "Notice added successfully",
      notice: notice,
    });
  } catch (error) {
    logger.logError("Add Notice Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add notice",
    });
  }
});

module.exports = router;