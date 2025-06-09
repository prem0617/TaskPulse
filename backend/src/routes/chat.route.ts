import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { getMessages, sendMessage } from "../controllers/chat.controller";

const router = express.Router();

router.post("/:projectId", authMiddleware, sendMessage);
router.get("/:projectId", authMiddleware, getMessages);

export default router;
