import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";

function ManageFAQs() {
  const [faqs, setFaqs] = useState([]);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("General");

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // ================= GET FAQs =================

  const fetchFAQs = async () => {
    try {
      const res = await api.get("/admin/faqs");

      if (res.data.success) {
        setFaqs(res.data.faqs);
      }
    } catch (error) {
      console.error("FAQ Error:", error);
      toast.error("Failed to load FAQs");
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  // ================= CLEAR FORM =================

  const clearForm = () => {
    setQuestion("");
    setAnswer("");
    setCategory("General");
    setEditingId(null);
  };

  // ================= ADD / UPDATE =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!question.trim() || !answer.trim()) {
      toast.warning("Question and answer are required");
      return;
    }

    try {
      setLoading(true);

      let res;

      if (editingId) {
        // UPDATE
        res = await api.put(
          `/admin/faq/${editingId}`,
          {
            question,
            answer,
            category,
          }
        );
      } else {
        // ADD
        res = await api.post(
          "/admin/faq",
          {
            question,
            answer,
            category,
          }
        );
      }

      if (res.data.success) {
        toast.success(res.data.message);

        clearForm();

        fetchFAQs();
      }
    } catch (error) {
      console.error("Save FAQ Error:", error);

      toast.error(
        error.response?.data?.message ||
        "Unable to save FAQ"
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= EDIT =================

  const handleEdit = (faq) => {
    setEditingId(faq._id);

    setQuestion(faq.question || "");

    setAnswer(faq.answer || "");

    setCategory(
      faq.category || "General"
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ================= DELETE =================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this FAQ?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const res = await api.delete(
        `/admin/faq/${id}`
      );

      if (res.data.success) {
        toast.success(
          "FAQ Deleted Successfully"
        );

        fetchFAQs();
      }
    } catch (error) {
      console.error(
        "Delete FAQ Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
        "Unable to delete FAQ"
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
        <h1 className="fw-bold mb-1">❓ Manage FAQs</h1>
        <p className="text-muted mb-0">
          Add, update and delete frequently asked questions.
        </p>
      </div>

      {/* ================= FORM ================= */}

      <div className="management-form">
        <h2>
          {editingId
            ? "✏️ Edit FAQ"
            : "➕ Add New FAQ"}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* QUESTION */}
          <div className="mb-3">
            <label>
              Question
            </label>

            <input
              type="text"
              value={question}
              onChange={(e) =>
                setQuestion(e.target.value)
              }
              placeholder="Enter question"
            />
          </div>

          {/* ANSWER */}
          <div className="mb-3">
            <label>
              Answer
            </label>

            <textarea
              value={answer}
              onChange={(e) =>
                setAnswer(e.target.value)
              }
              placeholder="Enter answer"
              rows="5"
            />
          </div>

          {/* CATEGORY */}
          <div className="mb-4">
            <label>
              Category
            </label>

            <input
              type="text"
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              placeholder="Example: Admission"
            />
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
                ? "Update FAQ"
                : "Add FAQ"}
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

      {/* ================= FAQ LIST ================= */}

      <h2 className="fw-bold mb-3">📋 Existing FAQs</h2>

      {faqs.length === 0 ? (
        <div className="card p-4 text-center text-muted">
          <p className="mb-0">
            No FAQs available. Add your first FAQ above.
          </p>
        </div>
      ) : (
        faqs.map((faq) => (
          <div
            key={faq._id}
            className="management-item"
          >
            <h3>{faq.question}</h3>

            <p>{faq.answer}</p>

            <small>
              Category: {faq.category || "General"}
            </small>

            <div className="mt-3 d-flex align-items-center">
              <button
                className="management-edit"
                onClick={() =>
                  handleEdit(faq)
                }
              >
                ✏️ Edit
              </button>

              <button
                className="management-delete"
                onClick={() =>
                  handleDelete(faq._id)
                }
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

export default ManageFAQs;