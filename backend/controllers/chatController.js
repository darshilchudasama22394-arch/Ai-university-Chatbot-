const Groq = require("groq-sdk");
const Chat = require("../models/Chat");
const ActivityLog = require("../models/ActivityLog");

// =====================================================
// GROQ
// =====================================================

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// =====================================================
// CHECK AVAILABLE GROQ MODELS
// =====================================================

const checkGroqModels = async () => {
  try {
    const models = await groq.models.list();

    console.log("\n====================================");
    console.log("AVAILABLE GROQ MODELS");
    console.log("====================================");

    models.data.forEach((model) => {
      console.log(model.id);
    });

    console.log("====================================\n");
  } catch (error) {
    console.error(
      "Groq Models Error:",
      error.message
    );
  }
};

// Check models when backend starts
checkGroqModels();


// =====================================================
// ASK AI
// =====================================================

const askAI = async (req, res) => {
  try {
    const { question } = req.body;

    // Check question
    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    // Check logged-in user
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // =================================================
    // GROQ AI
    // =================================================

    const completion =
      await groq.chat.completions.create({
        model: "qwen/qwen3.8-27b",

        messages: [
          {
            role: "system",

            content: `
You are an AI University Helpdesk.

Rules:

- Answer in very simple English.
- Never write long paragraphs.
- Always use headings.
- Always answer using numbered points or bullet points.
- Every numbered step MUST start on a NEW LINE.
- Leave one blank line after every numbered step.
- Leave one blank line after every heading.
- Never put Step 2 on the same line as Step 1.

Always use this style:

🎓 Heading

📌 Steps:

1. Step One

2. Step Two

3. Step Three

📄 Required Documents:

• Document 1

• Document 2

💡 Tip:

• Helpful tip

Always follow this format.
            `,
          },

          {
            role: "user",
            content: question.trim(),
          },
        ],

        temperature: 0.5,
        max_tokens: 700,
      });

    // =================================================
    // GET AI ANSWER
    // =================================================

    let answer =
      completion.choices[0].message.content;

    // =================================================
    // IMPROVE FORMATTING
    // =================================================

    answer = answer.replace(
      /(\d+\.)/g,
      "\n$1"
    );

    answer = answer.replace(
      /•/g,
      "\n•"
    );

    answer = answer.replace(
      /📌/g,
      "\n\n📌"
    );

    answer = answer.replace(
      /📄/g,
      "\n\n📄"
    );

    answer = answer.replace(
      /💡/g,
      "\n\n💡"
    );

    answer = answer.replace(
      /\n{3,}/g,
      "\n\n"
    );

    console.log("AI Answer:");
    console.log(answer);

    // =================================================
    // SAVE CHAT
    // =================================================

    const chat = await Chat.create({
      userId: req.user._id,
      question: question.trim(),
      answer,
    });

    // =================================================
    // SEND RESPONSE
    // =================================================

    res.json({
      success: true,
      answer,
      chatId: chat._id,
    });

  } catch (error) {

    console.error(
      "Groq Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to generate AI response",
    });
  }
};


// =====================================================
// CHAT HISTORY
// =====================================================

const history = async (req, res) => {
  try {

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required",
      });
    }

    const chats =
      await Chat.find({
        userId: req.user._id,
      }).sort({
        createdAt: 1,
      });

    res.json({
      success: true,
      chats,
    });

  } catch (error) {

    console.error(
      "History Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// CREATE NEW CHAT SESSION
// =====================================================

const newSession = async (req, res) => {
  try {

    const sessionId =
      new Date()
        .getTime()
        .toString();

    res.json({
      success: true,
      sessionId,
    });

  } catch (error) {

    console.error(
      "New Session Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// DELETE SINGLE CHAT
// =====================================================

const deleteChat = async (req, res) => {
  try {

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required",
      });
    }

    // =================================================
    // FIND CHAT
    // =================================================

    const chat =
      await Chat.findById(
        req.params.id
      );

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    // =================================================
    // SECURITY
    // STUDENT CAN DELETE ONLY THEIR OWN CHAT
    // =================================================

    if (
      chat.userId.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to delete this chat",
      });
    }

    // =================================================
    // SAVE ACTIVITY LOG
    // BEFORE DELETING CHAT
    // =================================================

    await ActivityLog.create({
      userId: req.user._id,

      userName:
        req.user.fullName,

      userEmail:
        req.user.email,

      action:
        "DELETE_CHAT",

      description:
        "Student deleted a chat",

      details: {
        chatId:
          chat._id.toString(),

        question:
          chat.question,

        answer:
          chat.answer,
      },
    });

    // =================================================
    // DELETE CHAT
    // =================================================

    await Chat.findByIdAndDelete(
      req.params.id
    );

    res.json({
      success: true,
      message:
        "Chat Deleted Successfully",
    });

  } catch (error) {

    console.error(
      "Delete Chat Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// DELETE ALL CHAT HISTORY
// =====================================================

const deleteAllChats = async (req, res) => {
  try {

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required",
      });
    }

    // =================================================
    // GET ALL USER CHATS
    // BEFORE DELETING
    // =================================================

    const chats =
      await Chat.find({
        userId: req.user._id,
      });

    // =================================================
    // SAVE ACTIVITY LOG
    // =================================================

    if (chats.length > 0) {

      await ActivityLog.create({
        userId:
          req.user._id,

        userName:
          req.user.fullName,

        userEmail:
          req.user.email,

        action:
          "DELETE_ALL_CHATS",

        description:
          "Student deleted all chat history",

        details: {

          deletedCount:
            chats.length,

          chats:
            chats.map(
              (chat) => ({
                chatId:
                  chat._id.toString(),

                question:
                  chat.question,
              })
            ),
        },
      });
    }

    // =================================================
    // DELETE ALL USER CHATS
    // =================================================

    await Chat.deleteMany({
      userId: req.user._id,
    });

    res.json({
      success: true,

      message:
        "All Chat History Deleted Successfully",
    });

  } catch (error) {

    console.error(
      "Delete All Chats Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
  askAI,
  history,
  newSession,
  deleteChat,
  deleteAllChats,
};