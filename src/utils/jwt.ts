import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { UserPayload } from "../types/user.types";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET!;
const EXPIRES_IN = "15m"; // short lifespan for security, extend if needed

export const signToken = (payload: UserPayload) => {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: EXPIRES_IN,
    algorithm: "HS512", // strong algorithm
  });
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, JWT_SECRET);
};