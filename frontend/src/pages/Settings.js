import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { applyTheme } from "../utils/theme";
import "./Settings.css";

function Settings() {

  // =====================================================
  // DEFAULT THEME = DARK
  // =====================================================

  const [darkMode, setDarkMode] = useState(() => {

    const savedTheme =
      localStorage.getItem("theme");

    // If nothing saved → DARK
    return savedTheme !== "light";

  });

  const [language, setLanguage] =
    useState("English");

  const [notifications, setNotifications] =
    useState(true);

  // =====================================================
  // APPLY THEME
  // =====================================================

  useEffect(() => {
    applyTheme(darkMode ? "dark" : "light");
  }, [darkMode]);

  // =====================================================
  // CHANGE THEME
  // =====================================================

  const toggleDarkMode = () => {

    setDarkMode((previous) =>
      !previous
    );

  };

  return (

    <div className="settings-page">

      <div className="settings-container">

        <div className="settings-top-nav">
          <Link to="/dashboard" className="settings-back-btn">
            ← Back to Dashboard
          </Link>
        </div>

        <div className="settings-card">

          {/* ================= HEADER ================= */}

          <div className="settings-header">

            <h2>
              ⚙️ Settings
            </h2>

            <p>
              Manage your application preferences
            </p>

          </div>

          <hr />

          {/* ================= DARK MODE ================= */}

          <div className="setting-row">

            <div className="setting-info">

              <div className="setting-icon">
                {darkMode ? "🌙" : "☀️"}
              </div>

              <div>

                <h5>
                  Dark Mode
                </h5>

                <p>
                  {darkMode
                    ? "Dark theme is enabled"
                    : "Light theme is enabled"}
                </p>

              </div>

            </div>

            <button
              type="button"
              className={`toggle-btn ${
                darkMode ? "active" : ""
              }`}
              onClick={toggleDarkMode}
            >

              <span className="toggle-circle">
                {darkMode ? "🌙" : "☀️"}
              </span>

              <span>
                {darkMode ? "ON" : "OFF"}
              </span>

            </button>

          </div>

          <hr />

          {/* ================= LANGUAGE ================= */}

          <div className="setting-row">

            <div className="setting-info">

              <div className="setting-icon">
                🌐
              </div>

              <div>

                <h5>
                  Language
                </h5>

                <p>
                  Select your preferred language
                </p>

              </div>

            </div>

            <select
              className="language-select"
              value={language}
              onChange={(e) =>
                setLanguage(e.target.value)
              }
            >

              <option value="English">
                English
              </option>

              <option value="Gujarati">
                Gujarati
              </option>

              <option value="Hindi">
                Hindi
              </option>

            </select>

          </div>

          <hr />

          {/* ================= NOTIFICATIONS ================= */}

          <div className="setting-row">

            <div className="setting-info">

              <div className="setting-icon">
                🔔
              </div>

              <div>

                <h5>
                  Notifications
                </h5>

                <p>
                  Receive important notifications
                </p>

              </div>

            </div>

            <label className="switch">

              <input
                type="checkbox"
                checked={notifications}
                onChange={() =>
                  setNotifications(
                    !notifications
                  )
                }
              />

              <span className="slider"></span>

            </label>

          </div>

        </div>

      </div>

    </div>

  );
}

export default Settings;