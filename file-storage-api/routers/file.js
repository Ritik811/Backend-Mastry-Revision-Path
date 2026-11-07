import express from "express";
import { uploadSingleFile } from "../controllers/file.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.post("/upload", upload.single("file"), uploadSingleFile);

export default router;
