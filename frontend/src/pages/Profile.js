import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Sidebar from "../components/layout/Sidebar";
import API from "../services/api";
import "./Profile.css";

function Profile() {
  const [user, setUser] = useState(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("student");
  const [createdAt, setCreatedAt] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Password states
  const [showPasswordSection, setShowPasswordSection] =
    useState(false);

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  // ===============================
  // LOAD PROFILE
  // ===============================

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);

      const res = await API.get("/user/profile");

      if (res.data.success) {
        const userData = res.data.user;

        setUser(userData);

        setFullName(
          userData.fullName || ""
        );

        setEmail(
          userData.email || ""
        );

        setRole(
          userData.role || "student"
        );

        setCreatedAt(
          userData.createdAt || ""
        );

        // Update localStorage
        localStorage.setItem(
          "user",
          JSON.stringify(userData)
        );
      }
    } catch (error) {
      console.error(
        "Profile Error:",
        error
      );

      // Fallback to localStorage
      const savedUser =
        JSON.parse(
          localStorage.getItem("user")
        );

      if (savedUser) {
        setUser(savedUser);

        setFullName(
          savedUser.fullName || ""
        );

        setEmail(
          savedUser.email || ""
        );

        setRole(
          savedUser.role || "student"
        );

        setCreatedAt(
          savedUser.createdAt || ""
        );
      } else {
        toast.error(
          "Unable to load profile"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // SAVE PROFILE
  // ===============================

  const saveProfile = async () => {
    if (!fullName.trim()) {
      toast.warning(
        "Full name is required"
      );
      return;
    }

    try {
      setSaving(true);

      const res = await API.put(
        "/user/profile",
        {
          fullName: fullName.trim(),
        }
      );

      if (res.data.success) {
        const updatedUser =
          res.data.user;

        setUser(updatedUser);

        setFullName(
          updatedUser.fullName || ""
        );

        localStorage.setItem(
          "user",
          JSON.stringify(updatedUser)
        );

        toast.success(
          "Profile updated successfully"
        );
      }
    } catch (error) {
      console.error(
        "Update Profile Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  // ===============================
  // CHANGE PASSWORD
  // ===============================

  const changePassword = async () => {
    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      toast.warning(
        "Please fill all password fields"
      );
      return;
    }

    if (newPassword.length < 6) {
      toast.warning(
        "New password must contain at least 6 characters"
      );
      return;
    }

    if (
      newPassword !== confirmPassword
    ) {
      toast.error(
        "New passwords do not match"
      );
      return;
    }

    try {
      const res = await API.put(
        "/user/change-password",
        {
          currentPassword,
          newPassword,
        }
      );

      if (res.data.success) {
        toast.success(
          "Password changed successfully"
        );

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");

        setShowPasswordSection(false);
      }
    } catch (error) {
      console.error(
        "Change Password Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to change password"
      );
    }
  };

  // ===============================
  // LOGOUT
  // ===============================

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href =
      "/login";
  };

  // ===============================
  // LOADING
  // ===============================

  if (loading) {
    return (
      <div className="dashboard-page">
        <Sidebar
          logout={logout}
          newChat={() => {
            window.location.href =
              "/dashboard";
          }}
        />

        <div className="dashboard-content">
          <div className="profile-loading">
            Loading profile...
          </div>
        </div>
      </div>
    );
  }

  // ===============================
  // PROFILE UI
  // ===============================

  return (
    <div className="dashboard-page">

      {/* SIDEBAR */}

      <Sidebar
        logout={logout}
        newChat={() => {
          window.location.href =
            "/dashboard";
        }}
      />

      {/* CONTENT */}

      <div className="dashboard-content">

        <div className="profile-wrapper">

          {/* PAGE HEADER */}

          <div className="profile-page-header">

            <div>
              <h2>
                👤 My Profile
              </h2>

              <p>
                Manage your account information
              </p>
            </div>

          </div>

          {/* PROFILE CARD */}

          <div className="profile-card">

            {/* AVATAR */}

            <div className="profile-top">

              <div className="profile-avatar">
                {fullName
                  ? fullName
                      .charAt(0)
                      .toUpperCase()
                  : "U"}
              </div>

              <div className="profile-basic">

                <h3>
                  {fullName ||
                    "User"}
                </h3>

                <p>
                  {email}
                </p>

                <span
                  className={`profile-role ${
                    role === "admin"
                      ? "admin-role"
                      : "student-role"
                  }`}
                >
                  {role === "admin"
                    ? "👑 Administrator"
                    : "🎓 Student"}
                </span>

              </div>

            </div>

            <hr />

            {/* PERSONAL INFORMATION */}

            <div className="profile-section">

              <h4>
                👤 Personal Information
              </h4>

              <div className="profile-grid">

                <div className="profile-field">

                  <label>
                    Full Name
                  </label>

                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) =>
                      setFullName(
                        e.target.value
                      )
                    }
                    placeholder="Enter your full name"
                  />

                </div>

                <div className="profile-field">

                  <label>
                    Email Address
                  </label>

                  <input
                    type="email"
                    value={email}
                    disabled
                  />

                  <small>
                    Email cannot be changed.
                  </small>

                </div>

                <div className="profile-field">

                  <label>
                    Account Role
                  </label>

                  <input
                    type="text"
                    value={
                      role === "admin"
                        ? "Administrator"
                        : "Student"
                    }
                    disabled
                  />

                </div>

                <div className="profile-field">

                  <label>
                    Account Created
                  </label>

                  <input
                    type="text"
                    value={
                      createdAt
                        ? new Date(
                            createdAt
                          ).toLocaleDateString()
                        : "Not available"
                    }
                    disabled
                  />

                </div>

              </div>

              <button
                className="profile-save-btn"
                onClick={saveProfile}
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "💾 Save Changes"}
              </button>

            </div>

            <hr />

            {/* SECURITY */}

            <div className="profile-section">

              <div className="security-header">

                <div>
                  <h4>
                    🔐 Security
                  </h4>

                  <p>
                    Keep your account secure by
                    regularly updating your password.
                  </p>
                </div>

                <button
                  className="password-toggle-btn"
                  onClick={() =>
                    setShowPasswordSection(
                      !showPasswordSection
                    )
                  }
                >
                  {showPasswordSection
                    ? "Cancel"
                    : "Change Password"}
                </button>

              </div>

              {/* PASSWORD FORM */}

              {showPasswordSection && (
                <div className="password-form">

                  <div className="profile-field">

                    <label>
                      Current Password
                    </label>

                    <input
                      type="password"
                      value={
                        currentPassword
                      }
                      onChange={(e) =>
                        setCurrentPassword(
                          e.target.value
                        )
                      }
                      placeholder="Enter current password"
                    />

                  </div>

                  <div className="profile-field">

                    <label>
                      New Password
                    </label>

                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) =>
                        setNewPassword(
                          e.target.value
                        )
                      }
                      placeholder="Enter new password"
                    />

                  </div>

                  <div className="profile-field">

                    <label>
                      Confirm New Password
                    </label>

                    <input
                      type="password"
                      value={
                        confirmPassword
                      }
                      onChange={(e) =>
                        setConfirmPassword(
                          e.target.value
                        )
                      }
                      placeholder="Confirm new password"
                    />

                  </div>

                  <button
                    className="profile-password-btn"
                    onClick={
                      changePassword
                    }
                  >
                    🔑 Update Password
                  </button>

                </div>
              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Profile;