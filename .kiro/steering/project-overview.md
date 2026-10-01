---
inclusion: always
---

# Kiro's Ghost Runner — Project Overview

## What is this?

A self-contained HTML5 Canvas mini-game built for the **Kiro University Challenge**.
The player controls a ghost character that must fly through procedurally generated
obstacles while collecting "Kiro Credits" for points.

## Project Goals

- Demonstrate a clean, dependency-free frontend game architecture
- Showcase smooth 60 FPS gameplay on canvas with proper physics and collision detection
- Serve as a reference project for the Kiro University community

## Stack

| Layer      | Technology                            |
|------------|---------------------------------------|
| Rendering  | HTML5 Canvas 2D API                   |
| Logic      | Vanilla JavaScript (ES6+, no bundler) |
| Styles     | Pure CSS3 (no framework)              |
| Persistence| `localStorage` (high score only)      |
| Server     | None required — open `index.html`     |

## File Structure

```
kiro-ghost-runner/
├── index.html          # Entry point: canvas + overlay screens + HUD
├── style.css           # Full UI theme (dark space/cloud, neon accents)
├── game.js             # Complete game engine
├── README.md           # Public documentation
└── .kiro/
    └── steering/
        ├── project-overview.md   ← this file
        ├── architecture.md       # Engine design & component breakdown
        └── gameplay-design.md    # Mechanics, balance values, design intent
```

## Running Locally

Open `index.html` directly in any modern browser — no build step or server required.

For a local dev server (optional, for cleaner URL):
```bash
npx serve .
# or
python -m http.server 8080
```

Then visit `http://localhost:8080`.
