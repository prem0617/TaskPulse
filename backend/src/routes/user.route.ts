import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  editProfile,
  getUser,
  searchUser,
  userInviteRequest,
} from "../controllers/user.controller";

const router = express.Router();

router.post("/getUser", authMiddleware, getUser);
router.post("/editProfile", authMiddleware, editProfile);
router.get("/search", authMiddleware, searchUser);
router.get("/invite-request", authMiddleware, userInviteRequest);

export default router;
