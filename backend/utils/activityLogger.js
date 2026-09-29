const ActivityLog = require("../models/ActivityLog");

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

    console.log("✅ Activity log created");
  } catch (error) {
    console.error(
      "Activity Log Error:",
      error
    );
  }
};

module.exports = createActivityLog;