import express from "express";
import { uploadMultipleFiles, uploadSingleFile } from "../controllers/file.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.post("/upload", upload.single("file"), uploadSingleFile);

router.post("/upload-multiple",upload.array("files",5),uploadMultipleFiles)

export default router;
