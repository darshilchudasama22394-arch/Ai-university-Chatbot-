const User = require("../models/User");
const Chat = require("../models/Chat");
const FAQ = require("../models/FAQ");
const Notice = require("../models/Notice");
const bcrypt = require("bcryptjs");

// =====================================================
// DASHBOARD STATISTICS
// =====================================================

const getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({
      role: "student",
    });

    const totalChats = await Chat.countDocuments();

    const totalFAQs = await FAQ.countDocuments();

    const totalNotices = await Notice.countDocuments();

    res.json({
      success: true,
      stats: {
        totalStudents,
        totalChats,
        totalFAQs,
        totalNotices,
      },
    });
  } catch (error) {
    console.error(
      "Dashboard Stats Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// GET ALL STUDENTS
// =====================================================

const students = async (req, res) => {
  try {
    const students = await User.find({
      role: "student",
    })
      .select("-password -otp -otp_expiry")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      students,
    });
  } catch (error) {
    console.error(
      "Get Students Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// ADD STUDENT
// =====================================================

const createStudent = async (req, res) => {
  try {
    const {
      full_name,
      fullName,
      email,
      password,
    } = req.body;

    const name = fullName || full_name;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Full name, email and password are required",
      });
    }

    const existingUser =
      await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    await User.create({
      fullName: name,
      email,
      password: hashedPassword,
      role: "student",
    });

    res.status(201).json({
      success: true,
      message: "Student Added Successfully",
    });
  } catch (error) {
    console.error(
      "Create Student Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// UPDATE STUDENT
// =====================================================

const editStudent = async (req, res) => {
  try {
    const {
      full_name,
      fullName,
      email,
      password,
    } = req.body;

    const name = fullName || full_name;

    const student =
      await User.findOne({
        _id: req.params.id,
        role: "student",
      });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Update name
    if (name && name.trim()) {
      student.fullName = name.trim();
    }

    // Update email
    if (email && email.trim()) {
      const existingUser =
        await User.findOne({
          email: email.trim(),
          _id: { $ne: req.params.id },
        });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message:
            "Email already exists",
        });
      }

      student.email =
        email.trim();
    }

    // Update password only if entered
    if (
      password &&
      password.trim()
    ) {
      student.password =
        await bcrypt.hash(
          password.trim(),
          10
        );
    }

    // Student role cannot be changed
    student.role = "student";

    await student.save();

    const updatedStudent =
      await User.findById(
        student._id
      ).select(
        "-password -otp -otp_expiry"
      );

    res.json({
      success: true,
      message:
        "Student Updated Successfully",
      student: updatedStudent,
    });
  } catch (error) {
    console.error(
      "Update Student Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// DELETE STUDENT
// =====================================================

const removeStudent = async (req, res) => {
  try {
    const student =
      await User.findOneAndDelete({
        _id: req.params.id,
        role: "student",
      });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Optional:
    // Delete student's chats also
    await Chat.deleteMany({
      userId: student._id,
    });

    res.json({
      success: true,
      message:
        "Student Deleted Successfully",
    });
  } catch (error) {
    console.error(
      "Delete Student Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// FAQ MANAGEMENT
// =====================================================

// GET ALL FAQs - ADMIN

const adminFAQs = async (req, res) => {
  try {
    const faqs =
      await FAQ.find().sort({
        createdAt: -1,
      });

    res.json({
      success: true,
      faqs,
    });
  } catch (error) {
    console.error(
      "Get Admin FAQs Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// CREATE FAQ

const createFAQ = async (req, res) => {
  try {
    const {
      question,
      answer,
      category,
    } = req.body;

    if (!question || !answer) {
      return res.status(400).json({
        success: false,
        message:
          "Question and answer are required",
      });
    }

    const faq =
      await FAQ.create({
        question,
        answer,
        category:
          category || "General",
      });

    res.status(201).json({
      success: true,
      message:
        "FAQ Added Successfully",
      faq,
    });
  } catch (error) {
    console.error(
      "Create FAQ Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// UPDATE FAQ

const editFAQ = async (req, res) => {
  try {
    const {
      question,
      answer,
      category,
    } = req.body;

    const faq =
      await FAQ.findByIdAndUpdate(
        req.params.id,
        {
          question,
          answer,
          category,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
    }

    res.json({
      success: true,
      message:
        "FAQ Updated Successfully",
      faq,
    });
  } catch (error) {
    console.error(
      "Update FAQ Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// DELETE FAQ

const removeFAQ = async (req, res) => {
  try {
    const faq =
      await FAQ.findByIdAndDelete(
        req.params.id
      );

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
    }

    res.json({
      success: true,
      message:
        "FAQ Deleted Successfully",
    });
  } catch (error) {
    console.error(
      "Delete FAQ Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// NOTICE MANAGEMENT
// =====================================================

// GET ALL NOTICES - ADMIN

const adminNotices = async (req, res) => {
  try {
    const notices =
      await Notice.find().sort({
        date: -1,
      });

    res.json({
      success: true,
      notices,
    });
  } catch (error) {
    console.error(
      "Get Admin Notices Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// CREATE NOTICE

const createNotice = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      date,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message:
          "Title and description are required",
      });
    }

    const notice =
      await Notice.create({
        title,
        description,
        category:
          category || "General",
        date:
          date || Date.now(),
      });

    res.status(201).json({
      success: true,
      message:
        "Notice Added Successfully",
      notice,
    });
  } catch (error) {
    console.error(
      "Create Notice Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// UPDATE NOTICE

const editNotice = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      date,
    } = req.body;

    const notice =
      await Notice.findByIdAndUpdate(
        req.params.id,
        {
          title,
          description,
          category,
          date,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!notice) {
      return res.status(404).json({
        success: false,
        message:
          "Notice not found",
      });
    }

    res.json({
      success: true,
      message:
        "Notice Updated Successfully",
      notice,
    });
  } catch (error) {
    console.error(
      "Update Notice Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// DELETE NOTICE

const removeNotice = async (req, res) => {
  try {
    const notice =
      await Notice.findByIdAndDelete(
        req.params.id
      );

    if (!notice) {
      return res.status(404).json({
        success: false,
        message:
          "Notice not found",
      });
    }

    res.json({
      success: true,
      message:
        "Notice Deleted Successfully",
    });
  } catch (error) {
    console.error(
      "Delete Notice Error:",
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
  getDashboardStats,

  students,
  createStudent,
  editStudent,
  removeStudent,

  adminFAQs,
  createFAQ,
  editFAQ,
  removeFAQ,

  adminNotices,
  createNotice,
  editNotice,
  removeNotice,
};