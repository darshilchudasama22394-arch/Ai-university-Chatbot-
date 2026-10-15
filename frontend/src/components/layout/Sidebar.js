import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { applyTheme, getStoredTheme } from "../../utils/theme";
import "./Sidebar.css";

function Sidebar({ logout, newChat }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => {
    setIsOpen(false);
  };

  const goTo = (path) => {
    navigate(path);
    closeMenu();
  };

  const toggleDarkMode = () => {
    applyTheme(getStoredTheme() === "dark" ? "light" : "dark");
    closeMenu();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="mobile-menu-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? "✕" : "☰"}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeMenu}
          aria-hidden="true"
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>

        {/* Logo */}
        <div className="logo-section" onClick={() => goTo("/dashboard")} style={{ cursor: "pointer" }}>
          <h2>🎓</h2>
          <div className="logo-text">
            <h4>PU PIET Dep.</h4>
            <span className="logo-subtitle">Student Portal</span>
          </div>
        </div>

        <div className="sidebar-divider"></div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          {/* New Chat */}
          <button
            className={`menu-btn menu-btn-primary ${isActive("/dashboard") && !chatsExist() ? "" : ""}`}
            onClick={() => {
              newChat();
              closeMenu();
            }}
          >
            <span className="menu-icon">➕</span>
            <span className="menu-label">New Chat</span>
          </button>

          {/* History */}
          <button
            className={`menu-btn ${isActive("/history") ? "menu-btn-active" : ""}`}
            onClick={() => goTo("/history")}
          >
            <span className="menu-icon">🕘</span>
            <span className="menu-label">History</span>
          </button>

          {/* Profile */}
          <button
            className={`menu-btn ${isActive("/profile") ? "menu-btn-active" : ""}`}
            onClick={() => goTo("/profile")}
          >
            <span className="menu-icon">👤</span>
            <span className="menu-label">Profile</span>
          </button>

          {/* Settings */}
          <button
            className={`menu-btn ${isActive("/settings") ? "menu-btn-active" : ""}`}
            onClick={() => goTo("/settings")}
          >
            <span className="menu-icon">⚙️</span>
            <span className="menu-label">Settings</span>
          </button>

          {/* FAQs */}
          <button
            className={`menu-btn ${isActive("/faqs") ? "menu-btn-active" : ""}`}
            onClick={() => goTo("/faqs")}
          >
            <span className="menu-icon">❓</span>
            <span className="menu-label">FAQs</span>
          </button>

          {/* Notices */}
          <button
            className={`menu-btn ${isActive("/notices") ? "menu-btn-active" : ""}`}
            onClick={() => goTo("/notices")}
          >
            <span className="menu-icon">📢</span>
            <span className="menu-label">Notices</span>
          </button>

          {/* Dark Mode */}
          <button
            className="menu-btn"
            onClick={toggleDarkMode}
          >
            <span className="menu-icon">🌙</span>
            <span className="menu-label">Theme Mode</span>
          </button>
        </nav>

        {/* Logout */}
        <div className="logout-section">
          <button
            className="logout-btn"
            onClick={() => {
              closeMenu();
              logout();
            }}
          >
            <span className="menu-icon">🚪</span>
            <span className="menu-label">Logout</span>
          </button>
        </div>

      </aside>
    </>
  );
}

// Helper to avoid reference error
function chatsExist() {
  return false;
}

export default Sidebar;