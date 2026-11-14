# 📚 Midterm Project — Library Books REST API

**Name  :** Rahumathulla Misfar Mohammed  
**NIM   :** 2005342004231  
**Theme :** Library — `/books`  
**Class :** Your Class  

---

## 🚀 How to Run

```bash
# 1. Install dependencies
npm install

# 2. Start the development server (with auto-reload)
npm run dev

# 3. Or start normally
npm start
```

The server starts on **http://localhost:3000**

---

## 🔑 Auth Token (for DELETE requests)

Add this header in Postman/Thunder Client for all DELETE requests:

```
Authorization: Bearer mysecrettoken123
```

---

## 📋 List of Routes

### Books Resource (`/books`)

| No | Method | Path | Description | Status |
|----|--------|------|-------------|--------|
| 1 | `GET` | `/` | Welcome message with name & theme | 200 |
| 2 | `GET` | `/books` | List all books | 200 |
| 3 | `GET` | `/books/:id` | Get one book by id | 200 / 404 |
| 4 | `POST` | `/books` | Add a new book | 201 / 400 |
| 5 | `PUT` | `/books/:id` | Update a book | 200 / 404 |
| 6 | `DELETE` | `/books/:id` | Delete a book (needs auth token) | 200 / 401 / 404 |
| 7 | `GET` | `/books/category` | List all books (no filter) | 200 |
| 7 | `GET` | `/books/category/Novel` | Filter books by genre | 200 |
| 8 | `GET` | `/books/files/*path` | Show wildcard path as array | 200 |
| 9 | `GET` | `/books/search?title=...` | Search by title / author / genre *(bonus)* | 200 |
| — | `GET` | `/any-unknown-url` | 404 from notFound handler | 404 |

### Authors Resource — Bonus (`/authors`)

| Method | Path | Description | Status |
|--------|------|-------------|--------|
| `GET` | `/authors` | List all authors | 200 |
| `GET` | `/authors/:id` | Get one author | 200 / 404 |
| `POST` | `/authors` | Add a new author | 201 / 400 |
| `PUT` | `/authors/:id` | Update an author | 200 / 404 |
| `DELETE` | `/authors/:id` | Delete an author (auth required) | 200 / 401 / 404 |
| `GET` | `/authors/search?country=...` | Search authors | 200 |

---

## 📦 POST Body Examples

**POST /books** (add a book):
```json
{
  "title": "Harry Potter",
  "author": "J.K. Rowling",
  "year": 1997,
  "genre": "Fantasy",
  "pages": 332
}
```

**POST /authors** (add an author):
```json
{
  "name": "J.K. Rowling",
  "country": "UK",
  "bornYear": 1965,
  "books": 15
}
```

**PUT /books/1** (update — only send fields you want to change):
```json
{
  "available": false,
  "pages": 530
}
```

---

## ❌ Error Responses

All errors use the same format (custom unified error format):
```json
{
  "success": false,
  "error": {
    "status": 404,
    "message": "Book with id 99 not found"
  }
}
```

| Error | Status | Trigger |
|-------|--------|---------|
| Validation | 400 | POST without required field |
| Unauthorized | 401 | DELETE without auth token |
| Not Found | 404 | Unknown id or unknown URL |
| Server Error | 500 | Unexpected crash |

---

## 🗂️ Project Structure

```
midterm-00000-YourName/
├── index.js          ← server entry: middleware → routes → 404 → errorHandler
├── middleware.js     ← logger, requireAuth, notFound, errorHandler
├── routes/
│   ├── books.js      ← books data array + all /books routes
│   └── authors.js    ← authors data array + all /authors routes (bonus)
├── package.json
├── README.md
└── screenshots/      ← Postman screenshots for every route
```

---

## 💡 Middleware Order Explanation (Q&A answer)

```
express.json()   → must be first so req.body is available to all routes
logger           → logs every request before the route handles it
routes           → actual business logic
notFound         → only reached if NO route matched → sends 404
errorHandler     → receives all errors from next(err) or throw → sends JSON error
```

If `errorHandler` were placed before the routes, errors thrown inside routes would never reach it. If `notFound` were placed before the routes, every request would immediately get a 404.

---

## ✅ Self-Check

- [x] `npm install` then `npm run dev` starts with no errors  
- [x] All 9 routes work in Postman  
- [x] `POST` with empty body → `400`  
- [x] `DELETE` without token → `401`, with token → `200`  
- [x] Unknown id → `404`, unknown URL → `404`  
- [x] Error handler has 4 parameters and is last `app.use()`  
- [x] `node_modules` NOT included in submission  
- [x] README and screenshots complete  

