import User from "../models/user.js";
import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    let { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "Please fill all inputs" });
    }

    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "User Already Exist with this email",
      });
    }
    const saltRound = 10;
    const hashPassword = await bcrypt.hash(password, saltRound);

    // Create New User
    const newUser = new User({
      name,
      email,
      password: hashPassword,
      role: role || "user",
    });

    await newUser.save();

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "User is Register Successfully",
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "Internal Issue" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "fill all inputs" });
    }

    let userExist = await User.findOne({ email });
    if (!userExist) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, message: "user is note register" });
    }

    const isPasswordMatch = await bcrypt.compare(password, userExist.password);
    if (!isPasswordMatch) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, message: "Invalid email and password" });
    }

    // Generate Token
    const token = jwt.sign(
      { id: userExist.id, role: userExist.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "User Login successfully",
      data: {
        id: userExist.id,
        name: userExist.name,
        email: userExist.email,
        role: userExist.role,
        token: token,
      },
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Issue",
      error: error.message,
    });
  }
};
