# Project 2: URL Shortener API (Level 2 - Base62 & Atomic Counter) 🚀

A robust, high-performance, production-grade URL Shortener RESTful API built with Node.js, Express, MongoDB (Mongoose), Base62 Encoding Algorithm, Atomic Counter Increment, and HTTP-Status-Codes.

---

## 📚 Table of Contents

1. [Folder Architecture](#1-folder-architecture)
2. [Project Setup Instructions](#2-project-setup-instructions)
3. [Deep Dive & Code Breakdown (Revision Notes)](#3-deep-dive--code-breakdown-revision-notes)
   - Database Configuration (`db.js`)
   - URL Model Schema (`URLmodels.js`)
   - Base62 Utility (`utils/base62.js`)
   - Counter Model Schema (`models/counter.js`)
   - Shorten URL Controller (`shortenUrl`)
   - Redirect & Track Controller (`redirectToOriginalUrl`)
   - URL Routes (`urlRoutes.js`)
   - Server Entry Point (`server.js`)
4. [API Endpoints Reference](#4-api-endpoints-reference)
5. [Git Maintenance & MongoDB Shell Handy Commands](#5-git-maintenance--mongosh-handy-commands)

---

## 1. Folder Architecture (Standard MVC)

- **`config/`**: Database connection logic (`db.js`).
- **`models/`**: Database schemas using Mongoose (`URLmodels.js`, `counter.js`).
- **`utils/`**: Helper algorithms and utilities (`base62.js`).
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

- **📦 Imports & Dependencies Needed**
  - `mongoose`: MongoDB ke sath secure connection establish karne ke liye.
- **🔍 Step-by-Step Code Explanation (Hinglish)**
  - `mongoose.connect(process.env.MONGO_URI)` ka use karke asynchronous connection banaya gaya hai. `try...catch` block ke zariye connection failures ko handle kiya jata hai aur error aane par process exit ho jati hai.
- **📌 Short Summary Steps**
  - Import mongoose.
  - Create async function `databaseConnection`.
  - Connect using `process.env.MONGO_URI`.
  - Handle errors with `try...catch`.

### B. URL Model Schema (`URLmodels.js`)

- **📦 Imports & Dependencies Needed**
  - `mongoose`: Schema aur Model define karne ke liye.
- **🔍 Step-by-Step Code Explanation (Hinglish)**
  - `originalUrl` field me user ka long URL store hota hai. `shortCode` me unique string rakha gaya hai jisme `index: true` aur `unique: true` lagaya gaya hai taaki high-performance database lookups mil sakein. `clicks` field analytics ke liye hai jo default 0 se start hoti hai.
- **📌 Short Summary Steps**
  - Define schema with `originalUrl`, `shortCode`, and `clicks`.
  - Enable `index: true` and `unique: true` on `shortCode`.
  - Set default value for `clicks` to 0.
  - Export Mongoose model `Url`.

### C. Base62 Utility (`utils/base62.js`)

- **📦 Imports & Dependencies Needed**
  - Custom Base62 alphabet set (`0-9`, `a-z`, `A-Z` — total 62 characters).
- **🔍 Step-by-Step Code Explanation (Hinglish)**
  - **Encode Function (`encodeBase62`)**: Ek sequential numeric ID (jaise `125`) ko 62 se divide karke remainder nikalta hai aur Base62 alphabet se match karke ek compact short string (`"cb"`) banata hai.
  - **Decode Function (`decodeBase62`)**: Ek Base62 string ko wapas original decimal number me convert karta hai base powers (`62^0, 62^1...`) ka use karke.
- **📌 Short Summary Steps**
  - Define `BASE62_ALPHABET` string of 62 chars.
  - Implement `encodeBase62(num)` division-remainder loop.
  - Implement `decodeBase62(str)` power calculation loop with validation.

### D. Counter Model Schema (`models/counter.js`)

- **📦 Imports & Dependencies Needed**
  - `mongoose`: Sequence tracking schema define karne ke liye.
- **🔍 Step-by-Step Code Explanation (Hinglish)**
  - Yeh model ek single sequence tracker maintain karta hai. Isme `id` (jaise `"url_count"`) aur `seq` (number jo har naye URL par increment hota hai) fields hoti hain taaki deterministic aur conflict-free IDs milti rahein.
- **📌 Short Summary Steps**
  - Define schema with `id` (String) and `seq` (Number).
  - Export Mongoose model `Counter`.

### E. Shorten URL Controller (`shortenUrl`)

- **📦 Imports & Dependencies Needed**
  - `Url` & `Counter` Models, `encodeBase62` utility, `StatusCodes`.
- **🔍 Step-by-Step Code Explanation (Hinglish)**
  - **Step 1: Validation**: Request body se `originalUrl` check kiya. Missing hone par `400 Bad Request` return kiya.
  - **Step 2: Atomic Counter Increment**: `Counter.findOneAndUpdate` with `$inc: { seq: 1 }` aur `upsert: true` ka use karke thread-safe tarike se next sequential ID fetch ki.
  - **Step 3: Base62 Conversion**: Numeric ID ko `encodeBase62()` se compact short code me badla.
  - **Step 4: Database Save & Response**: `Url.create()` ke zariye record save karke `201 Created` response diya.
- **📌 Short Summary Steps**
  - Validate `originalUrl`.
  - Fetch next atomic sequence using `Counter.findOneAndUpdate()`.
  - Convert sequence to string using `encodeBase62()`.
  - Save document and return `201 Created` response.

### F. Redirect & Track Controller (`redirectToOriginalUrl`)

- **📦 Imports & Dependencies Needed**
  - `Url` Model, `StatusCodes`.
- **🔍 Step-by-Step Code Explanation (Hinglish)**
  - **Step 1: Extract Params**: Request parameters se `shortCode` fetch kiya.
  - **Step 2: Database Lookup**: `await Url.findOne({ shortCode })` se record dhoonda.
  - **Step 3: Not Found Check**: Agar record nahi mila toh `404 Not Found` error return kiya.
  - **Step 4: Click Analytics**: `urlRecord.clicks++` karke counter badhaya aur save kiya.
  - **Step 5: Redirection**: `res.redirect(urlRecord.originalUrl)` se destination website par redirect kiya.
- **📌 Short Summary Steps**
  - Extract `shortCode` from `req.params`.
  - Find record using `await Url.findOne()`.
  - Check existence (404 if missing).
  - Increment `clicks` count and save.
  - Redirect via `res.redirect()`.

### G. URL Routes (`urlRoutes.js`)

- **📦 Imports & Dependencies Needed**
  - `express`, controllers (`shortenUrl`, `redirectToOriginalUrl`).
- **🔍 Step-by-Step Code Explanation (Hinglish)**
  - Express router banakar `POST /shorten` aur `GET /:shortCode` endpoints map kiye.
- **📌 Short Summary Steps**
  - Create router instance.
  - Map POST and GET routes to controllers.
  - Export router.

### H. Server Entry Point (`server.js`)

- **📦 Imports & Dependencies Needed**
  - `express`, `dotenv`, `cors`, `databaseConnection`, `urlRoutes`.
- **🔍 Step-by-Step Code Explanation (Hinglish)**
  - Environment variables configure kiye, database connect kiya, global middlewares (`cors`, `express.json()`) lagaye, aur routes mount kiye.
- **📌 Short Summary Steps**
  - Initialize express & load env.
  - Connect to database.
  - Apply middlewares and mount routes.

---

## 4. API Endpoints Reference

1. **Generate Short URL (Base62 Level 2)**
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
   - **URL:** `http://localhost:5000/<shortCode>` (e.g., `http://localhost:5000/1`)
   - **Description:** Redirects browser to destination URL and increments analytics click count.

---

## 5. Git Maintenance & MongoDB Shell Handy Commands

```bash
# Remove node_modules from git tracking if needed
git rm -r --cached URL-Shortener/node_modules

# Commit and push changes
git commit -m "Feat: Upgrade URL Shortener to Level 2 Base62 & Atomic Counter Architecture"
git push origin main

# Connect to MongoDB Shell
mongosh

# Show databases
show dbs

# Switch to project DB
use url-shortener-db

# View collections
show collections

# View stored URLs and analytics
db.urls.find().pretty()

# View counter sequence state
db.counters.find().pretty()
```
