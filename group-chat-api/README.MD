# 🚀 Real-Time Group Chat API Backend

A production-grade, modular, and scalable real-time chat backend built using **Node.js, Express, Socket.io, and Mongoose (MongoDB)**. This project follows industry-standard architectural patterns (MVC, Separation of Concerns) and implements advanced real-time features like chat rooms, message persistence, pagination, typing indicators, and active user tracking.

---

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Real-Time Communication:** Socket.io
- **Database & ODM:** MongoDB, Mongoose
- **Environment & Utilities:** Dotenv, CORS, Http-Status-Codes

---

## 📁 Project Architecture & Folder Structure

To keep the codebase clean, maintainable, and scalable, the project is structured following strict **Separation of Concerns**:

```text
group-chat-api/
│
├── config/
│   └── db.js               # MongoDB connection setup
│
├── controllers/
│   └── chatController.js   # HTTP route controllers (e.g., chat history)
│
├── models/
│   └── message.js          # Mongoose Schema for persistent chat messages
│
├── routes/
│   └── chatRoutes.js       # Express router definitions
│
├── sockets/
│   └── chatSocket.js       # Modularized Socket.io event handlers & state
│
├── .env                    # Environment variables (PORT, MONGO_URI)
├── server.js               # Lean server entry point (Bootstrap & Middleware)
└── package.json            # Project dependencies and scripts
```

🌟 Core Features & Implementation Levels
🟢 Level 1: WebSocket Setup & Foundation
HTTP & Socket Integration: Created an HTTP server using Node's http module wrapped around Express, attaching Socket.io to it.

Crucial Learning: Always use server.listen() instead of app.listen() when working with Socket.io to prevent unattached Express servers.

Lifecycle Management: Handled basic connection and disconnect events for tracking active client socket IDs.

🟡 Level 2: Chat Rooms & Database Persistence
Room-Based Isolation: Implemented socket.join(room) so messages are isolated to specific groups/rooms rather than global broadcasting (io.emit).

Database Persistence: Every incoming message is securely captured and saved to MongoDB using a robust Message schema (sender, room, message, timestamps).

MVC REST API Route: Created a dedicated controller and route to fetch historical chat data for any room (GET /api/chat/history/:room).

🔴 Level 3: Advanced State & Optimization (Production-Ready)
Chat Pagination (Infinite Scroll Support): Added query parameters (page and limit) to the history API using MongoDB's .skip() and .limit(), combined with reverse chronological sorting (createdAt: -1) and .reverse() for seamless frontend UI integration.

Real-Time Typing Indicators: Broadcasts "typing" and "stop-typing" events using socket.to(room).emit(), ensuring the sender is excluded and only room peers receive the indicator.

Active User Tracking: Maintained an in-memory Map() (activeUsers) to map socket IDs to user states, ensuring clean disconnect logs and state cleanup when users leave.

🔌 API Endpoints & Socket Events
🌐 HTTP REST Endpoints
Get Chat History (Paginated):

GET /api/chat/history/:room?page=1&limit=20

Response Format:
{
"success": true,
"currPage": 1,
"totalPages": 5,
"count": 20,
"data": [ ... ]
}

⚡ Socket.io Events
join-room

Payload: { room: "room-1", sender: "Ritik" } (supports backward compatibility for raw strings).

Action: Joins the socket to the specified room and registers user state.

send-message

Payload: { room: "room-1", sender: "Ritik", message: "Hello World!" }

Action: Saves message to MongoDB and broadcasts via io.to(room).emit("received message", savedMessage).

typing & stop-typing

Payload: { room: "room-1", sender: "Ritik" }

Action: Broadcasts typing indicators to room peers using socket.to(room).emit().

disconnect

Action: Automatically cleans up user state from the activeUsers map and logs departure.

⚙️ How to Run Locally
Clone the repository / Open project directory.

Install Dependencies:

Bash
npm install
Create a .env file in the root directory and add your configurations:

Code snippet
PORT=5000
MONGO_URI=your_mongodb_connection_string_here
Start the Server:

Bash
npm run dev # or node server.js
