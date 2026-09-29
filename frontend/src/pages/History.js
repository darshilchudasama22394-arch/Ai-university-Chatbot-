import React, {
  useEffect,
  useState,
  useCallback,
} from "react";
import { toast } from "react-toastify";
import Sidebar from "../components/layout/Sidebar";
import API from "../services/api";

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Currently opened question
  const [selectedChat, setSelectedChat] = useState(null);

  // ================= LOAD HISTORY =================
  const loadHistory = useCallback(async () => {
    try {
      setLoading(true);

      const res = await API.get("/chat/history");

      if (res.data.success) {
        setHistory(res.data.chats || []);
      } else {
        setHistory([]);
      }
    } catch (err) {
      console.error("History Error:", err);

      if (err.response) {
        toast.error(
          err.response.data.message ||
            "Unable to load history"
        );
      } else {
        toast.error(
          "Unable to connect to server"
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // ================= LOAD WHEN PAGE OPENS =================
  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // ================= CLICK QUESTION =================
  const handleQuestionClick = (chat) => {
    // If same question clicked again, close it
    if (selectedChat?._id === chat._id) {
      setSelectedChat(null);
    } else {
      setSelectedChat(chat);
    }
  };

  // ================= DELETE ONE CHAT =================
  const deleteChat = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this chat?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(
        `/chat/delete/${id}`
      );

      toast.success(
        "Chat Deleted Successfully"
      );

      // Close answer if deleted question is open
      if (selectedChat?._id === id) {
        setSelectedChat(null);
      }

      await loadHistory();
    } catch (err) {
      console.error(
        "Delete Chat Error:",
        err
      );

      if (err.response) {
        toast.error(
          err.response.data.message ||
            "Unable to delete chat"
        );
      } else {
        toast.error(
          "Unable to connect to server"
        );
      }
    }
  };

  // ================= DELETE ALL =================
  const deleteAllHistory = async () => {
    const confirmDelete = window.confirm(
      "Delete ALL chat history?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(
        "/chat/delete-all"
      );

      toast.success(
        "All Chat History Deleted"
      );

      setHistory([]);
      setSelectedChat(null);
    } catch (err) {
      console.error(
        "Delete All History Error:",
        err
      );

      if (err.response) {
        toast.error(
          err.response.data.message ||
            "Unable to delete all history"
        );
      } else {
        toast.error(
          "Unable to connect to server"
        );
      }
    }
  };

  // ================= LOGOUT =================
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  return (
    <div className="dashboard-page">

      {/* ================= SIDEBAR ================= */}
      <Sidebar
        logout={logout}
        newChat={() => {
          window.location.href =
            "/dashboard";
        }}
      />

      {/* ================= CONTENT ================= */}
      <div className="dashboard-content">

        {/* ================= HEADER ================= */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">

          <h2>
            🕘 Chat History
          </h2>

          {history.length > 0 && (
            <button
              className="btn btn-danger"
              onClick={deleteAllHistory}
            >
              🗑 Delete All
            </button>
          )}

        </div>

        {/* ================= LOADING ================= */}
        {loading ? (
          <div className="alert alert-info">
            Loading chat history...
          </div>
        ) : history.length === 0 ? (

          /* ================= EMPTY ================= */
          <div className="alert alert-info">
            No Chat History Found
          </div>

        ) : (

          /* ================= CHAT LIST ================= */
          history.map((chat) => {

            const isOpen =
              selectedChat?._id === chat._id;

            return (
              <div
                className="card shadow-sm mb-3"
                key={chat._id}
              >

                <div className="card-body">

                  {/* ================= QUESTION ROW ================= */}
                  <div
                    className="d-flex justify-content-between align-items-center"
                    style={{
                      cursor: "pointer",
                      gap: "15px",
                    }}
                    onClick={() =>
                      handleQuestionClick(chat)
                    }
                  >

                    {/* QUESTION */}
                    <h5
                      className="mb-0"
                      style={{
                        flex: 1,
                      }}
                    >
                      ❓ {chat.question}
                    </h5>

                    {/* RIGHT SIDE */}
                    <div
                      className="d-flex align-items-center"
                      style={{
                        gap: "10px",
                        flexShrink: 0,
                      }}
                    >

                      {/* VIEW ANSWER */}
                      <span
                        className="text-primary"
                        style={{
                          fontSize: "13px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {isOpen
                          ? "▲ Hide"
                          : "▼ View"}
                      </span>

                      {/* DELETE */}
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();

                          deleteChat(
                            chat._id
                          );
                        }}
                      >
                        🗑 Delete
                      </button>

                    </div>

                  </div>

                  {/* ================= DATE ================= */}
                  <small className="text-muted d-block mt-2">
                    {chat.createdAt
                      ? new Date(
                          chat.createdAt
                        ).toLocaleString()
                      : ""}
                  </small>

                  {/* ================= ANSWER ================= */}
                  {isOpen && (
                    <>
                      <hr />

                      <div
                        style={{
                          whiteSpace:
                            "pre-wrap",
                        }}
                      >
                        <strong>
                          🤖 Answer:
                        </strong>

                        <p className="mt-2 mb-0">
                          {chat.answer}
                        </p>
                      </div>
                    </>
                  )}

                </div>

              </div>
            );
          })

        )}

      </div>
    </div>
  );
}

export default History;