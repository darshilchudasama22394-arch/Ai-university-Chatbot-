import React, { useEffect, useState } from "react";
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
    <div
      style={{
        minHeight: "100vh",
        padding: "30px",
        background: "#f5f7fb",
      }}
    >
      {/* ================= HEADER ================= */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
          flexWrap: "wrap",
          gap: "15px",
        }}
      >
        <div>
          <h2>📋 Activity Logs</h2>

          <p
            style={{
              color: "#6b7280",
              marginBottom: 0,
            }}
          >
            Monitor important student activities
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={loadLogs}
        >
          🔄 Refresh
        </button>
      </div>

      {/* ================= LOADING ================= */}

      {loading ? (
        <div className="alert alert-info">
          Loading activity logs...
        </div>
      ) : logs.length === 0 ? (
        <div className="alert alert-info">
          No activity logs found.
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          {logs.map((log) => (
            <div
              key={log._id}
              style={{
                background: "#ffffff",
                borderRadius: "15px",
                padding: "20px",
                boxShadow:
                  "0 5px 20px rgba(0,0,0,0.08)",
                border:
                  "1px solid #e5e7eb",
              }}
            >
              {/* USER */}

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "flex-start",
                  gap: "15px",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <h5 style={{ marginBottom: "5px" }}>
                    👤 {log.userName}
                  </h5>

                  <p
                    style={{
                      margin: 0,
                      color: "#6b7280",
                    }}
                  >
                    📧 {log.userEmail}
                  </p>
                </div>

                <span
                  style={{
                    background: "#fee2e2",
                    color: "#991b1b",
                    padding: "7px 12px",
                    borderRadius: "20px",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  {getActionText(log.action)}
                </span>
              </div>

              <hr />

              {/* DESCRIPTION */}

              <p>
                <strong>
                  Activity:
                </strong>{" "}
                {log.description}
              </p>

              {/* DETAILS */}

              {log.details?.question && (
                <div
                  style={{
                    background: "#f8fafc",
                    borderRadius: "10px",
                    padding: "12px",
                    marginTop: "10px",
                  }}
                >
                  <strong>
                    ❓ Deleted Question:
                  </strong>

                  <p
                    style={{
                      marginTop: "5px",
                      marginBottom: 0,
                    }}
                  >
                    {log.details.question}
                  </p>
                </div>
              )}

              {/* DELETE COUNT */}

              {log.details?.deletedCount !==
                undefined && (
                <div
                  style={{
                    background: "#fff7ed",
                    padding: "10px",
                    borderRadius: "10px",
                    marginTop: "10px",
                  }}
                >
                  🗑️ Total chats deleted:{" "}
                  <strong>
                    {log.details.deletedCount}
                  </strong>
                </div>
              )}

              {/* DATE */}

              <small
                style={{
                  display: "block",
                  marginTop: "15px",
                  color: "#6b7280",
                }}
              >
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