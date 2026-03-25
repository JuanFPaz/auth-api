import express, { Application, Request, Response, NextFunction } from "express";
import authRoutes from "./routes/auth.routes";
import cors from "cors";

const app: Application = express();
const port = 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  }),
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/auth", authRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});