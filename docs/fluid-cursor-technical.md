# Fluid cursor — Technical Documentation

## Overview
`FluidCursor` is a high-performance WebGL-based implementation of a 2D incompressible fluid solver. It simulates realistic liquid-like motion, vorticity, and color diffusion in response to user input (mouse/touch events). This module is designed for interactive UI elements or background visual effects, utilizing GPGPU (General-Purpose computing on Graphics Processing Units) techniques via WebGL shaders to handle fluid physics in real-time.

## Architecture
The module encapsulates the entire simulation lifecycle within a single class. It manages its own WebGL context, framebuffer objects (FBOs), and shader programs.

*   **Data Flow:** Input events (pointers) -> Physics step (Shader kernels) -> Double-buffered textures (FBOs) -> Rendered frame.
*   **Dependencies:** Relies on the browser's WebGL2 or WebGL API. Requires `OES_texture_float_linear` or equivalent extensions for optimal performance.
*   **Context:** Intended to be initialized with a target `<canvas>` element. The class maintains internal state for velocity, density (dye), pressure, and curl.

## Design Principles
*   **GPGPU Pattern:** Uses **Double-Buffering (Ping-Pong FBOs)** to maintain simulation state. One FBO reads from the previous frame's result while the other writes the current update, preventing read/write race conditions.
*   **Shader Modularity:** Logic is partitioned into small, single-purpose GLSL kernels (Advection, Pressure projection, Divergence, etc.).
*   **Configurability:** A `config` object allows decoupling the physical properties of the fluid (e.g., dissipation, curl, pressure iterations) from the implementation logic.
*   **Defensive API Initialization:** Includes a feature-detection layer (`getSupportedFormat`) to fallback gracefully when floating-point texture formats or linear filtering are not supported by the hardware.

## API Reference

### `new FluidCursor(canvas, config)`
Initializes the simulator.
*   **`canvas`**: The HTMLCanvasElement for rendering.
*   **`config`**: Configuration object (e.g., `SIM_RESOLUTION`, `DENSITY_DISSIPATION`, `SPLAT_RADIUS`).

### Key Methods
*   **`step(dt)`**: Executes one cycle of the physics simulation (Curl -> Vorticity -> Divergence -> Pressure -> Advection).
*   **`splat(x, y, dx, dy, color)`**: Injects velocity (`dx`, `dy`) and color into the simulation at a specific coordinate.
*   **`render(target)`**: Draws the current state of the dye texture to the specified target (or null for the main canvas).
*   **`resizeCanvas()`**: Adjusts internal resolution based on device pixel ratio and canvas size.

## Internal Logic
The simulation follows the **Stable Fluids** algorithm:
1.  **Input:** User pointer movement is converted to a "splat" of velocity and color.
2.  **Vorticity Confinement:** Calculated to add small-scale turbulence, preventing the simulation from looking too "viscous" or static.
3.  **Divergence:** Measures how much the velocity field is expanding/contracting at each pixel.
4.  **Pressure Projection:** Solves the Poisson equation iteratively (controlled by `PRESSURE_ITERATIONS`) to ensure the velocity field remains incompressible (divergence-free).
5.  **Advection:** Moves the dye and velocity fields based on the current velocity, using bilinear interpolation to minimize sampling artifacts.

## Data Flow
1.  **External Input:** Event listeners track pointers and calculate `deltaX/Y`.
2.  **Splatting:** `splat()` updates the `velocity` and `dye` textures directly via GPU kernels.
3.  **Solver Loop:** `step()` executes a sequence of 6+ shader programs, piping output from one FBO as input to the next.
4.  **Display:** The `displayShader` samples the `dye` texture, applies an optional shading/normal-mapping effect, and maps the output to the canvas.

## Error Handling & Edge Cases
*   **Resolution Fallback:** If `supportLinearFiltering` is missing, the code automatically reduces resolution and disables shading to ensure the simulator continues to run on constrained hardware.
*   **Unsupported Formats:** The `getSupportedFormat` method recursively probes internal texture formats (`RGBA16F` -> `RGBA`) to ensure compatibility with the GPU driver.
*   **Time Clamping:** `calcDeltaTime` caps the delta time (`dt`) at ~16ms (60 FPS) to prevent "explosion" of the simulation if the browser tab is backgrounded or experiences a frame hitch.

## Usage Example

```javascript
const canvas = document.getElementById('fluid-canvas');

// Initialize with custom properties
const fluid = new FluidCursor(canvas, {
    SIM_RESOLUTION: 256,
    SPLAT_FORCE: 8000,
    SHADING: true
});

// The simulation starts automatically via requestAnimationFrame
// You can manually inject a splat if needed
fluid.splat(0.5, 0.5, 100, 100, { r: 1, g: 0, b: 0 });
```