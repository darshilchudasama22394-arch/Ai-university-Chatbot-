import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Auth.css";

const API = "http://localhost:5000/api/auth";

function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const email = localStorage.getItem("resetEmail");

  const verifyOTP = async (e) => {
    if (e) e.preventDefault();

    if (!otp.trim()) {
      alert("Please enter the OTP");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API}/verify-otp`, {
        email,
        otp: otp.trim(),
      });

      alert(res.data.message);

      if (res.data.success) {
        window.location.href = "/reset-password";
      }
    } catch (err) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-glow glow-one"></div>
      <div className="auth-glow glow-two"></div>
      <div className="auth-glow glow-three"></div>

      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <div className="logo-icon">🔐</div>
          <h1>Verify OTP</h1>
          <p>PU PIET Dep.</p>
        </div>

        {/* Heading */}
        <div className="auth-heading">
          <h2>Enter Verification Code</h2>
          <p>We sent a verification code to:</p>
          {email && <strong className="otp-email">{email}</strong>}
        </div>

        {/* Form */}
        <form onSubmit={verifyOTP}>
          <div className="auth-input-group">
            <label>One-Time Password (OTP)</label>
            <div className="auth-input-wrapper">
              <span className="input-icon">🔢</span>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                autoFocus
                autoComplete="one-time-code"
              />
            </div>
          </div>

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="auth-spinner"></span>
                Verifying...
              </>
            ) : (
              <>
                Verify OTP
                <span>→</span>
              </>
            )}
          </button>
        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <div className="auth-register">
          <p>Wrong email address?</p>
          <Link to="/forgot-password">Try Again</Link>
        </div>

        <div className="auth-footer">
          <span>🔒 One-Time Password</span>
          <span>•</span>
          <span>AI University Helpdesk</span>
        </div>
      </div>
    </div>
  );
}

export default VerifyOTP;