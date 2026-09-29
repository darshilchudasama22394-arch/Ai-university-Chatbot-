const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const transporter = require("../config/email");

// =====================================================
// REGISTER
// =====================================================
const register = async (req, res) => {
  try {
    const { full_name, fullName, email, password } = req.body;

    const name = fullName || full_name;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      fullName: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "student",
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "Registration Successful",
    });
  } catch (error) {
    console.error("Register Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// LOGIN
// Email + Password
//       ↓
// Generate OTP
//       ↓
// Send OTP to registered email
// =====================================================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Password",
      });
    }

    // =================================================
    // GENERATE LOGIN OTP
    // =================================================

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Save OTP
    user.otp = otp;

    // OTP valid for 5 minutes
    user.otp_expiry = new Date(
      Date.now() + 5 * 60 * 1000
    );

    await user.save();

    // =================================================
    // SEND OTP EMAIL
    // =================================================

    await transporter.sendMail({
      from: `"AI University Helpdesk" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "AI University Helpdesk - Login OTP",
      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: auto;
          padding: 30px;
          background: #f8fafc;
          border-radius: 12px;
        ">

          <h2 style="color:#4f46e5;">
            AI University Helpdesk
          </h2>

          <p>
            Hello <strong>${user.fullName}</strong>,
          </p>

          <p>
            Your login verification OTP is:
          </p>

          <div style="
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            color: #4f46e5;
            background: white;
            padding: 20px;
            text-align: center;
            border-radius: 10px;
          ">
            ${otp}
          </div>

          <p style="margin-top:20px;">
            This OTP is valid for <strong>5 minutes</strong>.
          </p>

          <p>
            If you did not attempt to login,
            please ignore this email.
          </p>

          <hr />

          <p style="color:#64748b;">
            AI University Helpdesk
          </p>

        </div>
      `,
    });

    // IMPORTANT:
    // Do NOT send JWT before OTP verification.

    res.json({
      success: true,
      requiresOtp: true,
      email: user.email,
      message: "OTP sent to your registered email",
    });
  } catch (error) {
    console.error("Login Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// VERIFY LOGIN OTP
// OTP
// ↓
// JWT
// ↓
// Dashboard / Admin
// =====================================================
const verifyLoginOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    const enteredOTP = otp.toString().trim();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // =================================================
    // CHECK OTP EXISTS
    // =================================================

    if (!user.otp) {
      return res.status(400).json({
        success: false,
        message: "No OTP found. Please login again.",
      });
    }

    // =================================================
    // CHECK OTP EXPIRY
    // =================================================

    if (
      !user.otp_expiry ||
      new Date() > new Date(user.otp_expiry)
    ) {
      user.otp = null;
      user.otp_expiry = null;

      await user.save();

      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please login again.",
      });
    }

    // =================================================
    // CHECK OTP
    // =================================================

    if (user.otp.toString().trim() !== enteredOTP) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // =================================================
    // OTP CORRECT
    // Clear OTP so it cannot be reused
    // =================================================

    user.otp = null;
    user.otp_expiry = null;

    await user.save();

    // =================================================
    // CREATE JWT
    // =================================================

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // =================================================
    // REMOVE SENSITIVE DATA
    // =================================================

    const userResponse = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    };

    res.json({
      success: true,
      message: "OTP verified successfully",
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error(
      "Verify Login OTP Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// FORGOT PASSWORD
// =====================================================
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.json({
        success: false,
        message: "Email not registered",
      });
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    user.otp = otp;
    user.otp_expiry = new Date(
      Date.now() + 5 * 60 * 1000
    );

    await user.save();

    await transporter.sendMail({
      from: `"AI University Helpdesk" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject:
        "AI University Helpdesk - Password Reset OTP",
      html: `
        <h2>AI University Helpdesk</h2>

        <p>
          Hello <strong>${user.fullName}</strong>,
        </p>

        <p>
          Your password reset OTP is:
        </p>

        <h1 style="
          color:#4f46e5;
          letter-spacing:8px;
        ">
          ${otp}
        </h1>

        <p>
          This OTP is valid for 5 minutes.
        </p>
      `,
    });

    res.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error(
      "Forgot Password Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// VERIFY PASSWORD RESET OTP
// =====================================================
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.otp) {
      return res.status(400).json({
        success: false,
        message: "OTP not found",
      });
    }

    if (
      !user.otp_expiry ||
      new Date() > new Date(user.otp_expiry)
    ) {
      user.otp = null;
      user.otp_expiry = null;

      await user.save();

      return res.status(400).json({
        success: false,
        message: "OTP Expired",
      });
    }

    if (
      user.otp.toString().trim() !==
      otp.toString().trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    res.json({
      success: true,
      message: "OTP Verified Successfully",
    });
  } catch (error) {
    console.error(
      "Verify OTP Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// RESET PASSWORD
// =====================================================
const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Email and new password are required",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.password = await bcrypt.hash(
      newPassword,
      10
    );

    user.otp = null;
    user.otp_expiry = null;

    await user.save();

    res.json({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    console.error(
      "Reset Password Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// EXPORT
// =====================================================
module.exports = {
  register,
  login,
  verifyLoginOTP,
  forgotPassword,
  verifyOTP,
  resetPassword,
};