# Tasks — Kiro's Ghost Runner Core

## Implementation Status

All tasks are marked as completed — this spec documents the final implementation.

---

## Wave 1 — Project Scaffold (can run in parallel)

- [x] **Task 1.1** — Create `index.html` with canvas element, HUD, start overlay, game-over overlay
- [x] **Task 1.2** — Create `style.css` with dark space theme, neon CSS variables, overlay animations
- [x] **Task 1.3** — Create `game.js` skeleton with constants, canvas context, and empty `gameLoop()`
- [x] **Task 1.4** — Create `assets/` folder and add `kiro-ghost.png` sprite

## Wave 2 — Core Engine (sequential)

- [x] **Task 2.1** — Implement sprite loader with `onload`/`onerror` and `spriteReady` flag
- [x] **Task 2.2** — Implement ghost object: position, `flap()`, `update()` with gravity/clamp, `hitbox()`
- [x] **Task 2.3** — Implement `ghost.draw()` using `drawImage()` with radial glow + canvas fallback
- [x] **Task 2.4** — Implement `rectsOverlap()` AABB helper
- [x] **Task 2.5** — Implement state machine: `startGame()`, `triggerGameOver()`, `showScreen()`

## Wave 3 — Entities (can run in parallel)

- [x] **Task 3.1** — Implement `createObstacle()` factory and `updateObstacles(dt)` with spawn timer
- [x] **Task 3.2** — Implement `drawObstacle()` with pillar rendering, neon border, rotated label
- [x] **Task 3.3** — Implement `createCredit()` factory and `updateCredits(dt)` with collect logic
- [x] **Task 3.4** — Implement `drawCredit()` spinning star with "K" glyph and radial glow
- [x] **Task 3.5** — Implement particle system: `spawnCollectParticles()`, `spawnDeathParticles()`, `updateParticles()`, `drawParticles()`

## Wave 4 — Background & Polish (can run in parallel)

- [x] **Task 4.1** — Implement `initStars()` and `updateStars()` parallax system (80 stars, variable speed)
- [x] **Task 4.2** — Implement `drawBackground()`: gradient + stars + cloud wisps + floor grid line
- [x] **Task 4.3** — Implement `drawScanlines()` CRT overlay
- [x] **Task 4.4** — Implement `resizeCanvas()` uniform scale and `window.resize` listener

## Wave 5 — Scoring & Persistence

- [x] **Task 5.1** — Implement `addScore(pts)` with HUD update and bump animation
- [x] **Task 5.2** — Implement `speedMult` difficulty scaling (every 100pts → +0.1×)
- [x] **Task 5.3** — Implement `saveHighScore()` with localStorage read/write
- [x] **Task 5.4** — Implement `updateHUD()` and game-over score summary population

## Wave 6 — Input & Integration

- [x] **Task 6.1** — Wire keyboard listener (`Space`, `ArrowUp`)
- [x] **Task 6.2** — Wire `pointerdown` on canvas for mouse/touch flap
- [x] **Task 6.3** — Wire UI button listeners: Start, Restart, Main Menu
- [x] **Task 6.4** — Bootstrap `init()`: `resizeCanvas`, `initStars`, set high score display, start loop

## Wave 7 — .kiro Configuration

- [x] **Task 7.1** — Create `.kiro/steering/` files: project-overview, architecture, gameplay-design, lessons
- [x] **Task 7.2** — Create `.kiro/hooks/` files: validate-on-save, canvas-code-review, session-context, guard-source-files
- [x] **Task 7.3** — Create `.kiro/specs/ghost-runner-core/`: requirements, design, tasks (this file)
- [x] **Task 7.4** — Create `.kiro/skills/game-developer/SKILL.md`
- [x] **Task 7.5** — Create `.kiro/settings/mcp.json`
- [x] **Task 7.6** — Create `.kiro/agents/`: canvas-reviewer, game-designer
- [x] **Task 7.7** — Create `powers/plugin.json` custom Power manifest

## Wave 8 — Testing

- [x] **Task 8.1** — Create `tests/pbt.test.js` property-based tests for physics, collisions, scoring
- [x] **Task 8.2** — Verify all tests pass with `node tests/pbt.test.js`
