import rateLimit from "express-rate-limit";
import { StatusCodes } from "http-status-codes";

export const shortenLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return res.status(StatusCodes.TOO_MANY_REQUESTS).json({
      success: false,
      message:
        "Too many requests from this IP, please try again after 15 minutes.",
    });
  },
});
