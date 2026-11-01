# Project 1: Authentication & Authorization API 🚀

A robust, production-ready Authentication and Authorization RESTful API built with Node.js, Express, MongoDB (Mongoose), bcrypt, JSON Web Tokens (JWT), and Cookie-Parser.

---

## 📚 Table of Contents

1. [Folder Architecture](#1-folder-architecture)
2. [Project Setup Instructions](#2-project-setup-instructions)
3. [Deep Dive & Code Breakdown (Revision Notes)](#3-deep-dive--code-breakdown-revision-notes)
   - Register User
   - Login User (Cookie-Based)
   - isLoggedIn Middleware
   - authorize Middleware (RBAC)
   - Logout User
4. [API Endpoints Reference](#4-api-endpoints-reference)
5. [MongoDB Shell Handy Commands](#5-mongodb-shell-mongosh-handy-commands)

---

## 1. Folder Architecture (Standard MVC)

- **`config/`**: Database connection logic (`db.js`).
- **`models/`**: Database schemas using Mongoose (`user.js`).
- **`controllers/`**: Core business logic for authentication (`authController.js`).
- **`routes/`**: Endpoints defining API paths (`authRoutes.js`).
- **`middleware/`**: Custom security middleware (`authMiddleware.js`).

---

## 2. Project Setup Instructions

### Step 1: Install Dependencies

```bash
npm install express mongoose bcrypt jsonwebtoken dotenv cors http-status-codes cookie-parser
npm install -D nodemon

Step 2: Environment Variables Setup (.env)
Create a .env file in the root directory:
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/auth-master-db
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development

Step 3: Server Configuration (server.js)
Ensure cookie-parser is registered before routes:
import cookieParser from "cookie-parser";
app.use(cookieParser());

Step 4: Start Development Server
npm run dev

3. Deep Dive & Code Breakdown (Revision Notes)
A. Register User Controller (registerUser)
📦 Imports & Dependencies Needed
User Model (../models/user.js): MongoDB ke sath interact karne aur naya user save karne ke liye.

bcrypt: Plain password ko secure hash me convert karne ke liye.

StatusCodes (http-status-codes): Clean aur standard HTTP response codes (201, 400, 500) return karne ke liye.

🔍 Step-by-Step Code Explanation (Hinglish)
Step 1: Extract Data & Validation
Client (Postman/Frontend) jo data bhejta hai, usko req.body se destructure kiya. Check kiya ki name, email, aur password khaali toh nahi hain. Agar kuch missing hai, toh turant 400 Bad Request bhej kar function rok diya.

Step 2: Check Existing User
User.findOne({ email }) ka use karke database me check kiya ki kya is email se pehle user registered hai ya nahi. Agar mil gaya, toh error bhej diya.

Step 3: Password Hashing
bcrypt.hash(password, 10) ka use karke plaintext password ko secure cryptographic string me badal diya taaki database leak hone par bhi password safe rahe.

Step 4: Create & Save User
New Mongoose instance banaya aur .save() method ke zariye MongoDB database me permanent store kar diya. Role nahi diya toh default "user" assign kar diya (role || "user").

Step 5: Response & Error Handling
Success par 201 Created ke sath user data (bina password ke) bhej diya. try...catch block ke zariye server crash hone se bachaya.

📌 Short Summary Steps (registerUser)
Extract Input (req.body).

Validate required fields (name, email, password).

Check duplicate user via User.findOne().

Hash password using bcrypt.hash().

Create and save new user via .save().

Return 201 Created success response.

Catch unexpected errors (500 Internal Server Error).

B. Login User Controller (loginUser)
📦 Imports & Dependencies Needed
User Model (../models/user.js): User ko database me dhoondne ke liye.

bcrypt: Entered password ko database ke hashed password se match karne ke liye.

jsonwebtoken (JWT): Secure authentication token generate karne ke liye.

🔍 Step-by-Step Code Explanation (Hinglish)
Step 1: Validate Login Inputs
Check kiya ki email aur password provided hain ya nahi. Agar missing hain toh 400 Bad Request return kiya.

Step 2: Find User in Database
User.findOne({ email }).select("+password") ka use karke user ko dhoonda. Note: Schema me password select: false ho sakta hai, isliye explicit .select("+password") lagana padta hai password comparison ke liye.

Step 3: Compare Passwords
bcrypt.compare(password, userExist.password) se check kiya ki user ne jo password dala hai, woh match kar raha hai ya nahi.

Step 4: Generate JWT Token
jwt.sign({ id: userExist.id, role: userExist.role }, process.env.JWT_SECRET, { expiresIn: '1d' }) ka use karke user ki ID aur role ko encrypt karke token banaya.

Step 5: Set HTTP-Only Cookie & Respond
Token ko response header me res.cookie("token", token, { httpOnly: true }) ke through secure cookie me bhej diya taaki XSS attacks se bachav ho sake.

📌 Short Summary Steps (loginUser)
Validate email and password inputs.

Find user via User.findOne() (including password field).

Compare passwords using bcrypt.compare().

Generate JWT payload token using jwt.sign().

Attach token inside res.cookie() (httpOnly).

Return 200 OK success response with user data.

C. Authentication Middleware (isLoggedIn)
📦 Imports & Dependencies Needed
jwt (jsonwebtoken): Cookie se token verify karne ke liye.

User Model: Token ki ID se database me current user find karne ke liye.

🔍 Step-by-Step Code Explanation (Hinglish)
Step 1: Extract Token from Cookies
req.cookies se token ko destructure kiya. Agar cookie me token nahi hai, toh user logged in nahi hai (401 Unauthorized).

Step 2: Verify JWT Token
jwt.verify(token, process.env.JWT_SECRET) se token ko decode aur verify kiya ki woh valid hai ya expire toh nahi ho gaya.

Step 3: Database Verification
Token milne ke baad User.findById(verifyToken.id).select("-password") se check kiya ki kya user abhi bhi database me exist karta hai ya account delete ho chuka hai.

Step 4: Attach User to Request & Next
Verified user object ko req.user me store kar diya aur next() call karke request ko aage route/controller par bhej diya.

📌 Short Summary Steps (isLoggedIn)
Extract token from req.cookies.

Check if token exists (401 if missing).

Verify token using jwt.verify().

Validate user existence in DB via User.findById().

Attach user document to req.user.

Call next() to proceed to route controller.

D. Role-Based Access Control Middleware (authorize)
📦 Imports & Dependencies Needed
req.user: Pehle se isLoggedIn middleware se attach kiya hua current user object.

🔍 Step-by-Step Code Explanation (Hinglish)
Step 1: Higher-Order Function Setup
authorize(...roles) ek function return karta hai jo Express middleware (req, res, next) ki tarah kaam karta hai. Ye dynamic roles ("admin", "moderator", etc.) as an array leta hai.

Step 2: Role Matching Check
roles.includes(req.user.role) se check kiya ki logged-in user ka role allowed roles ki list me hai ya nahi.

Step 3: Block or Allow Access
Agar role match nahi hua, toh 403 Forbidden error bhej diya. Agar match ho gaya, toh next() call karke aage bhej diya.

📌 Short Summary Steps (authorize)
Accept allowed roles via rest parameters (...roles).

Check req.user.role against allowed roles array.

Deny access (403 Forbidden) if role not permitted.

Call next() if role is authorized.

E. Logout Controller (logoutUser)
📦 Imports & Dependencies Needed
res.clearCookie(): Browser/Client cookie ko destroy/expire karne ke liye.

🔍 Step-by-Step Code Explanation (Hinglish)
Step 1: Clear Authentication Cookie
res.clearCookie("token", { httpOnly: true }) ka use karke client ki cookie ko turant expire kar diya jata hai.

Step 2: Send Success Response
Client ko 200 OK ke sath message bhej diya ki user successfully logout ho chuka hai.

📌 Short Summary Steps (logoutUser)
Clear the token cookie using res.clearCookie().

Return 200 OK success response.

4. API Endpoints Reference
1. Register User
Method: POST

URL: http://localhost:5000/api/auth/register

Body:

JSON
{
  "name": "Ritik",
  "email": "ritik@example.com",
  "password": "password123",
  "role": "user"
}
2. Login User (Sets HTTP-Only Cookie)
Method: POST

URL: http://localhost:5000/api/auth/login

Body:

JSON
{
  "email": "ritik@example.com",
  "password": "password123"
}
3. Get User Profile (Protected Route)
Method: GET

URL: http://localhost:5000/api/auth/me

Requires active login cookie.

4. Logout User
Method: POST

URL: http://localhost:5000/api/auth/logout

Clears auth cookie.

5. Admin Dashboard (Protected + Admin Only)
Method: GET

URL: http://localhost:5000/api/auth/admin/dashboard

Requires isLoggedIn + authorize("admin").

5. MongoDB Shell (mongosh) Handy Commands
JavaScript
// Connect to Shell
mongosh

// View databases
show dbs

// Switch to project DB
use auth-master-db

// View collections
show collections

// View registered users
db.users.find().pretty()

// Promote a user to admin role
db.users.updateOne({ email: "ritik@example.com" }, { $set: { role: "admin" } })
```
