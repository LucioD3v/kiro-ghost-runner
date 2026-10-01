---
inclusion: always
---

# Kiro's Ghost Runner — Project Overview

## What is this?

A dependency-free HTML5 Canvas runner game built for the **Kiro University Challenge 2026**.
The player pilots Kiro's official ghost mascot through a cloud environment, dodging
developer-themed obstacles and collecting Kiro Credits. Built entirely with Kiro as
the primary development tool.

**Author:** Vicente Guzman (@LucioD3v)
**Challenge:** Kiro University Challenge — Final Submission
**Deadline:** October 5, 2026 at 23:59 PT

---

## Project Goals

- Build a functional, polished mini-game demonstrating all 7 Kiro University lessons
- Use Kiro's full feature set: Vibe mode, Specs, Steering, Hooks, Agents, MCP
- Zero external dependencies — pure HTML5/CSS3/JS so the project runs anywhere
- Showcase smooth 60 FPS canvas gameplay with physics, collisions, and particles

---

## Stack

| Layer | Technology |
|-------|------------|
| Rendering | HTML5 Canvas 2D API |
| Logic | Vanilla JavaScript (ES6+, no bundler) |
| Styles | Pure CSS3 (no framework) |
| Sprite | Official Kiro ghost PNG (`assets/kiro-ghost.png`) |
| Persistence | `localStorage` (high score only) |
| Server | None required — open `index.html` directly |

---

## File Structure

```
kiro-ghost-runner/
├── index.html                        # Entry: canvas + HUD + overlay screens
├── style.css                         # Dark space theme, neon accents
├── game.js                           # Complete game engine (~800 lines)
├── assets/
│   └── kiro-ghost.png                # Official Kiro mascot sprite
├── README.md                         # Public docs + lesson writeup
└── .kiro/
    ├── hooks/
    │   ├── validate-on-save.json     # PostFileSave → JS syntax check
    │   ├── canvas-code-review.json   # PostFileSave → agent code review
    │   ├── session-context.json      # SessionStart → project briefing
    │   └── guard-source-files.json   # PreToolUse  → write scope guard
    └── steering/
        ├── project-overview.md       ← this file
        ├── architecture.md           # Engine design & component breakdown
        ├── gameplay-design.md        # Mechanics, scoring, balance values
        └── lessons.md                # 7-lesson mapping for challenge judges
```

---

## Kiro Features Used in This Project

| Feature | Where |
|---------|-------|
| Vibe Mode | Full project scaffolding and iterative refinement |
| Spec | `architecture.md`, `gameplay-design.md` produced from spec sessions |
| Steering | All 4 `.kiro/steering/` files with `inclusion: always` |
| Hooks | 4 hooks in `.kiro/hooks/` covering PostFileSave, SessionStart, PreToolUse |
| Custom Agents | `canvas-code-review` and `session-context` hooks use agent action type |
| Multi-Surface | IDE (development) + CLI (local server) + Web (visual feedback) |
| MCP | Canvas 2D API documentation queried during Vibe sessions |

---

## Running Locally

Open `index.html` directly in any modern browser — no build step required.

For a local dev server:
```bash
python -m http.server 8080
# open http://localhost:8080
```

---

## Coding Conventions (for Kiro sessions)

- **No external dependencies** — vanilla JS/CSS only
- **ES6+** — use `const`/`let`, arrow functions, template literals
- **Canvas state** — always wrap draw calls in `ctx.save()` / `ctx.restore()`
- **Comment style** — use `// ─── Section ───` banners for major sections
- **Entity pattern** — update logic separate from draw logic
- **No allocations in render loop** — create objects outside `gameLoop()`
