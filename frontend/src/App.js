import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

// ================= PUBLIC / STUDENT PAGES =================
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyLoginOTP from "./pages/VerifyLoginOTP";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import FAQs from "./pages/FAQs";
import Notices from "./pages/Notices";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOTP from "./pages/VerifyOTP";
import ResetPassword from "./pages/ResetPassword";
import ActivityLogs from "./pages/ActivityLogs";

// ================= ADMIN =================
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ManageStudents from "./pages/ManageStudents";
import ManageFAQs from "./pages/ManageFAQs";
import ManageNotices from "./pages/ManageNotices";

import AdminRoute from "./components/AdminRoute";

// ================= 404 =================
import NotFound from "./pages/NotFound";

function App() {

  // =====================================================
  // GLOBAL THEME
  // DEFAULT = DARK
  // =====================================================

  useEffect(() => {

    let theme = localStorage.getItem("theme");

    if (!theme) {
      theme = "dark";
      localStorage.setItem("theme", "dark");
    }

    document.body.classList.remove(
      "dark-mode",
      "light-mode"
    );

    document.documentElement.classList.remove(
      "dark-mode",
      "light-mode"
    );

    document.body.classList.add(
      `${theme}-mode`
    );

    document.documentElement.classList.add(
      `${theme}-mode`
    );

  }, []);

  return (
    <BrowserRouter>

      <Routes>

        {/* =================================================
            PUBLIC ROUTES
        ================================================= */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* =================================================
            LOGIN OTP
        ================================================= */}

        <Route
          path="/verify-login-otp"
          element={<VerifyLoginOTP />}
        />

        {/* =================================================
            FORGOT PASSWORD
        ================================================= */}

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/verify-otp"
          element={<VerifyOTP />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        {/* =================================================
            STUDENT ROUTES
        ================================================= */}

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/history"
          element={<History />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/settings"
          element={<Settings />}
        />

        <Route
          path="/faqs"
          element={<FAQs />}
        />

        <Route
          path="/notices"
          element={<Notices />}
        />

        <Route
          path="/student"
          element={<StudentDashboard />}
        />

        {/* =================================================
            ADMIN ROUTES
        ================================================= */}

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/manage-students"
          element={<ManageStudents />}
        />

        <Route
          path="/manage-faqs"
          element={<ManageFAQs />}
        />

        <Route
          path="/manage-notices"
          element={<ManageNotices />}
        />

        <Route
          path="/activity-logs"
          element={<ActivityLogs />}
        />

        {/* =================================================
            404
        ================================================= */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="colored"
      />

    </BrowserRouter>
  );
}

export default App;