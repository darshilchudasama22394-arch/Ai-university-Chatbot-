const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { verifyToken } = require("../middleware/authMiddleware");

router.use(verifyToken);

// ================= GET USER PROFILE =================

router.get("/profile", async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    console.error("Get Profile Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ================= UPDATE PROFILE =================

router.put("/profile", async (req, res) => {
  try {
    const { fullName, full_name } = req.body;
    const suppliedName = fullName ?? full_name;
    const name =
      typeof suppliedName === "string"
        ? suppliedName.trim()
        : "";

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Full name is required",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { fullName: name },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password -otp -otp_expiry");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "Profile Updated Successfully",
      user: user,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ================= CHANGE PASSWORD =================

router.put("/change-password", async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (
      typeof currentPassword !== "string" ||
      typeof newPassword !== "string" ||
      !currentPassword ||
      !newPassword
    ) {
      return res.status(400).json({
        success: false,
        message: "All password fields are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must contain at least 6 characters",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Compare old password
    const match = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!match) {
      return res.status(400).json({
        success: false,
        message: "Current Password is incorrect",
      });
    }

    // Hash new password
    user.password = await bcrypt.hash(
      newPassword,
      10
    );

    // Save user
    await user.save();

    res.json({
      success: true,
      message: "Password Changed Successfully",
    });
  } catch (error) {
    console.error(
      "Change Password Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ================= EXPORT ROUTER =================

module.exports = router;