import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  return (
    <nav className="ai-navbar">

      <div className="ai-navbar-container">

        {/* LOGO */}
        <Link
          to="/"
          className="ai-navbar-logo"
          onClick={() => setMenuOpen(false)}
        >
          🎓 AI Helpdesk
        </Link>

        {/* DESKTOP MENU */}
        <div className="ai-navbar-desktop">

          <Link
            to="/"
            className="ai-navbar-link"
          >
            Home
          </Link>

          <a
            href="#about"
            className="ai-navbar-link"
          >
            About
          </a>

          <a
            href="#features"
            className="ai-navbar-link"
          >
            Features
          </a>

          {/* LOGIN */}
          <Link
            to="/login"
            className="ai-navbar-login"
          >
            Login
          </Link>

          {/* REGISTER */}
          <Link
            to="/register"
            className="ai-navbar-register"
          >
            Register
          </Link>

        </div>

        {/* MOBILE */}
        <div
          className="ai-navbar-mobile"
          ref={menuRef}
        >

          <button
            type="button"
            className="ai-navbar-three-dot"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ⋮
          </button>

          {menuOpen && (
            <div className="ai-navbar-dropdown">

              <Link
                to="/"
                className="ai-mobile-link"
                onClick={() => setMenuOpen(false)}
              >
                🏠 Home
              </Link>

              <a
                href="#about"
                className="ai-mobile-link"
                onClick={() => setMenuOpen(false)}
              >
                ℹ️ About
              </a>

              <a
                href="#features"
                className="ai-mobile-link"
                onClick={() => setMenuOpen(false)}
              >
                ✨ Features
              </a>

              <div className="ai-mobile-line"></div>

              <Link
                to="/login"
                className="ai-mobile-login"
                onClick={() => setMenuOpen(false)}
              >
                🔐 Login
              </Link>

              <Link
                to="/register"
                className="ai-mobile-register"
                onClick={() => setMenuOpen(false)}
              >
                📝 Register
              </Link>

            </div>
          )}

        </div>

      </div>

    </nav>
  );
}

export default Navbar;