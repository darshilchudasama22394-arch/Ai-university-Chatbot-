const ActivityLog = require("../models/ActivityLog");
const logger = require("../utils/logger");

// =====================================================
// GET ACTIVITY LOGS
// =====================================================

const getActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find()
      .sort({ createdAt: -1 })
      .limit(200);

    res.status(200).json({
      success: true,
      logs,
    });
  } catch (error) {
    logger.logError(
      "Get Activity Logs Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to load activity logs",
    });
  }
};

// =====================================================
// GET SINGLE ACTIVITY LOG
// =====================================================

const getActivityLogById = async (req, res) => {
  try {
    const log = await ActivityLog.findById(
      req.params.id
    );

    if (!log) {
      return res.status(404).json({
        success: false,
        message: "Activity log not found",
      });
    }

    res.status(200).json({
      success: true,
      log,
    });
  } catch (error) {
    logger.logError(
      "Get Activity Log Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to load activity log",
    });
  }
};

// =====================================================
// UPDATE ACTIVITY LOG
// =====================================================

const updateActivityLog = async (req, res) => {
  try {
    const { question, answer } = req.body;

    const log = await ActivityLog.findById(
      req.params.id
    );

    if (!log) {
      return res.status(404).json({
        success: false,
        message: "Activity log not found",
      });
    }

    // Update deleted chat details
    if (!log.details) {
      log.details = {};
    }

    if (question !== undefined) {
      log.details.question = question;
    }

    if (answer !== undefined) {
      log.details.answer = answer;
    }

    await log.save();

    res.status(200).json({
      success: true,
      message: "Activity log updated successfully",
      log,
    });
  } catch (error) {
    logger.logError(
      "Update Activity Log Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update activity log",
    });
  }
};

// =====================================================
// DELETE ACTIVITY LOG
// =====================================================

const deleteActivityLog = async (req, res) => {
  try {
    const log = await ActivityLog.findById(
      req.params.id
    );

    if (!log) {
      return res.status(404).json({
        success: false,
        message: "Activity log not found",
      });
    }

    await ActivityLog.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Activity log deleted successfully",
    });
  } catch (error) {
    logger.logError(
      "Delete Activity Log Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to delete activity log",
    });
  }
};

// =====================================================
// DELETE ALL ACTIVITY LOGS
// =====================================================

const deleteAllActivityLogs = async (req, res) => {
  try {
    const result =
      await ActivityLog.deleteMany({});

    res.status(200).json({
      success: true,
      message: "All activity logs deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    logger.logError(
      "Delete All Activity Logs Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to delete all activity logs",
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  getActivityLogs,
  getActivityLogById,
  updateActivityLog,
  deleteActivityLog,
  deleteAllActivityLogs,
};