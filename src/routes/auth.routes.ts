import express, { NextFunction } from "express";
import {
  register,
  login,
  logout,
  profile,
  editProfile,
  refresh,
  deleteProfile,
  reset,
} from "../controllers/auth.controller";
import { authProfile, authRefresh } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/logout", logout);

router.post("/password/reset", reset); //Ruta para cuando el usuario olvida la contraseña, como es una api sencilla didactica para los access_token, solo verifico el username o email ingresado por el user, y su nueva contraseña.

// Rutas del perfil autenticado
router.get("/profile", authProfile, profile);

router.delete("/profile", authProfile, deleteProfile); // Ruta para cuando el usuario quiere borrar su cuenta, aca verificamos el access_token y si todo ta bien ,eliminamos al usuario :3

router.patch("/profile/password", authProfile, editProfile); // Ruta para cuando el usuario esta en el panel de su usuario, y nos envia la contraseña nueva. aca verificamos los accesstoken y los datos ingresados, como que coincidan las contraseñas etc.

// rutas del refresh token

router.post("/refresh", authRefresh, refresh);

export default router;
