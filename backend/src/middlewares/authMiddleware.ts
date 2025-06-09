import { Response, NextFunction, Request } from "express";
import jwt from "jsonwebtoken";

import { IUser } from "../models/user.model";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.tmtoken;

  if (!token) {
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (
      typeof decoded === "object" &&
      "email" in decoded &&
      "role" in decoded
    ) {
      req.user = decoded as IUser;
      // console.log(req.user);
      next();
    } else {
      res.status(403).json({ message: "Invalid token format" });
      return;
    }
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token" });
    return;
  }
};
