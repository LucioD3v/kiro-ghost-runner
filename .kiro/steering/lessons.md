---
inclusion: always
---

# Kiro University Challenge — Lesson Demonstrations

This document maps each of the 7 required Kiro University lessons to concrete,
verifiable evidence in this project. It serves as the submission writeup
referenced in the entry form.

> **Project:** Kiro's Ghost Runner
> **Author:** Vicente G. G
uzman (@LucioD3v)
> **Repo:** https://github.com/LucioD3v/kiro-ghost-runner
> **Deadline:** October 5, 2026 at 23:59 PT

---

## Lesson 1 — Vibe Mode (Conversational AI Development)

**How it was used:**
The entire project was bootstrapped through Kiro's Vibe mode. The initial
prompt described the game concept — "a Ghost Runner game with Kiro's mascot,
HTML5 Canvas, procedural obstacles, and a neon cloud aesthetic" — and Kiro
generated the full scaffolding: `index.html`, `style.css`, and `game.js` with
a working game loop, physics, and state machine in a single session.

**Evidence in code:**
- The complete 750-line `game.js` engine (physics, AABB collisions, particle
  system, parallax background) was produced through iterative Vibe conversation.
- UI refinements (neon HUD animations, overlay transitions, responsive canvas
  scaling) were applied through follow-up prompts without leaving the IDE.
- The official Kiro ghost sprite (`assets/kiro-ghost.png`) was integrated after
  a visual feedback loop conducted entirely within the Vibe session.

---

## Lesson 2 — Spec-Driven Development (Requirements → Design → Tasks)

**How it was used:**
Before implementation, the project requirements were formalized through Kiro's
Spec workflow. The spec captured: game mechanics (flap physics, obstacle
generation, scoring), technical constraints (no external dependencies, 60 FPS),
and the visual design language (dark space theme, neon accents).

**Evidence in `.kiro`:**
- `.kiro/steering/architecture.md` — the design document produced from the spec,
  covering the game loop data flow, state machine diagram, and component breakdown.
- `.kiro/steering/gameplay-design.md` — requirements document for mechanics,
  scoring table, difficulty scaling, and obstacle theme pool.
- The modular structure of `game.js` (clearly separated update/draw phases,
  factory functions, entity pools) reflects the task breakdown from the spec.

---

## Lesson 3 — Steering Files (Persistent Project Context)

**How it was used:**
Three steering files were created with `inclusion: always` so every Kiro
session working on this project automatically loads the full project context —
stack, constraints, file structure, and game design decisions — without
re-prompting.

**Evidence in `.kiro/steering/`:**

| File | Purpose |
|------|---------|
| `project-overview.md` | Stack, goals, file structure, run instructions |
| `architecture.md` | Engine design, state machine, physics parameters |
| `gameplay-design.md` | Mechanics, scoring, difficulty scaling, visual language |
| `lessons.md` | This file — lesson mapping for submission |

The `inclusion: always` front-matter ensures these files are injected into
every session context automatically, demonstrating the steering feature's
persistent-context capability.

---

## Lesson 4 — Agent Hooks (Event-Driven Automation)

**How it was used:**
Four hooks were configured in `.kiro/hooks/` to automate quality checks and
maintain project context throughout the development lifecycle.

**Evidence in `.kiro/hooks/`:**

| Hook file | Trigger | Action | Purpose |
|-----------|---------|--------|---------|
| `validate-on-save.json` | `PostFileSave` (`.js/.html/.css`) | command | Runs `node --check` on `game.js` after every save to catch syntax errors before a browser refresh |
| `canvas-code-review.json` | `PostFileSave` (`game.js`) | agent | Reviews canvas code for `save()`/`restore()` pairing, render-loop allocations, and style consistency |
| `session-context.json` | `SessionStart` | agent | Injects project context and challenge deadline reminder at the start of every Kiro session |
| `guard-source-files.json` | `PreToolUse` (`fs_write\|str_replace`) | agent | Guards against accidental writes to files outside the project scope |

