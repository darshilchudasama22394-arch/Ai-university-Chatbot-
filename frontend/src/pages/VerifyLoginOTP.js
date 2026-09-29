import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../services/api";
import "./Auth.css";

function VerifyLoginOTP() {

  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [otp, setOtp] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // =====================================================
  // GET EMAIL
  // =====================================================

  useEffect(() => {

    const savedEmail =
      sessionStorage.getItem(
        "loginEmail"
      );

    if (!savedEmail) {

      toast.error(
        "Login session expired. Please login again."
      );

      navigate("/login", {
        replace: true,
      });

      return;
    }

    setEmail(savedEmail);

  }, [navigate]);

  // =====================================================
  // VERIFY OTP
  // =====================================================

  const handleVerifyOTP = async (e) => {

    e.preventDefault();

    const cleanOTP =
      otp.trim();

    if (!cleanOTP) {

      toast.warning(
        "Please enter OTP"
      );

      return;
    }

    if (cleanOTP.length !== 6) {

      toast.warning(
        "OTP must be 6 digits"
      );

      return;
    }

    try {

      setLoading(true);

      const response =
        await API.post(
          "/auth/verify-login-otp",
          {
            email: email.trim().toLowerCase(),
            otp: cleanOTP,
          }
        );

      console.log(
        "OTP RESPONSE:",
        response.data
      );

      if (!response.data.success) {

        toast.error(
          response.data.message ||
            "Invalid OTP"
        );

        return;
      }

      // =================================================
      // SAVE JWT
      // =================================================

      localStorage.setItem(
        "token",
        response.data.token
      );

      // =================================================
      // SAVE USER
      // =================================================

      localStorage.setItem(
        "user",
        JSON.stringify(
          response.data.user
        )
      );

      // Remove temporary email

      sessionStorage.removeItem(
        "loginEmail"
      );

      toast.success(
        "Login Successful 🎉"
      );

      // =================================================
      // ADMIN / STUDENT
      // =================================================

      if (
        response.data.user?.role ===
        "admin"
      ) {

        navigate("/admin", {
          replace: true,
        });

      } else {

        navigate("/dashboard", {
          replace: true,
        });
      }

    } catch (error) {

      console.error(
        "OTP Verification Error:",
        error
      );

      if (error.response) {

        toast.error(
          error.response.data.message ||
            "Invalid OTP"
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

  // =====================================================
  // LOGIN AGAIN
  // =====================================================

  const loginAgain = () => {

    sessionStorage.removeItem(
      "loginEmail"
    );

    navigate("/login", {
      replace: true,
    });
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
            🔐
          </div>

          <h1>
            Verify Login
          </h1>

          <p>
            AI University Helpdesk
          </p>

        </div>

        {/* Heading */}

        <div className="auth-heading">

          <h2>
            Enter OTP 🔑
          </h2>

          <p>
            We sent a 6-digit verification
            code to:
          </p>

          <strong className="otp-email">
            {email}
          </strong>

        </div>

        {/* OTP FORM */}

        <form onSubmit={handleVerifyOTP}>

          <div className="auth-input-group">

            <label>
              Verification OTP
            </label>

            <div className="auth-input-wrapper">

              <span className="input-icon">
                🔢
              </span>

              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => {

                  const value =
                    e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 6);

                  setOtp(value);
                }}
                autoFocus
                autoComplete="one-time-code"
              />

            </div>

          </div>

          {/* VERIFY BUTTON */}

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
                Verify & Login
                <span>→</span>
              </>

            )}

          </button>

        </form>

        {/* LOGIN AGAIN */}

        <div
          className="otp-help"
          style={{
            textAlign: "center",
            marginTop: "22px",
          }}
        >

          <p>
            Didn't receive the OTP?
          </p>

          <button
            type="button"
            className="otp-link-btn"
            onClick={loginAgain}
          >
            Login Again
          </button>

        </div>

        {/* WRONG EMAIL */}

        <div
          className="auth-register"
          style={{
            marginTop: "18px",
          }}
        >

          <p>
            Wrong email?
          </p>

          <button
            type="button"
            className="otp-link-btn"
            onClick={loginAgain}
          >
            Back to Login
          </button>

        </div>

        {/* Footer */}

        <div className="auth-footer">

          <span>
            🔒 Secure OTP
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

export default VerifyLoginOTP;