import { StatusCodes } from "http-status-codes";
import Room from "../models/room.js";
import Booking from "../models/booking.js";

export const createBooking = async (req, res) => {
  try {
    const { room, userId, startDate, endDate } = req.body;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "End Date must be greater than start Date",
      });
    }

    const roomExist = await Room.findById(room);
    if (!roomExist) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "Room is Not found" });
    }

    const overlappingBooking = await Booking.findOne({
      room: room,
      status: { $ne: "cancelled" },
      startDate: { $lte: end },
      endDate: { $gte: { start } },
    });

    if (overlappingBooking) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message:
          "Room is already booked for these dates. Please choose different dates.",
      });
    }

    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const totalPrice = diffDays * roomExist.price;

    const booking = Booking.create({
      user: userId,
      room,
      startDate: start,
      endDate: end,
      totalPrice,
      status: "confirmed",
    });

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Room Book Successfully",
      data: booking,
    });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "Internal issue" });
  }
};
