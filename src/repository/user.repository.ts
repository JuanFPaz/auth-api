import { createPool, RowDataPacket } from "mysql2/promise";
import { option } from "../utils/config";
import type { UserRegister, UserLogin, UserPayload } from "../types/user.types";

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

  static async getUser({ username }: UserLogin) {
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
  //   //REGISTER
  //   static async getUserByUsername(
  //     username: string,
  //   ): Promise<{ status: "exist" } | { status: "success" }> {
  //     try {
  //       const [res] = await this.connection.execute<RowDataPacket[]>(
  //         `SELECT user.username FROM user WHERE user.username = ?`,
  //         [username],
  //       );
  //       if (res.length !== 0) {
  //         return {
  //           status: "exist",
  //         };
  //       }

  //       return {
  //         status: "success",
  //       };
  //     } catch (error) {
  //       throw (error as Error).message;
  //     }
  //   }

  //   static async getUserByEmail(
  //     email: string,
  //   ): Promise<{ status: "exist" } | { status: "success" }> {
  //     try {
  //       const [res] = await this.connection.execute<RowDataPacket[]>(
  //         `SELECT info.email FROM info WHERE info.email = ?`,
  //         [email],
  //       );
  //       if (res.length !== 0) {
  //         return {
  //           status: "exist",
  //         };
  //       }

  //       return {
  //         status: "success",
  //       };
  //     } catch (error) {
  //       throw (error as Error).message;
  //     }
  //   }

  // //   static async createUser(_user: userRegister) {
  // //     try {
  // //       const [infoResult]: any = await this.connection.execute(
  // //         `INSERT INTO info(name, lastname, email, birthday, country)
  // //        VALUES (?, ?, ?, ?, ?)`,
  // //         [
  // //           _user.name,
  // //           _user.lastname,
  // //           _user.email,
  // //           _user.birthday,
  // //           _user.country,
  // //         ],
  // //       );

  // //       const infoId = infoResult.insertId;
  // //       const hassPassword = await bcrypt.hash(_user.password, 10);

  // //       const [userResult] = await this.connection.execute(
  // //         `INSERT INTO user(username, password, info_id)
  // //        VALUES (?, ?, ?)`,
  // //         [_user.username, hassPassword, infoId],
  // //       );
  // //     } catch (error) {
  // //       throw (error as Error).message;
  // //     }
  // //   }

  //   //LOGIN
  //   static async getPayload(
  //     _user: userLogin,
  //   ): Promise<
  //     | { status: "notexist" }
  //     | { status: "notmatched" }
  //     | { status: "success"; payload: { id: string } }
  //   > {
  //     try {
  //       const [res] = await this.connection.execute<RowDataPacket[]>(
  //         "SELECT user.id, user.password FROM user WHERE user.username = ?",
  //         [_user.username],
  //       );
  //       if (res.length === 0) return { status: "notexist" };

  //       const user: { id: string; password: string } = {
  //         id: res[0].id,
  //         password: res[0].password,
  //       };

  //       const match = await bcrypt.compare(_user.password, user.password);

  //       if (!match) return { status: "notmatched" };

  //       return {
  //         status: "success",
  //         payload: { id: user.id },
  //       };
  //     } catch (error) {
  //       throw (error as Error).message;
  //     }
  //   }

  //   //AUTH
  //   public static async getUserById(_id: string): Promise<userAuth> {
  //     try {
  //       const SQL = `
  //       SELECT user.id, user.username, user.verificated, user.createdAt, info.name, info.lastname, info.email,info.birthday,info.country FROM user
  //       INNER JOIN info
  //       ON user.info_id = info.id
  //       WHERE user.id = ?`;
  //       const [res] = await this.connection.execute<RowDataPacket[]>(SQL, [_id]);
  //       const {
  //         id,
  //         username,
  //         createdAt,
  //         verificated,
  //         info,
  //         lastSession,
  //       }: userAuth = new User(res[0] as userData);
  //       return { id, username, createdAt, verificated, info, lastSession };
  //     } catch (error) {
  //       throw (error as Error).message;
  //     }
  //   }
}
