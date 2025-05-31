import { Request, Response } from "express";
import bcrypt from "bcrypt";
import userModel, { IUser } from "../models/user.model";
import generateTokenAndStoreCookie from "../lib/generateTokenAndStoreCookie";
import { IPayload } from "../types/auth.types";

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = await req.body;
    if (!email || !password) {
      res
        .status(400)
        .json({ error: "Fill all the required field", success: false });
      return;
    }

    const user: IUser | null = await userModel.findOne({ email });

    //   Check if user not found
    if (!user) {
      res.status(404).json({ error: "User not Found", success: false });
      return;
    }

    // match the hashed and original password
    const isPasswordMatched = bcrypt.compare(password, user?.passwordHash);

    if (!isPasswordMatched) {
      res
        .status(400)
        .json({ error: "Password is not matched", success: false });
      return;
    }

    //   generate payload for cookies
    const payload: IPayload = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const token = generateTokenAndStoreCookie({ payload, res });

    res.json({ message: "User loggedin", token, success: true, user });
    return;
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
      errorMessage: error.message,
      success: false,
    });
    return;
  }
}

export async function signup(req: Request, res: Response) {
  try {
    console.log(req.body);
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      res
        .status(400)
        .json({ error: "Fill all the required fields", success: false });
      return;
    }

    // Check if user already exists
    const existingUser: IUser | null = await userModel.findOne({ email });
    if (existingUser) {
      res
        .status(409)
        .json({ error: "User already exists with this email", success: false });
      return;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new userModel({
      name,
      email,
      passwordHash,
      role,
    });

    await newUser.save();

    // Prepare payload for JWT
    const payload: IPayload = {
      id: newUser.id!,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    };

    // Generate token and set cookie
    const token = generateTokenAndStoreCookie({ payload, res });

    res.status(201).json({
      message: "User registered successfully",
      success: true,
      token,
      user: newUser,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
      errorMessage: error.message,
      success: false,
    });
  }
}

export function logout(_req: Request, res: Response) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.json({ message: "User logged out successfully", success: true });
}

export async function getME(req: Request, res: Response) {
  try {
    const user = req.user; // Now this works fine
    res.json({ message: "User", user });
  } catch (error) {
    console.log(error);
  }
}
