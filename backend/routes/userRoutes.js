const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// ================= GET USER PROFILE =================

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "-password -otp -otp_expiry"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user: user,
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

router.put("/:id", async (req, res) => {
  try {
    const { full_name, fullName, email } = req.body;

    // Support both fullName and full_name
    const name = fullName || full_name;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Full name and email are required",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        fullName: name,
        email: email,
      },
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

router.post("/change-password", async (req, res) => {
  try {
    const {
      userId,
      currentPassword,
      newPassword,
    } = req.body;

    // Check required fields
    if (!userId || !currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "All password fields are required",
      });
    }

    // Find user
    const user = await User.findById(userId);

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