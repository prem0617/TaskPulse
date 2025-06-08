import { Request, Response } from "express";
import activitylogModel from "../models/activitylog.model";
import { getReceiverSocketId, io } from "../socket/socket.io";

export async function addNewLogs(req: Request, res: Response) {
  try {
    const user = req.user;

    if (!user || !user.id) {
      res.status(401).json({
        success: false,
        error: "Unauthorized: User not found",
      });
      return;
    }

    console.log(req.body);

    const { projectId, taskId, action, extraInfo } = req.body;

    if (!projectId || !action) {
      res.status(400).json({
        success: false,
        error: "Missing required fields: projectId and action are mandatory",
      });
      return;
    }

    const logsData = {
      projectId,
      taskId,
      action,
      extraInfo,
      userId: user.id,
    };

    const newLogDoc = new activitylogModel(logsData);
    await newLogDoc.save();

    await newLogDoc.populate([
      { path: "userId", select: "name username email" },
      { path: "taskId", select: "title" },
    ]);

    const newLogs = newLogDoc;

    res.status(201).json({
      success: true,
      message: "Activity log added successfully",
      logs: newLogs,
    });

    const roomName = projectId;
    const message = `Activity log added by ${user.name} for task ${taskId}`;

    const socketId = getReceiverSocketId(user.id);
    console.log(socketId, "socketId");
    if (socketId) {
      const socket = io.sockets.sockets.get(socketId);
      if (socket) {
        socket.join(roomName);

        io.to(roomName).emit("new-logs", {
          newLogs,
          message,
        });
      }
    }

    return;
  } catch (error) {
    console.error("Error adding activity log:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error while adding activity log",
    });
    return;
  }
}

export async function getLogs(req: Request, res: Response) {
  try {
    const user = req.user;

    if (!user || !user.id) {
      res.status(401).json({
        success: false,
        error: "Unauthorized: User not found",
      });
      return;
    }

    const { projectId } = req.body;

    if (!projectId) {
      res.status(400).json({
        success: false,
        error: "Missing required fields: projectId and action are mandatory",
      });
      return;
    }

    const getLogs = await activitylogModel
      .find({ projectId })
      .populate("userId", "name username email")
      .populate("taskId", "title")
      .sort({ createdAt: -1 }); // latest first

    res.status(201).json({
      success: true,
      message: "Previous log fetched successfully",
      logs: getLogs,
    });
    return;
  } catch (error) {
    console.error("Error getting activity log:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error while getting activity log",
    });
    return;
  }
}

export async function deleteLog(req: Request, res: Response) {
  try {
    const user = req.user;
    if (!user || !user.id) {
      res.status(401).json({
        success: false,
        error: "Unauthorized: User not found",
      });
      return;
    }

    const { logId } = req.body;

    if (!logId) {
      res.status(400).json({
        success: false,
        error: "Missing required field: logId",
      });
      return;
    }

    const log = await activitylogModel.findById(logId);

    if (!log) {
      res.status(404).json({
        success: false,
        error: "Log not found",
      });
      return;
    }

    const roomName = log.projectId.toString();

    // Emit socket event BEFORE deletion
    io.to(roomName).emit("delete-log", { logId });

    // Delete log from DB
    await activitylogModel.findByIdAndDelete(logId);

    res.status(200).json({
      success: true,
      message: "Log deleted successfully",
      logId,
    });
    return;
  } catch (error) {
    console.error("Error deleting log:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error while deleting log",
    });
    return;
  }
}
