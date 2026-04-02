import { ConnectionOptions } from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();
console.log("Chequeando ENVS");

console.log({
  host: process.env.DBHOST!,
  port: Number(process.env.DBPORT!),
  user: process.env.DBUSER!,
  database: process.env.DBSCHEME!,
});
// Options para createConnection
export const option: ConnectionOptions = {
  host: process.env.DBHOST!,
  port: Number(process.env.DBPORT!),
  user: process.env.DBUSER!,
  password: process.env.DBPWD!,
  database: process.env.DBSCHEME!,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false,
  },
};