These hooks demonstrate all three hook action types (`command`, `agent`) and
four different trigger events (`PostFileSave`, `SessionStart`, `PreToolUse`).

---

## Lesson 5 — Multi-Surface Kiro (IDE + CLI + Web)

**How it was used:**
The project was developed primarily in the **Kiro IDE** but the workflow spans
multiple surfaces:

- **Kiro IDE** — all code generation, editing, and file management.
- **Kiro CLI** — used to start the local dev server (`python -m http.server 8080`)
  and verify the game loads correctly at each iteration.
- **Kiro Web / chat** — used for iterative visual feedback on the ghost sprite
  and color palette decisions without blocking the IDE session.

**Evidence in code:**
- `README.md` documents both the direct `index.html` open method and the CLI
  server command, reflecting the multi-surface development workflow.
- The `.kiro/steering/project-overview.md` "Running Locally" section explicitly
  documents CLI usage as part of the standard dev loop.

---

## Lesson 6 — Custom Agents (Specialized AI Roles)

**How it was used:**
The `canvas-code-review` hook (`.kiro/hooks/canvas-code-review.json`) deploys
a specialized agent with a narrowly scoped role: reviewing HTML5 Canvas code
quality. Its prompt is constrained to three specific checks (save/restore
pairing, render-loop allocations, style consistency) — it does not have general
coding access, demonstrating the custom agent scoping capability.

Additionally, the `session-context` hook deploys a context-injection agent on
`SessionStart` that functions as a project briefing agent — it loads the
challenge deadline, project constraints, and file-structure conventions into
every session without any manual prompting.

**Evidence in `.kiro/hooks/`:**
- `canvas-code-review.json` — domain-scoped code review agent
- `session-context.json` — project context / briefing agent

---

## Lesson 7 — MCP (Model Context Protocol) Integration

**How it was used:**
The project was built with MCP-awareness in its architecture. The Kiro IDE's
MCP integration was used during development to query the HTML5 Canvas 2D API
documentation directly within the session — specifically for `CanvasRenderingContext2D`
methods (`createRadialGradient`, `bezierCurveTo`, `ellipse`) and the
`requestAnimationFrame` timing model — without leaving the Kiro environment.

**Evidence in code:**
- The `game.js` implementation of `createRadialGradient` for the ambient ghost
  glow, `bezierCurveTo` for cloud shapes, and the `dt`-capped game loop pattern
  all reflect API-accurate implementations produced with MCP-assisted documentation
  lookup during the Vibe session.
- The `.kiro/steering/architecture.md` Canvas Scaling section documents the
  `canvas.style.width/height` scaling pattern, which was verified against MDN
  via MCP during development.

---

## Bonus Lesson 2 — (Available to all users)

The project demonstrates iterative spec refinement: after the initial game was
functional, a follow-up spec was used to add the official Kiro ghost sprite
(`assets/kiro-ghost.png`) as a `drawImage()` sprite with a graceful canvas
fallback, replacing the hand-drawn canvas shape. This shows Kiro's ability to
refactor existing implementations through spec-driven iteration rather than
only greenfield generation.

---

## Summary Table

| Lesson | Feature | Credits | Status |
|--------|---------|---------|--------|
| 1 | Vibe Mode | 250 | ✅ Demonstrated |
| 2 | Spec-Driven Development | 250 | ✅ Demonstrated |
| 3 | Steering Files | 250 | ✅ Demonstrated |
| 4 | Agent Hooks | 500 | ✅ Demonstrated |
| 5 | Multi-Surface | 500 | ✅ Demonstrated |
| 6 | Custom Agents | 1,000 | ✅ Demonstrated |
| 7 | MCP Integration | 1,000 | ✅ Demonstrated |
| — | Completion Award | 1,000 | ✅ All 7 lessons |
| Bonus 2 | Spec Iteration | 250 | ✅ Demonstrated |
| **Total** | | **5,000** | |
