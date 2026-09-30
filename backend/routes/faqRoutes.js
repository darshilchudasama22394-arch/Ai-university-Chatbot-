const express = require("express");
const router = express.Router();

const FAQ = require("../models/FAQ");
const { verifyToken, adminOnly } = require("../middleware/authMiddleware");

// ================= GET ALL FAQs =================

router.get("/", async (req, res) => {
  try {
    const faqs = await FAQ.find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      faqs: faqs,
    });
  } catch (error) {
    console.error("Get FAQs Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load FAQs",
    });
  }
});

// ================= ADD FAQ =================

router.post("/", verifyToken, adminOnly, async (req, res) => {
  try {
    const {
      question,
      answer,
      category,
    } = req.body;

    if (!question || !answer) {
      return res.status(400).json({
        success: false,
        message: "Question and answer are required",
      });
    }

    const faq = new FAQ({
      question,
      answer,
      category: category || "General",
    });

    await faq.save();

    res.status(201).json({
      success: true,
      message: "FAQ added successfully",
      faq: faq,
    });
  } catch (error) {
    console.error("Add FAQ Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add FAQ",
    });
  }
});

module.exports = router;