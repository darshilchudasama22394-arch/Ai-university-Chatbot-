import React, { useEffect, useState } from "react";
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
    <div
      style={{
        padding: "30px",
        maxWidth: "1000px",
        margin: "0 auto",
      }}
    >

      <h1>❓ Manage FAQs</h1>

      <p>
        Add, update and delete frequently asked
        questions.
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
            ? "✏️ Edit FAQ"
            : "➕ Add New FAQ"}
        </h2>

        <form onSubmit={handleSubmit}>

          {/* QUESTION */}

          <div style={{ marginBottom: "15px" }}>
            <label>
              <strong>Question</strong>
            </label>

            <input
              type="text"
              value={question}
              onChange={(e) =>
                setQuestion(e.target.value)
              }
              placeholder="Enter question"
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

          {/* ANSWER */}

          <div style={{ marginBottom: "15px" }}>
            <label>
              <strong>Answer</strong>
            </label>

            <textarea
              value={answer}
              onChange={(e) =>
                setAnswer(e.target.value)
              }
              placeholder="Enter answer"
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

            <input
              type="text"
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              placeholder="Example: Admission"
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
              ? "Update FAQ"
              : "Add FAQ"}
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

      {/* ================= FAQ LIST ================= */}

      <h2>📋 Existing FAQs</h2>

      {faqs.length === 0 ? (
        <p>
          No FAQs available. Add your first FAQ
          above.
        </p>
      ) : (
        faqs.map((faq) => (
          <div
            key={faq._id}
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
              {faq.question}
            </h3>

            <p>
              {faq.answer}
            </p>

            <small>
              Category:{" "}
              {faq.category || "General"}
            </small>

            <div
              style={{
                marginTop: "15px",
              }}
            >

              <button
                onClick={() =>
                  handleEdit(faq)
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
                  handleDelete(faq._id)
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

export default ManageFAQs;