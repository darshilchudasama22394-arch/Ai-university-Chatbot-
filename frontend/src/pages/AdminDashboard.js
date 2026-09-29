import React, { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import "./AdminDashboard.css";

const AdminDashboard = () => {

  // =====================================================
  // MOBILE MENU
  // =====================================================

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  // =====================================================
  // DARK MODE
  // DEFAULT = DARK
  // =====================================================

  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme =
      localStorage.getItem("theme");

    // Dark mode is default
    return savedTheme !== "light";
  });

  // =====================================================
  // DASHBOARD STATES
  // =====================================================

  const [stats, setStats] = useState({
    totalStudents: 0,
    totalChats: 0,
    totalFAQs: 0,
    totalNotices: 0,
  });

  const [faqs, setFaqs] = useState([]);
  const [notices, setNotices] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);

  const [activeSection, setActiveSection] =
    useState("dashboard");

  // =====================================================
  // FAQ STATES
  // =====================================================

  const [faqQuestion, setFaqQuestion] =
    useState("");

  const [faqAnswer, setFaqAnswer] =
    useState("");

  const [faqCategory, setFaqCategory] =
    useState("General");

  const [editingFAQ, setEditingFAQ] =
    useState(null);

  // =====================================================
  // NOTICE STATES
  // =====================================================

  const [noticeTitle, setNoticeTitle] =
    useState("");

  const [noticeDescription, setNoticeDescription] =
    useState("");

  const [noticeCategory, setNoticeCategory] =
    useState("General");

  const [editingNotice, setEditingNotice] =
    useState(null);

  // =====================================================
  // STUDENT / USER STATES
  // =====================================================

  const [students, setStudents] = useState([]);

  const [studentSearch, setStudentSearch] =
    useState("");

  const [studentRoleFilter, setStudentRoleFilter] =
    useState("student");

  const [editingStudent, setEditingStudent] =
    useState(null);

  const [studentName, setStudentName] =
    useState("");

  const [studentEmail, setStudentEmail] =
    useState("");

  const [studentPassword, setStudentPassword] =
    useState("");

  const [studentRole, setStudentRole] =
    useState("student");

  // =====================================================
  // APPLY THEME
  // =====================================================

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
      document.documentElement.classList.add(
        "dark-mode"
      );
    } else {
      document.body.classList.remove(
        "dark-mode"
      );
      document.documentElement.classList.remove(
        "dark-mode"
      );
    }

    localStorage.setItem(
      "theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  // =====================================================
  // TOGGLE DARK MODE
  // =====================================================

  const toggleDarkMode = () => {
    setDarkMode((previousMode) => !previousMode);
  };

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    loadStats();
    loadFAQs();
    loadNotices();
    loadStudents();
    loadActivityLogs();
  }, []);

  // =====================================================
  // MENU HANDLER
  // =====================================================

  const changeSection = (section) => {
    setActiveSection(section);

    // Close mobile menu
    setMobileMenuOpen(false);

    if (section === "students") {
      loadStudents();
    }

    if (section === "activity") {
      loadActivityLogs();
    }

    if (section === "faqs") {
      loadFAQs();
    }

    if (section === "notices") {
      loadNotices();
    }

    if (section === "dashboard") {
      loadStats();
    }
  };

  // =====================================================
  // REFRESH EVERYTHING
  // =====================================================

  const refreshAll = async () => {
    try {
      await Promise.all([
        loadStats(),
        loadFAQs(),
        loadNotices(),
        loadStudents(),
        loadActivityLogs(),
      ]);

      toast.success(
        "Admin dashboard refreshed"
      );
    } catch (error) {
      console.error(
        "Refresh All Error:",
        error
      );

      toast.error(
        "Failed to refresh dashboard"
      );
    }
  };

  // =====================================================
  // LOAD STATS
  // =====================================================

  const loadStats = async () => {
    try {
      const res = await api.get(
        "/admin/stats"
      );

      if (res.data.success) {
        setStats(
          res.data.stats || {
            totalStudents: 0,
            totalChats: 0,
            totalFAQs: 0,
            totalNotices: 0,
          }
        );
      }
    } catch (error) {
      console.error(
        "Stats Error:",
        error
      );
    }
  };

  // =====================================================
  // LOAD FAQs
  // =====================================================

  const loadFAQs = async () => {
    try {
      const res = await api.get(
        "/admin/faqs"
      );

      if (res.data.success) {
        setFaqs(
          res.data.faqs || []
        );
      }
    } catch (error) {
      console.error(
        "FAQ Error:",
        error
      );

      toast.error(
        "Failed to load FAQs"
      );
    }
  };

  // =====================================================
  // LOAD NOTICES
  // =====================================================

  const loadNotices = async () => {
    try {
      const res = await api.get(
        "/admin/notices"
      );

      if (res.data.success) {
        setNotices(
          res.data.notices || []
        );
      }
    } catch (error) {
      console.error(
        "Notice Error:",
        error
      );

      toast.error(
        "Failed to load notices"
      );
    }
  };

  // =====================================================
  // LOAD STUDENTS
  // =====================================================

  const loadStudents = async () => {
    try {
      const res = await api.get(
        "/admin/students"
      );

      if (res.data.success) {
        setStudents(
          res.data.students || []
        );
      }
    } catch (error) {
      console.error(
        "Students Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to load users"
      );
    }
  };

  // =====================================================
  // LOAD ACTIVITY LOGS
  // =====================================================

  const loadActivityLogs = async () => {
    try {
      const res = await api.get(
        "/admin/activity"
      );

      if (res.data.success) {
        setActivityLogs(
          res.data.logs || []
        );
      }
    } catch (error) {
      console.error(
        "Activity Logs Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to load activity logs"
      );
    }
  };

  // =====================================================
  // SAVE STUDENT / USER
  // =====================================================

  const saveStudent = async () => {

    if (
      !studentName.trim() ||
      !studentEmail.trim()
    ) {
      toast.warning(
        "Name and email are required"
      );
      return;
    }

    if (
      !editingStudent &&
      !studentPassword.trim()
    ) {
      toast.warning(
        "Password is required for new user"
      );
      return;
    }

    try {

      if (editingStudent) {

        await api.put(
          `/admin/student/${editingStudent._id}`,
          {
            fullName: studentName,
            email: studentEmail,
            role: studentRole,

            ...(studentPassword.trim()
              ? {
                  password:
                    studentPassword,
                }
              : {}),
          }
        );

        toast.success(
          "User updated successfully"
        );

      } else {

        await api.post(
          "/admin/student",
          {
            fullName: studentName,
            email: studentEmail,
            password: studentPassword,
            role: studentRole,
          }
        );

        toast.success(
          "User created successfully"
        );
      }

      clearStudentForm();

      await loadStudents();
      await loadStats();

    } catch (error) {

      console.error(
        "Save Student Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to save user"
      );
    }
  };

  // =====================================================
  // EDIT STUDENT
  // =====================================================

  const editStudent = (student) => {

    setEditingStudent(student);

    setStudentName(
      student.fullName || ""
    );

    setStudentEmail(
      student.email || ""
    );

    setStudentRole(
      student.role || "student"
    );

    setStudentPassword("");

    setActiveSection("students");

    setMobileMenuOpen(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // DELETE STUDENT
  // =====================================================

  const deleteStudent = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this user?"
      );

    if (!confirmDelete) {
      return;
    }

    try {

      await api.delete(
        `/admin/student/${id}`
      );

      toast.success(
        "User deleted successfully"
      );

      await loadStudents();
      await loadStats();

    } catch (error) {

      console.error(
        "Delete Student Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to delete user"
      );
    }
  };

  // =====================================================
  // CLEAR STUDENT FORM
  // =====================================================

  const clearStudentForm = () => {

    setEditingStudent(null);

    setStudentName("");

    setStudentEmail("");

    setStudentPassword("");

    setStudentRole("student");
  };

  // =====================================================
  // SAVE FAQ
  // =====================================================

  const saveFAQ = async () => {

    if (
      !faqQuestion.trim() ||
      !faqAnswer.trim()
    ) {
      toast.warning(
        "Question and answer are required"
      );
      return;
    }

    try {

      if (editingFAQ) {

        await api.put(
          `/admin/faq/${editingFAQ._id}`,
          {
            question: faqQuestion,
            answer: faqAnswer,
            category: faqCategory,
          }
        );

        toast.success(
          "FAQ updated successfully"
        );

      } else {

        await api.post(
          "/admin/faq",
          {
            question: faqQuestion,
            answer: faqAnswer,
            category: faqCategory,
          }
        );

        toast.success(
          "FAQ added successfully"
        );
      }

      clearFAQForm();

      await loadFAQs();
      await loadStats();

    } catch (error) {

      console.error(
        "Save FAQ Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to save FAQ"
      );
    }
  };

  // =====================================================
  // EDIT FAQ
  // =====================================================

  const editFAQ = (faq) => {

    setEditingFAQ(faq);

    setFaqQuestion(
      faq.question || ""
    );

    setFaqAnswer(
      faq.answer || ""
    );

    setFaqCategory(
      faq.category || "General"
    );

    setActiveSection("faqs");

    setMobileMenuOpen(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // DELETE FAQ
  // =====================================================

  const deleteFAQ = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this FAQ?"
      );

    if (!confirmDelete) {
      return;
    }

    try {

      await api.delete(
        `/admin/faq/${id}`
      );

      toast.success(
        "FAQ deleted successfully"
      );

      await loadFAQs();
      await loadStats();

    } catch (error) {

      console.error(
        "Delete FAQ Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to delete FAQ"
      );
    }
  };

  // =====================================================
  // CLEAR FAQ FORM
  // =====================================================

  const clearFAQForm = () => {

    setEditingFAQ(null);

    setFaqQuestion("");

    setFaqAnswer("");

    setFaqCategory("General");
  };

  // =====================================================
  // SAVE NOTICE
  // =====================================================

  const saveNotice = async () => {

    if (
      !noticeTitle.trim() ||
      !noticeDescription.trim()
    ) {
      toast.warning(
        "Title and description are required"
      );
      return;
    }

    try {

      if (editingNotice) {

        await api.put(
          `/admin/notice/${editingNotice._id}`,
          {
            title: noticeTitle,
            description: noticeDescription,
            category: noticeCategory,
          }
        );

        toast.success(
          "Notice updated successfully"
        );

      } else {

        await api.post(
          "/admin/notice",
          {
            title: noticeTitle,
            description: noticeDescription,
            category: noticeCategory,
          }
        );

        toast.success(
          "Notice added successfully"
        );
      }

      clearNoticeForm();

      await loadNotices();
      await loadStats();

    } catch (error) {

      console.error(
        "Save Notice Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to save notice"
      );
    }
  };

  // =====================================================
  // EDIT NOTICE
  // =====================================================

  const editNotice = (notice) => {

    setEditingNotice(notice);

    setNoticeTitle(
      notice.title || ""
    );

    setNoticeDescription(
      notice.description || ""
    );

    setNoticeCategory(
      notice.category || "General"
    );

    setActiveSection("notices");

    setMobileMenuOpen(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // DELETE NOTICE
  // =====================================================

  const deleteNotice = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this notice?"
      );

    if (!confirmDelete) {
      return;
    }

    try {

      await api.delete(
        `/admin/notice/${id}`
      );

      toast.success(
        "Notice deleted successfully"
      );

      await loadNotices();
      await loadStats();

    } catch (error) {

      console.error(
        "Delete Notice Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to delete notice"
      );
    }
  };

  // =====================================================
  // CLEAR NOTICE FORM
  // =====================================================

  const clearNoticeForm = () => {

    setEditingNotice(null);

    setNoticeTitle("");

    setNoticeDescription("");

    setNoticeCategory("General");
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  // =====================================================
  // FILTER USERS
  // =====================================================

  const filteredStudents =
    students.filter((student) => {

      const search =
        studentSearch
          .toLowerCase()
          .trim();

      const matchesSearch =
        !search ||
        student.fullName
          ?.toLowerCase()
          .includes(search) ||
        student.email
          ?.toLowerCase()
          .includes(search);

      const matchesRole =
        studentRoleFilter === "all" ||
        student.role ===
          studentRoleFilter;

      return (
        matchesSearch &&
        matchesRole
      );
    });

  // =====================================================
  // UI
  // =====================================================

  return (
    <div
      className={`admin-dashboard ${
        darkMode
          ? "admin-dark"
          : "admin-light"
      }`}
    >

      {/* =================================================
          MOBILE HEADER
      ================================================= */}

      <div className="mobile-admin-header">

        <button
          className="mobile-menu-button"
          onClick={() =>
            setMobileMenuOpen(
              !mobileMenuOpen
            )
          }
          aria-label="Open admin menu"
        >
          ⋮
        </button>

        <span className="mobile-admin-title">
          Admin Panel
        </span>

      </div>

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <div
        className={`admin-sidebar ${
          mobileMenuOpen
            ? "mobile-open"
            : ""
        }`}
      >

        {/* LOGO */}

        <div className="admin-logo">

          <h2>🎓</h2>

          <h3>
            Admin Panel
          </h3>

          <p>
            AI University Helpdesk
          </p>

        </div>

        {/* MENU */}

        <div className="admin-menu">

          {/* DASHBOARD */}

          <button
            className={`admin-menu-btn ${
              activeSection === "dashboard"
                ? "active"
                : ""
            }`}
            onClick={() =>
              changeSection(
                "dashboard"
              )
            }
          >
            <span>📊</span>
            <span>Dashboard</span>
          </button>

          {/* FAQs */}

          <button
            className={`admin-menu-btn ${
              activeSection === "faqs"
                ? "active"
                : ""
            }`}
            onClick={() =>
              changeSection("faqs")
            }
          >
            <span>❓</span>
            <span>Manage FAQs</span>
          </button>

          {/* NOTICES */}

          <button
            className={`admin-menu-btn ${
              activeSection === "notices"
                ? "active"
                : ""
            }`}
            onClick={() =>
              changeSection("notices")
            }
          >
            <span>📢</span>
            <span>Manage Notices</span>
          </button>

          {/* STUDENTS */}

          <button
            className={`admin-menu-btn ${
              activeSection === "students"
                ? "active"
                : ""
            }`}
            onClick={() =>
              changeSection(
                "students"
              )
            }
          >
            <span>👥</span>
            <span>Manage Students</span>
          </button>

          {/* ACTIVITY */}

          <button
            className={`admin-menu-btn ${
              activeSection === "activity"
                ? "active"
                : ""
            }`}
            onClick={() =>
              changeSection(
                "activity"
              )
            }
          >
            <span>📋</span>
            <span>Activity Logs</span>
          </button>

          {/* DARK / LIGHT MODE */}

          <button
            className="admin-menu-btn"
            onClick={toggleDarkMode}
          >
            <span>
              {darkMode
                ? "☀️"
                : "🌙"}
            </span>

            <span>
              {darkMode
                ? "Light Mode"
                : "Dark Mode"}
            </span>
          </button>

        </div>

        {/* LOGOUT */}

        <div className="admin-sidebar-bottom">

          <button
            className="admin-logout"
            onClick={logout}
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>

        </div>

      </div>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div className="admin-main">

        {/* =================================================
            DASHBOARD
        ================================================= */}

        {activeSection ===
          "dashboard" && (
          <>

            <div className="admin-section-header">

              <div>

                <h1>
                  📊 Admin Dashboard
                </h1>

                <p>
                  Welcome to the AI
                  University Helpdesk
                  Admin Panel.
                </p>

              </div>

              <button
                className="save-btn refresh-btn"
                onClick={refreshAll}
              >
                🔄 Refresh All
              </button>

            </div>

            {/* STATS */}

            <div className="stats-grid">

              <div className="stat-card">

                <h2>👥</h2>

                <h3>
                  {stats.totalStudents}
                </h3>

                <p>
                  Students
                </p>

              </div>

              <div className="stat-card">

                <h2>💬</h2>

                <h3>
                  {stats.totalChats}
                </h3>

                <p>
                  Total Chats
                </p>

              </div>

              <div className="stat-card">

                <h2>❓</h2>

                <h3>
                  {stats.totalFAQs}
                </h3>

                <p>
                  FAQs
                </p>

              </div>

              <div className="stat-card">

                <h2>📢</h2>

                <h3>
                  {stats.totalNotices}
                </h3>

                <p>
                  Notices
                </p>

              </div>

            </div>

          </>
        )}

        {/* =================================================
            FAQ SECTION
        ================================================= */}

        {activeSection ===
          "faqs" && (
          <>

            <h1>
              ❓ Manage FAQs
            </h1>

            <div className="admin-form">

              <h2>
                {editingFAQ
                  ? "✏️ Edit FAQ"
                  : "➕ Add FAQ"}
              </h2>

              <input
                type="text"
                placeholder="Question"
                value={faqQuestion}
                onChange={(e) =>
                  setFaqQuestion(
                    e.target.value
                  )
                }
              />

              <textarea
                placeholder="Answer"
                value={faqAnswer}
                onChange={(e) =>
                  setFaqAnswer(
                    e.target.value
                  )
                }
              />

              <input
                type="text"
                placeholder="Category"
                value={faqCategory}
                onChange={(e) =>
                  setFaqCategory(
                    e.target.value
                  )
                }
              />

              <button
                onClick={saveFAQ}
                className="save-btn"
              >
                {editingFAQ
                  ? "Update FAQ"
                  : "Add FAQ"}
              </button>

              {editingFAQ && (
                <button
                  onClick={
                    clearFAQForm
                  }
                  className="cancel-btn"
                >
                  Cancel
                </button>
              )}

            </div>

            <div className="admin-list">

              {faqs.length === 0 ? (

                <p>
                  No FAQs available.
                </p>

              ) : (

                faqs.map((faq) => (

                  <div
                    className="admin-item"
                    key={faq._id}
                  >

                    <div>

                      <h3>
                        {faq.question}
                      </h3>

                      <p>
                        {faq.answer}
                      </p>

                      <small>
                        Category:{" "}
                        {faq.category ||
                          "General"}
                      </small>

                    </div>

                    <div>

                      <button
                        className="edit-btn"
                        onClick={() =>
                          editFAQ(faq)
                        }
                      >
                        ✏️ Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          deleteFAQ(
                            faq._id
                          )
                        }
                      >
                        🗑️ Delete
                      </button>

                    </div>

                  </div>

                ))

              )}

            </div>

          </>
        )}

        {/* =================================================
            NOTICE SECTION
        ================================================= */}

        {activeSection ===
          "notices" && (
          <>

            <h1>
              📢 Manage Notices
            </h1>

            <div className="admin-form">

              <h2>
                {editingNotice
                  ? "✏️ Edit Notice"
                  : "➕ Add Notice"}
              </h2>

              <input
                type="text"
                placeholder="Notice Title"
                value={noticeTitle}
                onChange={(e) =>
                  setNoticeTitle(
                    e.target.value
                  )
                }
              />

              <textarea
                placeholder="Notice Description"
                value={
                  noticeDescription
                }
                onChange={(e) =>
                  setNoticeDescription(
                    e.target.value
                  )
                }
              />

              <input
                type="text"
                placeholder="Category"
                value={noticeCategory}
                onChange={(e) =>
                  setNoticeCategory(
                    e.target.value
                  )
                }
              />

              <button
                onClick={saveNotice}
                className="save-btn"
              >
                {editingNotice
                  ? "Update Notice"
                  : "Add Notice"}
              </button>

              {editingNotice && (
                <button
                  onClick={
                    clearNoticeForm
                  }
                  className="cancel-btn"
                >
                  Cancel
                </button>
              )}

            </div>

            <div className="admin-list">

              {notices.length === 0 ? (

                <p>
                  No notices available.
                </p>

              ) : (

                notices.map((notice) => (

                  <div
                    className="admin-item"
                    key={notice._id}
                  >

                    <div>

                      <h3>
                        {notice.title}
                      </h3>

                      <p>
                        {notice.description}
                      </p>

                      <small>
                        Category:{" "}
                        {notice.category ||
                          "General"}
                      </small>

                      <br />

                      <small>
                        Date:{" "}
                        {notice.date
                          ? new Date(
                              notice.date
                            ).toLocaleDateString()
                          : "Unknown date"}
                      </small>

                    </div>

                    <div>

                      <button
                        className="edit-btn"
                        onClick={() =>
                          editNotice(
                            notice
                          )
                        }
                      >
                        ✏️ Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          deleteNotice(
                            notice._id
                          )
                        }
                      >
                        🗑️ Delete
                      </button>

                    </div>

                  </div>

                ))

              )}

            </div>

          </>
        )}

        {/* =================================================
            STUDENTS / USERS
        ================================================= */}

        {activeSection ===
          "students" && (
          <>

            <div className="admin-section-header">

              <div>

                <h1>
                  👥 Manage Users
                </h1>

                <p>
                  Manage students and
                  administrators.
                </p>

              </div>

              <button
                className="save-btn refresh-btn"
                onClick={loadStudents}
              >
                🔄 Refresh
              </button>

            </div>

            {/* ADD / EDIT USER */}

            <div className="admin-form">

              <h2>
                {editingStudent
                  ? "✏️ Edit User"
                  : "➕ Add User"}
              </h2>

              <input
                type="text"
                placeholder="Full Name"
                value={studentName}
                onChange={(e) =>
                  setStudentName(
                    e.target.value
                  )
                }
              />

              <input
                type="email"
                placeholder="Email"
                value={studentEmail}
                onChange={(e) =>
                  setStudentEmail(
                    e.target.value
                  )
                }
              />

              <input
                type="password"
                placeholder={
                  editingStudent
                    ? "New Password (optional)"
                    : "Password"
                }
                value={
                  studentPassword
                }
                onChange={(e) =>
                  setStudentPassword(
                    e.target.value
                  )
                }
              />

              <select
                value={studentRole}
                onChange={(e) =>
                  setStudentRole(
                    e.target.value
                  )
                }
              >

                <option value="student">
                  Student
                </option>

                <option value="admin">
                  Admin
                </option>

              </select>

              <button
                className="save-btn"
                onClick={saveStudent}
              >
                {editingStudent
                  ? "💾 Update User"
                  : "➕ Add User"}
              </button>

              {editingStudent && (
                <button
                  className="cancel-btn"
                  onClick={
                    clearStudentForm
                  }
                >
                  Cancel
                </button>
              )}

            </div>

            {/* SEARCH */}

            <div className="admin-form">

              <input
                type="text"
                placeholder="🔍 Search by name or email..."
                value={studentSearch}
                onChange={(e) =>
                  setStudentSearch(
                    e.target.value
                  )
                }
              />

              <select
                value={
                  studentRoleFilter
                }
                onChange={(e) =>
                  setStudentRoleFilter(
                    e.target.value
                  )
                }
              >

                <option value="all">
                  All Users
                </option>

                <option value="student">
                  Students Only
                </option>

                <option value="admin">
                  Admins Only
                </option>

              </select>

            </div>

            {/* USER LIST */}

            <div className="admin-list">

              {filteredStudents.length ===
              0 ? (

                <div className="admin-item">

                  <p>
                    No users found.
                  </p>

                </div>

              ) : (

                filteredStudents.map(
                  (student) => (

                    <div
                      className="admin-item"
                      key={student._id}
                    >

                      <div>

                        <h3>
                          👤{" "}
                          {student.fullName ||
                            "Unknown User"}
                        </h3>

                        <p>
                          📧{" "}
                          {student.email}
                        </p>

                        <p>
                          🔐 Role:{" "}
                          <strong>
                            {student.role ===
                            "admin"
                              ? "Administrator"
                              : "Student"}
                          </strong>
                        </p>

                        <small>
                          📅 Created:{" "}
                          {student.createdAt
                            ? new Date(
                                student.createdAt
                              ).toLocaleString()
                            : "Unknown"}
                        </small>

                      </div>

                      <div>

                        <button
                          className="edit-btn"
                          onClick={() =>
                            editStudent(
                              student
                            )
                          }
                        >
                          ✏️ Edit
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() =>
                            deleteStudent(
                              student._id
                            )
                          }
                        >
                          🗑️ Delete
                        </button>

                      </div>

                    </div>

                  )
                )

              )}

            </div>

          </>
        )}

        {/* =================================================
            ACTIVITY LOGS
        ================================================= */}

        {activeSection ===
          "activity" && (
          <>

            <div className="admin-section-header">

              <div>

                <h1>
                  📋 Activity Logs
                </h1>

                <p>
                  Monitor important
                  student activities.
                </p>

              </div>

              <button
                className="save-btn refresh-btn"
                onClick={async () => {

                  await loadActivityLogs();

                  toast.success(
                    "Activity logs refreshed"
                  );

                }}
              >
                🔄 Refresh Logs
              </button>

            </div>

            <div className="admin-list">

              {activityLogs.length ===
              0 ? (

                <div className="admin-item">

                  <p>
                    No activity logs
                    available.
                  </p>

                </div>

              ) : (

                activityLogs.map(
                  (log) => (

                    <div
                      className="admin-item"
                      key={log._id}
                    >

                      <div>

                        <h3>
                          👤{" "}
                          {log.userName ||
                            log.user?.name ||
                            "Unknown Student"}
                        </h3>

                        <p>
                          📧{" "}
                          {log.userEmail ||
                            log.user?.email ||
                            "Unknown Email"}
                        </p>

                        <p>
                          <strong>
                            Action:
                          </strong>{" "}
                          {log.action ||
                            "Unknown Action"}
                        </p>

                        <p>
                          <strong>
                            Description:
                          </strong>{" "}
                          {log.description ||
                            "No description"}
                        </p>

                        {log.details
                          ?.question && (

                          <div>

                            <strong>
                              ❓ Deleted Question:
                            </strong>

                            <p>
                              {
                                log.details
                                  .question
                              }
                            </p>

                          </div>

                        )}

                        {log.details
                          ?.deletedCount !==
                          undefined && (

                          <p>

                            🗑️ Deleted Chats:{" "}

                            <strong>
                              {
                                log.details
                                  .deletedCount
                              }
                            </strong>

                          </p>

                        )}

                        {log.details &&
                          typeof log.details ===
                            "object" &&
                          !log.details
                            .question &&
                          log.details
                            .deletedCount ===
                            undefined && (

                          <p>

                            <strong>
                              Details:
                            </strong>{" "}

                            {JSON.stringify(
                              log.details
                            )}

                          </p>

                        )}

                        <small>

                          📅{" "}

                          {log.createdAt
                            ? new Date(
                                log.createdAt
                              ).toLocaleString()
                            : "Unknown date"}

                        </small>

                      </div>

                    </div>

                  )
                )

              )}

            </div>

          </>
        )}

      </div>

    </div>
  );
};

export default AdminDashboard;