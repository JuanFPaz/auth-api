import express, { Application, Request, Response } from "express";
import authRoutes from "./routes/auth.routes";
import cookieParser from 'cookie-parser'
import cors from "cors";
import { UserReposity } from "./repository/user.repository";

const app: Application = express();
const PORT = process.env.PORT ?? 3000;

app.use(
  cors({
    origin:['http://localhost:5173','https://juanfpaz.github.io'],
    methods:['GET','POST','DELETE','PATCH'],
    credentials:true
  }),
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/", async (req: Request, res: Response) => {
  try {
    await UserReposity.checkConnection();
    res.status(200).json({ status: 200, message: "Conexion Exitosa" });
  } catch (error) {
    res.status(500).json({ status: 500, message: (error as Error).message });
  }
});

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});