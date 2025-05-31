import { Request, Response } from "express";

import userModel from "../models/user.model";

export async function searchUser(req: Request, res: Response) {
  const query = req.query.q;

  if (!query) {
    res.status(400).json({ message: "Missing search query" });
    return;
  }

  try {
    const users = await userModel
      .find({
        name: { $regex: query, $options: "i" },
      })
      .limit(5);

    res.json(users);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Server error" });
  }
}
