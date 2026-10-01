# 👻 Kiro's Ghost Runner

> **Kiro University Challenge — Final Submission**
> Developed by **Vicente Guzman** ([@LucioD3v](https://github.com/LucioD3v))

## 🕹️ [Play it now → luciod3v.github.io/kiro-ghost-runner](https://luciod3v.github.io/kiro-ghost-runner/)

**Kiro's Ghost Runner** is a dependency-free HTML5 Canvas runner game where you pilot Kiro's official ghost mascot through a cloud environment, dodging developer-themed obstacles (`Memory Leak`, `CORS Block`, `Race Condition`…) and collecting Kiro Credits for points. The entire project — from scaffolding to sprite integration — was built using Kiro as the primary development tool, demonstrating Vibe mode, Spec-driven development, Steering files, Agent Hooks, Skills, Custom Agents, MCP integration, and Property-Based Testing across a single cohesive build.

---

## 🎮 How to Play

| Input | Action |
|-------|--------|
| `Space` / `↑` | Fly upward |
| Mouse click | Fly upward |
| Touch (mobile) | Fly upward |

- Dodge the bug obstacles scrolling from the right
- Collect ★ **Kiro Credits** for +10 points each
- Clear an obstacle gap for +5 points
- The game speeds up every 100 points — survive as long as you can
- Your best score is saved between sessions

---

## 🚀 Running Locally

> **No setup needed — play it live at [luciod3v.github.io/kiro-ghost-runner](https://luciod3v.github.io/kiro-ghost-runner/)**

Or run it locally:

**Option A — Direct (no server needed):**
```
Double-click index.html
```

**Option B — Local dev server (recommended for audio):**
```bash
python -m http.server 8080
# then open http://localhost:8080
```

> Audio requires a local server or browser that allows file:// audio.
> Use Option B for the best experience when recording demos.

---

## 📁 Project Structure

```
kiro-ghost-runner/
├── index.html                        # Game entry point: canvas + HUD + overlays
├── style.css                         # Dark space/cloud theme, neon accents
├── game.js                           # Full game engine (~850 lines, vanilla JS ES6+)
├── assets/
│   ├── kiro-ghost.png                # Official Kiro mascot sprite
│   ├── jump.mp3                      # Sound: ghost flap / jump
│   ├── coin.mp3                      # Sound: Kiro Credit collected
│   └── gamelost.mp3                  # Sound: game over / collision
├── tests/
│   └── pbt.test.js                   # Property-based tests (23/23 passing)
├── powers/
│   └── plugin.json                   # Custom Kiro Power manifest
├── README.md                         # This file
└── .kiro/
    ├── specs/ghost-runner-core/
    │   ├── requirements.md           # EARS-notation requirements (FR1-FR7, NFR1-NFR4)
    │   ├── design.md                 # Architecture, physics, state machine, data structures
    │   └── tasks.md                  # 8 implementation waves, 29 tasks
    ├── hooks/
    │   ├── validate-on-save.json     # PostFileSave → JS syntax check (command)
    │   ├── canvas-code-review.json   # PostFileSave → canvas quality review (agent)
    │   ├── session-context.json      # SessionStart → project briefing (agent)
    │   └── guard-source-files.json   # PreToolUse → write scope guard (agent)
    ├── steering/
    │   ├── project-overview.md       # Stack, goals, structure (inclusion: always)
    │   ├── architecture.md           # Engine design, state machine, physics
    │   ├── gameplay-design.md        # Mechanics, scoring, balance values
    │   └── lessons.md                # Full 7-lesson mapping for judges
    ├── skills/game-developer/
    │   └── SKILL.md                  # Canvas game dev specialist skill (auto-activating)
    └── agents/
        ├── canvas-reviewer.json      # Read-only canvas quality reviewer (JSON format)
        └── game-designer.md          # Game design specialist (Markdown format)
```

---

## ⚙️ Technical Highlights

| Feature | Implementation |
|---------|---------------|
| Rendering | HTML5 Canvas 2D, 60 FPS via `requestAnimationFrame` |
| Ghost sprite | `drawImage()` with official Kiro PNG + canvas glow overlay |
| Physics | Gravity + lift impulse, terminal velocity clamp |
| Collisions | AABB with inset hitbox for forgiving play |
| Obstacles | Procedural pillar pairs with random gaps + dev-themed labels |
| Difficulty | Speed multiplier scales every 100 pts, spawn interval shrinks |
| Collectibles | Spinning star credits with 10-particle burst on collect |
| Background | Parallax star field + scrolling cloud wisps |
| Audio | Web Audio API — jump, coin, game over sounds (graceful fallback) |
| Persistence | High score via `localStorage` |
| Canvas scaling | Uniform scale to fill any viewport, pixel-perfect |
| PBT | 23/23 property-based tests (`node tests/pbt.test.js`) |
| Zero dependencies | Pure HTML/CSS/JS — no bundler, no framework, no CDN |

---

## 🎓 Kiro University Challenge — Lesson Incorporation

> Full evidence mapping is in [`.kiro/steering/lessons.md`](.kiro/steering/lessons.md).
> Below is the summary required by the submission form.

### Lesson 1 — Vibe Mode
The entire project was bootstrapped through Kiro Vibe mode. A single conversational
prompt ("build a Ghost Runner game with Kiro's mascot, HTML5 Canvas, procedural
obstacles, and a neon cloud aesthetic") generated the full working scaffold.
Subsequent iterations — sprite integration, audio system, physics tuning, HUD
animations — were all done through follow-up Vibe prompts without leaving the IDE.

### Lesson 2 — Spec-Driven Development
The project was formally specified through Kiro's Spec workflow before implementation,
producing three documents in `.kiro/specs/ghost-runner-core/`: `requirements.md`
(EARS-notation FR1–FR7 + NFR1–NFR4), `design.md` (full architecture, physics model,
state machine, collision algorithm, rendering pipeline), and `tasks.md` (8 implementation
waves with 29 discrete tasks). The modular structure of `game.js` directly reflects
the spec's task breakdown.

### Lesson 3 — Steering Files
Four `inclusion: always` steering files ensure every Kiro session automatically
loads full project context — stack constraints, physics parameters, design decisions,
coding conventions, and lesson evidence — without re-prompting.

### Lesson 4 — Agent Hooks
Four hooks cover the full development lifecycle:
- **`validate-on-save`** — `PostFileSave` command hook: runs `node --check` on `game.js` after every save
- **`canvas-code-review`** — `PostFileSave` agent hook: reviews canvas code quality on `game.js` changes
- **`session-context`** — `SessionStart` agent hook: injects project context and deadline at session start
- **`guard-source-files`** — `PreToolUse` agent hook: guards against out-of-scope file writes

### Lesson 5 — Skills
A custom `game-developer` skill (`.kiro/skills/game-developer/SKILL.md`) encapsulates
HTML5 Canvas game development expertise as an auto-activating instruction package.
It defines rendering rules, physics constants, code style, and testing instructions —
and is loaded by both custom agents via their `resources` array.

### Lesson 6 — Custom Agents
Two custom agents with narrowly scoped permissions:
- **`canvas-reviewer.json`** (JSON format) — read-only canvas quality reviewer, loads the game-developer skill
- **`game-designer.md`** (Markdown format) — game design specialist with `ask` permission for source file writes

### Lesson 7 — MCP Integration
The Kiro IDE's MCP integration was used during development to query HTML5 Canvas 2D
API documentation (`createRadialGradient`, `bezierCurveTo`, `ellipse`, Web Audio API)
directly within sessions. Three MCP servers were used: `mcp-server-fetch` (MDN docs),
`mcp-server-git` (commit date compliance), `mcp-server-filesystem` (cross-file analysis).

### Bonus Lesson 2 — Property-Based Testing (PBT)
`tests/pbt.test.js` contains 23 property-based tests across 4 suites — Physics,
AABB Collision, Scoring & Difficulty, Canvas Scaling — all passing with
`node tests/pbt.test.js`. Tests validate invariants that hold for all random
inputs, not just specific examples.

---

## 📜 License

MIT — built for the Kiro University Challenge.

---

## 👤 Author

**Vicente Guzman** ([@LucioD3v](https://github.com/LucioD3v))
Built with [Kiro](https://kiro.dev) for the **Kiro University Challenge 2026**.

<!-- Submission hashtags: #KiroUniversity #BuildWithKiro -->
