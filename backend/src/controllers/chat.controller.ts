import { Request, Response } from "express";
import projectModel from "../models/project.model";
import chatModel from "../models/chat.model";
import { io } from "../socket/socket.io";
import mongoose from "mongoose";

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user || !user.id) {
      res.status(401).json({
        success: false,
        error: "Unauthorized: User not found",
      });
      return;
    }

    const { projectId } = req.params;
    const { message } = req.body;

    if (!message) {
      res.status(400).json({ message: "Message is required" });
      return;
    }

    const userId = user.id;

    // Check if user is part of the project
    const project = await projectModel.findById(projectId);
    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    console.log(project);

    // Convert all member ObjectIds to strings
    const memberIds = project.members.map((m: mongoose.Types.ObjectId) =>
      m.toString()
    );

    const isMember = memberIds.includes(userId);
    const isCreator = project.createdBy.toString() === userId;

    if (!isMember && !isCreator) {
      res
        .status(403)
        .json({ message: "Access denied: Not a project member or creator" });
      return;
    }

    const chat = await chatModel.create({
      sender: userId,
      projectId,
      message,
    });

    const populated = await chat.populate("sender", "name profilePic");

    io.to(projectId).emit("newMessage", { populated });

    res.status(201).json({
      success: true,
      message: "Message sent",
      data: populated,
    });
    return;
  } catch (error) {
    console.error("SendMessage Error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error while sending message",
    });
    return;
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;

    const messages = await chatModel
      .find({ projectId })
      .populate("sender", "name profilePic")
      .sort({ timestamp: 1 });

    res.status(200).json({
      success: true,
      messages,
    });
    return;
  } catch (error) {
    console.error("GetMessages Error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error while fetching messages",
    });
    return;
  }
};
