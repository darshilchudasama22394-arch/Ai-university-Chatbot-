import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";

function ManageNotices() {
  const [notices, setNotices] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("General");
  const [date, setDate] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // ================= GET NOTICES =================

  const fetchNotices = async () => {
    try {
      const res = await api.get("/admin/notices");

      if (res.data.success) {
        setNotices(res.data.notices);
      }
    } catch (error) {
      console.error("Notice Error:", error);
      toast.error("Failed to load notices");
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  // ================= CLEAR FORM =================

  const clearForm = () => {
    setTitle("");
    setDescription("");
    setCategory("General");
    setDate("");
    setEditingId(null);
  };

  // ================= ADD / UPDATE =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      toast.warning("Title and description are required");
      return;
    }

    try {
      setLoading(true);

      let res;

      const noticeData = {
        title,
        description,
        category,
        date: date || undefined,
      };

      if (editingId) {
        // UPDATE
        res = await api.put(
          `/admin/notice/${editingId}`,
          noticeData
        );
      } else {
        // ADD
        res = await api.post(
          "/admin/notice",
          noticeData
        );
      }

      if (res.data.success) {
        toast.success(res.data.message);

        clearForm();

        fetchNotices();
      }
    } catch (error) {
      console.error("Save Notice Error:", error);

      toast.error(
        error.response?.data?.message ||
        "Unable to save notice"
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= EDIT =================

  const handleEdit = (notice) => {
    setEditingId(notice._id);

    setTitle(notice.title || "");

    setDescription(notice.description || "");

    setCategory(notice.category || "General");

    if (notice.date) {
      const noticeDate = new Date(notice.date);

      if (!isNaN(noticeDate.getTime())) {
        setDate(noticeDate.toISOString().split("T")[0]);
      } else {
        setDate("");
      }
    } else {
      setDate("");
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ================= DELETE =================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this notice?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const res = await api.delete(`/admin/notice/${id}`);

      if (res.data.success) {
        toast.success("Notice Deleted Successfully");
        fetchNotices();
      }
    } catch (error) {
      console.error("Delete Notice Error:", error);

      toast.error(
        error.response?.data?.message ||
        "Unable to delete notice"
      );
    }
  };

  // ================= UI =================

  return (
    <div className="management-page">
      <div className="mb-3">
        <Link to="/admin" className="btn btn-secondary btn-sm">
          ← Back to Admin Dashboard
        </Link>
      </div>

      <div className="mb-4">
        <h1 className="fw-bold mb-1">📢 Manage Notices</h1>
        <p className="text-muted mb-0">
          Add, update and delete university announcements.
        </p>
      </div>

      {/* ================= FORM ================= */}

      <div className="management-form">
        <h2>
          {editingId
            ? "✏️ Edit Notice"
            : "➕ Add New Notice"}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* TITLE */}
          <div className="mb-3">
            <label>Notice Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter notice title"
            />
          </div>

          {/* DESCRIPTION */}
          <div className="mb-3">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter notice details"
              rows="5"
            />
          </div>

          <div className="row g-3 mb-4">
            {/* CATEGORY */}
            <div className="col-md-6">
              <label>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="General">General</option>
                <option value="Exam">Exam</option>
                <option value="Admission">Admission</option>
                <option value="Event">Event</option>
                <option value="Holiday">Holiday</option>
              </select>
            </div>

            {/* DATE */}
            <div className="col-md-6">
              <label>Notice Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          {/* BUTTONS */}
          <div className="d-flex align-items-center">
            <button
              className="management-submit"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : editingId
                ? "Update Notice"
                : "Add Notice"}
            </button>

            {editingId && (
              <button
                className="management-cancel"
                type="button"
                onClick={clearForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ================= NOTICES LIST ================= */}

      <h2 className="fw-bold mb-3">📋 Existing Notices</h2>

      {notices.length === 0 ? (
        <div className="card p-4 text-center text-muted">
          <p className="mb-0">
            No notices available. Add your first notice above.
          </p>
        </div>
      ) : (
        notices.map((notice) => (
          <div
            key={notice._id}
            className="management-item"
          >
            <h3>{notice.title}</h3>

            <p>{notice.description}</p>

            <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
              <small>Category: {notice.category || "General"}</small>
              {notice.date && (
                <small>📅 {new Date(notice.date).toLocaleDateString()}</small>
              )}
            </div>

            <div className="d-flex align-items-center">
              <button
                className="management-edit"
                onClick={() => handleEdit(notice)}
              >
                ✏️ Edit
              </button>

              <button
                className="management-delete"
                onClick={() => handleDelete(notice._id)}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ManageNotices;