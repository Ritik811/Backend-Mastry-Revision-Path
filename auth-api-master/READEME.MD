Project 1: Authentication & Authorization API 🚀

A robust, production-ready Authentication and Authorization RESTful API built with Node.js, Express, MongoDB (Mongoose), bcrypt, and JSON Web Tokens (JWT).

📚 Revision Notes & Concepts Covered

1. Folder Architecture (MVC Standard)

config/: Database connection logic (db.js).

models/: Database schemas using Mongoose (User.js).

controllers/: Core business logic for authentication (authController.js).

routes/: Endpoints defining API paths (authRoutes.js).

middleware/: Custom middleware (JWT authorization, input validation).

2. Key Technical Concepts & Best Practices

A. Input Validation & Error Handling

Always validate required fields (name, email, password) before querying the database to save resource cycles.

Return explicit HTTP status codes using http-status-codes (e.g., StatusCodes.BAD_REQUEST, StatusCodes.UNAUTHORIZED).

B. Mongoose Queries: findOne vs find

User.findOne({ email }): Returns a single matching document (or null if not found). Crucial for checking existence during registration or login.

User.find({ email }): Returns an array of matching documents ([]). Since empty arrays are truthy in JavaScript, checking if (User.find(...)) will incorrectly trigger existence checks!

C. Password Security (bcrypt)

Passwords must never be stored in plain text.

Hashing: Use await bcrypt.hash(password, 10) during registration.

Comparison: Use await bcrypt.compare(enteredPassword, storedHashedPassword) during login.

D. Authentication via JWT (JSON Web Tokens)

JWT consists of three parts: Header, Payload, Signature.

Generated on successful login using jwt.sign({ id, role }, secret, { expiresIn: '1d' }).

Sent in request headers for protected endpoints:

Authorization: Bearer <your_jwt_token>

🛠️ Project Setup Instructions

1. Install Dependencies

npm install express mongoose bcrypt jsonwebtoken dotenv cors http-status-codes
npm install -D nodemon


2. Environment Variables Setup (.env)

Create a .env file in the root directory:

PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/auth-master-db
JWT_SECRET=your_super_secret_jwt_key


3. Start Development Server

npm run dev


🔌 API Endpoints Reference

1. Register User

Method: POST

URL: http://localhost:5000/api/auth/register

Headers: Content-Type: application/json

Body:

{
  "name": "Ritik",
  "email": "ritik@example.com",
  "password": "password123",
  "role": "user"
}


Response (201 Created):

{
  "success": true,
  "message": "User is Register Successfully",
  "data": {
    "id": "671e7d...",
    "name": "Ritik",
    "email": "ritik@example.com",
    "role": "user"
  }
}


2. Login User

Method: POST

URL: http://localhost:5000/api/auth/login

Headers: Content-Type: application/json

Body:

{
  "email": "ritik@example.com",
  "password": "password123"
}


Response (200 OK):

{
  "success": true,
  "message": "User Login successfully",
  "data": {
    "id": "671e7d...",
    "name": "Ritik",
    "email": "ritik@example.com",
    "role": "user",
    "token": "eyJhbGciOiJIUzI1Ni..."
  }
}



⚙️ MongoDB Shell (mongosh) Handy Commands

# Connect to Shell
mongosh

# View databases
show dbs

# Switch to project DB
use auth-master-db

# View collections
show collections

# View registered users
db.users.find().pretty()
