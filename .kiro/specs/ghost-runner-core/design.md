# Design — Kiro's Ghost Runner Core

## Architecture Overview

```
index.html  ──loads──►  style.css   (UI layer: overlays, HUD, typography)
            ──loads──►  game.js     (engine layer: all game logic)
                            │
                            ├── Canvas 2D context (rendering)
                            ├── Image (sprite loader)
                            ├── State Machine (start/playing/gameover)
                            ├── Ghost object (physics + draw)
                            ├── Entity pools (obstacles[], credits[], particles[])
                            ├── Background system (stars[], clouds)
                            └── localStorage (high score persistence)
```

---

## Module Breakdown

### 1. Game Loop

```
requestAnimationFrame(gameLoop(timestamp))
  │
  ├─ dt = clamp(timestamp - lastTime, 0, 50)   // spiral-of-death prevention
  ├─ [UPDATE] updateStars, ghost.update, updateObstacles, updateCredits, updateParticles
  ├─ [COLLIDE] checkCollisions → triggerGameOver if hit
  └─ [DRAW]   drawBackground, obstacles, credits, particles, ghost, scanlines
```

**Target:** 60 FPS. All velocities are in px/frame (not px/ms) for simplicity.
Speed multiplier is applied at read-time in update functions, not stored per entity.

### 2. Physics Model

```
Every frame (ghost.update):
  vy += GRAVITY          (0.38 px/frame²)
  vy  = min(vy, MAX_FALL_SPEED)   (9 px/frame terminal)
  y  += vy

On flap input:
  vy = LIFT_FORCE        (-7.2 px/frame, immediate)

Floor clamp:
  if y + h >= FLOOR_Y → y = FLOOR_Y - h, vy = 0, game over

Ceiling clamp:
  if y < 0 → y = 0, vy = 0
```

### 3. Collision Detection

AABB (Axis-Aligned Bounding Box) with inset hitbox:

```
ghost.hitbox() = { x: x+5, y: y+6, w: w-10, h: h-10 }

rectsOverlap(a, b):
  return a.x < b.x+b.w && a.x+a.w > b.x &&
         a.y < b.y+b.h && a.y+a.h > b.y
```

Checked against:
- Top pillar rect: `(ob.x, 0, ob.w, ob.gapY)`
- Bottom pillar rect: `(ob.x, ob.gapY+ob.gapH, ob.w, FLOOR_Y-(ob.gapY+ob.gapH))`
- Floor: `ghost.y + ghost.h >= FLOOR_Y`

### 4. State Machine

```
         ┌──────────┐
  init ──►  'start'  ├── input ──────────────────────────────►┐
         └──────────┘                                         │
                                                              ▼
         ┌────────────┐   500ms delay    ┌──────────────────────┐
         │ 'gameover' │◄── collision ────│      'playing'       │
         └────────────┘                  └──────────────────────┘
               │
               ├── Restart ─────────────────► 'playing' (full reset)
               └── Menu ───────────────────► 'start'
```

### 5. Procedural Obstacle Generation

```
Obstacle = {
  x:      GAME_W + 10,          // spawn off right edge
  gapY:   40 + rand*(FLOOR_Y - gapH - 80),
  gapH:   130 + rand*60,        // 130–190px gap
  w:      54,
  color:  random('#ff4f6d' | '#b44fff'),
  label:  random(OBSTACLE_LABELS[]),
  scored: false
}

Spawn interval: max(900, 1800 - score*1.5) ms
Scroll speed:   OBSTACLE_SPEED * speedMult  (3.5 * multiplier px/frame)
```

### 6. Difficulty Curve

```
speedMult = 1 + floor(score / 100) * 0.1

Score   │ speedMult │ Obstacle interval
────────┼───────────┼──────────────────
0       │ ×1.0      │ 1800ms
100     │ ×1.1      │ ~1650ms
300     │ ×1.3      │ ~1350ms
500     │ ×1.5      │ ~1050ms
900+    │ ×1.9      │ 900ms (floor)
```

### 7. Rendering Pipeline (draw order)

1. `ctx.clearRect` — clear frame
2. `drawBackground()` — gradient + stars + cloud wisps + floor line
3. `obstacles.forEach(drawObstacle)` — pillars with neon borders + labels
4. `credits.forEach(drawCredit)` — spinning star collectibles
5. `drawParticles()` — collect/death particle bursts
6. `ghost.draw()` — sprite via drawImage() or canvas fallback
7. `drawScanlines()` — subtle CRT overlay (globalAlpha 0.025)

### 8. Canvas Scaling

```
scale = min(viewportW / GAME_W, viewportH / GAME_H)
canvas.style.width  = GAME_W * scale + 'px'
canvas.style.height = GAME_H * scale + 'px'
canvas.width        = GAME_W   // logical resolution fixed at 800×400
canvas.height       = GAME_H
```

Recalculated on `window.resize`.

### 9. Sprite Loading

```
ghostImg = new Image()
ghostImg.src = 'assets/kiro-ghost.png'
ghostImg.onload  → spriteReady = true
ghostImg.onerror → spriteReady = true (fallback mode)

Game loop starts only after spriteReady is true.
```

---

## Data Structures

### Ghost
```js
{ x, y, w:38, h:44, vy, alive, flickerTimer }
```

### Obstacle
```js
{ x, gapY, gapH, w:54, color, label, scored }
```

### Credit
```js
{ x, y, r:10, angle, collected }
```

### Particle
```js
{ x, y, vx, vy, alpha, color, size }
```

### Star (parallax)
```js
{ x, y, size, speed, alpha }
```

---

## Error Handling

| Scenario | Handling |
|----------|---------|
| PNG sprite fails to load | Canvas fallback shape drawn, `spriteReady` still set |
| `localStorage` unavailable | `parseInt('0')` default, no writes attempted |
| Tab blur (dt spike) | dt capped at 50ms, prevents physics explosion |
| Resize during gameplay | `resizeCanvas()` recalculates scale, gameplay continues |
