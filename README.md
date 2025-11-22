# 📦 Catálogo de Productos  
Aplicación Full Stack desarrollada con la pila **PERN (PostgreSQL, Express, React, Node.js)** que permite visualizar productos, categorías, gestionar usuarios invitados, favoritos y un panel administrativo para CRUDs internos.

---

## 🚀 Demo en Vivo

- **Frontend (Netlify):** https://catalogo-fdz.netlify.app  
- **Backend (Render):** https://catalogo-productos-vsu3.onrender.com  

---

## 📝 Descripción General

Este proyecto es un **catálogo de productos tipo ecommerce sencillo**, donde los usuarios pueden:

- Navegar por categorías  
- Ver productos con imágenes  
- Agregar productos a favoritos  
- Navegar como *invitado* mediante una cookie generada automáticamente  
- Usar una interfaz administradora para crear, editar y eliminar productos, categorías, medios, etc.

El proyecto está desplegado con **Netlify (cliente)** y **Render (API)**, usando **PostgreSQL remoto** para almacenar toda la información.

---

## 🧰 Tecnologías Utilizadas

### **Frontend**
- React.js + Vite
- React Router
- Context API
- Fetch API con manejo de cookies (`credentials: 'include'`)
- TailwindCSS / estilos propios

### **Backend**
- Node.js + Express
- PostgreSQL (pg)
- JWT + Cookies HTTPOnly
- Bcrypt para hashing
- CORS configurado para ambientes productivo y local

### **Base de Datos**
- PostgreSQL  
- Relaciones entre:  
  - `users`  
  - `categories`  
  - `products`  
  - `media_urls` (Cloudinary)  
  - `favorites`

---

## ⭐ Funcionalidades Principales

- 🔐 **Autenticación automática de usuario invitado** vía cookie HTTPOnly  
- 🛒 **Navegación de productos con paginación**  
- 🏷️ **Listado y filtrado por categorías**  
- ❤️ **Agregar/Quitar favoritos**  
- 🖼️ **Galería de imágenes por producto (Cloudinary)**  
- 🛠️ **Panel administrativo** (CRUD de categorías, productos, imágenes)  
- 📡 **API REST segura**  
- 🌐 **Frontend responsivo para cualquier dispositivo**

---

## 🗂️ Estructura del Proyecto

### **Backend**

server/
├── src/
│ ├── index.js
│ ├── app.js
│ ├── routes/
│ ├── controllers/
│ ├── middleware/
│ ├── db/
│ └── utils/
├── package.json
└── .env

### **Frontend*

client/
├── src/
│ ├── components/
│ ├── pages/
│ ├── context/
│ ├── hooks/
│ └── services/
├── vite.config.js
├── package.json
└── .env

---

## 🔧 Instalación Local

### 1️⃣ Clonar el repositorio

```sh
git clone https://github.com/AdrianFdz19/catalogo-productos.git
cd catalogo-productos
```

2️⃣ Instalar dependencias (Backend)
```sh
cd server
npm install
```

3️⃣ Instalar dependencias (Frontend)
```sh
cd server
npm install
```
## ⚙️ Configuración de Variables de Entorno
Crea un archivo .env dentro de la carpeta server:

PORT=3000
DATABASE_URL=postgres://user:password@host/db
JWT_SECRET=tu_clave_secreta
NODE_ENV=development

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

En el frontend, crea un archivo .env dentro de client:

VITE_API_URL=http://localhost:3000

## 🗃️ Base de Datos (PostgreSQL)

Este proyecto utiliza PostgreSQL.
Estas son las tablas y sus campos:

### users
- id SERIAL PRIMARY KEY
- username
- email
- full_name
- role
- hashed_password
- created_at
- updated_at

### categories
- id SERIAL PRIMARY KEY
- name
- slug
- created_at
- updated_at

### products
- id SERIAL PRIMARY KEY
- name
- description
- price
- stock
- category_id (FK → categories.id)
- created_at
- updated_at

### media_urls
- id SERIAL PRIMARY KEY
- product_id (FK → products.id)
- url
- created_at

### favorites
- id SERIAL PRIMARY KEY
- user_id (FK → users.id)
- product_id (FK → products.id)


