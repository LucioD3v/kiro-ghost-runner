---
inclusion: always
---

# Engine Architecture — Kiro's Ghost Runner

## Game Loop

The loop runs via `requestAnimationFrame` at the browser's native refresh rate (targeting 60 FPS).

```
requestAnimationFrame(gameLoop)
  │
  ├─ dt = timestamp - lastTime   (capped at 50ms to prevent spiral-of-death)
  │
  ├─ UPDATE PHASE
  │   ├─ updateStars()           parallax background
  │   ├─ ghost.update()          physics integration
  │   ├─ updateObstacles(dt)     spawn + scroll + score check
  │   ├─ updateCredits(dt)       spawn + scroll + collect check
  │   └─ updateParticles()       decay + gravity
  │
  ├─ COLLISION PHASE
  │   └─ checkCollisions()       AABB ghost vs obstacles/floor
  │       └─ triggerGameOver()   if hit
  │
  └─ DRAW PHASE
      ├─ drawBackground()        gradient + stars + cloud wisps + floor line
      ├─ obstacles[]             pillars with neon borders + labels
      ├─ credits[]               animated star collectibles
      ├─ drawParticles()         collect burst / death burst
      ├─ ghost.draw()            ghost body + eyes + glow
      └─ drawScanlines()         subtle CRT overlay
```

## State Machine

```
         ┌──────────┐
  init ──►  'start'  ├─── SPACE/Click/Button ──►┐
         └──────────┘                            │
                                                 ▼
         ┌────────────┐                     ┌──────────┐
         │ 'gameover' │◄── collision ────── │'playing' │
         └────────────┘                     └──────────┘
               │
               ├─ Restart ──────────────────► 'playing'
               └─ Menu   ──────────────────► 'start'
```

## Ghost Physics

| Parameter     | Value  | Effect                          |
|---------------|--------|---------------------------------|
| `GRAVITY`     | 0.38   | Constant downward acceleration  |
| `LIFT_FORCE`  | -7.2   | Instant vy on flap input        |
| `MAX_FALL_SPEED` | 9   | Terminal velocity clamp         |

The ghost's hitbox is inset 5px on all sides from the sprite bounding box,
giving the player a slight grace margin on glancing passes.

## Obstacle System

- Obstacles are "pillar pairs" with a random vertical gap.
- Spawn interval starts at **1800ms** and shrinks with score (`max(900ms, 1800 - score × 1.5)`).
- Scroll speed starts at **3.5 px/frame** and scales via `speedMult = 1 + floor(score/100) × 0.1`.
- Each pillar carries a random "bug label" from a themed pool (e.g. "Memory Leak", "CORS Block").
- Clearing a pillar gap awards **+5 points**.

## Credit Collectibles

- Spawn every 900ms, scroll at 80% obstacle speed.
- Collecting one awards **+10 points** and triggers a 10-particle burst.
- Rendered as a spinning star with a "K" glyph at center.

## Particle System

Lightweight pool of free-floating points with:
- Position, velocity, alpha decay (0.04/frame), micro-gravity (0.08/frame).
- Two spawn presets: `spawnCollectParticles` (gold) and `spawnDeathParticles` (red).

## Persistence

Only the high score is persisted, stored in `localStorage` under key `kgr_highscore`.
No other external I/O is performed.

## Canvas Scaling

The logical resolution is fixed at **800 × 400 px**.
`resizeCanvas()` computes the maximum uniform scale that fits the viewport
and applies it via `canvas.style.width/height`, keeping pixel-perfect rendering.
