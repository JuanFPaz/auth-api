// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import { verifyToken, verifyRefreshToken } from "../utils/jwt";
import AuthService from "../service/auth.service";
import { InvalidTokenError } from "../common/errors/InvalidTokenError";
import { UserNotFoundError } from "../common/errors/UserNotFoundError";
import { UnauthorizedError } from "../common/errors/UnauthorizedError";

export const authProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization || "";
    const [scheme, token] = authHeader.split(" ");
    if (scheme !== "Bearer" || !token) {
      throw new InvalidTokenError("Missing or invalid Authorization header.");
    }

    const decoded = verifyToken(token);

    await AuthService.validateAccessToken(decoded);

    (req as any).user = {
      id: decoded.id,
      username: decoded.username,
      email: decoded.email,
    };
    next();
  } catch (err) {
    if (err instanceof UserNotFoundError || err instanceof InvalidTokenError) {
      const error: UserNotFoundError | InvalidTokenError = err;
      return next(new UnauthorizedError(401, error.message));
    }

    return next(err);
  }
};

export const authRefresh = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies?.refresh_token;

    if (!token) throw new InvalidTokenError("Missing Refresh Toke.");
    const decoded = verifyRefreshToken(token);
    (req as any).refreshUser = { jti: decoded.jti, token };
    next();
  } catch (err) {
    if (err instanceof InvalidTokenError) {
      const error: InvalidTokenError = err;
      return next(new UnauthorizedError(401, error.message));
    }

    return next(err);
  }
};
