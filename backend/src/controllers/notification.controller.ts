import { Request, Response } from "express";
import notificationModel from "../models/notification.model";

export async function getNotification(req: Request, res: Response) {
  try {
    const user = req.user;

    if (!user || !user.id) {
      res.status(401).json({
        success: false,
        error: "Unauthorized: User not found",
      });
      return;
    }

    const userId = user.id;

    const notifications = await notificationModel
      .find({ userId })
      .populate("sender", "name email")
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
}

export async function deleteNotification(req: Request, res: Response) {
  try {
    const user = req.user;

    if (!user || !user.id) {
      res.status(401).json({
        success: false,
        error: "Unauthorized: User not found",
      });
      return;
    }

    const userId = user.id;

    const result = await notificationModel.findOneAndDelete({
      _id: req.params.id,
      userId,
    });

    if (!result) {
      res.status(404).json({ error: "Notification not found" });
      return;
    }

    res.json({ message: "Notification deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete notification" });
    return;
  }
}
