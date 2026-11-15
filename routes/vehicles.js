// ─────────────────────────────────────────────────────────────────────────────
// routes/vehicles.js  —  RentEase Vehicle Resource
// Main resource for the midterm project
// ─────────────────────────────────────────────────────────────────────────────

const { Router } = require("express");
const { requireAuth } = require("../middleware");

const router = Router();

// ── Data Array ────────────────────────────────────────────────────────────────
let vehicles = [
  { id: 1, brand: "Toyota",     model: "Avanza",   year: 2022, category: "MPV",        transmission: "Manual",    fuelType: "Petrol", seats: 7, pricePerDay: 350000, location: "Jakarta",    available: true,  ownerId: 1, rating: 4.8, description: "Comfortable family MPV, perfect for group travel" },
  { id: 2, brand: "Honda",      model: "Jazz",     year: 2021, category: "Hatchback",   transmission: "Automatic", fuelType: "Petrol", seats: 5, pricePerDay: 300000, location: "Bandung",    available: true,  ownerId: 2, rating: 4.6, description: "Sporty and fuel-efficient city car" },
  { id: 3, brand: "Yamaha",     model: "NMAX",     year: 2023, category: "Motorcycle",  transmission: "Automatic", fuelType: "Petrol", seats: 2, pricePerDay: 100000, location: "Bali",       available: false, ownerId: 1, rating: 4.9, description: "Popular scooter, ideal for exploring Bali" },
  { id: 4, brand: "Toyota",     model: "Fortuner", year: 2022, category: "SUV",         transmission: "Automatic", fuelType: "Diesel", seats: 7, pricePerDay: 650000, location: "Surabaya",   available: true,  ownerId: 3, rating: 4.7, description: "Premium SUV built for all terrain adventures" },
  { id: 5, brand: "Honda",      model: "CR-V",     year: 2023, category: "SUV",         transmission: "Automatic", fuelType: "Petrol", seats: 5, pricePerDay: 550000, location: "Jakarta",    available: true,  ownerId: 2, rating: 4.5, description: "Modern SUV with great comfort and features" },
  { id: 6, brand: "Suzuki",     model: "Carry",    year: 2020, category: "Van",         transmission: "Manual",    fuelType: "Petrol", seats: 8, pricePerDay: 400000, location: "Medan",      available: true,  ownerId: 3, rating: 4.2, description: "Spacious van for group and cargo travel" },
  { id: 7, brand: "BMW",        model: "320i",     year: 2022, category: "Luxury",      transmission: "Automatic", fuelType: "Petrol", seats: 5, pricePerDay: 1200000, location: "Jakarta",   available: false, ownerId: 1, rating: 4.9, description: "Premium luxury sedan for a first-class experience" },
  { id: 8, brand: "Honda",      model: "Beat",     year: 2023, category: "Motorcycle",  transmission: "Automatic", fuelType: "Petrol", seats: 2, pricePerDay: 75000,  location: "Yogyakarta", available: true,  ownerId: 2, rating: 4.4, description: "Economical city scooter, easy to park anywhere" },
  { id: 9, brand: "Toyota",     model: "Innova",   year: 2021, category: "MPV",         transmission: "Automatic", fuelType: "Diesel", seats: 7, pricePerDay: 500000, location: "Bali",       available: true,  ownerId: 3, rating: 4.6, description: "Reliable and comfortable family vehicle" },
  { id: 10, brand: "Mitsubishi", model: "Triton",  year: 2022, category: "Pickup",      transmission: "Manual",    fuelType: "Diesel", seats: 5, pricePerDay: 450000, location: "Makassar",   available: true,  ownerId: 1, rating: 4.3, description: "Rugged pickup truck built for tough roads" },
];

let nextId = vehicles.length + 1;

// ── Helper: parse & validate id ───────────────────────────────────────────────
function parseId(req, res, next) {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || id < 1) {
    return res.status(400).json({
      success: false,
      error: "Bad Request",
      message: "Vehicle id must be a positive integer",
    });
  }
  req.vehicleId = id;
  next();
}

// ── BONUS: Search route — MUST be before /:id ─────────────────────────────────
// GET /vehicles/search?q=toyota&location=bali&category=suv&available=true
router.get("/search", (req, res) => {
  const { q, location, category, available, minPrice, maxPrice } = req.query;
  let results = [...vehicles];

  if (q)         results = results.filter(v =>
    v.brand.toLowerCase().includes(q.toLowerCase()) ||
    v.model.toLowerCase().includes(q.toLowerCase()) ||
    v.description.toLowerCase().includes(q.toLowerCase())
  );
  if (location)  results = results.filter(v => v.location.toLowerCase().includes(location.toLowerCase()));
  if (category)  results = results.filter(v => v.category.toLowerCase() === category.toLowerCase());
  if (available !== undefined) results = results.filter(v => v.available === (available === "true"));
  if (minPrice)  results = results.filter(v => v.pricePerDay >= parseInt(minPrice));
  if (maxPrice)  results = results.filter(v => v.pricePerDay <= parseInt(maxPrice));

  res.json({
    success: true,
    count: results.length,
    query: req.query,
    data: results,
  });
});

