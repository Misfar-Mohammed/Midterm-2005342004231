// ─────────────────────────────────────────────────────────────────────────────
// index.js  —  RentEase API Entry Point
// Your Journey, Your Choice.
//
// MIDDLEWARE ORDER (will be asked in Q&A):
//   1. express.json()  → parse JSON body before any route reads req.body
//   2. logger          → log every incoming request (method + URL)
//   3. Routes          → handle business logic (/vehicles, /owners)
//   4. notFound        → catch any URL not matched by routes → 404
//   5. errorHandler    → catch all errors passed via next(err) or throw
//
// If errorHandler came before routes, errors from routes wouldn't reach it.
// If notFound came before routes, every request would return 404 immediately.
// ─────────────────────────────────────────────────────────────────────────────

const express = require("express");
const path = require("path");
const { logger, notFound, errorHandler } = require("./middleware");
const vehiclesRouter = require("./routes/vehicles");
const ownersRouter = require("./routes/owners");   // bonus second resource

const app = express();
const PORT = process.env.PORT || 3000;

// ── 1. Parse JSON request bodies ─────────────────────────────────────────────
app.use(express.json());

// ── Serve static UI from /public ─────────────────────────────────────────────
app.use(express.static(path.join(__dirname, "public")));

// ── 2. Logger middleware — runs on EVERY request ──────────────────────────────
app.use(logger);

// ── 3. Routes ─────────────────────────────────────────────────────────────────

// Route 1: GET / — welcome message with name, NIM and theme
app.get("/", (req, res) => {
  const base = `${req.protocol}://${req.get("host")}`;
  res.json({
    success: true,
    message: "Welcome to RentEase API 🚗",
    tagline: "Your Journey, Your Choice.",
    author: "Rahumathulla Misfar Mohammed",
    nim: "20250040208",
    theme: "Vehicle Rental Marketplace",
    endpoints: {
      vehicles: `${base}/vehicles`,
      vehicleById: `${base}/vehicles/:id`,
      vehicleSearch: `${base}/vehicles/search?q=toyota&location=jakarta`,
      vehicleCategory: `${base}/vehicles/category/:name`,
      vehicleFiles: `${base}/vehicles/files/*path`,
      owners: `${base}/owners`,
      ownerById: `${base}/owners/:id`,
      ownerSearch: `${base}/owners/search?q=budi&city=jakarta`,
    },
    auth: {
      description: "Protected routes (DELETE) require this header",
      header: "Authorization: Bearer rentease-secret-2024",
    },
  });
});

// Mount the vehicles router — all routes prefixed with /vehicles
app.use("/vehicles", vehiclesRouter);

// Mount the owners router — all routes prefixed with /owners (bonus +5)
app.use("/owners", ownersRouter);

// ── 4. 404 handler — AFTER all routes, BEFORE error handler ───────────────────
app.use(notFound);

// ── 5. Error handler — MUST be last, MUST have exactly 4 parameters ───────────
app.use(errorHandler);

// ── Start server (only locally, not on Vercel/Netlify serverless) ─────────────
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`\n🚗 RentEase API is running!`);
    console.log(`   Your Journey, Your Choice.\n`);
    console.log(`   Local:     http://localhost:${PORT}`);
    console.log(`   UI:        http://localhost:${PORT}/index.html`);
    console.log(`   Vehicles:  http://localhost:${PORT}/vehicles`);
    console.log(`   Owners:    http://localhost:${PORT}/owners`);
    console.log(`\n   Auth token for DELETE:`);
    console.log(`   Authorization: Bearer rentease-secret-2024\n`);
  });
}

// Export app for Vercel serverless & testing
module.exports = app;
