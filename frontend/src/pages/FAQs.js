import React, { useEffect, useState } from "react";
import api from "../services/api";

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

        // Backend response:
        // { success: true, faqs: [...] }

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

  // ================= TOGGLE FAQ =================

  const toggle = (index) => {
    setOpenIndex(
      openIndex === index ? null : index
    );
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        Loading FAQs...
      </div>
    );
  }

  // ================= ERROR =================

  if (error) {
    return (
      <div
        style={{
          padding: 24,
          color: "red",
        }}
      >
        {error}
      </div>
    );
  }

  // ================= UI =================

  return (
    <div
      style={{
        padding: 24,
        maxWidth: 800,
        margin: "0 auto",
      }}
    >
      <h1>❓ Frequently Asked Questions</h1>

      <p>
        Find answers to common university questions.
      </p>

      {/* NO FAQ */}
      {faqs.length === 0 ? (
        <div
          style={{
            padding: 20,
            border: "1px solid #ddd",
            borderRadius: 8,
            marginTop: 20,
          }}
        >
          <p>No FAQs available yet.</p>
        </div>
      ) : (
        /* FAQ LIST */
        faqs.map((faq, index) => (
          <div
            key={faq._id || faq.id || index}
            style={{
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: 16,
              marginBottom: 12,
              cursor: "pointer",
              background: "#fafafa",
            }}
            onClick={() => toggle(index)}
          >
            {/* QUESTION */}
            <h3
              style={{
                margin: 0,
                color: "#222",
              }}
            >
              {openIndex === index ? "▼" : "▶"}{" "}
              {faq.question}
            </h3>

            {/* ANSWER */}
            {openIndex === index && (
              <p
                style={{
                  marginTop: 12,
                  color: "#333",
                  lineHeight: 1.6,
                }}
              >
                {faq.answer}
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default FAQs;