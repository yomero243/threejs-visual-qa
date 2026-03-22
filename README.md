# Three.js Visual QA

[![Playwright](https://img.shields.io/badge/Playwright-E2E_Testing-45ba4b?style=flat-square&logo=playwright&logoColor=white)](https://playwright.dev/)
[![React Three Fiber](https://img.shields.io/badge/R3F-React_Three_Fiber-61DAFB?style=flat-square&logo=react&logoColor=black)](https://docs.pmnd.rs/react-three-fiber)
[![WebGL](https://img.shields.io/badge/WebGL-Canvas_Testing-990000?style=flat-square)](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API)
[![Three.js](https://img.shields.io/badge/Three.js-r180+-black?style=flat-square&logo=threedotjs)](https://threejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-Build-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)

> **Proof of Concept:** Automated Visual QA for React Three Fiber applications using Playwright snapshot testing. Solves the fundamental problem of testing WebGL content that lives inside an opaque `<canvas>` element.

---

## 🔴 The Problem

Standard DOM-based testing tools fail entirely on 3D web apps:

```
DOM Testing (works for normal UIs)         Canvas Testing (this project)
──────────────────────────────────         ──────────────────────────────
<body>                                     <body>
  <div id="app">                             <div id="app">
    <button>Click me</button>  ✅              <canvas>          ← opaque
    <h1>Title</h1>             ✅                ┌─────────────┐
    <input type="text"/>       ✅                │ 3D Scene    │ ✗ no DOM
  </div>                                        │  meshes     │ ✗ no selectors
</body>                                         │  shaders    │ ✗ no aria
                                                │  particles  │ ✗ no a11y tree
                                              └─────────────┘
                                            </canvas>
                                          </div>
                                        </body>

querySelector('#mesh-color') → null ✗   Screenshot diff → pixel delta ✅
getByRole('sphere') → not found ✗       Golden master comparison ✅
expect(scene).toHaveText() → ✗          maxDiffPixelRatio: 0.05 ✅
```

**The canvas is a black box to the DOM.** This project solves it with deterministic rendering + visual snapshot comparison.

---

## 💡 The Solution: Deterministic Rendering

We enforce render consistency through two mechanisms:

**1. Testing Mode via URL parameter**
```
http://localhost:5173/?testing=true&color=red
```
When `testing=true`:
- Animation loops are **frozen** (no frame-to-frame variance)
- Randomized physics are **disabled**
- Camera is **locked** to `(0, 0, 0)` for identical framing

**2. State injection via URL params**
State (color, geometry variant, etc.) is passed as URL parameters — bypassing UI interaction and making every test run deterministic.

---

## 🔁 How Tests Work

```
Playwright Test Runner
        │
        ├─ iterate ['red', 'green', 'blue']
        │
        ├─ navigate → /?testing=true&color=red
        │
        ├─ wait 3000ms  ← textures, shaders, fonts fully loaded
        │
        ├─ screenshot → daily-check-red.png
        │
        └─ compare vs golden master
              maxDiffPixelRatio: 0.05
              if diff > 5% → FAIL (visual regression detected)
```

Test file: `tests/visual.spec.ts`
Golden masters: `tests/visual.spec.ts-snapshots/`

---

## 📦 Use Cases

### CI/CD Pipelines
Run visual regression tests on every PR — catch unintended shader changes, material breakage, or geometry regressions before they ship.

### 3D Design Systems
Validate that your 3D component library renders consistently across versions. A design token change that breaks a material gets caught automatically.

### WebGL Regression Testing
When upgrading Three.js versions, run the snapshot suite to detect any rendering differences introduced by the new renderer.

### Automated Daily Checks
Schedule the test suite to run nightly against production — detect WebGPU/driver-induced visual drift over time.

---

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| 3D Engine | Three.js + React Three Fiber |
| Testing | Playwright (screenshot comparison) |
| Frontend | React 19 + TypeScript |
| Build | Vite |
| Test Strategy | Deterministic rendering + golden master |

---

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
npx playwright install
```

### 2. Run the dev server
```bash
npm run dev
```

Verify test mode manually: `http://localhost:5173/?testing=true&color=blue`

### 3. Run visual tests
```bash
npx playwright test
```

### 4. Update golden masters (after intentional design changes)
```bash
npx playwright test --update-snapshots
```

---

## 📁 Structure

```
threejs-visual-qa/
├── src/
│   ├── Experience.tsx     # 3D scene (handles testing= param)
│   └── main.tsx
├── tests/
│   ├── visual.spec.ts     # Playwright snapshot test suite
│   └── visual.spec.ts-snapshots/  # Golden master images
└── vite.config.ts
```

---

## 🔑 Key Implementation: `Experience.tsx`

```tsx
// Testing mode disables non-determinism
const isTesting = new URLSearchParams(window.location.search).get('testing') === 'true'
const color = new URLSearchParams(window.location.search).get('color') ?? 'white'

useFrame((state, delta) => {
  if (isTesting) return  // ← freeze animation
  // ... normal animation loop
})
```

---

## 👨‍💻 About

Built by **Gabriel** — Creative 3D Developer & Technical Artist with a focus on production-quality Three.js/R3F applications, including testing infrastructure for complex WebGL scenes.

> 💼 **Available for freelance** — 3D web apps, WebGL/WebGPU rendering, testing infrastructure for creative codebases, and frontend engineering. [Let's connect →](https://github.com/yomero243)
