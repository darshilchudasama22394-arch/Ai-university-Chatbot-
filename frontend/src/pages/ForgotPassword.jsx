import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Auth.css";

const API = "http://localhost:5000/api/auth";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOTP = async (e) => {
    if (e) e.preventDefault();

    if (!email.trim()) {
      alert("Please enter your registered email");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API}/forgot-password`, {
        email: email.trim(),
      });

      alert(res.data.message);

      if (res.data.success) {
        localStorage.setItem("resetEmail", email.trim());
        window.location.href = "/verify-otp";
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
          <div className="logo-icon">🔑</div>
          <h1>Reset Password</h1>
          <p>PU PIET Dep.</p>
        </div>

        {/* Heading */}
        <div className="auth-heading">
          <h2>Forgot Your Password?</h2>
          <p>Enter your registered email and we'll send you an OTP.</p>
        </div>

        {/* Form */}
        <form onSubmit={sendOTP}>
          <div className="auth-input-group">
            <label>Registered Email Address</label>
            <div className="auth-input-wrapper">
              <span className="input-icon">✉️</span>
              <input
                type="email"
                placeholder="Enter Registered Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                autoFocus
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
                Sending OTP...
              </>
            ) : (
              <>
                Send OTP
                <span>→</span>
              </>
            )}
          </button>
        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <div className="auth-register">
          <p>Remember your password?</p>
          <Link to="/login">Back to Login</Link>
        </div>

        <div className="auth-footer">
          <span>🔒 Secure Verification</span>
          <span>•</span>
          <span>AI University Helpdesk</span>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;