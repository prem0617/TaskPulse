import { Request, Response } from "express";
import bcrypt from "bcrypt";
import userModel, { IUser } from "../models/user.model";
import generateTokenAndStoreCookie from "../lib/generateTokenAndStoreCookie";
import { IPayload } from "../types/auth.types";

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res
        .status(400)
        .json({ error: "Fill all the required fields", success: false });
      return;
    }

    const identifier = email.toLowerCase(); // email or username input
    let user: IUser | null = await userModel.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    // Check if user not found
    if (!user) {
      res.status(404).json({ error: "User not found", success: false });
      return;
    }

    // Match password
    const isPasswordMatched = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordMatched) {
      res.status(400).json({ error: "Invalid credentials", success: false });
      return;
    }

    // Create payload and token
    const payload: IPayload = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      username: user.username,
    };

    const token = generateTokenAndStoreCookie({ payload, res });

    res.json({ message: "User logged in", token, success: true, user });
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
    // console.log(req.body);
    const { name, email, password, role, username } = req.body;

    if (!name || !email || !password || !username) {
      res
        .status(400)
        .json({ error: "Fill all the required fields", success: false });
      return;
    }

    const emailLower = email.toLowerCase();
    const usernameLower = username.toLowerCase();

    // Check if user already exists by email
    const existingUserEmail: IUser | null = await userModel.findOne({
      email: emailLower,
    });
    if (existingUserEmail) {
      res.status(409).json({
        error: "Email address already exists. Try with a different email.",
        success: false,
      });
      return;
    }

    // Check if username exists
    const existingUsername: IUser | null = await userModel.findOne({
      username: usernameLower,
    });
    if (existingUsername) {
      res.status(409).json({
        error: "Username already exists. Try with a different username.",
        success: false,
      });
      return;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new userModel({
      name,
      email: emailLower,
      username: usernameLower,
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
      username: newUser.username,
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
  res.cookie("tmtoken", "", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    expires: new Date(0), // ✅ or use maxAge: 0
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
