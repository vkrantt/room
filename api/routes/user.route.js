import express from "express";
import {
  allUsers,
  loginUser,
  registerUser,
} from "../controller/user.controller.js";
import { protectedRoute } from "../middleware/verifyToken.js";
const router = express.Router();

// routes
router.route("/").post(registerUser).get(protectedRoute, allUsers);
router.route("/login").post(loginUser);

export default router;
