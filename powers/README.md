# 👻 ghost-runner-dev — Kiro Power

A Kiro Power for **HTML5 Canvas browser game development**, built for
[Kiro's Ghost Runner](https://github.com/LucioD3v/kiro-ghost-runner) as part of
the **Kiro University Challenge 2026**.

Install this Power to get a complete game development toolkit in any Kiro session:
canvas rendering expertise, a read-only code reviewer, a game design specialist,
and pre-configured MCP servers for documentation lookup.

---

## 📦 What's bundled

### Skill — `game-developer`
Auto-activates on keywords: `canvas`, `game`, `physics`, `collision`, `sprite`,
`particle`, `gravity`, `hitbox`, `audio`, `game-loop`.

Covers:
- HTML5 Canvas 2D rendering rules (`save()`/`restore()`, draw order, shadowBlur resets)
- Game loop architecture (`requestAnimationFrame`, dt cap, update/draw separation)
- Physics model (gravity accumulation, impulse lift, terminal velocity, floor/ceiling clamps)
- AABB collision detection with inset hitbox
- Audio pool pattern (`HTMLAudioElement` pool of N — avoids `cloneNode()` src bug)
- Difficulty scaling formulas (speed multiplier, spawn interval)
- Canvas viewport scaling (uniform scale, aspect ratio preservation)
- Property-based testing patterns for game logic

### Agent — `canvas-reviewer`
**Read-only** canvas code quality auditor.

Checks:
- `ctx.save()` / `ctx.restore()` pairing on every draw call
- Object allocations inside the render loop (performance killer)
- `shadowBlur` and `globalAlpha` reset discipline
- Draw order correctness
- Code style consistency

Shell access limited to `node tests/**` — cannot modify any files.

### Agent — `game-designer`
Game design specialist with **spec-first discipline**.

Covers:
- Difficulty balance (speed multiplier curves, spawn intervals, gap heights)
- EARS-notation requirement writing (`WHEN … THE SYSTEM SHALL …`)
- Obstacle / collectible theming
- Physics constant tuning
- New feature planning with mandatory spec update before code changes

Write access scoped to `.kiro/specs/`, `.kiro/steering/`, and `tests/` only.
Asks for confirmation before touching any `.js`, `.html`, or `.css` file.

### MCP Servers (`mcp.json`)
| Server | Purpose |
|--------|---------|
| `mcp-server-fetch` | Fetch MDN, Canvas API, and Web Audio API docs in-session |
| `mcp-server-git` | Query git history and verify commit dates |
| `mcp-server-filesystem` | Cross-file project analysis during spec sessions |

> MCP servers require `uvx` (install via `pip install uv`) and `npx`.
> If unavailable, the skill and agents still work without MCP.

---

## 🚀 Installing this Power

**Option A — From GitHub URL (Kiro IDE):**
1. Open Kiro IDE → Powers panel → **Import from URL**
2. Paste: `https://github.com/LucioD3v/kiro-ghost-runner/tree/main/powers`
3. Click Install → keywords activate the Power automatically

**Option B — Local folder import:**
1. Clone the repo: `git clone https://github.com/LucioD3v/kiro-ghost-runner`
2. Open Kiro IDE → Powers panel → **Import from folder**
3. Select the `powers/` folder

---

## ⚡ Usage

Once installed, the Power activates automatically when your prompt contains
any of its keywords. You can also invoke agents directly:

```
/canvas-reviewer   → audit your canvas code
/game-designer     → plan a new feature or balance change
```

---

## 📁 Power structure

```
powers/
├── plugin.json                    ← Power manifest (this package)
├── mcp.json                       ← Bundled MCP server config
├── README.md                      ← This file
├── skills/
│   └── game-developer/
│       └── SKILL.md               ← Canvas game dev skill
└── agents/
    ├── canvas-reviewer.json       ← Read-only code reviewer
    └── game-designer.md           ← Game design specialist
```

---

## 👤 Author

**Vicente Guzman** ([@LucioD3v](https://github.com/LucioD3v))
Built with [Kiro](https://kiro.dev) for the **Kiro University Challenge 2026**.

**Plugin.json URL:**
`https://github.com/LucioD3v/kiro-ghost-runner/blob/main/powers/plugin.json`
