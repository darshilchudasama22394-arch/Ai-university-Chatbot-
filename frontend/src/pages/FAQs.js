import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./FAQs.css";

const FAQs = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const res = await api.get("/faqs");

        console.log("FAQ response:", res.data);

        const list = Array.isArray(res.data?.faqs)
          ? res.data.faqs
          : Array.isArray(res.data)
          ? res.data
          : [];

        setFaqs(list);
      } catch (err) {
        console.error("FAQ Error:", err);
        setError("Failed to load FAQs");
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (loading) {
    return (
      <div className="faqs-page faqs-state">
        <div className="faqs-loader"></div>
        <p>Loading FAQs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="faqs-page faqs-error">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="faqs-page">
      <div className="faqs-top-nav">
        <Link to="/dashboard" className="faqs-back-btn">
          ← Back to Dashboard
        </Link>
      </div>

      <div className="faqs-header">
        <h1>❓ Frequently Asked Questions</h1>
        <p>Find answers to common university questions.</p>
      </div>

      {faqs.length === 0 ? (
        <div className="faq-empty">
          <span className="faq-empty-icon" aria-hidden="true">💡</span>
          <h3>No FAQs Available Yet</h3>
          <p>Frequently asked questions will appear here once added by administrators.</p>
        </div>
      ) : (
        <div className="faqs-list">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq._id || faq.id || index}
                className={`faq-entry ${isOpen ? "faq-entry-open" : ""}`}
                onClick={() => toggle(index)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggle(index);
                  }
                }}
              >
                <div className="faq-entry-header">
                  <h3>
                    <span className="faq-icon-arrow" aria-hidden="true">
                      {isOpen ? "▼" : "▶"}
                    </span>
                    {faq.question}
                  </h3>
                </div>

                {isOpen && (
                  <div className="faq-answer-container">
                    <p className="faq-answer">{faq.answer}</p>
                    {faq.category && (
                      <span className="faq-category-badge">
                        Category: {faq.category}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FAQs;