import { StatusCodes } from "http-status-codes";
import File from "../models/files.js";

export const uploadSingleFile = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "Please Upload File" });
    }

    const newFile = await File.create({
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      fileType: req.file.mimetype,
    });

    return res
      .status(StatusCodes.CREATED)
      .json({
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
