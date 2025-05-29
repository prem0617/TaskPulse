import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import "dotenv/config";

import connectDB from "./lib/connectDb";
import authRoutes from "./routes/auth.route";

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

// Basic route
app.get("/", (_req: Request, res: Response) => {
  res.send("Hello from TypeScript + Express!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDB();
});
