// ─────────────────────────────────────────────────────────────────────────────
// middleware.js
// Contains: logger, requireAuth, notFound, errorHandler
// ─────────────────────────────────────────────────────────────────────────────

// AUTH TOKEN — in real production this would be in an .env file
const AUTH_TOKEN = "mysecrettoken123";

// ── 1. Logger ─────────────────────────────────────────────────────────────────
// Runs on every request; prints method, URL, and timestamp
function logger(req, res, next) {
  const time = new Date().toISOString();
  console.log(`[${time}] ${req.method} ${req.url}`);
  next(); // must call next() to pass control to the next middleware
}

// ── 2. requireAuth ────────────────────────────────────────────────────────────
// Protects DELETE routes — checks for the Authorization header token
function requireAuth(req, res, next) {
  const authHeader = req.headers["authorization"]; // e.g. "Bearer mysecrettoken123"

  // Check header exists and matches expected token
  if (!authHeader || authHeader !== `Bearer ${AUTH_TOKEN}`) {
    // Create an error object and pass it to the error handler
    const err = new Error("Unauthorized: missing or invalid token");
    err.status = 401;
    return next(err);
  }

  next(); // token is valid, continue
}

// ── 3. notFound ───────────────────────────────────────────────────────────────
// 404 handler — catches any URL that did not match a route above
function notFound(req, res, next) {
  const err = new Error(`Not Found: ${req.method} ${req.url}`);
  err.status = 404;
  next(err); // pass to the error handler below
}

// ── 4. errorHandler ───────────────────────────────────────────────────────────
// 4-parameter error handler — MUST be placed LAST in index.js
// Express recognises it as an error handler because it has 4 parameters (err, req, res, next)
function errorHandler(err, req, res, next) {
  // express.json() throws a SyntaxError when the request body is malformed JSON.
  // We catch it here and return a friendly 400 instead of crashing.
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      error: {
        status: 400,
        message: "Invalid JSON: the request body could not be parsed",
      },
    });
  }

  const statusCode = err.status || 500;

  // ── Custom unified error format (bonus +2) ─────────────────────────────────
  res.status(statusCode).json({
    success: false,
    error: {
      status: statusCode,
      message: err.message || "Internal Server Error",
    },
  });
}

// Export all middleware so index.js and routes can import them
module.exports = { logger, requireAuth, notFound, errorHandler };

