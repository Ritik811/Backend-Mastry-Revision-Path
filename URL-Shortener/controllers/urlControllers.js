import { StatusCodes } from "http-status-codes";
import Url from "../models/URLmodels.js";
import Counter from "../models/counter.js";
import { encodeBase62 } from "../utils/base62.js";

const getNextSequence = async (sequenceName) => {
  const sequenceDocument = await Counter.findOneAndUpdate(
    { id: sequenceName },
    { $inc: { seq: 1 } },
    { new: true, upsert: true },
  );

  return sequenceDocument.seq;
};

const isValidUrl = (url) => {
  try {
    const parseUrl = new URL(url);
    return parseUrl.protocol == "http:" || parseUrl.protocol == "https:";
  } catch (err) {
    return false;
  }
};

export const shortenUrl = async (req, res) => {
  try {
    let { originalUrl, customCode } = req.body;
    if (!originalUrl) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "Original Url is required" });
    }

    originalUrl = originalUrl.trim();

    if (!isValidUrl(originalUrl)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "Invalid URL" });
    }

    let shortCode;
    if (customCode) {
      customCode = customCode.trim();
      const isValidFormat = /^[a-zA-Z0-9-_]+$/.test(customCode);
      if (!isValidFormat) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message:
            "Custom code can only contain letters, numbers, hyphens, and underscores.",
        });
      }

      const existingUrl = await Url.findOne({ shortCode: customCode });
      if (existingUrl) {
        return res.status(StatusCodes.CONFLICT).json({
          success: false,
          message:
            "This custom alias is already taken. Please choose another one.",
        });
      }

      shortCode = customCode;
    } else {
      const counterValue = await getNextSequence("url_count");
      shortCode = encodeBase62(counterValue);
    }

    let expiresAt = null;
    if (expiresInDays && !isNaN(expiresInDays)) {
      expiresAt = new Date(
        Date.now() + Number(expiresInDays) * 24 * 60 * 60 * 1000,
      );
    }

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

    if (urlRecord.expiresAt && new Date() > urlRecord.expiresAt) {
      return res.status(StatusCodes.GONE).json({
        success: false,
        message: "This short URL has expired and is no longer accessible.",
      });
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
