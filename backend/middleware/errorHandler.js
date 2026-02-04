import config from "../src/config/env.js";

// ── 1. Custom error class ───────────────────────────────────
// Throw `new AppError("message", statusCode)` anywhere in your
// route / controller chain — the handler below catches it.
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode  = statusCode;
    this.isOperational = true;          // "expected" error
    Error.captureStackTrace(this, this.constructor);
  }
}

// ── 2. Catch-all error-handling middleware ──────────────────
// Express identifies this as error middleware because it has
// exactly four parameters.  Do NOT remove `next`.
const errorHandler = (err, _req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message    = err.isOperational
    ? err.message
    : "Something went wrong";

  // Only log the full stack in non-production environments.
  if (config.nodeEnv !== "production") {
    console.error("[TubeMind Error]", err.stack);
  }

  res.status(statusCode).json({
    status:  statusCode >= 500 ? "error"   : "fail",
    message,
    ...(config.nodeEnv !== "production" && { stack: err.stack }),
  });
};

export default errorHandler;