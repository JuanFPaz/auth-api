import { User } from "../models/user.model";
import { UserReposity } from "../repository/user.repository";
import type {
  UserRegister,
  UserLogin,
  UserPayload,
  UserConstructor,
} from "../types/user.types";
import {
  createJti,
  hashToken,
  signToken,
  signRefreshToken,
  getRefreshTTLSEC,
  persistRefreshToken,
} from "../utils/jwt";
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

  static async login(user: UserLogin): Promise<UserPayload> {
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

  static async token(payload: UserPayload, ip: string, userAgent: string) {
    const accessToken = signToken(payload);
    const jti = createJti();
    const refreshToken = signRefreshToken(payload, jti);
    const data = persistRefreshToken({
      id: payload.id,
      refreshToken,
      jti,
      ip,
      userAgent,
    });
    await UserReposity.createRefreshToken(data);
    const REFRESH_TTL_SEC = getRefreshTTLSEC();
    return {
      accessToken,
      refreshToken,
      REFRESH_TTL_SEC,
    };
  }

  static async rotationToken(
    token: string,
    jti: string,
    ip: string,
    userAgent: string,
  ) {
    const tokenHash = hashToken(token);
    const doc = await UserReposity.getRefreshToken({ tokenHash, jti });
    if (!doc[0]) throw new Error("No refresh Token");
    if (doc[0].revoked_at) throw new Error("Refresh Token not recognized");
    if (doc[0].expires_at < new Date())
      throw new Error("Refresh Token expired");

    const revokedAt = new Date();
    const newJti = createJti();
    const replacedBy = newJti;

    await UserReposity.rotationRefreshToken({
      revokedAt,
      replacedBy,
      tokenHash,
      jti,
    });

    const payload: UserPayload = {
      id: doc[0].user_id,
      username: doc[0].username,
      email: doc[0].email,
    };
    const newAccessToken = signToken(payload);
    const newRefresh = signRefreshToken(payload, newJti);

    const data = persistRefreshToken({
      id: payload.id,
      refreshToken: newRefresh,
      jti: newJti,
      ip,
      userAgent,
    });

    await UserReposity.createRefreshToken(data);

    const REFRESH_TTL_SEC = getRefreshTTLSEC();
    return {
      newAccessToken,
      newRefresh,
      REFRESH_TTL_SEC,
    };
  }

  static async revokeToken(token: string) {
    const tokenHash = hashToken(token);
    const doc = await UserReposity.getRefreshTokenByHash(tokenHash);

    if (doc[0] && !doc[0].revoked_at) {
      const revokedAt = new Date();
      const jti = doc[0].jti;
      await UserReposity.revokeRefreshToken({ revokedAt, tokenHash, jti });
    }
  }

  static async profile(user: UserPayload) {
    const _user = await UserReposity.getUserById(user);
    const userResponse = new User(_user[0] as UserConstructor);
    return userResponse.toObject();
  }
}
