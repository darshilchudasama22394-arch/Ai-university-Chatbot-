import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../services/api";
import "./Auth.css";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  // =====================================================
  // LOGIN
  // =====================================================

  const handleLogin = async (e) => {

    e.preventDefault();

    if (!email.trim() || !password.trim()) {

      toast.warning(
        "Please enter email and password"
      );

      return;
    }

    try {

      setLoading(true);

      const cleanEmail =
        email.trim().toLowerCase();

      const response = await API.post(
        "/auth/login",
        {
          email: cleanEmail,
          password: password,
        }
      );

      console.log(
        "LOGIN RESPONSE:",
        response.data
      );

      if (!response.data.success) {

        toast.error(
          response.data.message ||
            "Login failed"
        );

        return;
      }

      // =================================================
      // OTP REQUIRED
      // =================================================

      if (response.data.requiresOtp === true) {

        // Save email temporarily
        sessionStorage.setItem(
          "loginEmail",
          response.data.email || cleanEmail
        );

        toast.success(
          "OTP sent to your registered email"
        );

        // IMPORTANT:
        // Do not save JWT here.
        // JWT will be received after OTP verification.

        navigate(
          "/verify-login-otp",
          {
            replace: true,
          }
        );

        return;
      }

      // =================================================
      // FALLBACK
      // =================================================

      toast.error(
        "OTP verification is required"
      );

    } catch (error) {

      console.error(
        "Login Error:",
        error
      );

      if (error.response) {

        toast.error(
          error.response.data.message ||
            "Invalid email or password"
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

      {/* Background */}

      <div className="auth-glow glow-one"></div>
      <div className="auth-glow glow-two"></div>
      <div className="auth-glow glow-three"></div>

      {/* Card */}

      <div className="auth-card">

        {/* Logo */}

        <div className="auth-logo">

          <div className="logo-icon">
            🎓
          </div>

          <h1>
            AI University
          </h1>

          <p>
            Helpdesk
          </p>

        </div>

        {/* Heading */}

        <div className="auth-heading">

          <h2>
            Welcome Back 👋
          </h2>

          <p>
            Sign in to continue to your
            university helpdesk
          </p>

        </div>

        {/* Login Form */}

        <form onSubmit={handleLogin}>

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
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                autoComplete="current-password"
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >
                {showPassword
                  ? "🙈"
                  : "👁️"}
              </button>

            </div>

          </div>

          {/* Forgot Password */}

          <div className="forgot-password">

            <Link to="/forgot-password">
              Forgot Password?
            </Link>

          </div>

          {/* Login */}

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
                Login
                <span>→</span>
              </>

            )}

          </button>

        </form>

        {/* Divider */}

        <div className="auth-divider">
          <span>OR</span>
        </div>

        {/* Register */}

        <div className="auth-register">

          <p>
            Don't have an account?
          </p>

          <Link to="/register">
            Create Account
          </Link>

        </div>

        {/* Footer */}

        <div className="auth-footer">

          <span>
            🔒 OTP Secure Login
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

export default Login;