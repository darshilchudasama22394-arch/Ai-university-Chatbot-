import React from "react";

function Message({ question, answer }) {
  return (
    <div>

      {/* User Message */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "15px",
        }}
      >
        <div
          style={{
            background: "#4F46E5",
            color: "white",
            padding: "12px 18px",
            borderRadius: "15px",
            maxWidth: "70%",
            whiteSpace: "pre-wrap",
          }}
        >
          👤 {question}
        </div>
      </div>

      {/* AI Message */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          marginBottom: "25px",
        }}
      >
        <div
          style={{
            background: "#F3F4F6",
            color: "#111827",
            padding: "15px 20px",
            borderRadius: "15px",
            maxWidth: "75%",
            whiteSpace: "pre-wrap",
            lineHeight: "1.9",
            fontSize: "16px",
            wordBreak: "break-word",
          }}
        >
          🤖
          <br />
          {answer}
        </div>
      </div>

    </div>
  );
}

export default Message;