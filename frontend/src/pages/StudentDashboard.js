import React from "react";
import { Link } from "react-router-dom";

function StudentDashboard() {
  return (
    <div className="container py-5" style={{ maxWidth: "800px" }}>
      <div className="card shadow-sm p-4 p-md-5 text-center">
        <div style={{ fontSize: "56px", lineHeight: "1", marginBottom: "16px" }}>🎓</div>
        <h1 className="fw-bold mb-3">Student Dashboard</h1>
        <p className="text-muted mb-4" style={{ fontSize: "16px" }}>
          Welcome to the PU PIET Dep. Academic Portal. Access booklet assistance, notices, and profile settings.
        </p>
        <div className="d-flex flex-wrap justify-content-center gap-3">
          <Link to="/dashboard" className="btn btn-primary px-4 py-2">
            🚀 Open AI Helpdesk
          </Link>
          <Link to="/notices" className="btn btn-secondary px-4 py-2">
            📢 University Notices
          </Link>
          <Link to="/profile" className="btn btn-outline-primary px-4 py-2">
            👤 My Profile
          </Link>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;