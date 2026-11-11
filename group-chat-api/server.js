import express from "express";
import cors from "cors";
import http from "http";
import { configDotenv } from "dotenv";
import connectionDB from "./config/db.js";
import { Server } from "socket.io";
import chatRouter from "./routes/chatRoutes.js";
import { chatSocket } from "./sockets/chatSocket.js";

configDotenv();
connectionDB();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/chat", chatRouter);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

chatSocket(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log("server is Running PORT: ", PORT);
});
