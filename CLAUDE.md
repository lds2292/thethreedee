# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (Vite, hot reload)
npm run build    # Production build
npm run preview  # Preview production build
```

No test framework is configured.

## Architecture

Vue 3 + Three.js SPA for viewing 3D model files (STL, OBJ, GLTF, GLB) in the browser.
No state management library. Vue Router is defined (`src/router/index.js`) but **not mounted** — routing is handled manually via `window.location.pathname` in `App.vue`.

**Layout structure:**
```
App.vue
├── NotFoundPage       (pathname !== '/')
├── MobileBlock        (isMobile — set once on load, never updated on resize)
└── header (56px)
    main (flex-row)
    ├── content-area (flex:1)
    │   ├── ModelViewer   (when modelFile is loaded)
    │   └── DropZone      (initial state)
    └── ad-sidebar (300px)  ← Google AdSense
```

**Component flow:**
- `App.vue` — root; holds `modelFile` ref. `isMobile` is checked once at page load (not on resize) to avoid unmounting the viewer on PC window resize.
- `DropZone.vue` — drag-and-drop / click-to-browse UI; validates extension and magic bytes, emits `file-loaded` with the raw `File` object. Supports STL, OBJ, GLTF, GLB.
- `ModelViewer.vue` — owns the entire Three.js lifecycle (renderer, scene, camera, OrbitControls). Receives the `File` prop, parses it, renders the model.
- `MobileBlock.vue` — shown when `window.innerWidth < 768` at page load. Tells mobile users to use desktop.
- `src/pages/NotFoundPage.vue` — 404 page shown for any path other than `/`.

**Rendering strategy in ModelViewer:**
- On-demand rendering: the render loop runs via `requestAnimationFrame` but skips frames unless `needsRender` is `true`. `requestRender()` sets the flag; OrbitControls `change` events and post-load trigger it.
- Pixel ratio is capped at 2× to limit GPU load on retina displays.
- Uses `MeshPhongMaterial` (lighter than `MeshStandardMaterial`).
- Shadows are disabled.
- `ResizeObserver` on `canvas.parentElement` handles all layout changes (window resize, ad load, etc.). `onResize()` reads dimensions from the parent container, not the canvas itself (Three.js sets inline styles on canvas which would give stale values).

**File parsing:**
- STL/OBJ/GLTF/GLB files are validated by extension + magic bytes in `DropZone.vue` before loading.
- STL/OBJ are parsed in a dedicated Web Worker (`src/workers/modelParser.worker.js`) to avoid blocking the main thread.
- Binary STL: parsed directly in the worker; typed arrays are transferred (zero-copy) back via `postMessage`.
- ASCII STL: worker detects it and sends the buffer back; main thread falls back to Three.js `STLLoader`.
- OBJ: worker decodes the text and sends it back; main thread uses `OBJLoader`.
- GLTF/GLB: loaded on the main thread via `GLTFLoader`. External HTTP/HTTPS URIs inside GLTF files are blocked via `LoadingManager.setURLModifier`.
- File size limit: 500 MB.

**Model placement:** `centerAndFit()` computes the bounding box, normalizes the model to a ~3-unit scale, and repositions the camera accordingly.

**Routing / 404:**
- `public/_redirects` — Netlify catch-all (`/* /index.html 200`) so all paths serve the SPA.
- `App.vue` checks `window.location.pathname` and renders `<NotFoundPage>` for any path other than `/`.

**AdSense:**
- Publisher ID: `ca-pub-1253318658034453`
- Ad slot: `XXXXXXXXXX` (replace with real slot ID in `App.vue`)
- Placement: right sidebar (300px), `data-ad-format="auto"` — AdSense selects Half Page or Medium Rectangle based on available height.
- AdSense is skipped on mobile (`isMobile` guard in `onMounted`).

**Security:**
- CSP meta tag in `index.html` — AdSense domains whitelisted, `worker-src 'self'`.
- Web Worker loaded from dedicated file (not Blob URL) for CSP compliance.
- GLTF external URI blocking via `LoadingManager`.
- Dev server security headers configured in `vite.config.js`.
