import express from "express";
import { protectedRoute } from "../middleware/verifyToken.js";
import {
  accessChat,
  addToGroup,
  createGroupChat,
  fetchChats,
  removeFromGroup,
  renameGroup,
} from "../controller/chat.controller.js";
const router = express.Router();

// routes
router
  .route("/")
  .post(protectedRoute, accessChat)
  .get(protectedRoute, fetchChats);

router.route("/group").post(protectedRoute, createGroupChat);
router.route("/rename").put(protectedRoute, renameGroup);
router.route("/groupadd").put(protectedRoute, addToGroup);
router.route("/groupremove").put(protectedRoute, removeFromGroup);

export default router;
