import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  acceptRequest,
  createProject,
  getProject,
  sendRequest,
} from "../controllers/project.controllers";

const router = express.Router();

router.post("/create-project", authMiddleware, createProject);
router.get("/get-project", authMiddleware, getProject);
router.post("/send-request", authMiddleware, sendRequest);
router.post("/accept-request", authMiddleware, acceptRequest);

export default router;
