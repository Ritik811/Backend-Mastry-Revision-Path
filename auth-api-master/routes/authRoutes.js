import express from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/authController.js";
import { authorize, isLoggedIn } from "../middleware/authmiddleware.js";
import { StatusCodes } from "http-status-codes";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/me", isLoggedIn, (req, res) => {
  return res.status(StatusCodes.OK).json({
    success: true,
    message: "Here is Your profile data",
    user: req.user,
  });
});

router.post("/logout", isLoggedIn, logoutUser);

router.get("/admin/dashboard", isLoggedIn, authorize("admin"), (req, res) => {
  return res.status(StatusCodes.OK).json({
    success: true,
    message: "welcome to admin dashboard",
    admin: req.user,
  });
});

const authRouter = router;
export default authRouter;
