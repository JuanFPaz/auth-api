import express from "express";
import {
  register,
  login,
  profile,
  refresh,
  logout,
} from "../controllers/auth.controller";
import { authProfile, authRefresh } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/profile", authProfile, profile);

router.post("/refresh", authRefresh, refresh);

router.post('/logout', logout)

export default router;
