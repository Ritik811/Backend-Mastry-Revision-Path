import express from "express";
import { loginUser, registerUser } from "../controllers/authController.js";
import { isLoggedIn } from "../middleware/authmiddleware.js";
import { StatusCodes } from "http-status-codes";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/me", isLoggedIn, (req, res) => {
  return res
    .status(StatusCodes.OK)
    .json({
      success: true,
      message: "Here is Your profile data",
      user: req.user,
    });
});

const authRouter = router;
export default authRouter;
