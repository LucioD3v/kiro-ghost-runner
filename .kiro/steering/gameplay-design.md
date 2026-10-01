---
inclusion: always
---

# Gameplay Design — Kiro's Ghost Runner

## Core Loop

```
Fly → Dodge obstacles → Collect credits → Survive longer → Higher score
```

The game is intentionally single-mechanic: one button (Space / tap) controls
everything. This keeps the barrier to entry near-zero while allowing skill
expression through rhythm and timing.

## Controls

| Input            | Action          |
|------------------|-----------------|
| `Space`          | Flap (fly up)   |
| `Arrow Up`       | Flap (fly up)   |
| Mouse click      | Flap (fly up)   |
| Touch (canvas)   | Flap (fly up)   |

## Scoring

| Event                    | Points |
|--------------------------|--------|
| Clear an obstacle pillar | +5     |
| Collect a Kiro Credit ★  | +10    |

High score is saved between sessions via `localStorage`.

## Difficulty Scaling

Difficulty increases automatically as the score rises:

| Score Threshold | Speed Multiplier | Obstacle Interval |
|-----------------|------------------|-------------------|
| 0               | ×1.0             | 1800ms            |
| 100             | ×1.1             | ~1650ms           |
| 200             | ×1.2             | ~1500ms           |
| 500             | ×1.5             | ~1050ms           |
| 900+            | ×1.9+            | 900ms (minimum)   |

This creates a natural skill ceiling that rewards consistent players.

## Obstacle Themes (Bug Labels)

Obstacles are labeled with developer pain points, reinforcing the Kiro brand story:

- `Deprecated API` · `Memory Leak` · `Timeout Error` · `null pointer`
- `CORS Block` · `Stack Overflow` · `404 Not Found` · `Infinite Loop`
- `Race Condition` · `Unhandled Promise` · `Bad Merge` · `Tech Debt`

## Visual Language

| Element        | Color          | Meaning              |
|----------------|----------------|----------------------|
| Ghost          | Cyan (#00f5ff) | The player / Kiro AI |
| Credits        | Yellow (#ffe066)| Reward / progress    |
| Obstacles      | Red / Purple   | Danger / bugs        |
| Background     | Deep navy      | Cloud / space env    |
| Floor grid line| Cyan (dim)     | Boundary / ground    |

## Game Over Screen

Shows:
- Death cause (which obstacle type or "hit the ground")
- Current run score
- All-time best (with "New Best!" highlight if broken)
- Quick restart button (no animation skip required)

## Potential Future Enhancements (Post-MVP)

- [ ] Sound effects (Web Audio API — flap, collect, death)
- [ ] Animated sprite sheet for the ghost
- [ ] Power-ups: shield, slow-motion, score multiplier
- [ ] Leaderboard via a lightweight backend (e.g. Kiro + Lambda)
- [ ] Mobile touch-optimized UI sizing
- [ ] Difficulty presets (Easy / Normal / Nightmare)
