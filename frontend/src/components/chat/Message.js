import React from "react";
import { formatBookletAnswer, formatBookletSource } from "../../utils/bookletDisplay";

function Message({ question, answer, sources = [] }) {
  return (
    <article className="chat-message">
      <div className="chat-message-row chat-message-user">
        <div className="chat-message-content">
          <span className="chat-message-label">You</span>
          <div className="chat-message-bubble">{question}</div>
        </div>
      </div>

      <div className="chat-message-row chat-message-assistant">
        <span className="chat-assistant-avatar" aria-hidden="true">✦</span>
        <div className="chat-message-content">
          <span className="chat-message-label">PU PIET Dep.</span>
          <div className="chat-message-bubble">{formatBookletAnswer(answer)}</div>
          {sources.length > 0 && (
            <div className="chat-source-list" aria-label="Answer sources">
              <span>From the booklets</span>
              {sources.map((source) => (
                <span className="chat-source-chip" key={source}>
                  {formatBookletSource(source)}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default Message;