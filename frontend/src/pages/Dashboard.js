import React, { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/layout/Sidebar";
import ChatBox from "../components/chat/ChatBox";
import { jsPDF } from "jspdf";
import { toast } from "react-toastify";
import "./Dashboard.css";

function Dashboard() {
  // =====================================================
  // USER
  // =====================================================

  const user = JSON.parse(localStorage.getItem("user"));

  const userId = user?._id || user?.id;


  // =====================================================
  // STATES
  // =====================================================

  const [question, setQuestion] = useState("");
  const [search, setSearch] = useState("");

  const [filteredChats, setFilteredChats] = useState([]);

  const [loading, setLoading] = useState(false);

  const [listening, setListening] = useState(false);

  // Current chat session
  const [chats, setChats] = useState([]);


  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };


  // =====================================================
  // NEW CHAT
  // =====================================================

  const newChat = () => {
    setChats([]);
    setFilteredChats([]);
    setQuestion("");
    setSearch("");

    toast.success("New Chat Started");
  };


  // =====================================================
  // CLEAR CHAT WHEN DASHBOARD LOADS
  // =====================================================

  useEffect(() => {
    setChats([]);
    setFilteredChats([]);
    setQuestion("");
  }, []);


  // =====================================================
  // ASK AI
  // =====================================================

  const askAI = async () => {
    if (!question.trim()) {
      toast.warning("Please enter a question.");
      return;
    }

    if (!user) {
      toast.error("Please login again.");
      return;
    }

    if (!userId) {
      toast.error(
        "User information is missing. Please login again."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await API.post("/chat/ask", {
        question: question.trim(),

        user: {
          id: userId,
        },
      });

      if (response.data.success) {
        const newMessage = {
          question: question.trim(),

          answer:
            response.data.answer ||
            "Sorry, I could not generate an answer.",
        };

        setChats((prev) => [
          ...prev,
          newMessage,
        ]);

        setQuestion("");

        toast.success(
          "Answer Generated Successfully"
        );
      } else {
        toast.error(
          response.data.message ||
          "Unable to generate answer"
        );
      }

    } catch (error) {
      console.error(
        "Ask AI Error:",
        error
      );

      if (error.response) {
        toast.error(
          error.response.data.message ||
          "Something went wrong"
        );
      } else {
        toast.error(
          "Unable to connect to server"
        );
      }

    } finally {
      setLoading(false);
    }
  };


  // =====================================================
  // VOICE RECOGNITION
  // =====================================================

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error(
        "Speech Recognition is not supported in this browser."
      );

      return;
    }

    const recognition =
      new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.interimResults = false;

    recognition.maxAlternatives = 1;

    setListening(true);

    recognition.start();


    recognition.onresult = (event) => {
      const transcript =
        event.results[0][0].transcript;

      setQuestion(transcript);

      setListening(false);
    };


    recognition.onerror = () => {
      toast.error(
        "Voice Recognition Failed"
      );

      setListening(false);
    };


    recognition.onend = () => {
      setListening(false);
    };
  };


  // =====================================================
  // SEARCH CURRENT CHAT
  // =====================================================

  useEffect(() => {
    if (!search.trim()) {
      setFilteredChats(chats);

      return;
    }

    const searchText =
      search.toLowerCase();

    const result = chats.filter(
      (chat) =>
        chat.question
          ?.toLowerCase()
          .includes(searchText) ||

        chat.answer
          ?.toLowerCase()
          .includes(searchText)
    );

    setFilteredChats(result);

  }, [search, chats]);


  // =====================================================
  // DOWNLOAD CHAT AS PDF
  // =====================================================

  const downloadPDF = () => {
    if (chats.length === 0) {
      toast.warning(
        "No Chat Available"
      );

      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(18);

    doc.text(
      "AI University Helpdesk",
      20,
      20
    );

    doc.setFontSize(10);

    doc.text(
      `Student: ${
        user?.fullName ||
        user?.full_name ||
        "Student"
      }`,
      20,
      28
    );

    let y = 42;


    chats.forEach(
      (chat, index) => {

        doc.setFontSize(12);

        doc.text(
          `Question ${index + 1}`,
          20,
          y
        );

        y += 8;


        const questionLines =
          doc.splitTextToSize(
            chat.question,
            170
          );

        doc.text(
          questionLines,
          20,
          y
        );

        y +=
          questionLines.length * 7 +
          5;


        doc.text(
          "Answer:",
          20,
          y
        );

        y += 8;


        const answerLines =
          doc.splitTextToSize(
            chat.answer,
            170
          );

        doc.text(
          answerLines,
          20,
          y
        );

        y +=
          answerLines.length * 7 +
          12;


        if (y > 270) {
          doc.addPage();

          y = 20;
        }
      }
    );


    doc.save(
      "AI-University-Chat-History.pdf"
    );

    toast.success(
      "Chat PDF Downloaded"
    );
  };


  // =====================================================
  // SUGGESTED QUESTIONS
  // =====================================================

  const suggestions = [
    "What is the admission process?",
    "How can I apply for a scholarship?",
    "What are the hostel facilities?",
    "When are the semester exams?",
    "How do I pay my fees?",
  ];


  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="dashboard-page">

      {/* =================================================
          SIDEBAR
          ================================================= */}

      <Sidebar
        logout={logout}
        newChat={newChat}
      />


      {/* =================================================
          MAIN CONTENT
          ================================================= */}

      <div className="dashboard-content">


        {/* =================================================
            HEADER
            ================================================= */}

        <div className="dashboard-header">

          <h2>
            🎓 AI University Helpdesk
          </h2>

          <p>
            Welcome{" "}

            <strong className="text-primary">
              {user?.fullName ||
                user?.full_name ||
                "Student"}
            </strong>

          </p>

        </div>


        {/* =================================================
            CHAT CARD
            ================================================= */}

        <div className="chat-card">


          {/* =================================================
              SEARCH
              ================================================= */}

          <input
            type="text"
            className="form-control mb-3"
            placeholder="🔍 Search in current chat..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />


          {/* =================================================
              CHAT MESSAGES
              ================================================= */}

          <ChatBox
            chats={filteredChats}
          />


          {/* =================================================
              LOADING
              ================================================= */}

          {loading && (
            <div className="loading-box text-center my-3">

              <div
                className="spinner-border text-primary"
                role="status"
              >
                <span className="visually-hidden">
                  Loading...
                </span>
              </div>

              <p className="mt-2">
                🤖 AI is thinking...
              </p>

            </div>
          )}


          {/* =================================================
              SUGGESTED QUESTIONS
              ================================================= */}

          <div className="mb-3">

            <h5>
              💡 Suggested Questions
            </h5>


            {suggestions.map(
              (item, index) => (

                <button
                  key={index}
                  type="button"
                  className="btn btn-outline-primary btn-sm me-2 mb-2"
                  onClick={() =>
                    setQuestion(item)
                  }
                >
                  {item}
                </button>

              )
            )}

          </div>


          {/* =================================================
              QUESTION INPUT
              ================================================= */}

          <textarea
            className="form-control chat-input"
            rows="4"
            value={question}
            onChange={(e) =>
              setQuestion(e.target.value)
            }
            placeholder="Ask anything about your university..."
          />


          {/* =================================================
              ACTION BUTTONS
              ================================================= */}

          <div className="chat-actions">


            {/* ASK AI */}

            <button
              type="button"
              className="btn btn-primary"
              onClick={askAI}
              disabled={loading}
            >
              {loading
                ? "Thinking..."
                : "🚀 Ask AI"}
            </button>


            {/* SPEAK */}

            <button
              type="button"
              className="btn btn-danger"
              onClick={startListening}
              disabled={listening}
            >
              {listening
                ? "🎤 Listening..."
                : "🎤 Speak"}
            </button>


            {/* DOWNLOAD */}

            <button
              type="button"
              className="btn btn-success"
              onClick={downloadPDF}
            >
              📄 Download Chat
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;