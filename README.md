# 🔐 API de Autenticación con JWT (Node.js + TypeScript)

API REST básica que implementa autenticación de usuarios utilizando JSON Web Tokens (JWT). Permite registrar usuarios, iniciar sesión y acceder a rutas protegidas.

---

## 🚀 Tecnologías utilizadas

* Node.js
* Express
* TypeScript
* JWT (jsonwebtoken)
* bcrypt
* dotenv

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
PORT=3000
```

---

## 🧪 Scripts disponibles

```bash
npm run dev     # Ejecuta en modo desarrollo
npm run build   # Compila TypeScript a JavaScript
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
  "username": "user@email.com",
  "password": "123456"
}
```

---

### 🔐 Login

**POST** `/login`

```json
{
  "username": "user@email.com",
  "password": "123456"
}
```

📌 Respuesta:

```json
{
  "token": "jwt_token_aqui"
}
```

---

### 🔒 Ruta protegida

**GET** `/profile`

📌 Headers:

```
Authorization: Bearer tu_token
```

---

## 🛡️ Seguridad implementada

* Hash de contraseñas con bcrypt
* Autenticación mediante JWT
* Middleware de validación de token
* Variables de entorno para datos sensibles

---

## ⚠️ Notas

* Este proyecto es una implementación educativa
* No incluye base de datos (los datos se almacenan en memoria)
* Ideal como base para proyectos más complejos

---

## 📌 Mejoras futuras

* Integración con base de datos (PostgreSQL / MongoDB)
* Sistema de roles y permisos
* Refresh tokens
* Validaciones avanzadas

---

## 👨‍💻 Autor

Desarrollado por Juan Paz.

---

## ⭐ Objetivo del proyecto

Este proyecto fue creado con fines de aprendizaje para comprender el flujo de autenticación en aplicaciones backend modernas.
