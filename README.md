# 🏍️ ZeroxMotors — Sistema de Ventas

Sistema de gestión de ventas para la empresa ZeroxMotors, desarrollado como propuesta de solución digital para reemplazar los registros manuales por un sistema centralizado y eficiente.

---

## 🚀 Tecnologías

| Capa | Tecnología |
|------|-----------|
| Frontend | React + Vite + Tailwind CSS |
| Backend | Node.js + Express.js |
| Base de datos | MySQL |
| Patrón | MVC (Model - View - Controller) |

---

## 📁 Estructura del proyecto

    zeroxmotors/
    ├── backend/
    │   ├── config/         # Conexión a base de datos
    │   ├── controllers/    # Lógica de negocio
    │   ├── models/         # Queries SQL
    │   ├── routes/         # Endpoints REST
    │   ├── middleware/     # Manejo de errores
    │   └── index.js        # Entrada del servidor
    │
    ├── frontend/
    │   └── src/
    │       ├── pages/      # Vistas principales
    │       ├── components/ # Componentes reutilizables
    │       ├── services/   # Llamadas a la API
    │       └── context/    # Estado global
    
---

## ⚙️ Instalación y configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/AldairTe/zeroxmotors.git
cd zeroxmotors
```

### 2. Configurar la base de datos

- Crear la base de datos en MySQL ejecutando el script SQL incluido
- Importar los datos de prueba

### 3. Configurar el backend

```bash
cd backend
npm install
```

Crear el archivo `.env` en la carpeta `backend`:

```env
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=zeroxmotors
```

### 4. Configurar el frontend

```bash
cd frontend
npm install
```

Crear el archivo `.env` en la carpeta `frontend`:

```env
VITE_API_URL=http://localhost:3001/api
```

---

## ▶️ Ejecutar el proyecto

**Terminal 1 — Backend:**

```bash
cd backend
node index.js
```

**Terminal 2 — Frontend:**

```bash
cd frontend
npm run dev
```

Abrir el navegador en: `http://localhost:5173`

---

## 📦 Módulos del sistema

| Módulo | Descripción |
|--------|-------------|
| 👥 Clientes | Registro y gestión de clientes con tipo y número de documento |
| 📦 Productos | Catálogo de productos en grid con imagen, precio y stock |
| 🧾 Ventas | Registro de ventas con detalle de productos y cálculo automático |
| 📋 Cotizaciones | Gestión de cotizaciones con opción de convertir a venta |
| 📊 Reportes | Reportes gerenciales de ventas, productos y clientes |

---

## 👥 Actores del sistema

- **Cliente** — Realiza compras de productos
- **Vendedor** — Gestiona clientes, cotizaciones y ventas
- **Gerente** — Visualiza reportes gerenciales
- **Almacenero** — Gestiona el inventario de productos
- **Proveedor** — Abastece productos a la empresa

---

## 🎓 Contexto académico

Proyecto desarrollado para el curso de **Diseño y Arquitectura de Software**, aplicando la metodología **RUP** y el lenguaje de modelado **UML**.

---

## 👨‍💻 Autor

**Aldair** — [@AldairTe](https://github.com/AldairTe)