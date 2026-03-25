import express, { Application } from "express";
import authRoutes from "./routes/auth.routes";
import cookieParser from 'cookie-parser'
import cors from "cors";

const app: Application = express();
const PORT = process.env.PORT ?? 3000;

app.use(
  cors({
    origin:['http://localhost:5173','https://juanfpaz.github.io'],
    methods:['GET','POST'],
    credentials:true
  }),
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
1