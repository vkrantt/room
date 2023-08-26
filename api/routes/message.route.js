import express from "express";
import { protectedRoute } from "../middleware/verifyToken.js";
import {
  getAllMessages,
  sendMessage,
} from "../controller/message.controller.js";
const router = express.Router();

// routes
router.route("/").post(protectedRoute, sendMessage);
router.route("/:chatId").get(protectedRoute, getAllMessages);

export default router;
