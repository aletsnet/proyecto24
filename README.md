# proyecto24
Sistema de punto de venta elaborado por el grupo 24 y 24A del horario Mixto de Centro Universitario Hidalguense, del Nov25 - Dic25

## 🚀 Descripción del Proyecto

Sistema web de punto de venta desarrollado con **Tauri 2**, **Vite**, **TypeScript**, **Bootstrap** y **Axios**. 

## 📋 Características

- ✅ Interfaz de login con Bootstrap
- ✅ Autenticación de usuarios
- ✅ Diseño responsive y moderno
- ✅ Integración de Axios para peticiones HTTP
- ✅ Aplicación de escritorio multiplataforma con Tauri 2
- ✅ Desarrollo rápido con Vite

## 🛠️ Tecnologías Utilizadas

- **Tauri 2**: Framework para crear aplicaciones de escritorio con tecnologías web
- **Vite**: Build tool rápido para desarrollo frontend
- **TypeScript**: Superset de JavaScript con tipado estático
- **Bootstrap 5**: Framework CSS para diseño responsive
- **Axios**: Cliente HTTP para realizar peticiones al backend

## 📦 Requisitos Previos

- **Node.js** (v20 o superior)
- **npm** (v10 o superior)
- **Rust** (última versión estable)
- **Dependencias del sistema para Tauri**: Ver [Tauri Prerequisites](https://tauri.app/start/prerequisites/)

## 🚀 Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/aletsnet/proyecto24.git
cd proyecto24
```

2. Instalar dependencias:
```bash
npm install
```

## 💻 Uso

### Modo Desarrollo

Para ejecutar la aplicación en modo desarrollo:

```bash
npm run dev
```

Esto iniciará el servidor de desarrollo de Vite en `http://localhost:1420/`

### Para ejecutar la aplicación de escritorio con Tauri:

```bash
npm run tauri dev
```

### Compilar para Producción

Para construir la aplicación web:

```bash
npm run build
```

Para construir la aplicación de escritorio:

```bash
npm run tauri build
```

## 📱 Interfaz de Login

El sistema incluye una interfaz de acceso con las siguientes características:

- Campo de usuario
- Campo de contraseña
- Opción de recordar sesión
- Validación de formularios
- Mensajes de error/éxito
- Diseño responsive con Bootstrap

### Credenciales de Prueba (Modo Demo)

Durante el desarrollo, el sistema acepta cualquier usuario y contraseña para pruebas.
Para conectar con un backend real, descomentar la sección de autenticación con Axios en `src/main.ts`.

## 🔧 Configuración

### Configurar Backend API

Para conectar con un backend real, editar la configuración de Axios en `src/main.ts`:

```typescript
const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Cambiar a la URL de tu backend
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});
```

## 📁 Estructura del Proyecto

```
proyecto24/
├── src/                    # Código fuente frontend
│   ├── main.ts            # Lógica principal y manejo de login
│   ├── styles.css         # Estilos personalizados con Bootstrap
│   └── assets/            # Recursos estáticos
├── src-tauri/             # Código fuente de Tauri (Rust)
│   ├── src/               # Código Rust
│   ├── icons/             # Iconos de la aplicación
│   └── tauri.conf.json    # Configuración de Tauri
├── index.html             # Página principal
├── package.json           # Dependencias y scripts
├── tsconfig.json          # Configuración de TypeScript
└── vite.config.ts         # Configuración de Vite
```

## 🎨 Capturas de Pantalla

### Interfaz de Login
![Login Interface](https://github.com/user-attachments/assets/7c90c4d0-60ed-48a0-8142-7fe7d5694cd0)

### Login Exitoso
![Login Success](https://github.com/user-attachments/assets/0de70948-bb22-4b43-a8cd-1a16b6f2b919)

## 👥 Contribuidores

Grupo 24 y 24A del horario Mixto de Centro Universitario Hidalguense

## 📄 Licencia

Este proyecto es parte de un trabajo académico del Centro Universitario Hidalguense.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
