const jwt = require("jsonwebtoken");
const User = require("../models/User");
const logger = require("../utils/logger");

// =====================================================
// VERIFY JWT TOKEN
// =====================================================

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check Authorization header
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // Get token
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Invalid token.",
      });
    }

    // Verify JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Find current user in MongoDB
    const user = await User.findById(decoded.id).select(
      "-password -otp -otp_expiry"
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User account not found.",
      });
    }

    // Store complete user information
    // in request for next middleware/controller
    req.user = user;

    next();
  } catch (error) {
    logger.logError(
      "Authentication Error:",
      error.message
    );

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

// =====================================================
// ADMIN ONLY
// =====================================================

const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required.",
    });
  }

  next();
};

// =====================================================
// STUDENT ONLY
// =====================================================

const studentOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  if (req.user.role !== "student") {
    return res.status(403).json({
      success: false,
      message: "Student access required.",
    });
  }

  next();
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  verifyToken,
  adminOnly,
  studentOnly,
};