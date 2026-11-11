import Message from "../models/message.js";
import { StatusCodes } from "http-status-codes";

export const getChatHistory = async (req, res) => {
  try {
    const { room } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const message = await Message.find({ room })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalMessage = await Message.countDocuments({ room });

    return res.status(StatusCodes.OK).json({
      success: true,
      currPage: page,
      totalPages: Math.ceil(totalMessage / limit),
      count: message.length,
      data: message.reverse(),
    });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error while fetching chat history",
    });
  }
};
