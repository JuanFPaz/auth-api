import { Request, Response } from "express";
import { signToken } from "../utils/jwt";
import DataBase, {type userLogin, type userRegister, type userData } from "../models/user.model";
import { handleError } from "../utils/errorHandler";

//Register

export const base = async (req: Request, res: Response) => {
  try {
    const users = await DataBase.getUsers()
    res.json({users});
  } catch (err) {
    handleError(err, res, "Base");
  }
};

export const register = async (req: Request, res: Response) => {
  const { username, password, info }: userRegister = req.body;
  try {
    const existUser = await DataBase.getUser(username);
    //TODO existMail
    if (existUser) return res.status(404).json({ status:404,message: "Ya existe un usuario con ese nombre" });
    await DataBase.createUser({ username, password, info });
    res.status(201).json({status:201, message: "Usuario creado correctamente!" });
  } catch (err) {
    handleError(err, res, "Register");
  }
};

//Login
export const login = async (req: Request, res: Response) => {
  const { username, password }: userLogin = req.body;

  try {
    const {user,matchpass} = await DataBase.getUserLog({username, password});
    if (!user) return res.status(404).json({ status:404, message: "Nombre de Usuario Incorrecto" });

    if (!matchpass) return res.status(404).json({ status:404, message: "Contraseña de Usuario Incorrecta" });

    const payload = {id: user.id};

    const token = signToken(payload);

    res.status(200)
      .cookie('access_token', token,{
        httpOnly:true,
        secure:false, // true en produccion
        sameSite:'lax', // none en produccion
        maxAge: 1000 * 60 * 60,
      })
      .json({ status:200, message: "Usuario ingresado correctamente" });
  } catch (err) {
    handleError(err, res, "Login");
  }
};

export const logout = async (req:Request, res:Response) =>{
  res.status(200)
    .clearCookie('access_token')
    .json({status:200, message:'Usuario desconectado correctamente'})
} 

export const user = async (req:Request, res:Response) =>{
  const {id}: userData = (req as any).user
  try {
    const user = await DataBase.getUserById(id)
    if(!user) return res.status(500).json({status: 500, message:'Error, usuario esta vacio?'})
    res.status(202).json({message:'Usuario Autorizado', ...user})
  } catch (error) {
    
  }
}
