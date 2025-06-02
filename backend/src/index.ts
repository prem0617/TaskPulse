import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import "dotenv/config";

import connectDB from "./lib/connectDb";

import authRoutes from "./routes/auth.route";
import projectRoutes from "./routes/projects.route";
import taskRoutes from "./routes/task.route";
import userRoutes from "./routes/user.route";

import { server, app } from "./socket/socket.io";

const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/users", userRoutes);

// Basic route
app.get("/", (_req: Request, res: Response) => {
  res.send("Hello from TypeScript + Express!");
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDB();
});
