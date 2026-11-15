# 🚗 RentEase — Vehicle Rental Marketplace API

> **Your Journey, Your Choice.**

**Midterm Project — Build a REST API with Express.js**

| Field | Value |
|-------|-------|
| **Name** | Rahumathulla Misfar Mohammed |
| **NIM** | 2005342004231 |
| **Theme** | Vehicle Rental Marketplace |
| **Main Resource** | `/vehicles` |
| **Bonus Resource** | `/owners` (+5 pts) |
| **Framework** | Node.js + Express 5 |

---

## 🚀 How to Run

```bash
# 1. Install dependencies
npm install

# 2. Start development server (with auto-reload)
npm run dev

# 3. Or start production server
npm start
```

Server runs at: **http://localhost:3000**
UI Dashboard at: **http://localhost:3000/index.html**

---

## 🔒 Authentication

Protected routes (`DELETE`) require this header:

```
Authorization: Bearer rentease-secret-2024
```

---

## 📋 Route List

### Core Routes (100 pts)

| # | Method | Path | Description | Status Code |
|---|--------|------|-------------|-------------|
| 1 | GET | `/` | Welcome message with author info | 200 |
| 2 | GET | `/vehicles` | List all vehicles | 200 |
| 3 | GET | `/vehicles/:id` | Get one vehicle (404 if not found) | 200 / 404 |
| 4 | POST | `/vehicles` | Add new vehicle (400 if missing fields) | 201 / 400 |
| 5 | PUT | `/vehicles/:id` | Update vehicle | 200 / 404 |
| 6 | DELETE | `/vehicles/:id` | Delete vehicle 🔒 (401 without token) | 200 / 401 / 404 |
| 7 | GET | `/vehicles/category/:name` | Filter by category (optional param) | 200 |
| 8 | GET | `/vehicles/files/*path` | Named wildcard — returns path segments | 200 |
| 9 | GET | `/*` | Unknown URL — 404 handler | 404 |

### Bonus Routes (+10 pts)

| # | Method | Path | Description | Bonus |
|---|--------|------|-------------|-------|
| 10 | GET | `/vehicles/search?q=&location=&category=&available=` | Search with query params | +3 |
| 11 | GET | `/owners` | List all owners | +5 |
| 12 | GET | `/owners/:id` | Get one owner | +5 |
| 13 | POST | `/owners` | Register new owner | +5 |
| 14 | PUT | `/owners/:id` | Update owner | +5 |
| 15 | DELETE | `/owners/:id` | Remove owner 🔒 | +5 |
| 16 | GET | `/owners/search?q=&city=&verified=` | Search owners | +5 |
| 17 | GET | `/owners/city/:name` | Filter owners by city | +5 |

> Unified error format used across all responses = **+2 pts**

---

## 📦 Project Structure

```
midterm-2005342004231-RahumathullaMisfarMohammed/
├── index.js              ← server entry: middleware → routes → 404 → error handler
├── middleware.js          ← logger, requireAuth, notFound, errorHandler
├── routes/
│   ├── vehicles.js        ← main resource + data array
│   └── owners.js          ← bonus second resource + data array
├── public/
│   └── index.html         ← RentEase UI dashboard
├── screenshots/           ← Postman screenshots (required for submission)
├── package.json
├── README.md
├── vercel.json            ← Vercel deployment config
└── netlify.toml           ← Netlify deployment config
```

---

## 🧪 Testing Examples

### GET all vehicles
```bash
GET http://localhost:3000/vehicles
```

### GET vehicle by ID
```bash
GET http://localhost:3000/vehicles/1
```

### Search vehicles
```bash
GET http://localhost:3000/vehicles/search?q=toyota&location=jakarta&available=true
```

### Filter by category
```bash
GET http://localhost:3000/vehicles/category/SUV
GET http://localhost:3000/vehicles/category       # returns all
```

### Wildcard path
```bash
GET http://localhost:3000/vehicles/files/contracts/rental-001.pdf
```

### Add new vehicle (POST)
```bash
POST http://localhost:3000/vehicles
Content-Type: application/json

{
  "brand": "Honda",
  "model": "City",
  "year": 2023,
  "category": "Sedan",
  "pricePerDay": 400000,
  "location": "Jakarta",
  "transmission": "Automatic",
  "fuelType": "Petrol",
  "seats": 5,
  "description": "Elegant city sedan"
}
```

### Update vehicle (PUT)
```bash
PUT http://localhost:3000/vehicles/1
Content-Type: application/json

{
  "pricePerDay": 380000,
  "available": false
}
```

### Delete vehicle (DELETE — requires auth)
```bash
DELETE http://localhost:3000/vehicles/1
Authorization: Bearer rentease-secret-2024
```

### Error Tests
```bash
# 400 — missing required fields
POST http://localhost:3000/vehicles
{}

# 401 — missing auth token
DELETE http://localhost:3000/vehicles/1

# 404 — vehicle not found
GET http://localhost:3000/vehicles/9999

# 404 — unknown URL
GET http://localhost:3000/unknown-route
```

---

## 🌐 Live Deployments

| Platform | URL |
|----------|-----|
| **Vercel** | https://midterm-2005342004231.vercel.app |
| **Netlify** | https://midterm-202534204231.netlify.app |
| **GitHub** | https://github.com/Misfar-Mohammed/Midterm-2005342004231 |

---

## ⚙️ Middleware Order Explanation

```
express.json()   ← 1st: parse JSON body before any route reads req.body
logger           ← 2nd: log every request (must run before routes)
Routes           ← 3rd: handle business logic
notFound         ← 4th: catch unmatched URLs (AFTER routes, or all requests hit 404)
errorHandler     ← 5th: 4-param function, catches all errors (MUST be last)
```

---

## 🚗 Vehicle Data Fields

Each vehicle has: `id`, `brand`, `model`, `year`, `category`, `transmission`, `fuelType`, `seats`, `pricePerDay`, `location`, `available`, `ownerId`, `rating`, `description`

**10 vehicles** pre-loaded in the array. New `id` is generated automatically.

---

*RentEase — Your Journey, Your Choice 🚗*
