import { Request, Response } from "express";
import type { UserRegister, UserLogin, UserPayload, UserResponse } from "../types/user.types";
import AuthService from "../service/auth.service";
//Register
export const register = async (req: Request, res: Response) => {
  const user: UserRegister = req.body;
  try {
    await AuthService.register(user);
    res
      .status(201)
      .json({ status: 201, message: "Usuario registrado correctamente" });
  } catch (err) {
    // Esto tambien hay que arreglarlo y personalizarlo
    res.status(500).json({ status: 500, message: (err as Error).message });
  }
};

//Login
export const login = async (req: Request, res: Response) => {
  const user: UserLogin = req.body
  const ip = req.ip!;
  const userAgent = req.headers["user-agent"] || "";
  try {
    const payload = await AuthService.login(user);
    const { access_token, refreshToken, REFRESH_TTL_SEC } =
      await AuthService.token(payload, ip, userAgent);
    res
      .status(201)
      .cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: true, // TRUE PARA PRODUCCION
        sameSite: "none",
        path: "/api/auth" ,
        maxAge: REFRESH_TTL_SEC * 1000,
      })
      .json({ status: 201, message: "Credenciales Validas", access_token });
  } catch (err) {
    res.status(500).json({ status: 500, message: (err as Error).message });
  }
};

export const refresh = async (req: Request, res: Response) => {
  const token = (req as any).refreshUser.token;
  const jti = (req as any).refreshUser.jti;
  const ip = req.ip!;
  const userAgent = req.headers["user-agent"] || "";
    
  try {
    const { newAccessToken, newRefresh, REFRESH_TTL_SEC } =
      await AuthService.rotationToken(token, jti, ip, userAgent);
      
    res
      .status(201)
      .cookie("refresh_token", newRefresh, {
        httpOnly: true,
        secure: true, // TRUE PARA PRODUCCION
        sameSite: "none",
        path: "/api/auth",
        maxAge: REFRESH_TTL_SEC * 1000,
      })
      .json({
        status: 201,
        message: "Credenciales Validas",
        access_token: newAccessToken,
      });
  } catch (error) {
    res.status(401).json({ status: 401, message: (error as Error).message });
  }
};

export const logout = async (req: Request, res: Response) => {
  const token = req.cookies?.refresh_token;
    try {
    if (token) {
      await AuthService.revokeToken(token);
    }

    res
      .clearCookie("refresh_token", { path: "/api/auth" })
      .json({ status:202, message: "Logged Out" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const profile = async (req: Request, res: Response) => {
  const userPayload: UserPayload = (req as any).user;
  try {
    const data:UserResponse = await AuthService.profile(userPayload);
    res.status(202).json({ status: 202, message: "Usuario Autenticado", data });
  } catch (error) {
    res.status(401).json({ status: 401, message: (error as Error).message });
  }
};
