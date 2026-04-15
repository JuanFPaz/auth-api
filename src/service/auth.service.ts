import { User } from "../models/user.model";
import { UserReposity } from "../repository/user.repository";
import type { UserRegister, UserLogin, UserPayload, UserConstructor } from "../types/user.types"
import { signToken } from "../utils/jwt";
import bcrypt from "bcrypt";

export default class AuthService {
  static async register(user: UserRegister) {
    try {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await UserReposity.createUser({
        ...user,
        password: hashedPassword,
      });
    } catch (error) {
      if (
        (error as any).code === "ER_DUP_ENTRY" ||
        (error as any).errno === 1062
      ) {
        if ((error as any).sqlMessage.includes("users.username"))
          throw new Error("Ya existe un usuario con esta cuenta");
        if ((error as any).sqlMessage.includes("users.email"))
          throw new Error("Ya existe un usuario con esta correo electronico");
      }

      throw new Error("Ocurrio un error creando el usuario");
    }
  }

  static async login(user: UserLogin):Promise<UserPayload> {
    const _user = await UserReposity.getUser(user);

    if (!_user[0]) throw new Error("Usuario Incorrecto");

    const matched = await bcrypt.compare(user.password, _user[0].password);

    if (!matched) throw new Error("Contraseña Incorrecta");

    return {
      id: _user[0].id,
      username: _user[0].username,
      email: _user[0].email,
    };
  }

  static async token(payload: UserPayload) {
    const accessToken = signToken(payload);
    return {
      accessToken,
    };
  }

  static async profile(user: UserPayload) {
    const _user = await UserReposity.getUserById(user);
    const userResponse = new User(_user[0] as UserConstructor)
    return userResponse.toObject()
  }
}