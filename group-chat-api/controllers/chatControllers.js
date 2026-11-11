import Message from "../models/message.js";
import { StatusCodes } from "http-status-codes";

export const getChatHistory = async (req, res) => {
  try {
    const { room } = req.params;
    const message = await Message.find({ room }).sort({ createdAt: 1 });

    return res
      .status(StatusCodes.OK)
      .json({ success: true, count: message.length, data: message });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error while fetching chat history",
    });
  }
};
