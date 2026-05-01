import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { UserPayload } from "../types/user.types";
import { PersistRefresh } from "../types/refresh.types";
import { InvalidTokenError } from "../common/errors/InvalidTokenError";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_SECRET!;
const REFRESH_TTL_SEC = 60 * 60 * 24 * 7; // 7 days
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
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err: any) {
    console.log(err.name);
    if (err.name === "TokenExpiredError") {
      throw new InvalidTokenError("Token Expired");
    }

    if (err.name === "JsonWebTokenError") {
      throw new InvalidTokenError("Invalid Token");
    }
  }
};

export const hashToken = (token: string) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export const createJti = () => {
  return crypto.randomBytes(16).toString("hex");
};

export const signRefreshToken = (payload: UserPayload, jti: string) => {
  const token = jwt.sign({ ...payload, jti }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TTL_SEC,
    algorithm: "HS512", // strong algorithm
  });
  return token;
};

export const verifyRefreshToken = (token: string): any => {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      throw new InvalidTokenError("Token Expired");
    }

    if (err.name === "JsonWebTokenError") {
      throw new InvalidTokenError("Invalid Token");
    }
  }
};

export const persistRefreshToken = (persistRefresh: PersistRefresh) => {
  const userId = persistRefresh.id;
  const tokenHash = hashToken(persistRefresh.refreshToken);
  const jti = persistRefresh.jti;
  const ip = persistRefresh.ip;
  const expiresAt = new Date(Date.now() + REFRESH_TTL_SEC * 1000);
  const userAgent = persistRefresh.userAgent;

  return {
    userId,
    tokenHash,
    jti,
    expiresAt,
    ip,
    userAgent,
  };
};

export const getRefreshTTLSEC = () => {
  return REFRESH_TTL_SEC;
};
