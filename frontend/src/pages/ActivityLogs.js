import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../services/api";

function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= LOAD ACTIVITY LOGS =================

  const loadLogs = async () => {
    try {
      setLoading(true);

      const response = await API.get(
        "/admin/activity"
      );

      if (response.data.success) {
        setLogs(response.data.logs || []);
      }
    } catch (error) {
      console.error(
        "Activity Logs Error:",
        error
      );

      if (error.response) {
        toast.error(
          error.response.data.message ||
            "Unable to load activity logs"
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

  useEffect(() => {
    loadLogs();
  }, []);

  // ================= FORMAT DATE =================

  const formatDate = (date) => {
    if (!date) return "Unknown";

    const formatted = new Date(date);

    if (isNaN(formatted.getTime())) {
      return "Unknown";
    }

    return formatted.toLocaleString();
  };

  // ================= ACTION DISPLAY =================

  const getActionText = (action) => {
    switch (action) {
      case "DELETE_CHAT":
        return "🗑️ Deleted Chat";

      case "DELETE_ALL_CHATS":
        return "🗑️ Deleted All Chats";

      default:
        return action || "Unknown Action";
    }
  };

  return (
    <div className="activity-log-page">
      <div className="mb-3">
        <Link to="/admin" className="btn btn-secondary btn-sm">
          ← Back to Admin Dashboard
        </Link>
      </div>

      {/* ================= HEADER ================= */}

      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h1 className="fw-bold mb-1">📋 Activity Logs</h1>
          <p className="activity-log-muted mb-0">
            Monitor important student actions and system events
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={loadLogs}
        >
          🔄 Refresh Logs
        </button>
      </div>

      {/* ================= LOADING ================= */}

      {loading ? (
        <div className="card p-5 text-center text-muted">
          <div className="spinner-border text-primary mx-auto mb-2" role="status"></div>
          <p className="mb-0">Loading activity logs...</p>
        </div>
      ) : logs.length === 0 ? (
        <div className="card p-5 text-center text-muted">
          <p className="mb-0">No activity logs found.</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {logs.map((log) => (
            <div
              key={log._id}
              className="activity-log-card"
            >
              {/* USER */}
              <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap">
                <div>
                  <h5 className="fw-bold mb-1">
                    👤 {log.userName}
                  </h5>

                  <p className="activity-log-muted mb-0">
                    📧 {log.userEmail}
                  </p>
                </div>

                <span className="activity-log-badge">
                  {getActionText(log.action)}
                </span>
              </div>

              <hr />

              {/* DESCRIPTION */}
              <p className="mb-2">
                <strong>Activity:</strong> {log.description}
              </p>

              {/* DETAILS */}
              {log.details?.question && (
                <div className="activity-log-details">
                  <strong>❓ Deleted Question:</strong>
                  <p className="mt-1 mb-0">
                    {log.details.question}
                  </p>
                </div>
              )}

              {/* DELETE COUNT */}
              {log.details?.deletedCount !== undefined && (
                <div className="activity-log-count mt-2">
                  🗑️ Total chats deleted: <strong>{log.details.deletedCount}</strong>
                </div>
              )}

              {/* DATE */}
              <small className="activity-log-muted d-block mt-3">
                📅 {formatDate(log.createdAt)}
              </small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ActivityLogs;