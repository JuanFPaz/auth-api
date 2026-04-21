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

  static async deleteUser(id: number) {
    try {
      const [res] = await this.pool.execute(`DELETE FROM users WHERE id = ?`, [
        id,
      ]);
    } catch (error) {
      throw error;
    }
  }

  static async editUser(id: number, newPassword: string) {
    try {
      const [res] = await this.pool.execute<RowDataPacket[]>(
        `
        UPDATE users
        SET password = ?
        WHERE users.id = ?
        `,
        [newPassword, id],
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

  static async getUserById(id: number) {
    try {
      const [res] = await this.pool.execute<RowDataPacket[]>(
        "SELECT * FROM users WHERE users.id = ?",
        [id],
      );

      return res;
    } catch (error) {
      throw error;
    }
  }

  static async createRefreshToken({
    userId,
    tokenHash,
    jti,
    expiresAt,
    ip,
    userAgent,
  }: RefreshTokenRecord) {
    try {
      const [userResult] = await this.pool.execute(
        `INSERT INTO refresh_tokens(user_id, token_hash, jti,expires_at,ip,user_agent)
       VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, tokenHash, jti, expiresAt, ip, userAgent],
      );
    } catch (error) {
      throw error;
    }
  }

  static async getRefreshToken({ tokenHash, jti }: RefreshTokenBase) {
    try {
      const [res] = await this.pool.execute<RowDataPacket[]>(
        `
        SELECT  users.id, users.username, users.email, refresh_tokens.*
        FROM users
        INNER JOIN refresh_tokens
        ON refresh_tokens.user_id = users.id
        WHERE refresh_tokens.token_hash = ? AND refresh_tokens.jti = ?
        `,
        [tokenHash, jti],
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

  static async rotationRefreshToken({
    revokedAt,
    replacedBy,
    tokenHash,
    jti,
  }: RefreshRotation) {
    try {
      const [res] = await this.pool.execute<RowDataPacket[]>(
        `
        UPDATE refresh_tokens
        SET revoked_at = ? , replaced_by = ?
        WHERE refresh_tokens.token_hash = ? AND refresh_tokens.jti = ?
        `,
        [revokedAt, replacedBy, tokenHash, jti],
      );
    } catch (error) {
      throw error;
    }
  }

  static async revokeRefreshToken({
    revokedAt,
    tokenHash,
    jti,
  }: RefreshRevoke) {
    try {
      const [res] = await this.pool.execute<RowDataPacket[]>(
        `
        UPDATE refresh_tokens
        SET revoked_at = ?
        WHERE refresh_tokens.token_hash = ? AND refresh_tokens.jti = ?
        `,
        [revokedAt, tokenHash, jti],
      );
    } catch (error) {
      throw error;
    }
  }

  static async revokeAllByUserId(id: number) {
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
