import asyncHandler from "express-async-handler";
import { User } from "../models/user.model.js";
import { getToken } from "../config/generateToken.js";
import bcrypt from "bcryptjs";
import { sendError } from "../handlers/handlers.js";

// register user
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, picture } = req.body;
  if (!name || !email || !password) {
    sendError(res, "Please enter all fields.");
  }
  try {
    const user = await User.findOne({ email });

    if (user) {
      sendError(res, "User already exists.");
    }

    const hash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hash,
      picture,
    });

    if (newUser) {
      res.status(200).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        picture: newUser.picture,
        token: getToken(newUser._id),
      });
    } else {
      sendError(res, "Failed to create user.");
    }
  } catch (error) {
    res.status(500).json({
      status: "server error",
      error: error,
    });
  }
});

//  login user
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    sendError(res, "Please enter all fields.");
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      sendError(res, "User not found");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      sendError(res, "User not found");
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      token: getToken(user._id),
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: error,
    });
  }
});

// user search api
export const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          {
            name: { $regex: req.query.search, $options: "i" },
          },
          {
            email: { $regex: req.query.search, $options: "i" },
          },
        ],
      }
    : {};
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});
