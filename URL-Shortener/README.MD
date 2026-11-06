# Project 2: URL Shortener REST API (Level 3 - Production-Ready Masterpiece) 🚀

A robust, high-performance, secure, and production-grade URL Shortener RESTful API built with Node.js, Express, MongoDB (Mongoose), Base62 Encoding Algorithm, Atomic Counter Increment, Rate Limiting, Custom Aliases, URL Validation, and Expiration TTL logic.

---

## 📚 Table of Contents

1. [Folder Architecture](#1-folder-architecture)
2. [Project Setup Instructions](#2-project-setup-instructions)
3. [Deep Dive & Code Breakdown (Revision Notes)](#3-deep-dive--code-breakdown-revision-notes)
   - Database Configuration (`db.js`)
   - URL Model Schema (`URLmodels.js`)
   - Base62 Utility (`utils/base62.js`)
   - Counter Model Schema (`models/counter.js`)
   - Rate Limiter Middleware (`middleware/rateLimiter.js`)
   - Shorten URL Controller (`shortenUrl` with Custom Aliases, Validation & TTL)
   - Redirect & Track Controller (`redirectToOriginalUrl` with Expiry Check)
   - URL Routes (`urlRoutes.js`)
   - Server Entry Point (`server.js`)
4. [API Endpoints Reference](#4-api-endpoints-reference)
5. [Git Maintenance & MongoDB Shell Handy Commands](#5-git-maintenance--mongosh-handy-commands)

---

## 1. Folder Architecture (Standard MVC + Security)

- **`config/`**: Database connection logic (`db.js`).
- **`models/`**: Database schemas using Mongoose (`URLmodels.js`, `counter.js`).
- **`utils/`**: Helper algorithms and utilities (`base62.js`).
- **`middleware/`**: Security middlewares like IP rate limiting (`rateLimiter.js`).
- **`controllers/`**: Core business logic for URL shortening, custom aliases, validation, expiration, and redirection (`urlController.js`).
- **`routes/`**: Endpoints defining API paths (`urlRoutes.js`).

---

## 2. Project Setup Instructions

### Step 1: Install Dependencies

```bash
npm install express mongoose dotenv cors http-status-codes express-rate-limit
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

### B. URL Model Schema (`URLmodels.js`)

- **📦 Imports & Dependencies Needed**
  - `mongoose`: Schema aur Model define karne ke liye.
- **🔍 Step-by-Step Code Explanation (Hinglish)**
  - `originalUrl` field me user ka long URL store hota hai. `shortCode` me unique string rakha gaya hai jisme `index: true` aur `unique: true` lagaya gaya hai. Analytics ke liye `clicks` aur link expiry ke liye `expiresAt` (TTL support) fields add ki gayi hain.

### C. Base62 Utility (`utils/base62.js`)

- **📦 Imports & Dependencies Needed**
  - Custom Base62 alphabet set (`0-9`, `a-z`, `A-Z` — total 62 characters).
- **🔍 Step-by-Step Code Explanation (Hinglish)**
  - **Encode Function (`encodeBase62`)**: Ek sequential numeric ID ko 62 se divide karke remainder nikalta hai aur Base62 alphabet se match karke ek compact short string banata hai.

### D. Counter Model Schema (`models/counter.js`)

- **📦 Imports & Dependencies Needed**
  - `mongoose`: Sequence tracking schema define karne ke liye.
- **🔍 Step-by-Step Code Explanation (Hinglish)**
  - Yeh model ek single sequence tracker maintain karta hai. Isme `id` aur `seq` fields hoti hain taaki deterministic aur conflict-free IDs milti rahein.

### E. Rate Limiter Middleware (`middleware/rateLimiter.js`)

- **📦 Imports & Dependencies Needed**
  - `express-rate-limit`, `http-status-codes`.
- **🔍 Step-by-Step Code Explanation (Hinglish)**
  - Server ko DDoS aur spam requests se bachane ke liye IP-based throttling lagayi gayi hai jo 15 minutes me maximum allowed requests ko restrict karti hai.

### F. Shorten URL Controller (`shortenUrl`)

- **📦 Imports & Dependencies Needed**
  - `Url` & `Counter` Models, `encodeBase62` utility, `StatusCodes`.
- **🔍 Step-by-Step Code Explanation (Hinglish)**
  - **Validation & Sanitization**: URL protocol (`http`/`https`) check kiya jata hai.
  - **Custom Aliases (Vanity URLs)**: Agar user `customCode` deta hai, toh conflict check (`Url.findOne`) ke baad wahi code allot hota hai; warna Atomic Counter + Base62 fallback use hota hai.
  - **TTL Expiration**: `expiresInDays` ke base par `expiresAt` timestamp calculate karke save ki jati hai.

### G. Redirect & Track Controller (`redirectToOriginalUrl`)

- **📦 Imports & Dependencies Needed**
  - `Url` Model, `StatusCodes`.
- **🔍 Step-by-Step Code Explanation (Hinglish)**
  - **Lookup & Expiry Check**: Record find karne ke baad check hota hai ki link expire toh nahi ho gaya (`new Date() > urlRecord.expiresAt`). Expire hone par `410 Gone` return hota hai, warna click count increment karke destination par redirect kiya jata hai.

### H. URL Routes (`urlRoutes.js`) & Server Entry Point (`server.js`)

- Routes par rate limiter middleware attach karke server ko port 5000 par mount kiya gaya hai.

---

## 4. API Endpoints Reference

1. **Generate Short URL (Supports Custom Alias & Expiration)**
   - **Method:** `POST`
   - **URL:** `http://localhost:5000/shorten`
   - **Body:**
     ```json
     {
       "originalUrl": "https://github.com",
       "customCode": "my-github",
       "expiresInDays": 7
     }
     ```

2. **Redirect to Original URL & Track Click**
   - **Method:** `GET`
   - **URL:** `http://localhost:5000/<shortCode>` (e.g., `http://localhost:5000/my-github`)
   - **Description:** Validates expiration, redirects browser to destination URL, and increments analytics click count.

---

## 5. Git Maintenance & MongoDB Shell Handy Commands

```bash
# Remove node_modules from git tracking if needed
git rm -r --cached URL-Shortener/node_modules

# Commit and push changes
git commit -m "Feat: Complete Level 3 Production Hardening (Vanity URLs, Rate Limiting, Validation & TTL)"
git push origin main

# Connect to MongoDB Shell
mongosh

# Show databases
show dbs

# Switch to project DB
use url-shortener-db

# View stored URLs and analytics
db.urls.find().pretty()
```
