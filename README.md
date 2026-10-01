# 👻 Kiro's Ghost Runner

> **Kiro University Challenge — Final Submission**
> Developed by **Vicente Guzman** ([@LucioD3v](https://github.com/LucioD3v))

**Kiro's Ghost Runner** is a dependency-free HTML5 Canvas runner game where you pilot Kiro's official ghost mascot through a cloud environment, dodging developer-themed obstacles (`Memory Leak`, `CORS Block`, `Race Condition`…) and collecting Kiro Credits for points. The entire project — from scaffolding to sprite integration — was built using Kiro as the primary development tool, demonstrating Vibe mode, Spec-driven development, Steering files, Agent Hooks, multi-surface usage, Custom Agents, and MCP integration across a single cohesive build.

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

**Option A — Direct (no server needed):**
```
Double-click index.html
```

**Option B — Local dev server:**
```bash
python -m http.server 8080
# then open http://localhost:8080
```

---

## 📁 Project Structure

```
kiro-ghost-runner/
├── index.html              # Game entry point: canvas + HUD + overlay screens
├── style.css               # Dark space/cloud theme, neon accents, animations
├── game.js                 # Full game engine (~800 lines, vanilla JS ES6+)
├── assets/
│   └── kiro-ghost.png      # Official Kiro mascot sprite
├── README.md               # This file
└── .kiro/
    ├── hooks/
    │   ├── validate-on-save.json     # PostFileSave: JS syntax check
    │   ├── canvas-code-review.json   # PostFileSave: agent code review
    │   ├── session-context.json      # SessionStart: project briefing agent
    │   └── guard-source-files.json   # PreToolUse: write guard agent
    └── steering/
        ├── project-overview.md       # Stack, goals, setup (inclusion: always)
        ├── architecture.md           # Engine design, state machine, physics
        ├── gameplay-design.md        # Mechanics, scoring, balance values
        └── lessons.md                # 7-lesson mapping for submission judges
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
| Persistence | High score via `localStorage` |
| Canvas scaling | Uniform scale to fill any viewport, pixel-perfect |
| Zero dependencies | Pure HTML/CSS/JS — no bundler, no framework, no CDN |

---

## 🎓 Kiro University Challenge — Lesson Incorporation

> Full evidence mapping is in [`.kiro/steering/lessons.md`](.kiro/steering/lessons.md).
> Below is the summary required by the submission form.

### Lesson 1 — Vibe Mode
The entire project was bootstrapped through Kiro Vibe mode. A single conversational
prompt ("build a Ghost Runner game with Kiro's mascot, HTML5 Canvas, procedural
obstacles, and a neon cloud aesthetic") generated the full working scaffold.
Subsequent iterations — sprite integration, physics tuning, HUD animations — were
all done through follow-up Vibe prompts without leaving the IDE.

### Lesson 2 — Spec-Driven Development
Before implementation, requirements and design were captured through Kiro's Spec
workflow, producing `architecture.md` (game loop data flow, state machine, component
breakdown) and `gameplay-design.md` (mechanics, scoring table, difficulty scaling).
The modular structure of `game.js` — clearly separated update/draw phases and factory
functions — directly reflects the task breakdown from the spec.

### Lesson 3 — Steering Files
Three `inclusion: always` steering files were created so every Kiro session
automatically loads full project context: stack constraints, file structure, physics
parameters, and design decisions — without re-prompting. A fourth steering file
(`lessons.md`) documents lesson evidence for judges.

### Lesson 4 — Agent Hooks
Four hooks cover the full development lifecycle:
- **`validate-on-save`** — `PostFileSave` command hook: runs `node --check` on `game.js` after every save
- **`canvas-code-review`** — `PostFileSave` agent hook: reviews canvas code quality on `game.js` changes
- **`session-context`** — `SessionStart` agent hook: injects project context and deadline at session start
- **`guard-source-files`** — `PreToolUse` agent hook: guards against out-of-scope file writes

### Lesson 5 — Multi-Surface (IDE + CLI + Web)
Developed in **Kiro IDE** for all code generation; **Kiro CLI** for the local dev
server (`python -m http.server 8080`) used to verify the game at each iteration;
**Kiro Web** for iterative visual feedback on the ghost sprite and color palette.

### Lesson 6 — Custom Agents
Two custom agents with narrowly scoped roles:
- `canvas-code-review` agent: restricted to three specific canvas quality checks
- `session-context` agent: functions as a project briefing agent on every session start

### Lesson 7 — MCP Integration
The Kiro IDE's MCP integration was used during development to query HTML5 Canvas 2D
API documentation (`createRadialGradient`, `bezierCurveTo`, `ellipse`, `requestAnimationFrame`
timing model) directly within the session. API-accurate implementations and the
`dt`-capped game loop pattern reflect MCP-assisted documentation lookup.

### Bonus Lesson 2 — Spec Iteration
After the initial game was functional, a follow-up spec was used to refactor the
hand-drawn canvas ghost shape into a `drawImage()` sprite implementation using the
official Kiro PNG, with a graceful canvas fallback — demonstrating spec-driven
iteration on existing code.

---

## 📜 License

MIT — built for the Kiro University Challenge.

---

## 👤 Author

**Vicente Guzman** ([@LucioD3v](https://github.com/LucioD3v))
Built with [Kiro](https://kiro.dev) for the **Kiro University Challenge 2026**.

<!-- Submission hashtags: #KiroUniversity #BuildWithKiro -->
