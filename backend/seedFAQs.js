const mongoose = require("mongoose");
require("dotenv").config();

const FAQ = require("./models/FAQ");

const faqs = [
  {
    question: "How can I check my attendance?",
    answer:
      "Login to your student dashboard and open the Attendance section to view your attendance.",
    category: "Academics",
  },
  {
    question: "How can I check my examination schedule?",
    answer:
      "You can check the latest examination schedule from the Examination section or contact the examination department.",
    category: "Examination",
  },
  {
    question: "How can I pay my college fees?",
    answer:
      "College fees can be paid through the university fee payment portal or by contacting the accounts department.",
    category: "Fees",
  },
  {
    question: "How can I apply for admission?",
    answer:
      "To apply for admission, complete the university admission application form and submit the required documents.",
    category: "Admission",
  },
  {
    question: "What documents are required for admission?",
    answer:
      "Common documents include your identity proof, previous academic marksheets, photographs, and other documents specified by the university.",
    category: "Admission",
  },
  {
    question: "How can I contact the examination department?",
    answer:
      "You can contact the examination department through the university office or the official examination contact details.",
    category: "Examination",
  },
  {
    question: "How can I contact my faculty?",
    answer:
      "You can contact your faculty through the university communication system or visit the respective department.",
    category: "Faculty",
  },
  {
    question: "Where can I find university notices?",
    answer:
      "University notices can be viewed from the Notices section of the AI University Helpdesk.",
    category: "General",
  },
  {
    question: "What should I do if I forget my password?",
    answer:
      "Use the password recovery option on the login page or contact the university helpdesk for assistance.",
    category: "Technical Support",
  },
  {
    question: "How can I update my profile information?",
    answer:
      "Open the Profile section from the sidebar, update your information, and click Save Changes.",
    category: "General",
  },
  {
    question: "What are the college working hours?",
    answer:
      "College working hours depend on the university and department. Please check the official university schedule for current timings.",
    category: "General",
  },
  {
    question: "How can I get technical support?",
    answer:
      "You can use the AI University Helpdesk chatbot or contact the university technical support department.",
    category: "Technical Support",
  },
];

const seedFAQs = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");

    await FAQ.deleteMany({});

    await FAQ.insertMany(faqs);

    console.log(`${faqs.length} FAQs inserted successfully`);

    await mongoose.connection.close();

    console.log("MongoDB connection closed");

    process.exit(0);
  } catch (error) {
    console.error("FAQ Seed Error:", error);

    process.exit(1);
  }
};

seedFAQs();