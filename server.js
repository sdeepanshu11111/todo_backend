import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";

dotenv.config();

const app = express();
const httpServer = createServer(app); // Create HTTP server

// ✅ CORS setup
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:5174",
      "https://todo-frontend-ashy.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

// ✅ SOCKET.IO SETUP
const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:5174",
      "https://todo-frontend-ashy.vercel.app",
    ],
    credentials: true,
  },
});

// Track online users
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("⚡ User connected:", socket.id);

  // Join private room (based on userId)
  socket.on("join", (userId) => {
    socket.userId = userId;
    socket.join(userId);
    onlineUsers.set(userId, socket.id);
    
    console.log(`✅ User ${userId} joined their room`);
    
    // Broadcast updated online users list
    io.emit("updateUsers", Array.from(onlineUsers.keys()));
  });

  // Handle message sending
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const msg = { senderId, receiverId, text, createdAt: new Date() };
    io.to(receiverId).emit("receiveMessage", msg);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
    
    // Remove user from online list
    if (socket.userId) {
      onlineUsers.delete(socket.userId);
      // Broadcast updated online users list
      io.emit("updateUsers", Array.from(onlineUsers.keys()));
    }
  });
});

// ✅ Start server
const Port = process.env.PORT || 5000;
httpServer.listen(Port, async () => {
  console.log(`🚀 Server is running on port ${Port}`);
  try {
    await connectDB();
  } catch (error) {
    console.error("❌ Failed to connect to database:", error);
  }
});
