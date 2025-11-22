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
