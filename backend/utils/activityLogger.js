const ActivityLog = require("../models/ActivityLog");
const logger = require("./logger");

const createActivityLog = async ({
  userId = null,
  userName = "Unknown Student",
  userEmail = "Unknown Email",
  action,
  description = "",
  details = {},
}) => {
  try {
    await ActivityLog.create({
      userId,
      userName,
      userEmail,
      action,
      description,
      details,
    });

    logger.info("✅ Activity log created");
  } catch (error) {
    logger.logError(
      "Activity Log Error:",
      error
    );
  }
};

module.exports = createActivityLog;