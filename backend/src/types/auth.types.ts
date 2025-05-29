import { Request, Response } from "express";
import { IUser } from "../models/user.model";

export interface IGenerateToken {
  payload: IPayload;
  res: Response;
}

export interface IPayload {
  name: string;
  email: string;
  role: string;
}
