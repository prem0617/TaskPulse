import { Request, Response } from "express";
import taskModel from "../models/task.model";
import projectModel from "../models/project.model";
import { compileFunction } from "vm";
import mongoose from "mongoose";

export async function addTask(req: Request, res: Response) {
  try {
    const user = req.user;
    console.log(user);
    if (!user || !user.id) {
      res.status(404).json({ error: "User not found", success: false });
      return;
    }
    const { title, description, dueDate, projectId } = req.body;

    if (!title || !description || !dueDate || !projectId) {
      res
        .status(400)
        .json({ error: "Please fill all the required fields", success: false });
      return;
    }

    const taskData = {
      title,
      description,
      dueDate,
      projectId,
    };

    const newTask = new taskModel(taskData);

    await newTask.save();

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
    console.log(user);
    if (!user || !user.id) {
      res.status(404).json({ error: "User not found", success: false });
      return;
    }

    const { userId, taskId, projectId } = req.body;

    const project = await projectModel.findById(projectId);

    if (!project) {
      res.status(404).json({ error: "Project is not Found", success: false });
      return;
    }

    console.log(project);

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

    console.log({ isPendingRequest, isMemberIsPartOfProject });

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

    await task.save();

    res.json({ message: `Task is assigned to user ${userId} `, success: true });

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
    console.log(user);
    if (!user || !user.id) {
      res.status(404).json({ error: "User not found", success: false });
      return;
    }

    const { taskId, status } = req.body;

    const task = await taskModel.findById(taskId);

    if (!task) {
      res.status(404).json({ error: "Task is not Found", success: false });
      return;
    }

    if (task.assignedTo.toString() !== user.id) {
      res.status(400).json({
        error:
          "You don't have access to change the status of task because it is not assign to you",
        success: false,
      });
      return;
    }

    task.status = status;

    await task.save();

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
