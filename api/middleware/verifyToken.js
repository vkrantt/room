import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import asyncHandler from "express-async-handler";

export const protectedRoute = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // decode
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (errors) {
      res.status(401).json({
        status: "Unautorized",
        error: errors,
      });
    }
  }
  if (!token) {
    res.status(401).json({
      status: "Unautorized",
    });
  }
});
