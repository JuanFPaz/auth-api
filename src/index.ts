import express, { Application, NextFunction, Request, Response } from "express";
import authRoutes from "./routes/auth.routes";
import cookieParser from "cookie-parser";
import cors from "cors";
import { UnauthorizedError } from "./common/errors/UnauthorizedError";
import { verifyConnection } from "./middleware/verify.middleware";

const app: Application = express();
const PORT = process.env.PORT ?? 3000;

app.use(
  cors({
    origin: ["http://localhost:5173", "https://juanfpaz.github.io"],
    methods: ["GET", "POST", "DELETE", "PATCH"],
    credentials: true,
  }),
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/",verifyConnection);

app.use("/api/auth", authRoutes);

app.use((err: any, req: Request, res: Response, next:NextFunction) => {
  if (err instanceof UnauthorizedError) {
    return res.status(err.status).json({ message: err.message });
  }

  return res.status(500).json({
    message: "Internal server error",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
