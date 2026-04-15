import { Request, Response } from "express";
import type { UserRegister, UserLogin} from "../types/user.types";
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
  const user: UserLogin = req.body;
  try {
    const payload = await AuthService.login(user);
    const { accessToken } = await AuthService.token(payload);

    res.status(201).json({ status: 201, message: "Credenciales Validas", accessToken });
  } catch (err) {
    res.status(500).json({ status: 500, message: (err as Error).message });
  }
};

// export const logout = async (req: Request, res: Response) => {
//   res
//     .status(200)
//     .clearCookie("access_token")
//     .json({ status: 200, message: "Usuario desconectado correctamente" });
// };

export const profile = async (req: Request, res: Response) => {
  try {
    const data = await AuthService.profile((req as any).user);
    res.status(202).json({ status: 202, message: "Usuario Autenticado", data });
  } catch (error) {
    res.status(401).json({ status: 401, message: (error as Error).message });
  }
};
