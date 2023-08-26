import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    email: { type: String, trim: true, unique: true, required: true },
    password: { type: String, required: true },
    picture: {
      type: String,
      default:
        "https://i0.wp.com/digitalhealthskills.com/wp-content/uploads/2022/11/3da39-no-user-image-icon-27.png?fit=500%2C500&ssl=1",
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
