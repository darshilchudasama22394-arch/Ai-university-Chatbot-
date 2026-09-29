import React, { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/layout/Sidebar";
import "./Notices.css";

function Notices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const res = await api.get("/notices");

      console.log("Notice response:", res.data);

      const list = Array.isArray(res.data?.notices)
        ? res.data.notices
        : Array.isArray(res.data)
        ? res.data
        : [];

      setNotices(list);
    } catch (error) {
      console.error("Notice Error:", error);
      setError("Failed to load notices");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "No date";
    }

    const date = new Date(dateValue);

    if (isNaN(date.getTime())) {
      return "No date";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="notices-page">

      {/* SIDEBAR */}

      <Sidebar
        logout={logout}
        newChat={() => {
          window.location.href = "/dashboard";
        }}
      />

      {/* MAIN CONTENT */}

      <div className="notices-content">

        <div className="notices-header">
          <div>
            <h1>📢 University Notices</h1>

            <p>
              Stay updated with the latest university
              announcements.
            </p>
          </div>
        </div>

        {/* LOADING */}

        {loading && (
          <div className="notice-message">
            <div className="notice-loader"></div>
            <p>Loading notices...</p>
          </div>
        )}

        {/* ERROR */}

        {!loading && error && (
          <div className="notice-error">
            ⚠️ {error}
          </div>
        )}

        {/* NO NOTICES */}

        {!loading &&
          !error &&
          notices.length === 0 && (
            <div className="empty-notices">
              <div className="empty-icon">
                📢
              </div>

              <h2>No Notices Available</h2>

              <p>
                There are currently no university
                announcements.
              </p>
            </div>
          )}

        {/* NOTICES */}

        {!loading &&
          !error &&
          notices.length > 0 && (
            <div className="notices-list">

              {notices.map((notice) => (
                <div
                  className="notice-card"
                  key={notice._id}
                >

                  {/* TOP */}

                  <div className="notice-top">

                    <div className="notice-icon">
                      📢
                    </div>

                    <div className="notice-title-area">

                      <h2>
                        {notice.title}
                      </h2>

                      <span className="notice-category">
                        {notice.category ||
                          "General"}
                      </span>

                    </div>

                  </div>

                  {/* DESCRIPTION */}

                  <div className="notice-description">
                    {notice.description}
                  </div>

                  {/* FOOTER */}

                  <div className="notice-footer">

                    <span>
                      📅{" "}
                      {formatDate(
                        notice.date
                      )}
                    </span>

                  </div>

                </div>
              ))}

            </div>
          )}

      </div>
    </div>
  );
}

export default Notices;