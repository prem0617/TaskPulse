import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import "dotenv/config";

import connectDB from "./lib/connectDb";

import authRoutes from "./routes/auth.route";
import projectRoutes from "./routes/projects.route";
import taskRoutes from "./routes/task.route";
import userRoutes from "./routes/user.route";
import logsRoutes from "./routes/logs.route";
import chatRoutes from "./routes/chat.route";

import { server, app } from "./socket/socket.io";

import { Worker } from "bullmq";
import { connection } from "./bullMq/redis";
import { sendEmail } from "./bullMq/mailer";

// Middleware to parse JSON
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://task-pulse-seven.vercel.app",
      "https://task-pulse.vercel.app",
    ],
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/users", userRoutes);
app.use("/api/logs", logsRoutes);
app.use("/api/chat", chatRoutes);

// Basic route
app.get("/", (_req: Request, res: Response) => {
  res.send("Hello from TypeScript + Express!");
});

// Start the server

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});

const worker = new Worker(
  "sendReminder",
  async (job) => {
    const { email, task } = job.data;
    await sendEmail({ email, task });
    console.log(`Email sent to ${email} for task ${task.id || task._id}`);
  },
  { connection }
);

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});
