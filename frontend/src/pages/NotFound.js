import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh", padding: "24px", background: "var(--color-background)" }}
    >
      <div
        className="card shadow p-4 p-md-5 text-center"
        style={{ maxWidth: "520px", width: "100%", borderRadius: "20px" }}
      >
        <div style={{ fontSize: "64px", lineHeight: "1", marginBottom: "16px" }}>🔍</div>
        <h1 className="fw-bold mb-2" style={{ fontSize: "32px" }}>404</h1>
        <h3 className="fw-bold mb-3" style={{ fontSize: "20px" }}>Page Not Found</h3>
        <p className="text-muted mb-4">
          The page you are looking for might have been moved or does not exist.
        </p>
        <div>
          <Link to="/" className="btn btn-primary px-4 py-2">
            🏠 Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;