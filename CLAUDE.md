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

Vue 3 + Three.js SPA for viewing 3D model files (STL, OBJ) in the browser. No router, no state management library.

**Component flow:**
- `App.vue` — root; holds `modelFile` ref. Shows `DropZone` when no file is loaded, switches to `ModelViewer` once a file is selected.
- `DropZone.vue` — drag-and-drop / click-to-browse UI; validates extension (`.stl`, `.obj`) and emits `file-loaded` with the raw `File` object.
- `ModelViewer.vue` — owns the entire Three.js lifecycle (renderer, scene, camera, OrbitControls). Receives the `File` prop, parses it, renders the model.

**Rendering strategy in ModelViewer:**
- On-demand rendering: the render loop runs via `requestAnimationFrame` but skips frames unless `needsRender` is `true`. `requestRender()` sets the flag; OrbitControls `change` events and post-load trigger it.
- Pixel ratio is capped at 2× to limit GPU load on retina displays.
- Uses `MeshPhongMaterial` (lighter than `MeshStandardMaterial`).
- Shadows are disabled.

**File parsing:**
- STL/OBJ files are parsed in an inline Web Worker (created from a Blob URL) to avoid blocking the main thread.
- Binary STL: parsed directly in the worker; typed arrays are transferred (zero-copy) back via `postMessage`.
- ASCII STL: worker detects it and sends the buffer back; main thread falls back to Three.js `STLLoader`.
- OBJ: worker decodes the text and sends it back; main thread uses `OBJLoader`.

**Model placement:** `centerAndFit()` computes the bounding box, normalizes the model to a ~3-unit scale, and repositions the camera accordingly.