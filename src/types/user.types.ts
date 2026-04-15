export type UserRegister = {
  username: string;
  password: string;
  name: string;
  lastname: string;
  email: string;
  birthday: Date;
  country: string;
};

export type UserLogin = {
  username: string;
  password: string;
};

export type UserPayload = {
  id: number;
  username: string;
  email: string;
};

// eL TIPO QUE 
export type UserConstructor = {
  id: string;
  username: string;
  createdAt: Date;
  name: string;
  lastname: string;
  email: string;
  birthday: Date;
  country: string;
};

// El tipo que enviamos al front
export type UserResponse = {
  id: string;
  username: string;
  name: string;
  lastname: string;
  email: string;
  birthday: string;
  country: string;
  createdAt:string,
  lastSession:string
};