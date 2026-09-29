const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    userName: {
      type: String,
      default: "Unknown Student",
    },

    userEmail: {
      type: String,
      default: "Unknown Email",
    },

    action: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "ActivityLog",
  activityLogSchema
);