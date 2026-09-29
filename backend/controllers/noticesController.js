const Notice = require("../models/Notice");

// Get notices
const getNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      notices,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Add notice
const createNotice = async (req, res) => {
  try {
    const { title, description } = req.body;

    await Notice.create({
      title,
      description,
    });

    res.json({
      success: true,
      message: "Notice Added Successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Update notice
const editNotice = async (req, res) => {
  try {
    const { title, description } = req.body;

    await Notice.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
      }
    );

    res.json({
      success: true,
      message: "Notice Updated Successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Delete notice
const removeNotice = async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Notice Deleted Successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  getNotices,
  createNotice,
  editNotice,
  removeNotice,
};