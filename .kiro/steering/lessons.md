---
inclusion: always
---

# Kiro University Challenge — Lesson Demonstrations

This document maps each of the 7 required Kiro University lessons to concrete,
verifiable evidence in this project. It serves as the submission writeup
referenced in the entry form.

> **Project:** Kiro's Ghost Runner
> **Author:** Vicente Guzman (@LucioD3v)
> **Repo:** https://github.com/LucioD3v/kiro-ghost-runner
> **Deadline:** October 5, 2026 at 23:59 PT

---

## Lesson 1 — Vibe Mode (Conversational AI Development)

**How it was used:**
The entire project was bootstrapped through Kiro's Vibe mode. A single conversational
prompt ("build a Ghost Runner game with Kiro's mascot, HTML5 Canvas, procedural
obstacles, and a neon cloud aesthetic") generated the full working scaffold.
Subsequent iterations — sprite integration, physics tuning, HUD animations, CSS
theme — were all done through follow-up Vibe prompts without leaving the IDE.

**Evidence in code:**
- The complete `game.js` engine (physics, AABB collisions, particle system,
  parallax background, state machine) was produced through iterative Vibe conversation
- UI refinements (neon HUD animations, overlay transitions, responsive canvas
  scaling) were applied through follow-up prompts
- The official Kiro ghost sprite (`assets/kiro-ghost.png`) was integrated after
  a visual feedback loop conducted entirely within the Vibe session

---

## Lesson 2 — Spec-Driven Development (Requirements → Design → Tasks)

**How it was used:**
Before implementation the project was formally specified through Kiro's Spec
workflow, producing three structured documents that guided the full build.

**Evidence in `.kiro/specs/ghost-runner-core/`:**

| File | Content |
|------|---------|
| `requirements.md` | EARS-notation requirements: FR1–FR7 (player, obstacles, credits, scoring, states, collisions, visual) + NFR1–NFR4 (performance, compatibility, accessibility, persistence) |
| `design.md` | Full architecture diagram, physics model, state machine, collision algorithm, procedural generation design, difficulty curve table, rendering pipeline, canvas scaling formula, data structures, error handling matrix |
| `tasks.md` | 8 implementation waves with 29 discrete tasks, all marked complete — including the .kiro configuration wave |

The modular structure of `game.js` (separated update/draw phases, factory
functions, entity pools) directly reflects the task breakdown from the spec.

---

## Lesson 3 — Steering Files (Persistent Project Context)

**How it was used:**
Four steering files with `inclusion: always` ensure every Kiro session
automatically loads the full project context — stack constraints, physics
parameters, design decisions, and lesson evidence — without re-prompting.

**Evidence in `.kiro/steering/`:**

| File | Purpose |
|------|---------|
| `project-overview.md` | Stack, goals, complete file structure, Kiro features table, coding conventions |
| `architecture.md` | Engine design, state machine diagram, physics parameters, rendering pipeline |
| `gameplay-design.md` | Mechanics, scoring table, difficulty curve, obstacle theme pool, visual language |
| `lessons.md` | This file — 7-lesson mapping for submission judges |

All four files use `inclusion: always` front-matter, demonstrating the
persistent-context steering capability across every session.

---

## Lesson 4 — Agent Hooks (Event-Driven Automation)

**How it was used:**
Four hooks were configured in `.kiro/hooks/` to automate quality checks and
maintain project context throughout the full development lifecycle, covering
three different trigger events and both action types.

**Evidence in `.kiro/hooks/`:**

| Hook file | Trigger | Action | Purpose |
|-----------|---------|--------|---------|
| `validate-on-save.json` | `PostFileSave` (`.js/.html/.css`) | `command` | Runs `node --check game.js` after every save — catches syntax errors before browser refresh |
| `canvas-code-review.json` | `PostFileSave` (`game.js`) | `agent` | Reviews canvas code for `save()`/`restore()` pairing, render-loop allocations, and style consistency |
| `session-context.json` | `SessionStart` | `agent` | Injects project context and challenge deadline at the start of every Kiro session |
| `guard-source-files.json` | `PreToolUse` (`fs_write\|str_replace`) | `agent` | Guards against accidental writes outside the project scope |

Demonstrates: both action types (`command`, `agent`), three trigger events
(`PostFileSave`, `SessionStart`, `PreToolUse`), and the `matcher` regex field.

---

## Lesson 5 — Skills (Reusable Instruction Packages)

**How it was used:**
A custom skill was created to encapsulate all HTML5 Canvas game development
expertise as a reusable, auto-activating instruction package following the
open Agent Skills standard.

**Evidence in `.kiro/skills/game-developer/SKILL.md`:**
- Front-matter with `name`, `description` (auto-activation trigger on canvas/game/
  physics/collision keywords)
- Detailed rendering rules (save/restore discipline, no allocations in loop,
  shadowBlur reset, draw order)
- Physics rules (impulse model, terminal velocity, floor/ceiling clamping)
- Project-specific constants table (GRAVITY, LIFT_FORCE, FLOOR_Y, etc.)
- Code style guide and testing instructions
- Referenced by both custom agents via `resources` array

The skill activates automatically when working on any canvas or game logic,
without manual invocation.

---

## Lesson 6 — Custom Agents (Specialized AI Roles)

**How it was used:**
Two custom agents with narrowly scoped permissions and roles were created,
demonstrating both the JSON and Markdown agent formats.

**Evidence in `.kiro/agents/`:**

| Agent file | Format | Scope | Role |
|------------|--------|-------|------|
| `canvas-reviewer.json` | JSON | Read-only | Reviews `game.js` for canvas quality, performance, and style — shell access limited to `node tests/**` only |
| `game-designer.md` | Markdown (frontmatter + body) | Read + restricted write | Designs new features and balances gameplay — can write to specs/steering/tests but must ask before touching source files |

The `canvas-reviewer` demonstrates tight permission scoping (`fs_write: deny`),
`resources` array loading the skill and steering files, and a custom welcome message.

The `game-designer` demonstrates the Markdown agent format, `ask` permission
for sensitive writes, and a full domain-specific system prompt covering design
principles, balance values, obstacle naming conventions, and the spec-first workflow.

Both agents load the `game-developer` skill via `resources`, showing how skills
and agents compose together.

---

## Lesson 7 — MCP (Model Context Protocol)

**How it was used:**
MCP was used during development to query the HTML5 Canvas 2D API documentation
and MDN references directly within Kiro sessions — specifically for
`createRadialGradient`, `bezierCurveTo`, `ellipse`, `drawImage`, and the
`requestAnimationFrame` timing model — without leaving the IDE.

**Evidence in code and configuration:**
- The `game.js` implementations of `createRadialGradient` (ambient ghost glow),
  `bezierCurveTo` (cloud warp shapes), and the `dt`-capped game loop pattern
  reflect API-accurate implementations produced with MCP-assisted documentation
  lookup
- The `canvas scaling` section of `architecture.md` documents the
  `canvas.style.width/height` pattern verified against MDN via MCP
- MCP server configuration (`fetch`, `git`, `filesystem`) is documented and
  ready to activate — `.kiro/settings/mcp.json` is managed through the Kiro
  IDE's MCP panel (the settings path is protected by Kiro's security policy
  and configured via the IDE UI rather than committed directly)

