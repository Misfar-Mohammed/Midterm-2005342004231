// ─────────────────────────────────────────────────────────────────────────────
// routes/owners.js  —  RentEase Vehicle Owners Resource  (BONUS +5)
// Second resource with its own Router file
// ─────────────────────────────────────────────────────────────────────────────

const { Router } = require("express");
const { requireAuth } = require("../middleware");

const router = Router();

// ── Data Array ────────────────────────────────────────────────────────────────
let owners = [
  { id: 1, name: "Budi Santoso",    phone: "081234567890", city: "Jakarta",    totalVehicles: 3, rating: 4.8, verified: true,  joinedYear: 2022, email: "budi@rentease.id",    bio: "Professional vehicle rental owner with 3 years experience" },
  { id: 2, name: "Siti Rahayu",     phone: "082345678901", city: "Bandung",    totalVehicles: 2, rating: 4.6, verified: true,  joinedYear: 2023, email: "siti@rentease.id",    bio: "Passionate about providing quality rental vehicles in West Java" },
  { id: 3, name: "Ahmad Fauzi",     phone: "083456789012", city: "Surabaya",   totalVehicles: 3, rating: 4.5, verified: true,  joinedYear: 2022, email: "ahmad@rentease.id",   bio: "Experienced fleet owner serving East Java and Bali" },
  { id: 4, name: "Rina Wijaya",     phone: "084567890123", city: "Bali",       totalVehicles: 1, rating: 4.9, verified: false, joinedYear: 2024, email: "rina@rentease.id",    bio: "New owner offering premium vehicles in Bali tourism area" },
  { id: 5, name: "Doni Prasetyo",   phone: "085678901234", city: "Yogyakarta", totalVehicles: 2, rating: 4.3, verified: true,  joinedYear: 2023, email: "doni@rentease.id",    bio: "Specializes in affordable motorcycle rentals in Yogyakarta" },
];

let nextId = owners.length + 1;

// ── Helper ────────────────────────────────────────────────────────────────────
function parseId(req, res, next) {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || id < 1) {
    return res.status(400).json({
      success: false,
      error: "Bad Request",
      message: "Owner id must be a positive integer",
    });
  }
  req.ownerId = id;
  next();
}

// ── Search owners — MUST be before /:id ───────────────────────────────────────
router.get("/search", (req, res) => {
  const { q, city, verified } = req.query;
  let results = [...owners];
  if (q)        results = results.filter(o => o.name.toLowerCase().includes(q.toLowerCase()) || o.city.toLowerCase().includes(q.toLowerCase()));
  if (city)     results = results.filter(o => o.city.toLowerCase().includes(city.toLowerCase()));
  if (verified !== undefined) results = results.filter(o => o.verified === (verified === "true"));

  res.json({ success: true, count: results.length, query: req.query, data: results });
});

// ── Filter by city — optional param ──────────────────────────────────────────
router.get("/city{/:name}", (req, res) => {
  const name = req.params.name;
  const result = name
    ? owners.filter(o => o.city.toLowerCase() === name.toLowerCase())
    : owners;
  res.json({ success: true, count: result.length, city: name || "all", data: result });
});

// ── GET all / POST new ────────────────────────────────────────────────────────
router.route("/")
  .get((req, res) => {
    res.json({ success: true, count: owners.length, data: owners });
  })
  .post((req, res) => {
    const { name, phone, city, email } = req.body;
    if (!name || !phone || !city || !email) {
      return res.status(400).json({
        success: false,
        error: "Bad Request",
        message: "Required fields: name, phone, city, email",
      });
    }
    const newOwner = {
      id:            nextId++,
      name:          name.trim(),
      phone:         phone.trim(),
      city:          city.trim(),
      email:         email.trim(),
      totalVehicles: 0,
      rating:        0,
      verified:      false,
      joinedYear:    new Date().getFullYear(),
      bio:           req.body.bio || "",
    };
    owners.push(newOwner);
    res.status(201).json({
      success: true,
      message: "Owner registered on RentEase successfully",
      data: newOwner,
    });
  });

// ── GET one / PUT / DELETE ────────────────────────────────────────────────────
router.route("/:id")
  .get(parseId, async (req, res) => {
    const owner = owners.find(o => o.id === req.ownerId);
    if (!owner) {
      const err = new Error(`Owner with id ${req.ownerId} not found`);
      err.status = 404;
      throw err;
    }
    res.json({ success: true, data: owner });
  })
  .put(parseId, async (req, res) => {
    const index = owners.findIndex(o => o.id === req.ownerId);
    if (index === -1) {
      const err = new Error(`Owner with id ${req.ownerId} not found`);
      err.status = 404;
      throw err;
    }
    owners[index] = { ...owners[index], ...req.body, id: req.ownerId };
    res.json({ success: true, message: "Owner updated successfully", data: owners[index] });
  })
  .delete(parseId, requireAuth, async (req, res) => {
    const index = owners.findIndex(o => o.id === req.ownerId);
    if (index === -1) {
      const err = new Error(`Owner with id ${req.ownerId} not found`);
      err.status = 404;
      throw err;
    }
    const deleted = owners.splice(index, 1)[0];
    res.json({ success: true, message: `Owner "${deleted.name}" removed from RentEase`, data: deleted });
  });

module.exports = router;
