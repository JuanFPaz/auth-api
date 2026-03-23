import bycrpt from "bcrypt";

export type userRegister = {
  username: string;
  password: string;
  info: info;
};

export type userLogin = {
  username: string;
  password: string;
};

export type userData = {
  id: string;
  username: string;
  info: info;
};

type info = {
  name: string;
  lastname: string;
  email: string;
  birthday: string;
  country: string;
};

type filterUser = {
  id: string;
  username: string;
  info: info;
};

class User {
  private _id: string;
  private _username: string;
  private _password: string;
  private _info: info;

  constructor(u: userRegister) {
    this._id = crypto.randomUUID();
    this._username = u.username;
    this._password = u.password;
    this._info = u.info;
  }

  public get id(): string {
    return this._id;
  }

  public get username(): string {
    return this._username;
  }

  public get info(): info {
    return this._info;
  }

  public async hash() {
    const hash = await bycrpt.hash(this._password, 10);
    this._password = hash;
  }

  public async compare(pass: string): Promise<boolean> {
    const matchPass = await bycrpt.compare(pass, this._password);
    return matchPass;
  }
}

export default class DataBase {
  private static db: User[] = [];

  public static async createUser(user: userRegister) {
    const _user = new User(user);
    await _user.hash();
    this.db.push(_user);
  }

  public static async getUsers(): Promise<filterUser[]> {
    const _userMap: filterUser[] = this.db.map(({ id, username, info }) => {
      return {
        id,
        username,
        info,
      };
    });
    console.log(_userMap);
    return _userMap;
  }

  //Para Register
  public static async getUser(name: string): Promise<filterUser | undefined> {
    const [_user] = this.db.filter(
      (u) => u.username.toLowerCase() === name.toLowerCase(),
    );
    if (!_user) return _user;
    const { id, username, info } = _user;
    return {
      id,
      username,
      info,
    };
  }

  //Para Login
  public static async getUserLog(user: userLogin): Promise<filterPayload> {
    const [_user] = this.db.filter(
      (u) => u.username.toLowerCase() === user.username.toLowerCase(),
    );

    if (!_user) return { user: _user, matchpass: false };
    const matchpass = await _user.compare(user.password);
    return {
      user: {
        id: _user.id,
      },
      matchpass,
    };
  }
  //Para Auth
  public static async getUserById(
    _id: string,
  ): Promise<filterUser | undefined> {
    const [_user] = this.db.filter((u) => u.id === _id);
    if (!_user) return _user;
    const { id, username, info } = _user;
    return {
      id,
      username,
      info,
    };
  }
}

type filterPayload = {
  user:
    | {
        id: string;
      }
    | undefined;
  matchpass: boolean;
};
