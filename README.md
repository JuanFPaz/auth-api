# 🔐 API de Autenticación con JWT (Node.js + TypeScript)

API REST básica que implementa autenticación de usuarios utilizando JSON Web Tokens (JWT). Permite registrar usuarios, iniciar sesión y acceder a rutas protegidas.

---

## 🚀 Tecnologías utilizadas

- Node.js
- Express
- TypeScript
- JWT (jsonwebtoken)
- bcrypt
- dotenv
- cookie-parser
- cors

---

## 📦 Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/JuanFPaz/express-ts.git
cd express-ts
```

2. Instalar dependencias:

```bash
npm install
```

3. Crear archivo `.env` en la raíz:

```env
JWT_SECRET=supersecreto
```

---

## 🧪 Scripts disponibles

```bash
npm run dev     # Ejecuta en modo desarrollo
npm run build   # Compila TypeScript a JavaScript
npm run build:prod   # Instala dependencias y ejecuta npm run build para produccion
npm start       # Ejecuta versión compilada
```

---

## 📁 Estructura del proyecto

```
src/
 ├── controllers/
 ├── routes/
 ├── middleware/
 ├── models/
 └── index.ts
```

---

## 🔑 Endpoints

### 📝 Registro

**POST** `/register`

```json
{
  "username": "FonkyBuu",
  "password": "1234",
  "name": "Juan",
  "lastname": "Paz",
  "email": "juancito@hotmail.com",
  "birthday": "1994-11-25",
  "country": "Argentina"
}
```

---

### 🔐 Login

**POST** `/login`

```json
{
  "username": "FonkyBuu",
  "password": "1234"
}
```

📌 Respuesta:

- Se envia el `acces_token` a traves de las cookies mediante esta configuracion:

```ts
res
  .status(200)
  .cookie("access_token", token, {
    httpOnly: true,
    secure: true, //TRUE EN PRODUCCION | FALSE EN DESARROLLO
    sameSite: "none", //NONE EN PRODUCCION | LAX EN DESARROLLO
    maxAge: 1000 * 60 * 60,
  })
  .json({ status: 200, message: "Usuario ingresado correctamente" });
```

- En mi caso, el `front` y el `back` se encuentran en dos ecosistemas distintos. Si tuvieramos un `Server-Side Rendering`, el `sameSite` deberia ser `strict`

---

### 🔒 Ruta protegida

**GET** `/me`

- Se Busca el `acces_token` creado en `/login`, al recibir la solicitud

```ts
const token = req.cookies.access_token;

if (!token)
  return res
    .status(401)
    .json({ status: 401, message: "Missing or invalid Authorization header" });
```

---

## 🛡️ Seguridad implementada

- Hash de contraseñas con bcrypt
- Autenticación mediante JWT
- Middleware de validación de token
- Variables de entorno para datos sensibles

---

## ⚠️ Notas

- Este proyecto es una implementación educativa
- Ideal como base para proyectos más complejos

---

## 📌 Mejoras futuras

- Sistema de roles y permisos
- Validaciones avanzadas

---

## 👨‍💻 Autor

Desarrollado por Juan Paz.
