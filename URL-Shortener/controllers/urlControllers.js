import { StatusCodes } from "http-status-codes";
import Url from "../models/URLmodels.js";
import crypto from "crypto";

export const shortenUrl = async (req, res) => {
  try {
    let { originalUrl } = req.body;
    if (!originalUrl) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "Original Url is required" });
    }

    const shortCode = crypto.randomBytes(3).toString("hex");

    const newUrl = await Url.create({
      originalUrl,
      shortCode,
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Short Url generated Successfully",
      data: {
        originalUrl: newUrl.originalUrl,
        shortCode: newUrl.shortCode,
        shortUrl: `http://localhost:5000/${newUrl.shortCode}`,
      },
    });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "Internal issue" });
  }
};

export const redirectToOriginalUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const urlRecord = await Url.findOne({ shortCode });

    if (!urlRecord) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "short url not found or expire" });
    }

    urlRecord.clicks++;
    await urlRecord.save();

    return res.redirect(urlRecord.originalUrl);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "Internal issue" });
  }
};
