import React, { useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api/auth";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const email = localStorage.getItem("resetEmail");

  const resetPassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
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
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "450px" }}>
      <h2 className="text-center mb-4">Create New Password</h2>

      <input
        type="password"
        className="form-control mb-3"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      <input
        type="password"
        className="form-control mb-3"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <button
        className="btn btn-primary w-100"
        onClick={resetPassword}
      >
        Update Password
      </button>
    </div>
  );
}

export default ResetPassword;