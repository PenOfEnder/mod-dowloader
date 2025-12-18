# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview
**Bryan.js's Mod Downloader** is a SvelteKit web application for managing and downloading Minecraft mods from Modrinth. The app allows users to list mods, identify mods from JAR files using SHA-1 hashing, and export/import mod lists as JSON.

## Technology Stack
- **Framework**: SvelteKit 2.x with Svelte 5.x
- **Styling**: Tailwind CSS 4.x (using new `@theme` syntax)
- **Build Tool**: Vite 7.x
- **Language**: JavaScript (no TypeScript, `checkJs` is disabled)

## Development Commands

### Start Development Server
```sh
npm run dev
```
Opens dev server at http://localhost:5173 (default Vite port)

### Build for Production
```sh
npm run build
```

### Preview Production Build
```sh
npm run preview
```

### Sync SvelteKit Files
```sh
npm run prepare
```
Runs `svelte-kit sync` to generate types and update `.svelte-kit` directory

## Code Architecture

### Path Aliases
Defined in `svelte.config.js`:
- `$lib` → `src/lib` (SvelteKit default)
- `$utils` → `src/utils`
- `$components` → `src/components`

### Directory Structure
```
src/
├── lib/
│   ├── assets/          # Static assets (favicon, images)
│   ├── components/
│   │   ├── files/       # Input, button, mods_list components
│   │   └── ui/          # Navbar, footer components
│   └── svg_icons/       # SVG icon components (trash, download, search, etc.)
├── routes/              # SvelteKit file-based routing
│   ├── +layout.svelte   # Root layout with global CSS
│   ├── +page.svelte     # Home page (navigation hub)
│   ├── list/            # Mod list management page
│   ├── download/        # Download page (not implemented)
│   ├── search/          # Search page (not implemented)
│   └── utils/svelte/identify-mod/
│       └── +server.js   # Server endpoint for Modrinth API
└── utils/               # Shared utilities
    ├── default_list.js  # Template mod list
    └── mod_template.js  # Mod object template
```

### Key Features

#### 1. Mod Identification via JAR Files
- **Location**: `src/routes/list/+page.svelte` (lines 76-133)
- **Flow**: 
  1. User uploads `.jar` file
  2. Client computes SHA-1 hash from file ArrayBuffer
  3. Sends hash to `/utils/svelte/identify-mod` endpoint
  4. Server queries Modrinth API to identify mod by hash
  5. Retrieves project info and adds to mod list

#### 2. Modrinth API Integration
- **Server Route**: `src/routes/utils/svelte/identify-mod/+server.js`
- **User-Agent**: `ModrinthDowloader/1.0 (bryanjsypenofender@gmail.com)`
- **Endpoints Used**:
  - `POST /v2/version_files` - Identify mod version by SHA-1 hash
  - `GET /v2/project/{id}` - Get project details

#### 3. Mod Data Structure
Defined in `src/utils/mod_template.js`:
```js
{
  "project_id": "undefinied",  // Note: typo in source
  "name": "Template mod",
  "loaders": {
    "fabric": "",
    "forge": "",
    "quilt": "",
    "neoforge": ""
  }
}
```

#### 4. Export/Import Functionality
- **Export**: Saves mod list as JSON file (lines 26-41 in list/+page.svelte)
- **Import**: Reads JSON file and merges with existing mods (lines 43-61)

### Styling System
- **Custom Theme**: Defined in `src/routes/layout.css` using Tailwind's `@theme` directive
- **Color Palette**: `main-green-*` (50-950) custom color scale
- **Font**: "Pixelify Sans" from Google Fonts (pixel-style font)
- **VS Code**: CSS files are associated with `tailwindcss` language mode

## Important Patterns

### Svelte 5 Syntax
This project uses Svelte 5's runes syntax:
- `$props()` for component props (see `+layout.svelte`)
- State management uses `let` with reactive assignments (`mods = mods`)

### File Input Handling
When handling file inputs, always clear the buffer after processing:
```js
selectedFile = null;
if (e && e.target) {
  e.target.value = "";
}
```

### Modrinth API Requirements
- Always include `User-Agent` header with contact email
- Use SHA-1 algorithm for file hashing
- Project ID is required for mod identification

## Project Language
The UI is in **Spanish** - maintain Spanish for all user-facing text, alerts, and messages.

## Known Issues
- Typo in `mod_template.js`: `"undefinied"` should be `"undefined"` (line 2)
- `/download` and `/search` routes are not implemented (empty files)
