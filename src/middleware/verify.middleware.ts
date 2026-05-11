import { Request, Response } from "express";
import { UserReposity } from "../repository/user.repository";

export const verifyConnection = async (req: Request, res: Response) => {
  try {
    await UserReposity.checkConnection();
    res.status(200).json({ status: 200, message: "Conexion Exitosa" });
  } catch (error) {
    res.status(500).json({ status: 500, message: (error as Error).message });
  }
};
