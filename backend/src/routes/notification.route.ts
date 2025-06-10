import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  deleteNotification,
  getNotification,
} from "../controllers/notification.controller";

const router = express.Router();

// ✅ Get all notifications for a logged-in user
router.get("/", authMiddleware, getNotification);

// ✅ Mark a notification as read

// ✅ Delete a notification
router.delete("/:id", authMiddleware, deleteNotification);

export default router;
