import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../services/api";
import "./Auth.css";

function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!fullName.trim()) {
      toast.warning("Please enter your full name");
      return;
    }

    if (!email.trim()) {
      toast.warning("Please enter your email");
      return;
    }

    if (!password) {
      toast.warning("Please enter a password");
      return;
    }

    if (password.length < 6) {
      toast.warning(
        "Password must be at least 6 characters"
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.warning("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await API.post("/auth/register", {
        fullName: fullName.trim(),
        email: email.trim(),
        password,
      });

      if (response.data.success) {
        toast.success("Registration Successful");

        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        toast.error(
          response.data.message ||
            "Registration failed"
        );
      }
    } catch (error) {
      console.error("Register Error:", error);

      if (error.response) {
        toast.error(
          error.response.data.message ||
            "Registration failed"
        );
      } else {
        toast.error(
          "Unable to connect to server"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* Background Glow */}
      <div className="auth-glow glow-one"></div>
      <div className="auth-glow glow-two"></div>
      <div className="auth-glow glow-three"></div>

      {/* Register Card */}
      <div className="auth-card">

        {/* Logo */}
        <div className="auth-logo">

          <div className="logo-icon">
            🎓
          </div>

          <h1>AI University</h1>

          <p>Helpdesk</p>

        </div>

        {/* Heading */}
        <div className="auth-heading">

          <h2>
            Create Account 🚀
          </h2>

          <p>
            Join the AI University
            Helpdesk
          </p>

        </div>

        {/* Form */}
        <form onSubmit={handleRegister}>

          {/* Full Name */}
          <div className="auth-input-group">

            <label>
              Full Name
            </label>

            <div className="auth-input-wrapper">

              <span className="input-icon">
                👤
              </span>

              <input
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) =>
                  setFullName(e.target.value)
                }
                autoComplete="name"
              />

            </div>

          </div>

          {/* Email */}
          <div className="auth-input-group">

            <label>
              Email Address
            </label>

            <div className="auth-input-wrapper">

              <span className="input-icon">
                ✉️
              </span>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                autoComplete="email"
              />

            </div>

          </div>

          {/* Password */}
          <div className="auth-input-group">

            <label>
              Password
            </label>

            <div className="auth-input-wrapper">

              <span className="input-icon">
                🔐
              </span>

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Create a password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                autoComplete="new-password"
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword
                  ? "🙈"
                  : "👁️"}
              </button>

            </div>

          </div>

          {/* Confirm Password */}
          <div className="auth-input-group">

            <label>
              Confirm Password
            </label>

            <div className="auth-input-wrapper">

              <span className="input-icon">
                🔒
              </span>

              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                autoComplete="new-password"
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
              >
                {showConfirmPassword
                  ? "🙈"
                  : "👁️"}
              </button>

            </div>

          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading}
          >

            {loading ? (
              <>
                <span className="auth-spinner"></span>
                Creating Account...
              </>
            ) : (
              <>
                Create Account
                <span>→</span>
              </>
            )}

          </button>

        </form>

        {/* Divider */}
        <div className="auth-divider">
          <span>OR</span>
        </div>

        {/* Login */}
        <div className="auth-register">

          <p>
            Already have an account?
          </p>

          <Link to="/login">
            Sign In
          </Link>

        </div>

        {/* Footer */}
        <div className="auth-footer">

          <span>
            🔒 Secure Registration
          </span>

          <span>•</span>

          <span>
            AI Powered
          </span>

        </div>

      </div>

    </div>
  );
}

export default Register;