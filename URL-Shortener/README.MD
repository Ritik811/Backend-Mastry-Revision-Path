# Project 2: URL Shortener API 🚀

A robust, high-performance URL Shortener RESTful API built with Node.js, Express, MongoDB (Mongoose), Crypto, and HTTP-Status-Codes.

---

## 📚 Table of Contents

1. [Folder Architecture](#1-folder-architecture)
2. [Project Setup Instructions](#2-project-setup-instructions)
3. [Deep Dive & Code Breakdown (Revision Notes)](#3-deep-dive--code-breakdown-revision-notes)
   - Database Configuration (`db.js`)
   - URL Model Schema (`URLmodels.js`)
   - Shorten URL Controller (`shortenUrl`)
   - Redirect & Track Controller (`redirectToOriginalUrl`)
   - URL Routes (`urlRoutes.js`)
   - Server Entry Point (`server.js`)
4. [API Endpoints Reference](#4-api-endpoints-reference)
5. [Git Maintenance & MongoDB Shell Handy Commands](#5-git-maintenance--mongosh-handy-commands)

---

## 1. Folder Architecture (Standard MVC)

- **`config/`**: Database connection logic (`db.js`).
- **`models/`**: Database schemas using Mongoose (`URLmodels.js`).
- **`controllers/`**: Core business logic for URL shortening and redirection (`urlController.js`).
- **`routes/`**: Endpoints defining API paths (`urlRoutes.js`).

---

## 2. Project Setup Instructions

### Step 1: Install Dependencies

```bash
npm install express mongoose dotenv cors http-status-codes
npm install -D nodemon
```

### Step 2: Environment Variables Setup (.env)
Create a `.env` file in the root directory:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/url-shortener-db
```

### Step 3: Start Development Server
```bash
npm run dev
```

---

## 3. Deep Dive & Code Breakdown (Revision Notes)

### A. Database Configuration (`db.js`)
* **📦 Imports & Dependencies Needed**
  * `mongoose`: MongoDB ke sath secure connection establish karne ke liye.
* **🔍 Step-by-Step Code Explanation (Hinglish)**
  * `mongoose.connect(process.env.MONGO_URI)` ka use karke asynchronous connection banaya gaya hai. `try...catch` block ke zariye connection failures ko handle kiya jata hai aur error aane par process exit ho jati hai.
* **📌 Short Summary Steps**
  * Import mongoose.
  * Create async function `databaseConnection`.
  * Connect using `process.env.MONGO_URI`.
  * Handle errors with `try...catch`.

### B. URL Model Schema (`URLmodels.js`)
* **📦 Imports & Dependencies Needed**
  * `mongoose`: Schema aur Model define karne ke liye.
* **🔍 Step-by-Step Code Explanation (Hinglish)**
  * `originalUrl` field me user ka long URL store hota hai. `shortCode` me unique 6-character identifier rakha gaya hai jisme `index: true` aur `unique: true` lagaya gaya hai taaki high-performance database lookups mil sakein. `clicks` field analytics ke liye hai jo default 0 se start hoti hai.
* **📌 Short Summary Steps**
  * Define schema with `originalUrl`, `shortCode`, and `clicks`.
  * Enable `index: true` and `unique: true` on `shortCode`.
  * Set default value for `clicks` to 0.
  * Export Mongoose model `Url`.

### C. Shorten URL Controller (`shortenUrl`)
* **📦 Imports & Dependencies Needed**
  * `Url` Model: Database me short URL record save karne ke liye.
  * `crypto`: Secure random bytes generate karne ke liye built-in module.
  * `StatusCodes`: Clean HTTP response codes ke liye (`http-status-codes`).
* **🔍 Step-by-Step Code Explanation (Hinglish)**
  * **Step 1: Input Validation**: Request body se `originalUrl` extract kiya aur check kiya ki field empty toh nahi hai. Agar empty hai toh `400 Bad Request` return kiya.
  * **Step 2: Short Code Generation**: `crypto.randomBytes(3).toString("hex")` ka use karke 3 bytes ko 6-character hexadecimal string me convert kiya.
  * **Step 3: Save to Database**: `Url.create()` ke zariye database me original URL aur generated short code ko store kiya.
  * **Step 4: JSON Response**: Success hone par `201 Created` status ke sath complete short URL details return ki.
* **📌 Short Summary Steps**
  * Destructure `originalUrl` from `req.body`.
  * Validate if `originalUrl` exists.
  * Generate 6-char hex string using `crypto.randomBytes(3)`.
  * Save record using `Url.create()`.
  * Return `201 Created` response with generated data.

### D. Redirect & Track Controller (`redirectToOriginalUrl`)
* **📦 Imports & Dependencies Needed**
  * `Url` Model: Database se short code search karne ke liye.
  * `StatusCodes`: HTTP status codes ke liye.
* **🔍 Step-by-Step Code Explanation (Hinglish)**
  * **Step 1: Extract Params**: Request parameters se `shortCode` fetch kiya.
  * **Step 2: Database Lookup**: `await Url.findOne({ shortCode })` ka use karke database me record dhoonda. (`await` lagana zaroori hai taaki query execute ho).
  * **Step 3: Not Found Check**: Agar record nahi mila toh `404 Not Found` error return kiya.
  * **Step 4: Click Analytics Increment**: `urlRecord.clicks++` karke click counter badhaya aur `await urlRecord.save()` se database me update save kiya.
  * **Step 5: Redirection**: `res.redirect(urlRecord.originalUrl)` ke through user ko original website par bhej diya.
* **📌 Short Summary Steps**
  * Extract `shortCode` from `req.params`.
  * Find record using `await Url.findOne()`.
  * Check if record exists (404 if not found).
  * Increment `clicks` count and save.
  * Redirect to original URL via `res.redirect()`.

### E. URL Routes (`urlRoutes.js`)
* **📦 Imports & Dependencies Needed**
  * `express`: Router instance create karne ke liye.
  * Controllers: `shortenUrl` aur `redirectToOriginalUrl` import kiye.
* **🔍 Step-by-Step Code Explanation (Hinglish)**
  * Express router banakar `POST /shorten` par `shortenUrl` controller map kiya aur `GET /:shortCode` par `redirectToOriginalUrl` controller map kiya.
* **📌 Short Summary Steps**
  * Create router instance using `express.Router()`.
  * Map `router.post("/shorten", shortenUrl)`.
  * Map `router.get("/:shortCode", redirectToOriginalUrl)`.
  * Export router.

### F. Server Entry Point (`server.js`)
* **📦 Imports & Dependencies Needed**
  * `express`, `dotenv`, `cors`, `databaseConnection`, `urlRoutes`.
* **🔍 Step-by-Step Code Explanation (Hinglish)**
  * Environment variables configure kiye, database connect kiya, Express app banakar `cors` aur `express.json()` middlewares lagaye, aur routes ko root path par mount karke server start kar diya.
* **📌 Short Summary Steps**
  * Initialize express and load env variables.
  * Connect to database via `databaseConnection()`.
  * Apply global middlewares (`cors`, `express.json()`).
  * Mount router and listen on specified PORT.

---

## 4. API Endpoints Reference

1. **Generate Short URL**
   - **Method:** `POST`
   - **URL:** `http://localhost:5000/shorten`
   - **Body:**
     ```json
     {
       "originalUrl": "https://www.google.com"
     }
     ```

2. **Redirect to Original URL & Track Click**
   - **Method:** `GET`
   - **URL:** `http://localhost:5000/<shortCode>` (e.g., `http://localhost:5000/4f8a2b`)
   - **Description:** Redirects browser to the destination URL and increments analytics click count.

---

## 5. Git Maintenance & MongoDB Shell Handy Commands

```bash
# Remove node_modules from git tracking in a subfolder
git rm -r --cached URL-Shortener/node_modules

# Commit and push changes
git commit -m "Fix: Remove node_modules from subfolder"
git push origin main

# Connect to MongoDB Shell
mongosh

# Show databases
show dbs

# Switch to project DB
use url-shortener-db

# View collections
show collections

# View stored analytics data
db.urls.find().pretty()
```