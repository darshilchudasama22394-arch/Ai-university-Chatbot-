import React from "react";
import Message from "./Message";
import "./ChatBox.css";

function ChatBox({ chats }) {
  return (
    <div className="chat-box" role="log" aria-live="polite" aria-label="Chat messages">

      {chats.length === 0 ? (
        <div className="chat-empty-state">
          <span className="chat-empty-icon" aria-hidden="true">✦</span>
          <h4>Ask your booklet assistant</h4>
          <p>Answers are based only on the four academic booklets listed here.</p>
        </div>
      ) : (
        chats.map((chat, index) => (
          <Message
            key={index}
            question={chat.question}
            answer={chat.answer}
            sources={chat.sources}
          />
        ))
      )}

    </div>
  );
}

export default ChatBox;