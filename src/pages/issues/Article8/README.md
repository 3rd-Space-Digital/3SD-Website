# Article 8: scroll-driven 3D scene

This package is a self-contained React Three Fiber scene for Article 8. The visitor scrolls through a tall page section, and the camera follows a path that was keyframed in Blender: down a hallway, into a room, and onto pages of text on the floor. All lighting is baked into the textures.

This README is written for the agent or developer integrating the package into the host website. Read all of it before wiring things up; the "Integration constraints" section in particular lists things that will silently break the scene.

## Contents

```
article 8/
  README.md                 this file
  article8/                 the scene source, drop into the host app's source tree
    index.js                public exports
    Article8Scene.jsx       top-level component (scroll section + pinned canvas)
    Experience.jsx          loads the model, converts baked materials, picks scroll vs. debug camera
    ScrollCamera.jsx        maps scroll progress to the Blender camera animation
    cameraPath.js           all scroll-feel tuning (speed segments, mobile camera lift)
    article8.css            scoped styles for the scroll section (imported by Article8Scene.jsx)
  model/
    pulsethreeJS.glb        optimized model (5.3 MB): geometry, all baked textures (WebP), camera + animation
  tools/                    optional: rebuild the .glb from a new Blender export
    optimize-model.mjs
    inspect-model.mjs
```

## Dependencies

Runtime (install in the host app):

| Package | Version tested |
|---|---|
| `react`, `react-dom` | 19.3.0 |
| `three` | 0.186.1 |
| `@react-three/fiber` | 9.8.1 |
| `@react-three/drei` | 10.7.9 |
| `leva` | 0.10.1 |

```bash
npm install three@^0.186.1 @react-three/fiber@^9.8.1 @react-three/drei@^10.7.9 leva@^0.10.1
```

Notes:

- `@react-three/fiber` 9 requires React 19. If the host is on React 18, it needs `@react-three/fiber` 8 and `@react-three/drei` 9, which has not been tested with this scene.
- The scene uses Three.js's `WebGPURenderer` (imported from `three/webgpu`). It falls back to WebGL 2 automatically on browsers without WebGPU, so no extra handling is needed, but `three` must be a version that ships `three/webgpu` (r171 or newer; 0.186 tested).
- `leva` provides a hidden tuning panel used during development (see `debug` below). It must be installed even though the panel is hidden in production.

Tooling for `tools/` only (dev dependencies, not needed at runtime):

```bash
npm install -D @gltf-transform/core@^4.5.1 @gltf-transform/extensions@^4.5.1 @gltf-transform/functions@^4.5.1 sharp@^0.35.5 meshoptimizer@^1.3.0
```

## Hosting the model (Supabase Storage)

The `.glb` is the only asset. All textures are embedded inside it, so there are no separate image files to host.

1. Create a **public** bucket in Supabase Storage (e.g. `article-8`). Public buckets send permissive CORS headers, so the site can fetch from them without extra configuration.
2. Upload `model/pulsethreeJS.glb` under a **versioned filename**, e.g. `pulsethreeJS-v1.glb`. Supabase serves files through a caching CDN; overwriting the same filename can leave visitors on a stale copy. Each new export should get a new name (`-v2`, `-v3`, ...).
3. Because filenames are versioned, upload with a long cache time, e.g. `cacheControl: "31536000"` via the Supabase client, or the equivalent dashboard setting.
4. Copy the public URL, which looks like `https://<project-ref>.supabase.co/storage/v1/object/public/article-8/pulsethreeJS-v1.glb`.
5. Put it in the host's environment config rather than hard-coding it, e.g. `NEXT_PUBLIC_ARTICLE8_MODEL_URL` (Next.js) or `VITE_ARTICLE8_MODEL_URL` (Vite).

Each first-time visitor downloads about 5.3 MB, so watch Supabase egress on the free plan.

## Usage

```jsx
import { Article8Scene, preloadArticle8Model } from "./article8";

const modelUrl = process.env.NEXT_PUBLIC_ARTICLE8_MODEL_URL; // or import.meta.env.VITE_ARTICLE8_MODEL_URL

// Optional: start downloading the model as soon as this module loads.
preloadArticle8Model(modelUrl);

export default function Article8Page() {
  return (
    <article>
      {/* ...intro content... */}
      <Article8Scene modelUrl={modelUrl} />
      {/* ...content after the scene... */}
    </article>
  );
}
```

### Props

| Prop | Default | Description |
|---|---|---|
| `modelUrl` | required | URL of the `.glb` (the Supabase public URL). |
| `pages` | `22.8` | Scroll length in screen heights. Higher means slower scrolling overall. The speed segments in `cameraPath.js` are calibrated to 22.8; see "Tuning". |
| `debug` | `false` | Shows the Leva tuning panel. Useful pattern: `debug={location.hash === "#debug"}`. |
| `className` | none | Extra class on the outer `<section>`. |

### Next.js (App Router)

The scene touches `window` and WebGL/WebGPU, so it must render on the client only:

```jsx
// app/articles/8/Article8Client.jsx
"use client";
import dynamic from "next/dynamic";

const Article8Scene = dynamic(
  () => import("@/components/article8").then((m) => m.Article8Scene),
  { ssr: false },
);

export default function Article8Client() {
  return <Article8Scene modelUrl={process.env.NEXT_PUBLIC_ARTICLE8_MODEL_URL} />;
}
```

