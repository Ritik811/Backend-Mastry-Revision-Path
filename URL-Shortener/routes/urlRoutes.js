import express from "express";
import {
  redirectToOriginalUrl,
  shortenUrl,
} from "../controllers/urlControllers.js";
import { shortenLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.post("/shorten",shortenLimiter, shortenUrl);
router.get("/:shortCode", redirectToOriginalUrl);

export default router;
