import { IGenerateToken } from "../types/auth.types";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

function generateTokenAndStoreCookie(data: IGenerateToken) {
  if (!JWT_SECRET) return;

  const { res, payload } = data;

  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("tmtoken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
}

export default generateTokenAndStoreCookie;
