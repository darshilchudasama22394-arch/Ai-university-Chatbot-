const express = require("express");
const cors = require("cors");
require("dotenv").config();
// MongoDB Connection
require("./config/database");
// Routes
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const adminRoutes = require("./routes/adminRoutes");
const faqRoutes = require("./routes/faqRoutes");
const userRoutes = require("./routes/userRoutes");
const noticeRoutes = require("./routes/noticesRoutes");
const activityRoutes = require("./routes/activityRoutes");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://ai-university-chatbot.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/faqs", faqRoutes);
app.use("/api/user", userRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/admin/activity", activityRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send(
    "🚀 AI University Helpdesk Backend Running with MongoDB..."
  );
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `✅ Server running on http://localhost:${PORT}`
  );
});