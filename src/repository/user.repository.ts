import { createPool, RowDataPacket } from "mysql2/promise";
import { option } from "../utils/config";
import type { UserRegister, UserLogin, UserPayload } from "../types/user.types";
import type {
  RefreshTokenRecord,
  RefreshRotation,
  RefreshRevoke,
  RefreshTokenBase,
} from "../types/refresh.types";

export class UserReposity {
  private static pool = createPool({ ...option });

  static async checkConnection() {
    let conn;
    try {
      conn = await this.pool.getConnection();
    } catch (error) {
      console.log(error);
      throw new Error("No se pudo establecer la conexion.");
    }

    if (conn) conn.release();
  }

  static async createUser({
    username,
    password,
    name,
    lastname,
    email,
    birthday,
    country,
  }: UserRegister) {
    try {
      const [userResult] = await this.pool.execute(
        `INSERT INTO users(username, password, name, lastname, email, birthday, country)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [username, password, name, lastname, email, birthday, country],
      );
    } catch (error) {
      throw error;
    }
  }

  static async editPassword({
    id,
    newPassword,
  }: {
    id: number;
    newPassword: string;
  }) {
    try {
      const [res] = await this.pool.execute<RowDataPacket[]>(
        `
        UPDATE users
        SET password = ?
        WHERE users.id = ?
        `,
        [newPassword,id],
      );
    } catch (error) {
      throw error;
    }
  }

  static async getUser(username: string) {
    try {
      const [res] = await this.pool.execute<RowDataPacket[]>(
        "SELECT * FROM users WHERE users.username = ?",
        [username],
      );

      return res;
    } catch (error) {
      throw error;
    }
  }

  static async getUserById({ id }: UserPayload) {
    try {
      const [res] = await this.pool.execute<RowDataPacket[]>(
        "SELECT users.id, users.username, users.email, users.createdAt, users.name, users.lastname, users.birthday, users.country FROM users WHERE users.id = ?",
        [id],
      );

      return res;
    } catch (error) {
      throw error;
    }
  }

  static async createRefreshToken(refresh: RefreshTokenRecord) {
    try {
      const [userResult] = await this.pool.execute(
        `INSERT INTO refresh_tokens(user_id, token_hash, jti,expires_at,ip,user_agent)
       VALUES (?, ?, ?, ?, ?, ?)`,
        [
          refresh.userId,
          refresh.tokenHash,
          refresh.jti,
          refresh.expiresAt,
          refresh.ip,
          refresh.userAgent,
        ],
      );
    } catch (error) {
      throw error;
    }
  }

  static async getRefreshToken(refresh: RefreshTokenBase) {
    try {
      const [res] = await this.pool.execute<RowDataPacket[]>(
        `
        SELECT  users.id, users.username, users.email, refresh_tokens.*
        FROM users
        INNER JOIN refresh_tokens
        ON refresh_tokens.user_id = users.id
        WHERE refresh_tokens.token_hash = ? AND refresh_tokens.jti = ?
        `,
        [refresh.tokenHash, refresh.jti],
      );

      return res;
    } catch (error) {
      throw error;
    }
  }

  static async getRefreshTokenByHash(tokenHash: string) {
    try {
      const [res] = await this.pool.execute<RowDataPacket[]>(
        `
        SELECT * FROM refresh_tokens
        WHERE refresh_tokens.token_hash = ?
        `,
        [tokenHash],
      );

      return res;
    } catch (error) {
      throw error;
    }
  }

  static async rotationRefreshToken(refresh: RefreshRotation) {
    try {
      const [res] = await this.pool.execute<RowDataPacket[]>(
        `
        UPDATE refresh_tokens
        SET revoked_at = ? , replaced_by = ?
        WHERE refresh_tokens.token_hash = ? AND refresh_tokens.jti = ?
        `,
        [refresh.revokedAt, refresh.replacedBy, refresh.tokenHash, refresh.jti],
      );
    } catch (error) {
      throw error;
    }
  }

  static async revokeRefreshToken(refresh: RefreshRevoke) {
    try {
      const [res] = await this.pool.execute<RowDataPacket[]>(
        `
        UPDATE refresh_tokens
        SET revoked_at = ?
        WHERE refresh_tokens.token_hash = ? AND refresh_tokens.jti = ?
        `,
        [refresh.revokedAt, refresh.tokenHash, refresh.jti],
      );
    } catch (error) {
      throw error;
    }
  }

  static async revokeAllByUserId(id:number){
   try {
      const [res] = await this.pool.execute<RowDataPacket[]>(
        `
        UPDATE refresh_tokens
        SET revoked_at = NOW()
        WHERE refresh_tokens.user_id = ? AND refresh_tokens.revoked_at IS NULL
        `,
        [id],
      );
    } catch (error) {
      throw error;
    }
  }
}
