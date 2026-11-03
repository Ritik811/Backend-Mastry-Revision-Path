import express from "express";
import {
  redirectToOriginalUrl,
  shortenUrl,
} from "../controllers/urlControllers.js";

const router = express.Router();

router.post("/shorten", shortenUrl);
router.get("/:shortCode", redirectToOriginalUrl);

export default router;
