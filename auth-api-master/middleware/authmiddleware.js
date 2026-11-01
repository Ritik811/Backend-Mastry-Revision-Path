import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { StatusCodes } from "http-status-codes";

export const isLoggedIn = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, message: "User is Note LoggedIn" });
    }

    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);

    const findUser = await User.findById(verifyToken.id).select("-password");
    if (!findUser) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, message: "Invalid User" });
    }

    req.user = findUser;
    next();
  } catch (error) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ success: false, message: "Invalid user" });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({
          success: false,
          message: `Role (${req.user.role}) is not allowed to access this resource! 🚫`,
        });
    }
    next();
  };
};