// ── Route 7: Category filter — optional param — MUST be before /:id ──────────
// GET /vehicles/category          → all vehicles
// GET /vehicles/category/SUV      → filter by category
router.get("/category{/:name}", (req, res) => {
  const name = req.params.name;
  const result = name
    ? vehicles.filter(v => v.category.toLowerCase() === name.toLowerCase())
    : vehicles;

  res.json({
    success: true,
    count: result.length,
    category: name || "all",
    data: result,
  });
});

// ── Route 8: Wildcard — named wildcard *path ───────────────────────────────────
// GET /vehicles/files/documents/contract.pdf
router.get("/files/*path", (req, res) => {
  const pathParam = req.params.path;
  const segments = Array.isArray(pathParam) ? pathParam : [pathParam];

  res.json({
    success: true,
    message: "RentEase File System",
    requestedPath: Array.isArray(pathParam) ? pathParam.join("/") : pathParam,
    segments,
    info: "In production, this would serve rental contracts and vehicle documents",
  });
});

// ── Routes 2 & 4: GET all / POST new ─────────────────────────────────────────
router.route("/")
  // GET /vehicles — list all vehicles
  .get((req, res) => {
    res.json({
      success: true,
      count: vehicles.length,
      data: vehicles,
    });
  })

  // POST /vehicles — add a new vehicle (validation: 400 if missing fields)
  .post((req, res) => {
    const { brand, model, year, category, pricePerDay, location } = req.body;

    // Validation — required fields
    if (!brand || !model || !year || !category || !pricePerDay || !location) {
      return res.status(400).json({
        success: false,
        error: "Bad Request",
        message: "Required fields: brand, model, year, category, pricePerDay, location",
      });
    }
    if (typeof pricePerDay !== "number" || pricePerDay <= 0) {
      return res.status(400).json({
        success: false,
        error: "Bad Request",
        message: "pricePerDay must be a positive number",
      });
    }
    if (typeof year !== "number" || year < 1990 || year > 2030) {
      return res.status(400).json({
        success: false,
        error: "Bad Request",
        message: "year must be a number between 1990 and 2030",
      });
    }

    const newVehicle = {
      id:           nextId++,            // auto-generated id
      brand:        brand.trim(),
      model:        model.trim(),
      year,
      category:     category.trim(),
      transmission: req.body.transmission || "Manual",
      fuelType:     req.body.fuelType     || "Petrol",
      seats:        req.body.seats        || 5,
      pricePerDay,
      location:     location.trim(),
      available:    req.body.available !== undefined ? req.body.available : true,
      ownerId:      req.body.ownerId      || 1,
      rating:       0,
      description:  req.body.description  || "",
    };

    vehicles.push(newVehicle);

    res.status(201).json({
      success: true,
      message: "Vehicle listed successfully on RentEase",
      data: newVehicle,
    });
  });

// ── Routes 3, 5, 6: GET one / PUT / DELETE by id ────────────────────────────
router.route("/:id")
  // GET /vehicles/:id — get one vehicle (404 if not found, thrown async)
  .get(parseId, async (req, res) => {
    const vehicle = vehicles.find(v => v.id === req.vehicleId);
    if (!vehicle) {
      const err = new Error(`Vehicle with id ${req.vehicleId} not found`);
      err.status = 404;
      throw err;    // caught by error handler (async route in Express 5)
    }
    res.json({ success: true, data: vehicle });
  })

  // PUT /vehicles/:id — update a vehicle
  .put(parseId, async (req, res) => {
    const index = vehicles.findIndex(v => v.id === req.vehicleId);
    if (index === -1) {
      const err = new Error(`Vehicle with id ${req.vehicleId} not found`);
      err.status = 404;
      throw err;
    }

    // Merge existing data with updated fields
    vehicles[index] = { ...vehicles[index], ...req.body, id: req.vehicleId };

    res.json({
      success: true,
      message: "Vehicle updated successfully",
      data: vehicles[index],
    });
  })

  // DELETE /vehicles/:id — delete (protected by requireAuth middleware)
  .delete(parseId, requireAuth, async (req, res) => {
    const index = vehicles.findIndex(v => v.id === req.vehicleId);
    if (index === -1) {
      const err = new Error(`Vehicle with id ${req.vehicleId} not found`);
      err.status = 404;
      throw err;
    }

    const deleted = vehicles.splice(index, 1)[0];

    res.json({
      success: true,
      message: `Vehicle "${deleted.brand} ${deleted.model}" removed from RentEase`,
      data: deleted,
    });
  });

module.exports = router;

