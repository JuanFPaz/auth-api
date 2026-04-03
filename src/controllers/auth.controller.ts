import { Request, Response } from "express";
import { signToken } from "../utils/jwt";
import {
  userLogin,
  userRegister,
  UserReposity,
  type userData,
} from "../models/user.model";
import { handleError } from "../utils/errorHandler";

//Check
export const check = async (req:Request, res:Response) => {
  try {
    const check = await UserReposity.checkConnection();
    return res.json({...check})
  } catch (error) {
    handleError(error, res, "Check");
  }
};

//Register
export const register = async (req: Request, res: Response) => {
  const user: userRegister = req.body;
  try {
    const existUser = await UserReposity.getUserByUsername(user.username);
    if (existUser.status === "exist")
      return res
        .status(409)
        .json({
          status: 409,
          message: "Este nombre de usuario ya esta registrado",
        });

    const existMail = await UserReposity.getUserByEmail(user.info.email);
    if (existMail.status === "exist")
      return res
        .status(409)
        .json({ status: 409, message: "Este email ya esta registrado" });

    await UserReposity.createUser(user);
    res.status(201).json({
      status: 201,
      message: "Usuario registrado con exito.",
    });
  } catch (err) {
    handleError(err, res, "Register");
  }
};

//Login
export const login = async (req: Request, res: Response) => {
  const user: userLogin = req.body;

  try {
    const getPayload = await UserReposity.getPayload(user);
    if (getPayload.status === "notexist")
      return res
        .status(404)
        .json({ status: 404, message: "Usuario Incorrecto" });
    if (getPayload.status === "notmatched")
      return res
        .status(404)
        .json({ status: 404, message: "Contraseña Incorrecta" });

    const { payload } = getPayload;
    const token = signToken(payload);
    return res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        secure: true, //TRUE EN PRODUCCION
        sameSite: "none", //NONE EN PRODUCCION
        maxAge: 1000 * 60 * 60,
      })
      .json({ status: 200, message: "Usuario ingresado con exito." });
  } catch (err) {
    handleError(err, res, "Login");
  }
};

export const logout = async (req: Request, res: Response) => {
  res
    .status(200)
    .clearCookie("access_token")
    .json({ status: 200, message: "Usuario desconectado correctamente" });
};

export const user = async (req: Request, res: Response) => {
  const { id }: userData = (req as any).user;
  try {
    const user = await UserReposity.getUserById(id);
    if (!user)
      return res
        .status(500)
        .json({ status: 500, message: "Error, usuario esta vacio?" });
    res.status(202).json({ message: "Usuario Autorizado", ...user });
  } catch (error) {
    handleError(error, res, "user");
  }
};
