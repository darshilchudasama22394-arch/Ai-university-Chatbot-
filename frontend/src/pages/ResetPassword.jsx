import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Auth.css";

const API = "http://localhost:5000/api/auth";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const email = localStorage.getItem("resetEmail");

  const resetPassword = async (e) => {
    if (e) e.preventDefault();

    if (!newPassword || !confirmPassword) {
      alert("Please enter both password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API}/reset-password`, {
        email,
        newPassword,
      });

      alert(res.data.message);

      if (res.data.success) {
        localStorage.removeItem("resetEmail");
        window.location.href = "/";
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
          <div className="logo-icon">🔒</div>
          <h1>New Password</h1>
          <p>PU PIET Dep.</p>
        </div>

        {/* Heading */}
        <div className="auth-heading">
          <h2>Create New Password</h2>
          <p>Choose a secure password for your account.</p>
        </div>

        {/* Form */}
        <form onSubmit={resetPassword}>
          {/* New Password */}
          <div className="auth-input-group">
            <label>New Password</label>
            <div className="auth-input-wrapper">
              <span className="input-icon">🔐</span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                autoFocus
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="auth-input-group">
            <label>Confirm Password</label>
            <div className="auth-input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label="Toggle confirm password visibility"
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
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
                Updating Password...
              </>
            ) : (
              <>
                Update Password
                <span>→</span>
              </>
            )}
          </button>
        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <div className="auth-register">
          <p>Cancel password reset?</p>
          <Link to="/login">Back to Login</Link>
        </div>

        <div className="auth-footer">
          <span>🔒 End-to-End Encryption</span>
          <span>•</span>
          <span>AI University Helpdesk</span>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;