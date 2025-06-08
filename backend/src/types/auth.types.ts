import { Request, Response } from "express";
import { IUser } from "../models/user.model";
import mongoose from "mongoose";

export interface IGenerateToken {
  payload: IPayload;
  res: Response;
}

export interface IPayload {
  id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  role: string;
  username: string;
}
