import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  acceptRequest,
  createProject,
  deleteProject,
  getProject,
  getProjects,
  invitedProjects,
  sendRequest,
} from "../controllers/project.controllers";
import { getTasks } from "../controllers/task.controller";

const router = express.Router();

router.post("/create-project", authMiddleware, createProject);
router.get("/get-project", authMiddleware, getProjects);
router.get("/invited-projects", authMiddleware, invitedProjects);
router.post("/get-one-project/:id", authMiddleware, getProject);
router.post("/send-request", authMiddleware, sendRequest);
router.post("/accept-request", authMiddleware, acceptRequest);
router.post("/get-tasks", authMiddleware, getTasks);
router.post("/delete-project", authMiddleware, deleteProject);

export default router;
