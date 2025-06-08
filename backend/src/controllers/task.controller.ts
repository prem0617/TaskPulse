import { Request, Response } from "express";
import mongoose from "mongoose";

import taskModel from "../models/task.model";
import projectModel from "../models/project.model";
import { getReceiverSocketId, io } from "../socket/socket.io";
import { scheduleEmailReminder } from "../bullMq/scheduleEmailReminder";

export async function addTask(req: Request, res: Response) {
  try {
    const user = req.user;
    console.log(user);
    if (!user || !user.id) {
      res.status(404).json({ error: "User not found", success: false });
      return;
    }
    const { title, description, projectId } = req.body;

    if (!title || !description || !projectId) {
      res
        .status(400)
        .json({ error: "Please fill all the required fields", success: false });
      return;
    }

    const taskData = {
      title,
      description,
      projectId,
    };

    const newTask = new taskModel(taskData);

    await newTask.save();

    const socketId = getReceiverSocketId(user.id);

    console.log(newTask);

    if (socketId) {
      if (socketId) {
        const socket = io.sockets.sockets.get(socketId);
        if (socket) {
          io.to(projectId).emit("new-task", {
            message: `${title} is added as new task by admin`,
            task: newTask,
          });
        }
      }
    }

    res.json({ message: "New task is created", newTask, success: true });

    return;
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Server error while creating task", success: false });
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

    const receiverId = getReceiverSocketId(userId);
    console.log(receiverId, "receiverId");
    if (receiverId) {
      io.to(receiverId).emit(
        "assigned-task",
        `${task.title} is assigned to you`
      );
    }

    await scheduleEmailReminder({ task, email, dueDate });

    res.json({
      message: `Task is assigned to user and Task reminder scheduled successfully.${userId} `,
      success: true,
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
    // console.log(user);
    if (!user || !user.id) {
      res.status(404).json({ error: "User not found", success: false });
      return;
    }

    const { taskId, status } = req.body;

    console.log({ taskId, status });

    const task = await taskModel.findById(taskId).populate("assignedTo");

    console.log(task);

    const projectId = task.projectId.toString();

    console.log(projectId);

    if (!task) {
      res.status(404).json({ error: "Task is not Found", success: false });
      return;
    }

    if (task.assignedTo._id.toString() !== user.id) {
      res.status(400).json({
        error:
          "You don't have access to change the status of task because it is not assign to you",
        success: false,
      });
      return;
    }

    task.status = status;

    await task.save();

    const socketId = getReceiverSocketId(user.id);

    const message = `${task.title} is now in the "${status}" stage.`;

    if (socketId) {
      if (socketId) {
        const socket = io.sockets.sockets.get(socketId);
        if (socket) {
          io.to(projectId).emit("change-task-status", {
            message,
            task,
          });
        }
      }
    }

    res.json({ message: "Task status updated", task, success: true });
    return;
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Server error while modify task status", success: false });
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

    res.json({ message: "Task deleted", success: true });
    return;
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Server error while deleting task", success: false });
  }
}
