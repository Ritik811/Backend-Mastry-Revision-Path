import { StatusCodes } from "http-status-codes";
import File from "../models/files.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

export const uploadSingleFile = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "Please Upload File" });
    }

    const cloudinaryResponse = await uploadToCloudinary(req.file.buffer);

    const newFile = await File.create({
      fileName: req.file.originalname,
      filePath: cloudinaryResponse.secure_url,
      fileSize: req.file.size,
      fileType: req.file.mimetype,
    });

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "File uploaded Successfully",
      data: newFile,
    });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "Internal issue" });
  }
};

export const uploadMultipleFiles = async (req, res) => {
  try {
    if (!req.files || req.files.length == 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "upload at least one file" });
    }

    const uploadPromises = req.files.map(async (file) => {
      const cloudinaryResponse = await uploadToCloudinary(file.buffer);

      return File.create({
        fileName: file.originalname,
        filePath: cloudinaryResponse.secure_url,
        fileType: file.mimetype,
        fileSize: file.size,
      });
    });

    const savedFiles = await Promise.all(uploadPromises);

    return res
      .status(StatusCodes.CREATED)
      .json({
        success: true,
        message: "File Uploads Successfully",
        data: savedFiles,
      });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "Internal issue" });
  }
};
