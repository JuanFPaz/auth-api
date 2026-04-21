import { Request, Response } from "express";
import type {
  UserRegister,
  UserLogin,
  UserPayload,
  UserResponse,
  UserEdit,
  UserDelete,
} from "../types/user.types";
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
  console.log('Login');
  console.log('---------');
  
  const user: UserLogin = req.body;
  const ip = req.ip!;
  const userAgent = req.headers["user-agent"] || "";
  try {
    const payload = await AuthService.login(user);
    const { access_token, refreshToken, REFRESH_TTL_SEC } =
      await AuthService.token(payload, ip, userAgent);

    console.log('Refresh: '+refreshToken);
    console.log('---------');
    res
      .status(201)
      .cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: false, // TRUE PARA PRODUCCION
        sameSite: "none",
        path: "/api/auth",
        maxAge: REFRESH_TTL_SEC * 1000,
      })
      .json({ status: 201, message: "Credenciales Validas", access_token });
  } catch (err) {
    res.status(500).json({ status: 500, message: (err as Error).message });
  }
};

//Refresh
export const refresh = async (req: Request, res: Response) => {
  const token = (req as any).refreshUser.token;
  const jti = (req as any).refreshUser.jti;
  const ip = req.ip!;
  const userAgent = req.headers["user-agent"] || "";
  console.log('Refresh');
  console.log('---------');
  console.log('Cookie: '+token);
  
  try {
    const { newAccessToken, newRefresh, REFRESH_TTL_SEC } =
      await AuthService.rotationToken(token, jti, ip, userAgent);

    console.log('New Refresh: '+newRefresh);
    console.log('---------');
    res
      .status(201)
      .cookie("refresh_token", newRefresh, {
        httpOnly: true,
        secure: false, // TRUE PARA PRODUCCION
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

//Logout
export const logout = async (req: Request, res: Response) => {
  const token = req.cookies?.refresh_token;
  try {
    if (token) {
      await AuthService.revokeToken(token);
    }

    res
      .clearCookie("refresh_token", { path: "/api/auth" })
      .json({ status: 202, message: "Logged Out" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

//profile
export const profile = async (req: Request, res: Response) => {
  const userPayload: UserPayload = (req as any).user;
  try {
    const data: UserResponse = await AuthService.profile(userPayload);
    res.status(202).json({ status: 202, message: "Usuario Autenticado", data });
  } catch (error) {
    res.status(401).json({ status: 401, message: (error as Error).message });
  }
};

//Edit Profile
export const editProfile = async (req: Request, res: Response) => {
  const payload: UserPayload = (req as any).user;
  const userEdit: UserEdit = req.body
  console.log(userEdit);
  
  const ip = req.ip!;
  const userAgent = req.headers["user-agent"] || "";
  try {
    await AuthService.editPassword(payload, userEdit);
    const { access_token, refreshToken, REFRESH_TTL_SEC } = await AuthService.token(payload, ip, userAgent);
   
    res
      .status(200)
      .cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: false, // TRUE PARA PRODUCCION
        sameSite: "none",
        path: "/api/auth",
        maxAge: REFRESH_TTL_SEC * 1000,
      })
      .json({
        status: 200,
        message: "Contraseña cambiada correctamente",
        access_token,
      });
  } catch (error) {
    console.error(error)
    res.status(401).json({ status: 401, message: (error as Error).message });
  }
};

//Delete Profile

export const deleteProfile = async (req:Request, res:Response) =>{
  const payload: UserPayload = (req as any).user; 
  const userDelete: UserDelete = req.body 
  try {
    await AuthService.deleteProfile(payload, userDelete);

    res
      .clearCookie("refresh_token", { path: "/api/auth" })
      .json({ status: 200, message: "Usuario eliminado correctamente, adios :)" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
}