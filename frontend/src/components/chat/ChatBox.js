import React from "react";
import Message from "./Message";
import "./ChatBox.css";

function ChatBox({ chats }) {
  return (
    <div className="chat-box">

      {chats.length === 0 ? (
        <div className="text-center text-muted mt-5">
          <h4>👋 Welcome!</h4>
          <p>Ask anything about your university.</p>
        </div>
      ) : (
        chats.map((chat, index) => (
          <Message
            key={index}
            question={chat.question}
            answer={chat.answer}
          />
        ))
      )}

    </div>
  );
}

export default ChatBox;