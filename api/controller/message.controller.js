import asyncHandler from "express-async-handler";
import { Message } from "../models/message.model.js";
import { sendError } from "../handlers/handlers.js";
import { User } from "../models/user.model.js";
import { Chat } from "../models/chat.model.js";

export const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    res.status(400);
    sendError(res, "Invalid data.");
  }

  let newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };
  try {
    let message = await Message.create(newMessage);

    message = await message.populate("sender", "name picture");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name picture email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });

    res.json(message);
  } catch (error) {
    res.status(500).json({
      status: "server error",
      error: error,
    });
  }
});

export const getAllMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name picture email")
      .populate("chat");

    res.json(messages);
  } catch (error) {
    res.status(500).json({
      status: "server error",
      error: error,
    });
  }
});
