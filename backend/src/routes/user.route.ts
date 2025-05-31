import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { searchUser } from "../controllers/user.controller";

const router = express.Router();

router.get("/search", authMiddleware, searchUser);

export default router;
