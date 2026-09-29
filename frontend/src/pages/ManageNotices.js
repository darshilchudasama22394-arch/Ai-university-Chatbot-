import React, { useEffect, useState } from "react";
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
      toast.warning(
        "Title and description are required"
      );
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
          `/admin/notices/${editingId}`,
          noticeData
        );
      } else {
        // ADD
        res = await api.post(
          "/admin/notices",
          noticeData
        );
      }

      if (res.data.success) {
        toast.success(res.data.message);

        clearForm();

        fetchNotices();
      }
    } catch (error) {
      console.error(
        "Save Notice Error:",
        error
      );

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

    setDescription(
      notice.description || ""
    );

    setCategory(
      notice.category || "General"
    );

    if (notice.date) {
      const noticeDate = new Date(notice.date);

      if (!isNaN(noticeDate.getTime())) {
        setDate(
          noticeDate.toISOString().split("T")[0]
        );
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
      const res = await api.delete(
        `/admin/notices/${id}`
      );

      if (res.data.success) {
        toast.success(
          "Notice Deleted Successfully"
        );

        fetchNotices();
      }
    } catch (error) {
      console.error(
        "Delete Notice Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
        "Unable to delete notice"
      );
    }
  };

  // ================= UI =================

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "1000px",
        margin: "0 auto",
      }}
    >

      <h1>📢 Manage Notices</h1>

      <p>
        Add, update and delete university notices.
      </p>

      {/* ================= FORM ================= */}

      <div
        style={{
          background: "#ffffff",
          padding: "25px",
          borderRadius: "10px",
          marginTop: "20px",
          marginBottom: "30px",
          boxShadow:
            "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >

        <h2>
          {editingId
            ? "✏️ Edit Notice"
            : "➕ Add New Notice"}
        </h2>

        <form onSubmit={handleSubmit}>

          {/* TITLE */}

          <div style={{ marginBottom: "15px" }}>
            <label>
              <strong>Notice Title</strong>
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="Enter notice title"
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "5px",
                border:
                  "1px solid #ccc",
                borderRadius: "6px",
              }}
            />
          </div>

          {/* DESCRIPTION */}

          <div style={{ marginBottom: "15px" }}>
            <label>
              <strong>Description</strong>
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="Enter notice details"
              rows="5"
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "5px",
                border:
                  "1px solid #ccc",
                borderRadius: "6px",
              }}
            />
          </div>

          {/* CATEGORY */}

          <div style={{ marginBottom: "15px" }}>
            <label>
              <strong>Category</strong>
            </label>

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "5px",
                border:
                  "1px solid #ccc",
                borderRadius: "6px",
              }}
            >
              <option value="General">
                General
              </option>

              <option value="Exam">
                Exam
              </option>

              <option value="Admission">
                Admission
              </option>

              <option value="Event">
                Event
              </option>

              <option value="Holiday">
                Holiday
              </option>
            </select>
          </div>

          {/* DATE */}

          <div style={{ marginBottom: "15px" }}>
            <label>
              <strong>Notice Date</strong>
            </label>

            <input
              type="date"
              value={date}
              onChange={(e) =>
                setDate(e.target.value)
              }
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "5px",
                border:
                  "1px solid #ccc",
                borderRadius: "6px",
              }}
            />
          </div>

          {/* BUTTONS */}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "10px 20px",
              marginRight: "10px",
              background: "#0d6efd",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            {loading
              ? "Saving..."
              : editingId
              ? "Update Notice"
              : "Add Notice"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={clearForm}
              style={{
                padding: "10px 20px",
                background: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          )}

        </form>

      </div>

      {/* ================= NOTICE LIST ================= */}

      <h2>📋 Existing Notices</h2>

      {notices.length === 0 ? (
        <p>
          No notices available. Add your first
          notice above.
        </p>
      ) : (
        notices.map((notice) => (
          <div
            key={notice._id}
            style={{
              background: "#f8f9fa",
              padding: "20px",
              borderRadius: "8px",
              marginBottom: "15px",
              border:
                "1px solid #ddd",
            }}
          >

            <h3>
              📢 {notice.title}
            </h3>

            <p>
              {notice.description}
            </p>

            <p>
              <strong>Category:</strong>{" "}
              {notice.category ||
                "General"}
            </p>

            <p>
              <strong>Date:</strong>{" "}
                {notice.date
                  ? new Date(notice.date).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
              })
              : "No date"}
            </p>

            <div
              style={{
                marginTop: "15px",
              }}
            >

              <button
                onClick={() =>
                  handleEdit(notice)
                }
                style={{
                  marginRight: "10px",
                  padding: "8px 15px",
                  background: "#ffc107",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                ✏️ Edit
              </button>

              <button
                onClick={() =>
                  handleDelete(
                    notice._id
                  )
                }
                style={{
                  padding: "8px 15px",
                  background: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
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