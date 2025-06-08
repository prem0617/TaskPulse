import express from "express";

import { addNewLogs, deleteLog, getLogs } from "../controllers/logs.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/add-logs", authMiddleware, addNewLogs);
router.post("/get-logs", authMiddleware, getLogs);
router.post("/delete-logs", authMiddleware, deleteLog);

export default router;
