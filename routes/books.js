// ─────────────────────────────────────────────────────────────────────────────
// routes/books.js
// Resource: /books — Library books data + all routes
// ─────────────────────────────────────────────────────────────────────────────

const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware");

// ── Data Array (Lecture 3 & 4: Arrays of Object Literals) ────────────────────
// 5+ items; each has: id (number), title (string), author (string),
// year (number), genre (string), pages (number), available (boolean)
let books = [
  { id: 1, title: "Laskar Pelangi",         author: "Andrea Hirata",       year: 2005, genre: "Novel",      pages: 529, available: true  },
  { id: 2, title: "Bumi Manusia",            author: "Pramoedya Ananta",    year: 1980, genre: "Historical",  pages: 410, available: true  },
  { id: 3, title: "Atomic Habits",           author: "James Clear",         year: 2018, genre: "Self-Help",   pages: 320, available: false },
  { id: 4, title: "The Alchemist",           author: "Paulo Coelho",        year: 1988, genre: "Novel",      pages: 208, available: true  },
  { id: 5, title: "Clean Code",              author: "Robert C. Martin",    year: 2008, genre: "Technology",  pages: 464, available: true  },
  { id: 6, title: "Sapiens",                 author: "Yuval Noah Harari",   year: 2011, genre: "History",    pages: 443, available: false },
  { id: 7, title: "The Great Gatsby",        author: "F. Scott Fitzgerald", year: 1925, genre: "Novel",      pages: 180, available: true  },
];

// Auto-increment id counter — always takes the highest existing id + 1
let nextId = books.reduce((max, b) => Math.max(max, b.id), 0) + 1;

// ── Helper: parse and validate a numeric id from the route param ──────────────
// Returns the integer id, or throws a 400 error if the param is not a number.
function parseId(paramId, next) {
  const id = parseInt(paramId, 10);
  if (isNaN(id) || id <= 0) {
    const err = new Error(`Invalid id: '${paramId}' must be a positive integer`);
    err.status = 400;
    next(err);
    return null; // signal: stop processing
  }
  return id;
}

// ─────────────────────────────────────────────────────────────────────────────
// IMPORTANT: Specific / named routes MUST come BEFORE /:id
// otherwise Express would treat "search" or "category" as an id value
// ─────────────────────────────────────────────────────────────────────────────

// ── BONUS +3: Search by query string ─────────────────────────────────────────
// GET /books/search?title=laskar&genre=novel
router.get("/search", (req, res) => {
  const { title, author, genre } = req.query;

  // Start with all books, then filter down based on whatever query params were sent
  let results = books;

  if (title) {
    results = results.filter((b) =>
      b.title.toLowerCase().includes(title.toLowerCase())
    );
  }
  if (author) {
    results = results.filter((b) =>
      b.author.toLowerCase().includes(author.toLowerCase())
    );
  }
  if (genre) {
    results = results.filter((b) =>
      b.genre.toLowerCase().includes(genre.toLowerCase())
    );
  }

  res.json({ success: true, count: results.length, data: results });
});

// ── Route 7: Optional route part (Express 5 syntax: { } ) ────────────────────
// GET /books/category       → shows all books (no filter)
// GET /books/category/Novel → shows books where genre === "Novel"
router.get("/category{/:name}", (req, res) => {
  const { name } = req.params; // undefined when the optional part is omitted

  if (!name) {
    // No category name provided — return all items
    return res.json({ success: true, count: books.length, data: books });
  }

  // Filter books whose genre matches (case-insensitive)
  const filtered = books.filter(
    (b) => b.genre.toLowerCase() === name.toLowerCase()
  );

  res.json({ success: true, count: filtered.length, data: filtered });
});

// ── Route 8: Named wildcard (*path) ──────────────────────────────────────────
// GET /files/documents/2024/report.pdf
// Returns the wildcard segments as an array
//
// NOTE: In Express 5, *path captures path segments as an ARRAY, not a string.
// e.g. /files/a/b/c.pdf → req.params.path = ["a", "b", "c.pdf"]
router.get("/files/*path", (req, res) => {
  // Express 5 gives us an array; join it to also show the full path string
  const segments = Array.isArray(req.params.path)
    ? req.params.path           // Express 5: already an array
    : req.params.path.split("/").filter(Boolean); // fallback for older versions

  const rawPath = segments.join("/");

  res.json({
    success: true,
    wildcardPath: rawPath,
    segments: segments,
    segmentCount: segments.length,
  });
});

// ── Routes 2 & 3: GET all / GET one (router.route groups same path) ───────────
// Using router.route() to group GET /books (all) on the same chain as POST
// GET  /books    → list all books
// POST /books    → add a new book
router.route("/")
  .get((req, res) => {
    // Return all books
    res.json({ success: true, count: books.length, data: books });
  })
  .post((req, res, next) => {
    // ── Validation (Lecture 3: if/else) ──────────────────────────────────────
    const { title, author, year, genre, pages } = req.body;

    if (!title) {
      const err = new Error("Validation failed: 'title' is required");
      err.status = 400;
      return next(err);
    }
    if (!author) {
      const err = new Error("Validation failed: 'author' is required");
      err.status = 400;
      return next(err);
    }
    if (!year || typeof year !== "number") {
      const err = new Error("Validation failed: 'year' is required and must be a number");
      err.status = 400;
      return next(err);
    }
    if (!genre) {
      const err = new Error("Validation failed: 'genre' is required");
      err.status = 400;
      return next(err);
    }
    if (!pages || typeof pages !== "number") {
      const err = new Error("Validation failed: 'pages' is required and must be a number");
      err.status = 400;
      return next(err);
    }

    // Build new book object — id is generated automatically, NOT typed by the user
    const newBook = {
      id: nextId++,     // auto-increment
      title,
      author,
      year,
      genre,
      pages,
      available: true,  // new books default to available
    };

    books.push(newBook); // add to array

    res.status(201).json({ success: true, data: newBook });
  });

// ── Routes for /books/:id (GET one, PUT, DELETE) ──────────────────────────────
router.route("/:id")
  // ── Route 3: GET one book by id ──────────────────────────────────────────
  // Uses async + throw so Express 5 catches the error automatically
  .get(async (req, res, next) => {
    const id = parseId(req.params.id, next);
    if (id === null) return; // parseId already called next(err)

    const book = books.find((b) => b.id === id);
    if (!book) {
      const err = new Error(`Book with id ${id} not found`);
      err.status = 404;
      throw err;
    }
    res.json({ success: true, data: book });
  })

  // ── Route 5: PUT — update a book ─────────────────────────────────────────
  .put(async (req, res, next) => {
    const id = parseId(req.params.id, next);
    if (id === null) return;

    const index = books.findIndex((b) => b.id === id);
    if (index === -1) {
      const err = new Error(`Book with id ${id} not found`);
      err.status = 404;
      throw err;
    }

    // Merge existing book with new values; id is always preserved
    const updatedBook = { ...books[index], ...req.body, id };
    books[index] = updatedBook;
    res.json({ success: true, data: updatedBook });
  })

  // ── Route 6: DELETE — requires auth token ────────────────────────────────
  .delete(requireAuth, async (req, res, next) => {
    const id = parseId(req.params.id, next);
    if (id === null) return;

    const index = books.findIndex((b) => b.id === id);
    if (index === -1) {
      const err = new Error(`Book with id ${id} not found`);
      err.status = 404;
      throw err;
    }

    const deleted = books.splice(index, 1)[0];
    res.json({ success: true, message: `Book '${deleted.title}' deleted`, data: deleted });
  });

module.exports = router;
