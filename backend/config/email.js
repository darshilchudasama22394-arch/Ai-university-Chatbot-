require("dotenv").config();
const nodemailer = require("nodemailer");
const logger = require("../utils/logger");

const emailConfig = {
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: Number(process.env.EMAIL_PORT || 587),
  secure: process.env.EMAIL_SECURE === "true" || Number(process.env.EMAIL_PORT || 587) === 465,
  auth:
    process.env.EMAIL_USER && process.env.EMAIL_PASS
      ? {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        }
      : undefined,
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
  tls: {
    rejectUnauthorized: true,
  },
};

const transporter = nodemailer.createTransport(emailConfig);

async function sendOTPEmail({ to, name, otp, purpose = "login" }) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    const error = new Error(
      "Email service is not configured. Set EMAIL_USER and EMAIL_PASS in your environment."
    );
    logger.error("Email sending failed: missing SMTP credentials", { purpose, to });
    throw error;
  }

  const normalizedName = name || "User";
  const subject =
    purpose === "reset"
      ? "PU PIET Dep. - Password Reset OTP"
      : "PU PIET Dep. - Login OTP";
  const description =
    purpose === "reset"
      ? "Use the code below to reset your password."
      : "Use the code below to verify your login.";

  const info = await transporter.sendMail({
    from: `"PU PIET Dep." <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
    to,
    subject,
    text: `${normalizedName}, ${description} Your OTP is ${otp}. This code expires in 5 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
        <h2 style="margin: 0 0 20px; color: #1f2937;">PU PIET Dep.</h2>
        <p style="margin: 0 0 16px; color: #374151;">Hello <strong>${normalizedName}</strong>,</p>
        <p style="margin: 0 0 20px; color: #374151;">${description}</p>
        <div style="background: #ffffff; border-radius: 10px; padding: 24px; text-align: center; border: 1px solid #e5e7eb; margin-bottom: 20px;">
          <div style="font-size: 12px; letter-spacing: 1.5px; color: #64748b; text-transform: uppercase; margin-bottom: 12px;">Your OTP</div>
          <div style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #4f46e5;">${otp}</div>
        </div>
        <p style="margin: 0 0 12px; color: #374151;">This OTP is valid for <strong>5 minutes</strong>.</p>
        <p style="margin: 0; color: #64748b;">If you did not request this code, you can safely ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="margin: 0; color: #64748b; font-size: 12px;">PU PIET Dep.</p>
      </div>
    `,
  });

  logger.info("OTP email sent", {
    to,
    purpose,
    messageId: info.messageId,
  });

  return info;
}

module.exports = {
  transporter,
  sendOTPEmail,
};