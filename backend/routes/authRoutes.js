const express = require("express");

const router = express.Router();

const {
  register,
  login,
  verifyLoginOTP,
  forgotPassword,
  verifyOTP,
  resetPassword,
} = require("../controllers/authController");


// =====================================================
// REGISTER
// POST /api/auth/register
// =====================================================

router.post(
  "/register",
  register
);


// =====================================================
// LOGIN
// POST /api/auth/login
//
// Email + Password
//        ↓
// Send OTP
// =====================================================

router.post(
  "/login",
  login
);


// =====================================================
// VERIFY LOGIN OTP
// POST /api/auth/verify-login-otp
//
// OTP
// ↓
// JWT
// ↓
// Dashboard / Admin
// =====================================================

router.post(
  "/verify-login-otp",
  verifyLoginOTP
);


// =====================================================
// FORGOT PASSWORD
// POST /api/auth/forgot-password
// =====================================================

router.post(
  "/forgot-password",
  forgotPassword
);


// =====================================================
// VERIFY PASSWORD RESET OTP
// POST /api/auth/verify-otp
// =====================================================

router.post(
  "/verify-otp",
  verifyOTP
);


// =====================================================
// RESET PASSWORD
// POST /api/auth/reset-password
// =====================================================

router.post(
  "/reset-password",
  resetPassword
);


// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;