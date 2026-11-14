// ─────────────────────────────────────────────────────────────────────────────
// index.js  —  Entry point
//
// ORDER IS CRITICAL (this order will be asked in Q&A):
//   1. express.json()     → parse JSON body before any route reads it
//   2. logger             → log every request
//   3. Routes             → handle the actual business logic
//   4. notFound           → catch any URL that didn't match a route (404)
//   5. errorHandler       → handle all errors passed via next(err) or throw
//
// If you put errorHandler before routes, errors from routes won't reach it.
// If you put notFound before routes, every route would hit 404 first.
// ─────────────────────────────────────────────────────────────────────────────

const express = require("express");
const { logger, notFound, errorHandler } = require("./middleware");
const booksRouter   = require("./routes/books");
const authorsRouter = require("./routes/authors"); // bonus +5

const app = express();
const PORT = process.env.PORT || 3000; // use platform's port or 3000 locally

// ── 1. Built-in middleware: parse incoming JSON request bodies ────────────────
// Without this, req.body would be undefined for POST and PUT requests
app.use(express.json());

// ── 2. Custom logger middleware — runs on EVERY request ───────────────────────
app.use(logger);

// ── 3. Routes ─────────────────────────────────────────────────────────────────

// Route 1: GET / — welcome message
app.get("/", (req, res) => {
  const base = `${req.protocol}://${req.get("host")}`;
  res.json({
    success: true,
    message: "Welcome to the Library Books API 📚",
    author:  "Rahumathulla Misfar Mohammed",
    nim:     "2005342004231",
    theme:   "Library Books",
    endpoints: {
      books:   `${base}/books`,
      authors: `${base}/authors`,
    },
  });
});

// Mount the books router — all routes inside booksRouter are prefixed with /books
// e.g. router.get("/")     becomes GET /books
//      router.get("/:id")  becomes GET /books/:id
app.use("/books", booksRouter);

// Mount the authors router (bonus second resource)
app.use("/authors", authorsRouter);

// ── 4. 404 handler — AFTER all routes, BEFORE error handler ──────────────────
// Any URL that did not match any route above reaches this middleware
app.use(notFound);

// ── 5. Error handler — MUST be last, MUST have exactly 4 parameters ──────────
// Express identifies this as an error handler because of the 4th parameter (next)
app.use(errorHandler);

// ── Start the server ──────────────────────────────────────────────────────────
// Only listen when running locally (not on Vercel/Netlify serverless)
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`\n🚀 Library Books API is running!`);
    console.log(`   Local:   http://localhost:${PORT}`);
    console.log(`   Books:   http://localhost:${PORT}/books`);
    console.log(`   Authors: http://localhost:${PORT}/authors`);
    console.log(`\n   Auth token for DELETE: Bearer mysecrettoken123\n`);
  });
}

// Export app for Vercel serverless & testing
module.exports = app;

