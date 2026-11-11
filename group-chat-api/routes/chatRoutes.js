import express from "express";
import { getChatHistory } from "../controllers/chatControllers.js";

const router = express.Router();

router.get("/history/:room", getChatHistory);

export default router;
