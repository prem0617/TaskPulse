import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  acceptRequest,
  createProject,
  getProject,
  getProjects,
  sendRequest,
} from "../controllers/project.controllers";
import { getTasks } from "../controllers/task.controller";

const router = express.Router();

router.post("/create-project", authMiddleware, createProject);
router.get("/get-project", authMiddleware, getProjects);
router.post("/get-one-project/:id", authMiddleware, getProject);
router.post("/send-request", authMiddleware, sendRequest);
router.post("/accept-request", authMiddleware, acceptRequest);
router.post("/get-tasks", authMiddleware, getTasks);

export default router;
