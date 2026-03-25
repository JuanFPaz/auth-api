import express, { Application } from "express";
import authRoutes from "./routes/auth.routes";
import cookieParser from "cookie-parser";
import cors from "cors";

const app: Application = express();
const port = 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials:true, // Exigimos al front que nos envie credenciales, para recibir las cookies
    methods: ["GET", "POST"],
  }),
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser())
app.use("/api/auth", authRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
1