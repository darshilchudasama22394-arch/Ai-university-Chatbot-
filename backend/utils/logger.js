const fs = require("node:fs");
const path = require("node:path");
const winston = require("winston");

const logDirectory = path.join(__dirname, "..", "logs");

fs.mkdirSync(logDirectory, { recursive: true });

const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, ...metadata }) => {
    const details = Object.keys(metadata).length
      ? ` ${JSON.stringify(metadata)}`
      : "";

    return `${timestamp} ${level}: ${message}${details}`;
  })
);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "http",
  defaultMeta: { service: "ai-university-helpdesk-api" },
  transports: [
    new winston.transports.Console({ format: consoleFormat }),
    new winston.transports.File({
      filename: path.join(logDirectory, "error.log"),
      level: "error",
      format: fileFormat,
      maxsize: 5 * 1024 * 1024,
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: path.join(logDirectory, "combined.log"),
      format: fileFormat,
      maxsize: 5 * 1024 * 1024,
      maxFiles: 5,
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logDirectory, "exceptions.log"),
      maxsize: 5 * 1024 * 1024,
      maxFiles: 5,
    }),
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logDirectory, "rejections.log"),
      maxsize: 5 * 1024 * 1024,
      maxFiles: 5,
    }),
  ],
  exitOnError: false,
});

logger.logError = (message, error) => {
  const details = error instanceof Error
    ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
        code: error.code,
        status: error.status,
      }
    : error;

  logger.error(message, { error: details });
};

module.exports = logger;