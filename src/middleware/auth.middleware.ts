// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import { verifyToken,verifyRefreshToken } from "../utils/jwt";
import AuthService from "../service/auth.service";

export const authProfile = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res
      .status(401)
      .json({ message: "Missing or invalid Authorization header" });
  }

  if (!token)
    return res.status(401).json({
      status: 401,
      message: "Missing or invalid Authorization header",
    });

  try {
    const decoded = verifyToken(token);

    // console.log(decoded); // OUTPUT {...decoded, iat: 1776909967} por ejemplo
    
    await AuthService.validateAccessToken(decoded);

    (req as any).user = {
      id: decoded.id,
      username: decoded.username,
      email: decoded.email,
    };
    next();
  } catch (err) {    
    res.status(401).json({ status: 401, message: 'Invalid or expired refresh token' });
    return;
  }
};


export const authRefresh = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies?.refresh_token;

  if (!token) return res.status(401).json({ message: "No refresh token" });

  try {
    const decoded = verifyRefreshToken(token);
    (req as any).refreshUser = { jti: decoded.jti, token };
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Invalid or expired refresh token" });
  }
};