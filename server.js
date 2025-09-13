import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";

dotenv.config();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:6000",
  "http://localhost:5000",
  process.env.FRONTEND_URL || "https://todo-frontend-ashy.vercel.app",
];

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

const Port = process.env.PORT || 5000;
app.listen(Port, async () => {
  console.log(`Server is running on port ${Port}`);
  try {
    await connectDB();
  } catch (error) {
    console.error("Failed to connect to database:", error);
  }
});
