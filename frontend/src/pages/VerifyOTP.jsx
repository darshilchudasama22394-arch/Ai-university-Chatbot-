import React, { useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api/auth";

function VerifyOTP() {
  const [otp, setOtp] = useState("");

  const email = localStorage.getItem("resetEmail");

  const verifyOTP = async () => {
    try {
      const res = await axios.post(`${API}/verify-otp`, {
        email,
        otp,
      });

      alert(res.data.message);

      if (res.data.success) {
        window.location.href = "/reset-password";
      }
    } catch (err) {
      alert("Something went wrong");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "450px" }}>
      <h2 className="text-center mb-4">Verify OTP</h2>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />

      <button
        className="btn btn-success w-100"
        onClick={verifyOTP}
      >
        Verify OTP
      </button>
    </div>
  );
}

export default VerifyOTP;