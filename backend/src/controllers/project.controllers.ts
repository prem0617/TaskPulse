import { Request, Response } from "express";
import projectModel from "../models/project.model";
import { getReceiverSocketId, io } from "../socket/socket.io";
import userModel from "../models/user.model";

export async function createProject(req: Request, res: Response) {
  try {
    const user = req.user;
    // console.log(user);
    if (!user || !user.id) {
      res.status(404).json({ error: "User not found", success: false });
      return;
    }

    const { title, description } = req.body;
    if (!title || !description) {
      res
        .status(400)
        .json({ error: "Please fill all the Required Fields", success: false });
      return;
    }

    const projectData = {
      title,
      description,
      createdBy: user.id,
    };

    const newProject = new projectModel(projectData);
    await newProject.save();

    const roomName = newProject.id;
    console.log(roomName);

    const socketId = getReceiverSocketId(user.id);
    console.log(socketId, "socketId");
    if (socketId) {
      const socket = io.sockets.sockets.get(socketId);
      if (socket) {
        socket.join(roomName);
        // console.log(socket);
      }
    }

    const userFromDB = await userModel.findById(user.id);

    userFromDB.rooms.push(roomName);
    await userFromDB.save();

    res.json({ message: "Project added", newProject });
    return;
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Server error while creating project", success: false });
    return;
  }
}

export async function getProjects(req: Request, res: Response) {
  try {
    const user = req.user;
    // console.log(user, "in PROJECTS");
    if (!user || !user.id) {
      res.status(404).json({ error: "User not found", success: false });
      return;
    }

    const getUserProjects = await projectModel.find({
      createdBy: user.id.toString(),
    });

    res.json({ message: "Project fetched", projects: getUserProjects });
    return;
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Server error while fetching projects", success: false });
    return;
  }
}
export async function getProject(req: Request, res: Response) {
  try {
    const user = req.user;
    // console.log(user, "in PROJECTS");
    if (!user || !user.id) {
      res.status(404).json({ error: "User not found", success: false });
      return;
    }

    const { projectId } = req.body;

    if (!projectId) {
      res.status(404).json({ error: "Project id not found", success: false });
      return;
    }

    const project = await projectModel.findById(projectId);

    res.json({ message: "Project fetched", project });
    return;
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Server error while fetching projects", success: false });
    return;
  }
}

export async function sendRequest(req: Request, res: Response) {
  try {
    const { memberId, projectId, username } = req.body;
    if (!memberId || !projectId) {
      res
        .status(400)
        .json({ error: "Fill all the Required fields", success: false });
      return;
    }

    const project = await projectModel.findById(projectId);
    if (!project) {
      res.status(404).json({ error: "Project is not Found", success: false });
      return;
    }

    if (
      project.members?.includes(memberId) ||
      project.pendingMembers?.includes(memberId)
    ) {
      res.status(400).json({
        error: "User already a member or request pending",
        success: false,
      });
      return;
    }

    project.pendingMembers.push(memberId);
    await project.save();

    res.json({ message: "Member is added to the project", project });

    const roomName = project.id;

    io.to(roomName).emit(
      "invite-msg",
      `${username} is invited to this Project`
    );

    return;
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Server error while adding member", success: false });
    return;
  }
}

export async function acceptRequest(req: Request, res: Response) {
  try {
    const user = req.user;
    // console.log(user);
    if (!user || !user.id) {
      res.status(404).json({ error: "User not found", success: false });
      return;
    }
    const { projectId } = req.body;
    if (!projectId) {
      res
        .status(400)
        .json({ error: "Fill all the Required fields", success: false });
      return;
    }

    const project = await projectModel.findById(projectId);
    if (!project) {
      res.status(404).json({ error: "Project is not Found", success: false });
      return;
    }

    if (project.members?.includes(user.id)) {
      res.status(400).json({
        error: "User already a member",
        success: false,
      });
      return;
    }

    if (!project.pendingMembers?.includes(user.id)) {
      res.status(400).json({
        error: "User has not recive any request",
        success: false,
      });
      return;
    }

    project.pendingMembers.pull(user.id);
    project.members.push(user.id);

    await project.save();

    const roomName = projectId;
    console.log(roomName, "room name");

    const socketId = getReceiverSocketId(user.id);
    console.log(socketId, "socketId");
    if (socketId) {
      console.log("inside socket");
      const socket = io.sockets.sockets.get(socketId);
      if (socket) {
        socket.join(roomName);
        const userFromDB = await userModel.findById(user.id);
        userFromDB.rooms.push(roomName);
        await userFromDB.save();
        io.to(roomName).emit(
          "accept-msg",
          `${user.username} accepted invite request`
        );
      }
    }

    console.log("outside socket");

    res.json({ message: "You are now part of the project", project });
    return;
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Server error while adding member", success: false });
    return;
  }
}

export async function invitedProjects(req: Request, res: Response) {
  try {
    const user = req.user;
    // console.log(user);
    if (!user || !user.id) {
      res.status(404).json({ error: "User not found", success: false });
      return;
    }

    const userId = user.id;

    const invitedProjects = await projectModel.find({
      members: userId,
    });

    res.json({ invitedProjects });

    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Server error while fetch invited projects",
      success: false,
    });
    return;
  }
}
