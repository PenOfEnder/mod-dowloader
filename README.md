# Bryan.js's Mod Downloader

![Minecraft](https://img.shields.io/badge/Minecraft-Mods-green)
![SvelteKit](https://img.shields.io/badge/SvelteKit-2.x-orange)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-blue)

Aplicación web para gestionar y descargar mods de Minecraft desde Modrinth de forma sencilla y rápida.

## ✨ Características

- 📝 **Gestión de Listas**: Crea y administra listas de mods personalizadas
- 🔍 **Identificación Automática**: Sube archivos JAR y la app identifica el mod automáticamente usando la API de Modrinth
- 💾 **Exportar/Importar**: Guarda tus listas de mods en formato JSON y compártelas
- 🎨 **Diseño Pixel Art**: Interfaz con estilo retro usando la fuente Pixelify Sans
- 🌐 **Integración con Modrinth**: Conexión directa con la base de datos de mods más grande

## 🚀 Inicio Rápido

### Requisitos Previos

- Node.js 18+ 
- npm, pnpm o yarn

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/mod-dowloader.git
cd mod-dowloader

# Instalar dependencias
npm install
```

### Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# Abrir en el navegador automáticamente
npm run dev -- --open
```

La aplicación estará disponible en `http://localhost:5173`

### Producción

```bash
# Construir para producción
npm run build

# Previsualizar build de producción
npm run preview
```

## 📁 Estructura del Proyecto

```
bryan.js-mod-downloader/
├── src/
│   ├── lib/
│   │   ├── components/      # Componentes reutilizables
│   │   │   ├── files/       # Inputs, botones, lista de mods
│   │   │   └── ui/          # Navbar, footer
│   │   ├── assets/          # Favicon y recursos estáticos
│   │   └── svg_icons/       # Iconos SVG personalizados
│   ├── routes/              # Rutas de la aplicación (SvelteKit)
│   │   ├── +page.svelte             # Página principal
│   │   ├── list/+page.svelte        # Gestión de listas
│   │   ├── download/+page.svelte    # (En desarrollo)
│   │   ├── search/+page.svelte      # (En desarrollo)
│   │   └── utils/svelte/identify-mod/
│   │       └── +server.js           # Endpoint API Modrinth
│   └── utils/               # Utilidades y templates
│       ├── mod_template.js  # Estructura de datos de mod
│       └── default_list.js  # Lista por defecto
├── static/                  # Archivos estáticos públicos
├── svelte.config.js         # Configuración de SvelteKit
├── vite.config.js           # Configuración de Vite
└── package.json
```

## 🛠️ Stack Tecnológico

- **Framework**: [SvelteKit 2.x](https://kit.svelte.dev/) con Svelte 5
- **Estilos**: [Tailwind CSS 4.x](https://tailwindcss.com/)
- **Build Tool**: [Vite 7.x](https://vitejs.dev/)
- **API**: [Modrinth API v2](https://docs.modrinth.com/)

## 📖 Cómo Funciona

### Identificación de Mods

1. El usuario sube un archivo `.jar` de un mod
2. La aplicación calcula el hash SHA-1 del archivo
3. Se envía el hash a la API de Modrinth
4. Modrinth identifica el mod y retorna información completa
5. El mod se agrega automáticamente a la lista

### Estructura de Datos

Cada mod se almacena con la siguiente estructura:

```json
{
  "project_id": "abc123",
  "name": "Nombre del Mod",
  "loaders": {
    "fabric": "1.20.1",
    "forge": "",
    "quilt": "",
    "neoforge": ""
  }
}
```

## 🎯 Roadmap

- [x] Sistema de gestión de listas
- [x] Identificación automática por JAR
- [x] Exportar/Importar JSON
- [ ] Página de búsqueda de mods
- [ ] Descarga directa de mods
- [ ] Filtros por versión de Minecraft
- [ ] Soporte para modpacks

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: nueva característica'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Alias de Rutas

El proyecto usa los siguientes alias configurados en `svelte.config.js`:

- `$lib` → `src/lib/`
- `$utils` → `src/utils/`
- `$components` → `src/components/`

## 🎨 Tema de Colores

Paleta personalizada `main-green` definida en `src/routes/layout.css`:

- `main-green-50` a `main-green-950`: Escala de verdes personalizados
- Fuente: **Pixelify Sans** (estilo pixel art)

---

# 🤖 Trabajar con Warp AI

Este proyecto está optimizado para trabajar con [Warp](https://warp.dev), el terminal inteligente con soporte para agentes AI.

## 🔧 Configuración Inicial

Warp leerá automáticamente el archivo `WARP.md` en la raíz del proyecto para entender la estructura y convenciones del código.

## 💡 Comandos Útiles con Warp

Puedes pedirle a Warp que ejecute estas tareas:

```
"Inicia el servidor de desarrollo"
"Construye el proyecto para producción"
"Muéstrame los mods en src/routes/list/+page.svelte"
"Agrega un nuevo componente de búsqueda"
"Explica cómo funciona la identificación de mods"
```

## 🎯 Contexto para Warp AI

### Convenciones del Proyecto

- **Idioma**: Todo el código UI está en español (mensajes, alertas, componentes)
- **Svelte 5**: Se usa la sintaxis moderna con runes (`$props()`, `$state()`)
- **Imports**: Usa los alias `$lib`, `$utils`, `$components`
- **API**: Siempre incluir `User-Agent` al comunicarse con Modrinth API

### Patrones Comunes

**Crear un nuevo componente SVG:**
```svelte
<script>
  let { size = 24, color = "#000000" } = $props();
</script>
<svg width={size} height={size} ...>
  <!-- SVG path -->
</svg>
```

**Manejo de archivos:**
```js
// Siempre limpiar el buffer después de procesar
selectedFile = null;
if (e && e.target) {
  e.target.value = "";
}
```

## 📚 Recursos

- [Documentación de Warp](https://docs.warp.dev/)
- [WARP.md del proyecto](./WARP.md) - Guía completa para Warp AI
- [Modrinth API Docs](https://docs.modrinth.com/)
- [SvelteKit Docs](https://kit.svelte.dev/docs)

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 👤 Contacto

Desarrollado por Bryan.js

- Email: bryanjsypenofender@gmail.com
- Modrinth: [Perfil](https://modrinth.com/)
