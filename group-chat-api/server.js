import express from "express";
import cors from "cors";
import http from "http";
import { configDotenv } from "dotenv";
import connectionDB from "./config/db.js";
import { Server } from "socket.io";
import Message from "./models/message.js";

configDotenv();
connectionDB();

const app = express();

app.use(express.json());
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`⚡ A user connected: ${socket.id}`);

  socket.on("join-room", (room) => {
    socket.join(room);
    console.log(`user with ID : ${socket.id} joined room: ${room}`);
  });

  socket.on("send-message", async (data) => {
    try {
      const { room, sender, message } = data;
      console.log(
        `Message Received in Room [${room}] from ${sender}: ${message}`,
      );

      const savedMessage = await Message.create({
        room,
        sender,
        message,
      });

      io.to(room).emit("received message", savedMessage);
    } catch (error) {
      console.log("Error Saving message ", error);
    }
  });
  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log("server is Running PORT: ", PORT);
});