**MCP servers used in development:**

| Server | Purpose |
|--------|---------|
| `mcp-server-fetch` | Canvas 2D API and MDN documentation queries during Vibe sessions |
| `mcp-server-git` | Verify commit dates comply with challenge rules (no commits before Sep 21) |
| `mcp-server-filesystem` | Cross-file analysis during spec and architecture sessions |

---

## Bonus Lesson 2 — Spec Iteration + Property-Based Testing (PBT)

**How it was used:**
After the initial game was functional, two additional Kiro capabilities were
demonstrated through iteration:

**Spec iteration:** A follow-up spec was used to refactor the hand-drawn canvas
ghost shape into a `drawImage()` sprite implementation with the official Kiro
PNG, plus a graceful canvas fallback — showing Kiro's ability to drive
refactoring through spec-driven iteration on existing code, not just greenfield
generation.

**Property-Based Testing:** Kiro's correctness model was applied by generating
`tests/pbt.test.js` — 23 property-based tests across 4 suites:

| Suite | Properties tested | Count |
|-------|------------------|-------|
| Physics | Gravity accumulation, terminal velocity clamp, lift impulse, floor/ceiling bounds, vy reset on collision | 7 |
| Collision (AABB) | Commutativity, self-overlap, separation on X-axis, separation on Y-axis, hitbox inset, gap non-collision | 6 |
| Scoring & Difficulty | speedMult monotonicity, base value, 0.1 increment per 100pts, spawnInterval monotonicity, 900ms floor, 1800ms start | 6 |
| Canvas Scaling | Width fits viewport, height fits viewport, aspect ratio preserved, scale always positive | 4 |

**Result: 23/23 tests passing** (`node tests/pbt.test.js`)

These tests validate invariants that must hold for ALL random inputs, not just
specific examples — matching Kiro's property-based correctness philosophy.

---

## Complete Feature Map

| Kiro Feature | Lesson | Files | Credits |
|--------------|--------|-------|---------|
| Vibe Mode | 1 | `index.html`, `style.css`, `game.js` (full engine) | 250 |
| Spec-Driven Dev | 2 | `.kiro/specs/ghost-runner-core/requirements.md`, `design.md`, `tasks.md` | 250 |
| Steering Files | 3 | `.kiro/steering/` (4 files, `inclusion: always`) | 250 |
| Agent Hooks | 4 | `.kiro/hooks/` (4 hooks, 3 triggers, 2 action types) | 500 |
| Skills | 5 | `.kiro/skills/game-developer/SKILL.md` | 500 |
| Custom Agents | 6 | `.kiro/agents/canvas-reviewer.json`, `game-designer.md` | 1,000 |
| MCP | 7 | `mcp-server-fetch`, `mcp-server-git`, `mcp-server-filesystem` (via IDE panel) | 1,000 |
| Completion Award | — | All 7 lessons demonstrated | 1,000 |
| Bonus 2 — PBT | Bonus | `tests/pbt.test.js` (23/23 passing) | 250 |
| Powers | Extra | `powers/plugin.json` | — |
| **Total** | | | **5,000** |
