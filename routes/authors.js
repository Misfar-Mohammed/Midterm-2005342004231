// ─────────────────────────────────────────────────────────────────────────────
// routes/authors.js
// BONUS +5: Second resource — /authors
// ─────────────────────────────────────────────────────────────────────────────

const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware");

// ── Authors data array ────────────────────────────────────────────────────────
let authors = [
  { id: 1, name: "Andrea Hirata",       country: "Indonesia", bornYear: 1967, books: 7,  active: true  },
  { id: 2, name: "Pramoedya Ananta",    country: "Indonesia", bornYear: 1925, books: 50, active: false },
  { id: 3, name: "James Clear",         country: "USA",       bornYear: 1986, books: 1,  active: true  },
  { id: 4, name: "Paulo Coelho",        country: "Brazil",    bornYear: 1947, books: 30, active: true  },
  { id: 5, name: "Robert C. Martin",    country: "USA",       bornYear: 1952, books: 9,  active: true  },
  { id: 6, name: "Yuval Noah Harari",   country: "Israel",    bornYear: 1976, books: 4,  active: true  },
];

let nextId = authors.reduce((max, a) => Math.max(max, a.id), 0) + 1;

// ── Helper: parse and validate a numeric id ───────────────────────────────────
function parseId(paramId, next) {
  const id = parseInt(paramId, 10);
  if (isNaN(id) || id <= 0) {
    const err = new Error(`Invalid id: '${paramId}' must be a positive integer`);
    err.status = 400;
    next(err);
    return null;
  }
  return id;
}

// ── BONUS: Search authors by country ─────────────────────────────────────────
// GET /authors/search?country=Indonesia
router.get("/search", (req, res) => {
  const { name, country } = req.query;
  let results = authors;
  if (name)    results = results.filter((a) => a.name.toLowerCase().includes(name.toLowerCase()));
  if (country) results = results.filter((a) => a.country.toLowerCase().includes(country.toLowerCase()));
  res.json({ success: true, count: results.length, data: results });
});

// ── GET all / POST new ────────────────────────────────────────────────────────
router.route("/")
  .get((req, res) => {
    res.json({ success: true, count: authors.length, data: authors });
  })
  .post((req, res, next) => {
    const { name, country, bornYear, books } = req.body;

    if (!name) {
      const err = new Error("Validation failed: 'name' is required");
      err.status = 400;
      return next(err);
    }
    if (!country) {
      const err = new Error("Validation failed: 'country' is required");
      err.status = 400;
      return next(err);
    }
    if (!bornYear || typeof bornYear !== "number") {
      const err = new Error("Validation failed: 'bornYear' must be a number");
      err.status = 400;
      return next(err);
    }

    const newAuthor = { id: nextId++, name, country, bornYear, books: books || 0, active: true };
    authors.push(newAuthor);
    res.status(201).json({ success: true, data: newAuthor });
  });

// ── GET one / PUT / DELETE ────────────────────────────────────────────────────
router.route("/:id")
  .get(async (req, res, next) => {
    const id = parseId(req.params.id, next);
    if (id === null) return;
    const author = authors.find((a) => a.id === id);
    if (!author) {
      const err = new Error(`Author with id ${id} not found`);
      err.status = 404;
      throw err;
    }
    res.json({ success: true, data: author });
  })
  .put(async (req, res, next) => {
    const id = parseId(req.params.id, next);
    if (id === null) return;
    const index = authors.findIndex((a) => a.id === id);
    if (index === -1) {
      const err = new Error(`Author with id ${id} not found`);
      err.status = 404;
      throw err;
    }
    authors[index] = { ...authors[index], ...req.body, id };
    res.json({ success: true, data: authors[index] });
  })
  .delete(requireAuth, async (req, res, next) => {
    const id = parseId(req.params.id, next);
    if (id === null) return;
    const index = authors.findIndex((a) => a.id === id);
    if (index === -1) {
      const err = new Error(`Author with id ${id} not found`);
      err.status = 404;
      throw err;
    }
    const deleted = authors.splice(index, 1)[0];
    res.json({ success: true, message: `Author '${deleted.name}' deleted`, data: deleted });
  });

module.exports = router;

