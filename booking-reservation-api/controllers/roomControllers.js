import { StatusCodes } from "http-status-codes";
import Room from "../models/room.js";

export const createRoom = async (req, res) => {
  try {
    const { title, description, price, capacity } = req.body;

    if (!title || !description || !price || !capacity) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "Please Fill All fields" });
    }

    const newRoom = await Room.create({
      title,
      description,
      price,
      capacity,
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Room Create Successfully",
      data: newRoom,
    });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "Internal issue" });
  }
};

export const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find({});
    return res
      .status(StatusCodes.OK)
      .json({ message: true, count: rooms.length, data: rooms });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "Internal issue" });
  }
};
