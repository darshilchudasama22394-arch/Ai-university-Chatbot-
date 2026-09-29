const FAQ = require("../models/FAQ");

// Get FAQs
const getFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      faqs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add FAQ
const createFAQ = async (req, res) => {
  try {
    const { question, answer } = req.body;

    await FAQ.create({
      question,
      answer,
    });

    res.json({
      success: true,
      message: "FAQ Added Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete FAQ
const removeFAQ = async (req, res) => {
  try {
    await FAQ.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "FAQ Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const editFAQ = async (req, res) => {
  try {
    const { question, answer } = req.body;

    await FAQ.findByIdAndUpdate(
      req.params.id,
      {
        question,
        answer,
      }
    );

    res.json({
      success: true,
      message: "FAQ Updated Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getFAQs,
  createFAQ,
  editFAQ,
  removeFAQ,
};