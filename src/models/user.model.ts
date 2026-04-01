import { createPool, RowDataPacket } from "mysql2/promise";
import { option } from "../utils/config";
import bcrypt from "bcrypt";

export type userRegister = {
  username: string;
  password: string;
  info: info;
};

export type userAuth = {
  id: string;
  username: string;
  verificated: number;
  createdAt: string;
  info: info;
};

export type userLogin = {
  username: string;
  password: string;
};

export type userData = {
  id: string;
  username: string;
  verificated: number;
  createdAt: Date;
  name: string;
  lastname: string;
  email: string;
  birthday: Date;
  country: string;
};

type info = {
  name: string;
  lastname: string;
  email: string;
  birthday: string | Date;
  country: string;
};

class User {
  private _id: string;
  private _verificated: number;
  private _username: string;
  private _info: info;
  private _createdAt: Date;

  constructor(u: userData) {
    this._id = u.id;
    this._username = u.username;
    this._createdAt = u.createdAt;
    this._verificated = u.verificated;
    this._info = {
      name: u.name,
      lastname: u.lastname,
      email: u.email,
      birthday: u.birthday,
      country: u.country,
    };
  }

  public get id(): string {
    return this._id;
  }

  public get username(): string {
    return this._username;
  }

  public get verificated(): number {
    return this._verificated;
  }

  public get info(): info {
    return {
      ...this._info,
      birthday: this._info.birthday.toLocaleString().split(",").join(""),
    };
  }

  public get createdAt(): string {
    return this._createdAt.toLocaleString().split(",").join("");
  }
}

export class UserReposity {
  private static connection = createPool({ ...option });

  //REGISTER
  static async getUserByUsername(username: string):Promise<{status:'exist'} | {status:'success'}> {
    try {
      const [res] = await this.connection.execute<RowDataPacket[]>(
        `SELECT user.username FROM user WHERE user.username = ?`,
        [username],
      );
      if (res.length !== 0){
        return {
          status: 'exist',
        };
      }

      return {
        status:'success'
      }

    } catch (error) {
      throw (error as Error).message;
    }
  }

  static async getUserByEmail(email: string):Promise<{status:'exist'} | {status:'success'}>  {
    try {
      const [res] = await this.connection.execute<RowDataPacket[]>(
        `SELECT info.email FROM info WHERE info.email = ?`,
        [email],
      );
      if (res.length !== 0){
        return {
          status: 'exist'
        };
      }

      return {
        status:'success'
      }
    } catch (error) {
      throw (error as Error).message;
    }
  }

  static async createUser(_user: userRegister) {
    try {
      const [infoResult]: any = await this.connection.execute(
        `INSERT INTO info(name, lastname, email, birthday, country)
       VALUES (?, ?, ?, ?, ?)`,
        [
          _user.info.name,
          _user.info.lastname,
          _user.info.email,
          _user.info.birthday,
          _user.info.country,
        ],
      );

      const infoId = infoResult.insertId;
      const hassPassword = await bcrypt.hash(_user.password, 10);

      const [userResult] = await this.connection.execute(
        `INSERT INTO user(username, password, info_id)
       VALUES (?, ?, ?)`,
        [_user.username, hassPassword, infoId],
      );
    } catch (error) {
      throw (error as Error).message;
    }
  }

  //LOGIN
  static async getPayload(_user: userLogin): Promise<{status:'notexist'} |{status:'notmatched' } | {status:'success', payload:{id:string}}>{
    try {
      const [res] = await this.connection.execute<RowDataPacket[]>(
        "SELECT user.id, user.password FROM user WHERE user.username = ?",
        [_user.username],
      );
      if(res.length === 0) return {status:'notexist'}
      
      const user: { id: string; password: string } = {
        id: res[0].id,
        password: res[0].password,
      };

      const match = await bcrypt.compare(_user.password, user.password);

      if (!match) return { status:'notmatched' };

      return {
        status: 'success',
        payload: { id: user.id },
      };
    } catch (error) {
      throw (error as Error).message;
    }
  }

  //AUTH
  public static async getUserById(_id: string): Promise<userAuth> {
    try {
      const SQL = `
      SELECT user.id, user.username, user.verificated, user.createdAt, info.name, info.lastname, info.email,info.birthday,info.country FROM user
      INNER JOIN info
      ON user.info_id = info.id
      WHERE user.id = ?`;
      const [res] = await this.connection.execute<RowDataPacket[]>(SQL, [_id]);
      const { id, username, createdAt, verificated, info }: userAuth = new User(
        res[0] as userData,
      );
      return { id, username, createdAt, verificated, info };
    } catch (error) {
      throw (error as Error).message;
    }
  }
}
