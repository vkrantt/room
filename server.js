import express from "express";
import { config } from "dotenv";
import chalk from "chalk";
import { chats } from "./data.js";
import cors from "cors";
import { mongoConnection } from "./api/database/dbconnect.js";
import userRoutes from "./api/routes/user.route.js";
import chatRoutes from "./api/routes/chat.route.js";
import messageRoutes from "./api/routes/message.route.js";
// import SocketIO from "socket.io";
import { Server, Socket } from "socket.io";

config({ path: ".env" });

// database connection
mongoConnection();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    Status: "ok",
    app: "Room",
    version: "1.0.0",
  });
});

app.get("/api/chats", (req, res) => {
  res.send(chats);
});

// Routes
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

const port = process.env.PORT || 3030;
const server = app.listen(port, () => {
  console.log(chalk.bold.blue(`Server is live on http://localhost:${port}`));
});

var io = new Server(server, {
  pingTimeOut: 60000,
  cors: {
    origin: "https://room-v1.netlify.app",
  },
});

io.on("connection", (socket) => {
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("joinchat", (room) => {
    socket.join(room);
  });

  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });

  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
  });

  socket.on("new message", (newMessageRecieved) => {
    let chat = newMessageRecieved.chat;
    if (!chat.users) {
      return;
    }
    chat.users.forEach((user) => {
      if (user._id === newMessageRecieved.sender._id) {
        return;
      }
      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    socket.leave(userData._id);
  });
});