Also add `"use client";` to the top of `article8/Article8Scene.jsx` if the host's lint rules require it. If the host's Next config restricts global CSS imports, move the contents of `article8.css` into the host's global stylesheet and remove the `import "./article8.css"` line; the class names are already prefixed with `article8-`.

### Vite / plain React

Import and render as in the usage example. No extra setup is needed.

## Integration constraints (read these)

The scroll mechanism is a tall `<section>` (`pages` × viewport height) containing a `position: sticky` canvas. Each frame, `ScrollCamera.jsx` reads the section's position with `getBoundingClientRect()` and converts it to animation progress: 0 when the section's top reaches the top of the viewport, 1 when its bottom reaches the bottom. Consequences:

1. **No `overflow: hidden | auto | scroll` on any ancestor** of `<Article8Scene>`. Any of these breaks `position: sticky`, and the canvas scrolls away instead of staying pinned. `overflow: clip` is safe.
2. **The page must scroll on the window/document**, not inside a nested scroll container. Progress is computed against `window.innerHeight`. If the host layout scrolls inside a full-height `div`, the scene needs to be placed outside it, or `sectionProgress` in `ScrollCamera.jsx` must be changed to use that container's height.
3. **Full width, no horizontal padding** on the direct parent is recommended. The camera framing assumes the canvas spans the viewport.
4. **Sticky headers:** a fixed or sticky site header will cover the top of the canvas. Either hide the header while the scene is in view, or change `top: 0` and the `height` values in `article8.css` to account for the header height.
5. **One instance per page.** The Leva store and the camera path state are global.
6. **Do not replace the scroll mechanism with drei's `ScrollControls`.** It was used originally and got stuck on mobile after orientation changes and address-bar resizes. The current native-scroll approach was built to fix that.
7. **React StrictMode is fine.** The animation setup is written to survive StrictMode's double-invoked effects.

### Optional site-level CSS

The standalone version of this scene applied these globally. They are not in `article8.css` because they affect the entire host site; apply them only if the host wants them on the article page:

```css
html {
  overscroll-behavior-y: none; /* stops iOS rubber-band bounce at the page ends */
  scrollbar-width: none;       /* hides the page scrollbar (Firefox, modern Chrome/Safari) */
}
html::-webkit-scrollbar {
  display: none;               /* hides the page scrollbar (older WebKit) */
}
```

The page also needs the standard mobile viewport tag, which most sites already have:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

## Tuning

All scroll-feel settings live in `article8/cameraPath.js`. Frame numbers match the Blender timeline (the clip runs frames 1 to 250 at 24 fps).

- **`STOPS`** maps scroll progress (0 to 1) to animation frames. Currently frames 0 to 184 scroll at normal speed, and 184 to 250 take twice as much scroll per frame. The scroll values are computed as fractions of "scroll units": 184 units for the first segment plus 66 frames × 2 = 132 for the second, 316 total. To change it, keep the same pattern and adjust `pages` so the overall speed stays right. For example, adding an extra hold or slowdown adds units, so raise `pages` proportionally.
- **`PORTRAIT_END_PULLBACK`** pulls the camera back on portrait (phone) screens over the final frames, so the pages on the floor fit the narrow screen. `distance` is how far it lifts (1.4 tested on iPhone-sized screens), `fullFrame` is where it reaches full strength (199), and `rampFrames` is how long it fades in (15). It does not apply on landscape or desktop screens.
- **Debug panel** (`debug` prop): `pages`, `smoothing` (how quickly the camera catches up to the scroll position), `fps`, `scrub` + `frame` (drag through the path to find frame numbers), `phone end lift`, and `free look` (orbit camera instead of the path).

## Updating the model from Blender

1. In Blender, export glTF 2.0 with **Format: glTF Separate**, **Include → Cameras** on, **Punctual Lights** off, **Animation** on with **Always Sample Animations** checked. Select all meshes plus the camera and use **Limit to Selected**.
2. Run the optimizer (from the folder containing `tools/`, with the dev dependencies installed):
   ```bash
   node tools/optimize-model.mjs path/to/pulsethreeJS.gltf model/pulsethreeJS.glb
   ```
   It converts the baked PNGs to WebP (walls, floor and pages at 4096 px / quality 95, everything else at 2048 px / quality 90), compresses the geometry with meshopt, and removes unused UV maps. The resolution groups are set by `HERO_TEXTURES` at the top of the script.
3. Check the result: `node tools/inspect-model.mjs model/pulsethreeJS.glb` should list one camera, one `CameraAction` animation, and 14 textures.
4. Upload the new `.glb` to Supabase under a new versioned name and update the environment variable.

## Implementation notes

- **Materials:** every mesh's material is replaced with an unlit `MeshBasicNodeMaterial` that shows only the baked texture, since the lighting is already in the bakes. There are no lights in the scene.
- **UV maps:** Three.js's glTF loader only reads the first four UV maps. Blender bakes sometimes land on a later map, which renders as a blank surface. `Experience.jsx` moves each mesh's bake UV map into the primary slot at load time. The optimizer also removes unused maps, so current models don't depend on this, but it guards against future exports.
- **Camera:** the Blender camera animation is played through an `AnimationMixer` that stays paused; scroll progress sets its time directly. The Blender camera's transform and field of view are then copied onto the R3F camera every frame.
- **Loading:** there is no loading indicator; the canvas is black until the model downloads. If the host wants one, wrap `<Article8Scene>` in its own UI, or add a drei `useProgress`-based overlay.
