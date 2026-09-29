import React from "react";

function ChatBox({ chats }) {
  return (
    <div
      className="chat-history mb-3"
      style={{
        maxHeight: "450px",
        overflowY: "auto",
        padding: "10px",
      }}
    >
      {chats.length === 0 ? (
        <div className="text-center text-muted mt-5">
          <h5>🤖 AI University Helpdesk</h5>
          <p>Ask your first question...</p>
        </div>
      ) : (
        chats.map((chat, index) => (
          <div key={index} className="mb-4">

            {/* User Question */}
            <div className="d-flex justify-content-end">
              <div
                style={{
                  background: "#4F46E5",
                  color: "#fff",
                  padding: "12px 18px",
                  borderRadius: "20px",
                  maxWidth: "75%",
                  marginBottom: "10px",
                }}
              >
                👤 {chat.question}
              </div>
            </div>

            {/* AI Answer */}
            <div className="d-flex justify-content-start">
              <div
                style={{
                  background: "#f1f3f6",
                  color: "#000",
                  padding: "15px",
                  borderRadius: "20px",
                  maxWidth: "80%",
                  whiteSpace: "pre-line",
                  lineHeight: "2",
                  fontSize: "16px",
                }}
              >
                🤖 {chat.answer}
              </div>
            </div>

          </div>
        ))
      )}
    </div>
  );
}

export default ChatBox;