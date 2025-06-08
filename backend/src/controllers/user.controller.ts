import { Request, Response } from "express";

import userModel from "../models/user.model";
import projectModel from "../models/project.model";

export async function searchUser(req: Request, res: Response) {
  const query = req.query.q;
  console.log(query);
  if (!query) {
    res.status(400).json({ message: "Missing search query" });
    return;
  }

  try {
    const user = req.user;
    // console.log(user);
    if (!user || !user.id) {
      res.status(404).json({ error: "User not found", success: false });
      return;
    }

    const users = await userModel
      .find({
        name: { $regex: query, $options: "i" },
      })
      .limit(5);

    const userToSend = users.filter((u) => u.id !== user.id);
    console.log(userToSend);
    res.json(userToSend);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function userInviteRequest(req: Request, res: Response) {
  try {
    const user = req.user;
    // console.log(user);
    if (!user || !user.id) {
      res.status(404).json({ error: "User not found", success: false });
      return;
    }

    const userId = user.id;

    const inviteProjects = await projectModel
      .find({
        pendingMembers: userId,
      })
      .populate("createdBy", "name email");

    if (!inviteProjects) {
      res.status(200).json({ message: "No projects found", success: false });
    }

    res.json({ inviteProjects });
    return;
  } catch (error) {
    console.error("Invite Request error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function getUser(req: Request, res: Response) {
  try {
    const user = req.user;
    // console.log(user);
    if (!user || !user.id) {
      res.status(404).json({ error: "User not found", success: false });
      return;
    }

    const { userId } = req.body;

    const userDoc = await userModel.findById(userId).select("-passwordHash");

    res.json({ user: userDoc });
    return;
  } catch (error) {
    console.error("Invite Request error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function editProfile(req: Request, res: Response) {
  try {
    const user = req.user;
    // console.log(user);
    if (!user || !user.id) {
      res.status(404).json({ error: "User not found", success: false });
      return;
    }
    const { name, username } = req.body;
    const updatedUser = await userModel.findByIdAndUpdate(user.id, {
      name,
      username,
    });

    res.json({ message: "Profile updated", updatedUser, success: true });
    return;
  } catch (error) {
    console.error("Edit Profile Request error:", error);
    res.status(500).json({ message: "Server error" });
  }
}
