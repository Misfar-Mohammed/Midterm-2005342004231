// ─────────────────────────────────────────────────────────────────────────────
// middleware.js  —  RentEase Middleware
//
// Exports: logger, requireAuth, notFound, errorHandler
//
// WHY THIS ORDER IN index.js (will be asked in Q&A):
//   1. express.json()  → parses JSON body before any route reads it
//   2. logger          → logs every request (must run before routes)
//   3. Routes          → handle the actual business logic
//   4. notFound        → catches any URL that matched no route (must be AFTER routes)
//   5. errorHandler    → handles all errors passed via next(err) or throw
//                        MUST have exactly 4 parameters so Express recognises it
// ─────────────────────────────────────────────────────────────────────────────

const AUTH_TOKEN = "Bearer rentease-secret-2024";   // token for protected routes

// ── 1. Logger: runs on every request ─────────────────────────────────────────
function logger(req, res, next) {
  const now = new Date().toISOString();
  console.log(`[${now}] ${req.method} ${req.url}`);
  next();
}

// ── 2. requireAuth: protects DELETE routes ────────────────────────────────────
function requireAuth(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader || authHeader !== AUTH_TOKEN) {
    return res.status(401).json({
      success: false,
      error:   "Unauthorized",
      message: `Missing or invalid token. Add header: Authorization: ${AUTH_TOKEN}`,
    });
  }
  next();
}

// ── 3. notFound: 404 for unknown URLs — placed AFTER all routes ───────────────
function notFound(req, res) {
  res.status(404).json({
    success: false,
    error:   "Not Found",
    message: `Route ${req.method} ${req.url} does not exist on RentEase API`,
    hint:    "Visit GET / for a list of all available endpoints",
  });
}

// ── 4. errorHandler: 4-param error handler — MUST be last in index.js ─────────
// Express identifies this as an error handler because of the 4th parameter (next)
// Handles errors thrown with throw or passed via next(err)
function errorHandler(err, req, res, next) {   // eslint-disable-line no-unused-vars
  // Handle malformed JSON body (SyntaxError from express.json())
  if (err instanceof SyntaxError && err.status === 400) {
    return res.status(400).json({
      success: false,
      error:   "Bad Request",
      message: "Malformed JSON body — check your request body syntax",
    });
  }

  const status  = err.status || 500;
  const message = err.message || "Internal Server Error";

  // Unified error format used consistently across all error responses (BONUS +2)
  res.status(status).json({
    success: false,
    error:   status === 404 ? "Not Found" : status === 400 ? "Bad Request" : "Server Error",
    message,
  });
}

module.exports = { logger, requireAuth, notFound, errorHandler };
