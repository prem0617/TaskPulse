import { Request, Response } from "express";
import mongoose from "mongoose";

import taskModel from "../models/task.model";
import projectModel from "../models/project.model";
import { getReceiverSocketId, io } from "../socket/socket.io";
import { scheduleEmailReminder } from "../bullMq/scheduleEmailReminder";

import { emailQueue } from "../bullMq/emailQueue"; // adjust path if needed

import fs, { stat } from "fs";
import cloudinary from "../lib/cloudinary";

interface MulterFile extends Express.Multer.File {
  path: string; // when disk storage is used
}

export async function addTask(req: Request, res: Response) {
  try {
    const user = req.user;
    if (!user || !user.id) {
      res.status(404).json({ error: "User not found", success: false });
      return;
    }
    const {
      title,
      description,
      projectId,
      status,
      dueDate,
      assignedTo,
      priority,
      labels,
    } = req.body;

    console.log({ body: req.body, files: req.files });

    if (!title || !projectId) {
      res
        .status(400)
        .json({ error: "Title and ProjectId are required", success: false });
      return;
    }

    // Process files if any (req.files from multer)
    const files = req.files as MulterFile[] | undefined;

    // Upload files to Cloudinary and prepare attachments array
    const attachments = [];

    if (files && files.length > 0) {
      for (const file of files) {
        // Upload to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(file.path, {
          folder: "Task Management", // optional folder in Cloudinary
          resource_type: "auto",
        });

        // Push file info + URL to attachments array
        attachments.push({
          filename: file.filename,
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          url: uploadResult.secure_url,
        });

        // Remove local file after upload
        fs.unlinkSync(file.path);
      }
    }

    // Build the task data object with attachments
    const taskData = {
      title,
      description,
      status: status || "To Do",
      dueDate: dueDate ? new Date(dueDate) : undefined,
      assignedTo,
      projectId,
      priority: priority || "medium",
      labels: labels ? JSON.parse(labels) : [], // labels sent as JSON string from frontend
      attachments,
    };

    const newTaskDoc = new taskModel(taskData);
    await newTaskDoc.save();

    await newTaskDoc.populate({
      path: "projectId",
      select: "title description createdBy",
    });

    const socketId = getReceiverSocketId(user.id);
    const newTask = newTaskDoc;

    console.log(newTask);

    if (socketId) {
      if (socketId) {
        const socket = io.sockets.sockets.get(socketId);
        if (socket) {
          io.to(projectId).emit("new-task", {
            message: `${title} is added as new task by admin in ${newTaskDoc.projectId.title}`,
            task: newTask,
          });
        }
      }
    }

    res.json({
      message: "New task created",
      newTask: newTaskDoc,
      success: true,
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Server error while creating task",
      success: false,
    });
    return;
  }
}

export async function assignedTaskTo(req: Request, res: Response) {
  try {
    const user = req.user;
    // console.log(user);
    if (!user || !user.id) {
      res.status(404).json({ error: "User not found", success: false });
      return;
    }
    // console.log(req.body);
    const { userId, taskId, projectId, dueDate, email } = req.body;

    const project = await projectModel.findById(projectId);

    if (!project) {
      res.status(404).json({ error: "Project is not Found", success: false });
      return;
    }

    // console.log(project);

    const acceptMembersList = project.members.map((p: mongoose.ObjectId) => {
      return p.toString();
    });

    const pendingMembersList = project.pendingMembers.map(
      (p: mongoose.ObjectId) => {
        return p.toString();
      }
    );

    const isPendingRequest = pendingMembersList.includes(userId);

    const isMemberIsPartOfProject = acceptMembersList.includes(userId);

    // console.log({ isPendingRequest, isMemberIsPartOfProject });

    if (isPendingRequest) {
      res.status(400).json({
        error: "User has not accepted the project invite yet.",
        success: false,
      });
      return;
    }

    if (!isMemberIsPartOfProject) {
      res.status(400).json({
        error: "User is not part of this project. Invite them first.",
        success: false,
      });
      return;
    }

    const task = await taskModel.findById(taskId);

    if (!task) {
      res.status(404).json({ error: "Task is not Found", success: false });
      return;
    }

    task.assignedTo = userId;
    task.dueDate = dueDate;

    await task.save();

    await task.save();
    const populatedTask = await taskModel
      .findById(task._id)
      .populate("assignedTo", "name email")
      .populate("projectId");

    const receiverId = getReceiverSocketId(userId);
    console.log(receiverId, "receiverId");
    if (receiverId) {
      io.to(receiverId).emit(
        "assigned-task",
        `${task.title} is assigned to you`
      );
    }

    io.to(projectId).emit("assign-task-general", {
      task: populatedTask,
    });

    await scheduleEmailReminder({ task, email, dueDate });

    res.json({
      message: `Task is assigned to user and Task reminder scheduled successfully.${userId} `,
      success: true,
      task,
    });

    return;
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Server error while assign task", success: false });
    return;
  }
}

export async function modifyStatus(req: Request, res: Response) {
  try {
    const user = req.user;
    if (!user || !user.id) {
      res.status(404).json({ error: "User not found", success: false });
      return;
    }

    const { taskId, status } = req.body;
    const task = await taskModel.findById(taskId).populate("assignedTo");

    if (!task) {
      res.status(404).json({ error: "Task is not Found", success: false });
      return;
    }

    if (task.assignedTo._id.toString() !== user.id) {
      res.status(400).json({
        error: "You don't have access to change the status of this task",
        success: false,
      });
      return;
    }

    task.status = status;
    await task.save();
    console.log({ task, status });
    // 👇 Cancel scheduled email reminder if task is marked as "Done"
    if (status === "Done") {
      const jobId = `reminder-${task._id}`;
      try {
        await emailQueue.remove(jobId);
        console.log(`Cancelled reminder job: ${jobId}`);
      } catch (err: any) {
        console.error(`Failed to remove job ${jobId}:`, err.message);
      }
    }

    const projectId = task.projectId.toString();
    const socketId = getReceiverSocketId(user.id);
    const message = `${task.title} is now in the "${status}" stage.`;

    if (socketId) {
      const socket = io.sockets.sockets.get(socketId);
      if (socket) {
        io.to(projectId).emit("change-task-status", {
          message,
          task,
        });
      }
    }

    res.json({ message: "Task status updated", task, success: true });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Server error while modifying task status",
      success: false,
    });
    return;
  }
}

export async function getTasks(req: Request, res: Response) {
  try {
    const { projectId } = await req.body;
    // console.log(projectId);
    const tasks = await taskModel
      .find({
        projectId,
      })
      .populate("assignedTo", "name email")
      .populate("projectId");
    // console.log(tasks);
    res.json({ tasks, success: true });
    return;
  } catch (error) {
    console.log(error);
    res.json({ error, success: false });
    return;
  }
}

export async function deleteTask(req: Request, res: Response) {
  try {
    const user = req.user;
    // console.log(user);
    if (!user || !user.id) {
      res.status(404).json({ error: "User not found", success: false });
      return;
    }

    const { taskId } = req.query;
    console.log(taskId);
    const task = await taskModel.findByIdAndDelete(taskId);
    if (!task) {
      res.json({ error: "Task not found", success: false });
      return;
    }

    const projectId = task.projectId.toString();

    const socketId = getReceiverSocketId(user.id);

    if (socketId) {
      if (socketId) {
        const socket = io.sockets.sockets.get(socketId);
        if (socket) {
          io.to(projectId).emit("delete-task", task);
        }
      }
    }

    res.json({ message: "Task deleted", success: true, task });
    return;
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Server error while deleting task", success: false });
  }
}
