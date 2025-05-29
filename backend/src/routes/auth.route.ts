import express from "express";
import { getME, login, logout, signup } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.get("/logout", logout);
router.get("/getMe", authMiddleware, getME);

export default router;
