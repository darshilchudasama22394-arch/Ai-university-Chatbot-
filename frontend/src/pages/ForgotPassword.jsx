import React, { useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api/auth";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const sendOTP = async () => {
    try {
      const res = await axios.post(`${API}/forgot-password`, {
        email,
      });

      alert(res.data.message);

      if (res.data.success) {
        localStorage.setItem("resetEmail", email);
        window.location.href = "/verify-otp";
      }
    } catch (err) {
      alert("Something went wrong");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "450px" }}>
      <h2 className="text-center mb-4">Forgot Password</h2>

      <input
        type="email"
        className="form-control mb-3"
        placeholder="Enter Registered Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        className="btn btn-primary w-100"
        onClick={sendOTP}
      >
        Send OTP
      </button>
    </div>
  );
}

export default ForgotPassword;