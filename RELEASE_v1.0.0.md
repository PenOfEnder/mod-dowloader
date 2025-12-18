# 🎉 Bryan.js's Mod Downloader v1.0.0

**Fecha de lanzamiento**: 18 de diciembre de 2025

¡Primera versión oficial de Bryan.js's Mod Downloader! Una aplicación web moderna para gestionar tus mods de Minecraft de forma sencilla y rápida.

---

## ✨ Características Principales

### 📝 Gestión de Listas de Mods
- Crea y administra listas personalizadas de mods
- Agrega mods manualmente escribiendo su nombre
- Elimina mods de tu lista con un solo clic
- Visualización clara con numeración automática

### 🔍 Identificación Automática de Mods
- **Sube archivos JAR**: La aplicación identifica automáticamente el mod
- **Integración con Modrinth API**: Conexión directa con la base de datos de mods más grande
- **Hash SHA-1**: Identificación precisa usando hashing criptográfico
- **Información completa**: Obtén nombre, ID del proyecto, versiones y más

### 💾 Exportar e Importar
- **Exporta** tus listas en formato JSON
- **Importa** listas guardadas o compartidas por otros usuarios
- **Formato estándar**: Archivos JSON fáciles de leer y editar
- **Fusión inteligente**: Importa sin duplicar mods existentes

### 🎨 Diseño Moderno con Estilo Retro
- Interfaz pixel art con la fuente **Pixelify Sans**
- Paleta de colores verde personalizada
- Animaciones suaves y transiciones elegantes
- Diseño responsive y fácil de usar

---

## 🛠️ Tecnologías

- **SvelteKit 2.49.1** - Framework moderno y reactivo
- **Svelte 5.45.6** - Con la nueva sintaxis de runes
- **Tailwind CSS 4.1.17** - Estilos con sistema `@theme`
- **Vite 7.2.6** - Build tool ultrarrápido
- **Modrinth API v2** - Integración oficial

---

## 📦 Instalación

### Para Usuarios

1. Descarga el código desde GitHub
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Inicia la aplicación:
   ```bash
   npm run dev
   ```
4. Abre tu navegador en `http://localhost:5173`

### Para Desarrollo

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/bryan.js-mod-downloader.git
cd bryan.js-mod-downloader

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

---

## 🚀 Cómo Usar

### Agregar Mods Manualmente
1. Ve a la sección **"Listar"**
2. Escribe el nombre del mod en el campo de texto
3. Presiona el botón **"+"**

### Identificar Mods desde JAR
1. Haz clic en **"Identificar JAR"**
2. Selecciona un archivo `.jar` de tu computadora
3. La aplicación identificará el mod automáticamente
4. El mod se agregará a tu lista

### Exportar tu Lista
1. Haz clic en **"Exportar lista"**
2. Se descargará un archivo `mods.json`
3. Guárdalo para respaldo o para compartir

### Importar una Lista
1. Haz clic en **"Importar lista"**
2. Selecciona un archivo `.json` válido
3. Los mods se fusionarán con tu lista actual

---

## 🎯 Estructura de Datos

Cada mod se guarda con el siguiente formato:

```json
{
  "project_id": "fabric-api",
  "name": "Fabric API",
  "loaders": {
    "fabric": "1.20.1",
    "forge": "",
    "quilt": "",
    "neoforge": ""
  }
}
```

---

## ⚠️ Limitaciones Conocidas

- Las páginas **"Descargar"** y **"Buscar"** están en desarrollo
- Solo soporta identificación de mods disponibles en Modrinth
- Sin filtros por versión de Minecraft (próximamente)
- La descarga directa de mods aún no está implementada

---

## 🐛 Bugs Conocidos

- Typo en `src/utils/mod_template.js`: `"undefinied"` en lugar de `"undefined"` (línea 2)

---

## 🔮 Próximos Pasos (v1.1.0)

- [ ] Implementar página de búsqueda de mods
- [ ] Agregar descarga directa de mods
- [ ] Filtros por versión de Minecraft
- [ ] Filtros por loader (Fabric, Forge, Quilt, NeoForge)
- [ ] Soporte para modpacks completos
- [ ] Modo oscuro
- [ ] Traducción al inglés

---

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si encuentras bugs o tienes ideas para nuevas características:

1. Abre un **Issue** en GitHub
2. Haz un **Fork** del proyecto
3. Envía un **Pull Request**

---

## 📚 Recursos

- **Repositorio**: [GitHub](https://github.com/tu-usuario/bryan.js-mod-downloader)
- **Modrinth API**: [Documentación](https://docs.modrinth.com/)
- **SvelteKit**: [Documentación oficial](https://kit.svelte.dev/)
- **Warp AI**: Lee `WARP.md` para trabajar con agentes AI

---

## 👤 Créditos

**Desarrollado por**: Bryan.js  
**Email**: bryanjsypenofender@gmail.com  
**User-Agent**: `ModrinthDowloader/1.0`

---

## 📄 Licencia

Este proyecto está disponible bajo la licencia **MIT**.

---

## 🙏 Agradecimientos

- **Modrinth** por su API pública y bien documentada
- **Svelte Team** por el increíble framework
- **Tailwind CSS** por el sistema de diseño
- **Comunidad de Minecraft** por el apoyo continuo

---

**¡Disfruta gestionando tus mods de Minecraft! 🎮**

Si tienes preguntas o sugerencias, no dudes en contactarme.

---

### Changelog Completo

```
[1.0.0] - 2025-12-18

Added:
- Sistema de gestión de listas de mods
- Identificación automática de mods mediante archivos JAR
- Integración con Modrinth API v2
- Exportación de listas en formato JSON
- Importación de listas JSON
- Interfaz de usuario con diseño pixel art
- Paleta de colores personalizada (main-green)
- Iconos SVG personalizados
- Componentes reutilizables (Input, Button, ModsList, Navbar, Footer)
- Path aliases ($lib, $utils, $components)
- Documentación completa (README.md, WARP.md)
- Soporte para Warp AI

Fixed:
- N/A (primera versión)

Changed:
- N/A (primera versión)

Deprecated:
- N/A (primera versión)

Removed:
- N/A (primera versión)

Security:
- Implementación de hash SHA-1 para identificación segura de archivos
```
