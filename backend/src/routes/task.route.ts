import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  addTask,
  assignedTaskTo,
  deleteTask,
  modifyStatus,
} from "../controllers/task.controller";

const router = express.Router();

router.post("/add-task", authMiddleware, addTask);
router.post("/assign-task", authMiddleware, assignedTaskTo);
router.post("/modify-task-status", authMiddleware, modifyStatus);
router.get("/delete-task", authMiddleware, deleteTask);

export default router;
