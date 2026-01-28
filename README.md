# Three.js Visual QA

This repository serves as a Proof of Concept (PoC) for implementing automated **Visual Quality Assurance (QA)** in 3D applications built with **React Three Fiber**.

It addresses the specific challenge of validating WebGL contexts—where traditional DOM selectors are ineffective—by utilizing deterministic snapshot testing.

## Technologies Used

The project employs a modern stack optimized for performance and testing:

- **Core:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **3D Engine:** [Three.js](https://threejs.org/) with [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber).
- **Build Tool:** [Vite](https://vitejs.dev/) (for rapid HMR).
- **E2E Testing:** [Playwright](https://playwright.dev/) (for browser automation and screenshot comparison).

## Methodology: The Challenge of 3D QA

Testing 3D applications is inherently complex due to two main factors:

1. **Canvas Opacity:** Content is rendered within a `<canvas>` element, lacking the internal HTML structure (e.g., `<div>`, `<button>`) required by standard DOM-based testing tools.
2. **Non-Determinism:** Continuous animation loops result in frame-by-frame rendering variances, rendering direct visual comparison impossible without strict control.

### Our Solution: Deterministic Rendering

We implement a strategy to enforce render consistency:

1. **Testing Mode (`testing=true`):** The application accepts URL parameters to freeze the experience state.
    - In `src/Experience.tsx`, the presence of the testing flag halts animation loops and disables randomized physics.
    - The camera and subject entities are locked to fixed coordinates (0,0,0) to ensure identical framing across test runs.

2. **State Injection:** Variable states (such as color configuration) are injected directly via URL parameters (e.g., `?color=red`), bypassing UI interaction requirements.

## Playwright and the "Daily Check" Strategy

We utilize Playwright to execute an automated visual verification workflow, simulating a daily consistency check of the application's graphical output.

### The Test Cycle

The test suite (`tests/visual.spec.ts`) executes the following logic:

1. **Variant Iteration:** It iterates through a predefined array of critical test cases: `['red', 'green', 'blue']`.
2. **Parameterized Navigation:**
    - Playwright initiates the browser and navigates to: `/?testing=true&color=red` (repeating for green and blue).
    - This forces the 3D scene to render the specific state in a static, predictable manner.
3. **Load Stabilization:** A safety timeout (3000ms) is observed to guarantee the full loading of 3D fonts, shaders, and textures.
4. **Snapshot Comparison:** A screenshot is captured and compared against the "Golden Master" (baseline image).
    - Filename format: `daily-check-red.png`, `daily-check-green.png`, etc.
    - **Threshold:** If the pixel difference exceeds *5% (maxDiffPixelRatio)*, the test fails, signaling a visual regression.

---

## Installation and Usage

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Environment

To view the application with standard animations and physics:

```bash
npm run dev
```

To manually verify the "test mode" in your browser, visit:
`http://localhost:5173/?testing=true&color=blue`

### 3. Run Visual Tests

This command executes Playwright, generates the snapshots, and performs the comparison:

```bash
npx playwright test
```

If this is the initial run, or if intentional design changes have been made, generate new baseline images with:

```bash
npx playwright test --update-snapshots
```
