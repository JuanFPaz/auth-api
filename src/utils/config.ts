import { ConnectionOptions } from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

// Options para createConnection
export const option:ConnectionOptions = {
  host: process.env.HOST!,
  user: process.env.USER!,
  password: process.env.PWD!, //Si es PHPMyAmdmin, va sin contraseña.
  database: process.env.DB!, // BD: my_first_scheme
};
