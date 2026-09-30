const mongoose = require("mongoose");
const logger = require("../utils/logger");
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    logger.info("MongoDB connected");
  })
  .catch((err) => {
    logger.logError("MongoDB connection failed", err);
  });

module.exports = mongoose;