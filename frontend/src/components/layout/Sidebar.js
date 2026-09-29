import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

function Sidebar({ logout, newChat }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => {
    setIsOpen(false);
  };

  const goTo = (path) => {
    navigate(path);
    closeMenu();
  };

  const toggleDarkMode = () => {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }

    closeMenu();
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="mobile-menu-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open menu"
      >
        {isOpen ? "✕" : "☰"}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeMenu}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>

        {/* Logo */}
        <div className="logo-section">
          <h2>🎓</h2>
          <h4>AI University Helpdesk</h4>
        </div>

        <hr />

        {/* New Chat */}
        <button
          className="menu-btn"
          onClick={() => {
            newChat();
            closeMenu();
          }}
        >
          ➕ New Chat
        </button>

        {/* History */}
        <button
          className="menu-btn"
          onClick={() => goTo("/history")}
        >
          🕘 History
        </button>

        {/* Profile */}
        <button
          className="menu-btn"
          onClick={() => goTo("/profile")}
        >
          👤 Profile
        </button>

        {/* Settings */}
        <button
          className="menu-btn"
          onClick={() => goTo("/settings")}
        >
          ⚙️ Settings
        </button>

        {/* FAQs */}
        <button
          className="menu-btn"
          onClick={() => goTo("/faqs")}
        >
          ❓ FAQs
        </button>

        {/* Notices */}
        <button
          className="menu-btn"
          onClick={() => goTo("/notices")}
        >
          📢 Notices
        </button>

        {/* Dark Mode */}
        <button
          className="menu-btn"
          onClick={toggleDarkMode}
        >
          🌙 Dark Mode
        </button>

        {/* Logout */}
        <div className="logout-section">
          <button
            className="logout-btn"
            onClick={() => {
              closeMenu();
              logout();
            }}
          >
            🚪 Logout
          </button>
        </div>

      </div>
    </>
  );
}

export default Sidebar;