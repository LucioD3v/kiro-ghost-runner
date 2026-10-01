/* ═══════════════════════════════════════════════════════════════════
   KIRO'S GHOST RUNNER — game.js
   Engine: HTML5 Canvas 2D, requestAnimationFrame, ES6+
   ─────────────────────────────────────────────────────────────────
   Developed by : Vicente Guzman (@LucioD3v)
   Challenge    : Kiro University Challenge
   ══════════════════════════════════════════════════════════════════ */

'use strict';

// ─── Canvas & Context ────────────────────────────────────────────────
const canvas  = document.getElementById('game-canvas');
const ctx     = canvas.getContext('2d');

// ─── Sprite Assets ───────────────────────────────────────────────────
// Load the official Kiro ghost PNG. The game loop starts only after
// this resolves so we never draw a broken image.
const ghostImg       = new Image();
ghostImg.src         = 'assets/kiro-ghost.png';
let   spriteReady    = false;
ghostImg.onload  = () => { spriteReady = true; };
ghostImg.onerror = () => {
  // Fallback: flag as ready anyway — draw() will use the canvas shape
  spriteReady = true;
  console.warn('kiro-ghost.png not found, using canvas fallback.');
};

// ─── Audio System ────────────────────────────────────────────────────
// Uses HTMLAudioElement pool — works on file://, http://, and GitHub Pages.
// Strategy: pre-create multiple Audio instances per sound (pool of 4) so
// the same sound can overlap without cloneNode() issues.

const SOUND_SRCS = {
  jump:     'assets/jump.mp3',
  coin:     'assets/coin.mp3',
  gamelost: 'assets/gamelost.mp3',
};

const POOL_SIZE  = 4;    // max simultaneous plays of the same sound
const audioPool  = {};   // name → Audio[]
let   audioReady = false;

// Build the pool immediately — browsers start buffering right away
(function buildAudioPool() {
  Object.entries(SOUND_SRCS).forEach(([name, src]) => {
    audioPool[name] = [];
    for (let i = 0; i < POOL_SIZE; i++) {
      try {
        const el = new Audio();
        el.src     = src;
        el.preload = 'auto';
        el.volume  = 1;
        audioPool[name].push(el);
      } catch (e) { /* Audio not supported */ }
    }
  });
})();

/**
 * Call on first user gesture. Attempts a silent play on every pooled element
 * to satisfy autoplay policies on Safari / mobile browsers.
 */
function initAudio() {
  if (audioReady) return;
  audioReady = true;
  Object.values(audioPool).forEach(pool => {
    pool.forEach(el => {
      el.muted = true;
      const p = el.play();
      if (p) p.then(() => { el.pause(); el.currentTime = 0; el.muted = false; })
               .catch(() => { el.muted = false; });
    });
  });
}

/**
 * Play a pooled sound. Picks the first element whose playback has ended
 * (or hasn't started), resets it, and plays.
 */
function playSound(name, volume = 1.0) {
  const pool = audioPool[name];
  if (!pool || pool.length === 0) return;

  // Find an idle element (paused or ended)
  let el = pool.find(e => e.paused || e.ended);

  // If all are playing, forcibly reuse the one furthest along
  if (!el) {
    el = pool.reduce((a, b) => a.currentTime > b.currentTime ? a : b);
  }

  try {
    el.currentTime = 0;
    el.volume      = Math.max(0, Math.min(1, volume));
    el.play().catch(() => {}); // silently ignore autoplay blocks
  } catch (e) { /* degrade silently */ }
}

// ─── Game Constants ──────────────────────────────────────────────────
const GAME_W          = 800;   // Logical game width  (px)
const GAME_H          = 400;   // Logical game height (px)
const GRAVITY         = 0.38;  // Downward acceleration per frame
const LIFT_FORCE      = -7.2;  // Velocity applied on flap input
const MAX_FALL_SPEED  = 9;     // Terminal velocity (positive = down)
const OBSTACLE_SPEED  = 3.5;   // Pixels per frame (increases over time)
const CREDIT_SPEED    = 2.8;   // Credits scroll slightly slower
const SPAWN_INTERVAL  = 1800;  // ms between obstacle spawns (decreases)
const CREDIT_INTERVAL = 900;   // ms between credit spawns
const FLOOR_Y         = GAME_H - 48; // Y position of the floor

// Obstacle labels pool — themed to Kiro / dev pain
const OBSTACLE_LABELS = [
  'Deprecated API', 'Memory Leak', 'Timeout Error',
  'null pointer', 'CORS Block', 'Stack Overflow',
  '404 Not Found', 'Infinite Loop', 'Race Condition',
  'Unhandled Promise', 'Bad Merge', 'Tech Debt',
];

// ─── Game State ──────────────────────────────────────────────────────
/**
 * States: 'start' | 'playing' | 'gameover'
 */
let state = 'start';

let score      = 0;
let highScore  = parseInt(localStorage.getItem('kgr_highscore') || '0', 10);
let frameCount = 0;
let lastTime   = 0;
let speedMult  = 1;        // increases as score grows

// ─── Entity Pools ────────────────────────────────────────────────────
let obstacles  = [];
let credits    = [];
let particles  = [];
let stars      = [];       // Parallax background stars

// Timers (ms since last spawn)
let obstacleTimer = 0;
let creditTimer   = 0;

// ─── Ghost (Player) ─────────────────────────────────────────────────
const ghost = {
  x:       120,
  y:       GAME_H / 2,
  w:       38,
  h:       44,
  vy:      0,
  alive:   true,
  flickerTimer: 0,    // brief flicker on near-miss

  /** Apply upward lift (flap) */
  flap() {
    this.vy = LIFT_FORCE;
    playSound('jump', 0.7);
  },

  update() {
    this.vy = Math.min(this.vy + GRAVITY, MAX_FALL_SPEED);
    this.y  += this.vy;

    // Floor collision
    if (this.y + this.h >= FLOOR_Y) {
      this.y  = FLOOR_Y - this.h;
      this.vy = 0;
    }

    // Ceiling clamp
    if (this.y < 0) {
      this.y  = 0;
      this.vy = 0;
    }

    if (this.flickerTimer > 0) this.flickerTimer--;
  },

  /** AABB hitbox — slightly inset for forgiving collisions */
  hitbox() {
    return {
      x: this.x + 5,
      y: this.y + 6,
      w: this.w - 10,
      h: this.h - 10,
    };
  },

  draw() {
    const cx = this.x + this.w / 2;
    const cy = this.y + this.h / 2;

    ctx.save();

    // ── Ambient glow behind sprite ────────────────────────────────
    const glowColor = '#00f5ff';
    const glowR     = this.w * 1.3;
    const grd = ctx.createRadialGradient(cx, cy, 2, cx, cy, glowR);
    grd.addColorStop(0, 'rgba(0,245,255,0.22)');
    grd.addColorStop(1, 'rgba(0,245,255,0)');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(cx, cy, glowR, 0, Math.PI * 2);
    ctx.fill();

    // ── Draw sprite (or canvas fallback if image didn't load) ──────
    if (spriteReady && ghostImg.naturalWidth > 0) {
      // Slight flicker on near-miss: reduce opacity
      ctx.globalAlpha = (this.flickerTimer % 4 < 2) ? 0.55 : 1.0;
      // Neon cyan tint overlay using 'screen' composite
      ctx.shadowColor = glowColor;
      ctx.shadowBlur  = 14;
      ctx.drawImage(ghostImg, this.x, this.y, this.w, this.h);
      ctx.globalAlpha = 1.0;
    } else {
      // Canvas fallback — simple blob with eyes
      this._canvasFallback(cx, cy);
    }

    ctx.restore();
  },

  /** Minimal canvas fallback used only when the PNG fails to load. */
  _canvasFallback(cx, cy) {
    const rx = this.w / 2;
    const ry = this.h / 2;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.fillStyle   = 'rgba(180,245,255,0.88)';
    ctx.shadowColor = '#00f5ff';
    ctx.shadowBlur  = 16;
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,245,255,0.9)';
    ctx.lineWidth   = 2;
    ctx.stroke();
    // eyes
    ctx.shadowBlur = 0;
    ctx.fillStyle  = '#0c1120';
    ctx.beginPath(); ctx.arc(cx - rx*0.32, cy - ry*0.05, rx*0.22, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + rx*0.32, cy - ry*0.05, rx*0.22, 0, Math.PI*2); ctx.fill();
  },

  _drawKiroShape(_dead) { /* replaced by sprite draw — kept for compat */ },
  _drawEye(_ex, _ey)    { /* no-op */ },
};

// ─── Obstacle Factory ────────────────────────────────────────────────
/**
 * Creates a vertical pillar obstacle (think Flappy Bird columns but
 * styled as glitchy server racks with labels).
 */
function createObstacle() {
  const gapH   = 130 + Math.random() * 60;           // vertical gap height
  const gapY   = 40 + Math.random() * (FLOOR_Y - gapH - 80);
  const w      = 54;
  const label  = OBSTACLE_LABELS[Math.floor(Math.random() * OBSTACLE_LABELS.length)];
  const hue    = Math.random() > 0.5 ? '#ff4f6d' : '#b44fff';  // red or purple

  return {
    x:    GAME_W + 10,
    gapY,
    gapH,
    w,
    color: hue,
    label,
    scored: false,  // true once ghost passes this pillar
  };
}

function updateObstacles(dt) {
  const speed = OBSTACLE_SPEED * speedMult;

  obstacleTimer += dt;
  const spawnInt = Math.max(900, SPAWN_INTERVAL - score * 1.5);

  if (obstacleTimer >= spawnInt) {
    obstacles.push(createObstacle());
    obstacleTimer = 0;
  }

  for (let i = obstacles.length - 1; i >= 0; i--) {
    const ob = obstacles[i];
    ob.x -= speed;

    // Award point when ghost clears the gap
    if (!ob.scored && ob.x + ob.w < ghost.x) {
      ob.scored = true;
      addScore(5);
    }

    if (ob.x + ob.w < -10) {
      obstacles.splice(i, 1);
    }
  }
}

function drawObstacle(ob) {
  const topH  = ob.gapY;
  const botY  = ob.gapY + ob.gapH;
  const botH  = FLOOR_Y - botY;

  // Draw top pillar
  drawPillar(ob.x, 0, ob.w, topH, ob.color);
  // Draw bottom pillar
  drawPillar(ob.x, botY, ob.w, botH, ob.color);

  // Gap warning glow line
  ctx.save();
  ctx.shadowColor = ob.color;
  ctx.shadowBlur  = 6;
  ctx.strokeStyle = ob.color;
  ctx.lineWidth   = 1;
  ctx.setLineDash([4, 6]);
  ctx.beginPath();
  ctx.moveTo(ob.x + ob.w / 2, ob.gapY);
  ctx.lineTo(ob.x + ob.w / 2, ob.gapY + ob.gapH);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();

  // Label (rotated, inside pillar)
  ctx.save();
  ctx.translate(ob.x + ob.w / 2, topH / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.font      = 'bold 9px "Courier New", monospace';
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.textAlign = 'center';
  ctx.fillText(ob.label.toUpperCase(), 0, 4);
  ctx.restore();
}

/**
 * Draws a single pillar rectangle with neon edges.
 */
function drawPillar(x, y, w, h, color) {
  if (h <= 0) return;
  ctx.save();

  // Dark body
  ctx.fillStyle = '#0d1424';
  ctx.fillRect(x, y, w, h);

  // Grid lines
  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  ctx.lineWidth   = 1;
  for (let row = y + 12; row < y + h; row += 12) {
    ctx.beginPath();
    ctx.moveTo(x, row);
    ctx.lineTo(x + w, row);
    ctx.stroke();
  }

  // Neon border
  ctx.shadowColor = color;
  ctx.shadowBlur  = 10;
  ctx.strokeStyle = color;
  ctx.lineWidth   = 2;
  ctx.strokeRect(x + 1, y + 1, w - 2, h - 2);

  ctx.restore();
}

// ─── Credit Collectibles ─────────────────────────────────────────────
function createCredit() {
  return {
    x:     GAME_W + 10,
    y:     40 + Math.random() * (FLOOR_Y - 80),
    r:     10,
    angle: 0,
    collected: false,
  };
}

function updateCredits(dt) {
  const speed = CREDIT_SPEED * speedMult;

  creditTimer += dt;
  if (creditTimer >= CREDIT_INTERVAL) {
    credits.push(createCredit());
    creditTimer = 0;
  }

  for (let i = credits.length - 1; i >= 0; i--) {
    const c = credits[i];
    c.x    -= speed;
    c.angle += 0.04;

    // Collision with ghost
    if (!c.collected) {
      const hb = ghost.hitbox();
      if (rectsOverlap(
        hb.x, hb.y, hb.w, hb.h,
        c.x - c.r, c.y - c.r, c.r * 2, c.r * 2
      )) {
        c.collected = true;
        addScore(10);
        spawnCollectParticles(c.x, c.y, '#ffe066');
        playSound('coin', 0.8);
      }
    }

    if (c.x + c.r < -10) credits.splice(i, 1);
  }
}

function drawCredit(c) {
  if (c.collected) return;

  ctx.save();
  ctx.translate(c.x, c.y);
  ctx.rotate(c.angle);

  // Outer glow
  const g = ctx.createRadialGradient(0, 0, 2, 0, 0, c.r * 2);
  g.addColorStop(0, 'rgba(255, 224, 102, 0.3)');
  g.addColorStop(1, 'rgba(255, 224, 102, 0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(0, 0, c.r * 2, 0, Math.PI * 2);
  ctx.fill();

  // Star shape
  ctx.shadowColor = '#ffe066';
  ctx.shadowBlur  = 12;
  ctx.fillStyle   = '#ffe066';
  drawStar(ctx, 0, 0, 5, c.r, c.r * 0.45);

  // "K" label
  ctx.shadowBlur  = 0;
  ctx.font        = `bold ${c.r}px "Courier New", monospace`;
  ctx.fillStyle   = '#080c14';
  ctx.textAlign   = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('K', 0, 1);

  ctx.restore();
}

/** Draws a star polygon on ctx at (x, y). */
function drawStar(ctx, x, y, points, outerR, innerR) {
  const step  = Math.PI / points;
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const r     = i % 2 === 0 ? outerR : innerR;
    const angle = i * step - Math.PI / 2;
    i === 0
      ? ctx.moveTo(x + r * Math.cos(angle), y + r * Math.sin(angle))
      : ctx.lineTo(x + r * Math.cos(angle), y + r * Math.sin(angle));
  }
  ctx.closePath();
  ctx.fill();
}

// ─── Particle System ─────────────────────────────────────────────────
function spawnCollectParticles(x, y, color) {
  for (let i = 0; i < 10; i++) {
    const angle = (Math.PI * 2 / 10) * i;
    particles.push({
      x, y,
      vx:    Math.cos(angle) * (2 + Math.random() * 2),
      vy:    Math.sin(angle) * (2 + Math.random() * 2),
      alpha: 1,
      color,
      size:  2 + Math.random() * 2,
    });
  }
}

function spawnDeathParticles(x, y) {
  for (let i = 0; i < 20; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 5;
    particles.push({
      x, y,
      vx:    Math.cos(angle) * speed,
      vy:    Math.sin(angle) * speed,
      alpha: 1,
      color: '#ff4f6d',
      size:  3 + Math.random() * 4,
    });
  }
}

function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x     += p.vx;
    p.y     += p.vy;
    p.alpha -= 0.04;
    p.vy    += 0.08;  // slight gravity on particles
    if (p.alpha <= 0) particles.splice(i, 1);
  }
}

function drawParticles() {
  for (const p of particles) {
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle   = p.color;
    ctx.shadowColor = p.color;
    ctx.shadowBlur  = 6;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// ─── Background: Parallax Stars ──────────────────────────────────────
function initStars() {
  stars = [];
  for (let i = 0; i < 80; i++) {
    stars.push({
      x:     Math.random() * GAME_W,
      y:     Math.random() * GAME_H,
      size:  0.5 + Math.random() * 1.5,
      speed: 0.2 + Math.random() * 0.8,
      alpha: 0.3 + Math.random() * 0.7,
    });
  }
}

function updateStars() {
  for (const s of stars) {
    s.x -= s.speed * speedMult;
    if (s.x < 0) {
      s.x = GAME_W;
      s.y = Math.random() * GAME_H;
    }
  }
}

function drawBackground() {
  // Deep space gradient
  const bg = ctx.createLinearGradient(0, 0, 0, GAME_H);
  bg.addColorStop(0, '#080c14');
  bg.addColorStop(1, '#0d1830');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, GAME_W, GAME_H);

  // Stars
  for (const s of stars) {
    ctx.globalAlpha = s.alpha;
    ctx.fillStyle   = '#e8eaf6';
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Cloud wisps (subtle, fast-moving)
  drawClouds();

  // Floor grid line
  ctx.save();
  ctx.strokeStyle = 'rgba(0, 245, 255, 0.2)';
  ctx.lineWidth   = 1;
  ctx.shadowColor = '#00f5ff';
  ctx.shadowBlur  = 6;
  ctx.beginPath();
  ctx.moveTo(0, FLOOR_Y);
  ctx.lineTo(GAME_W, FLOOR_Y);
  ctx.stroke();
  ctx.restore();
}

// Cloud layer (cheap: just soft ellipses scrolled with parallax)
let cloudOffsetA = 0;
let cloudOffsetB = 0;
const CLOUD_DEFS = [
  { x:  80, y:  60, rx: 90, ry: 28 },
  { x: 300, y:  90, rx: 70, ry: 22 },
  { x: 550, y:  50, rx: 110, ry: 30 },
  { x: 720, y:  80, rx: 80, ry: 20 },
  { x: 160, y: 280, rx: 95, ry: 26 },
  { x: 440, y: 310, rx: 75, ry: 20 },
  { x: 660, y: 290, rx: 100, ry: 28 },
];

function drawClouds() {
  cloudOffsetA = (cloudOffsetA + 0.3 * speedMult) % GAME_W;
  cloudOffsetB = (cloudOffsetB + 0.6 * speedMult) % GAME_W;

  ctx.save();
  for (let i = 0; i < CLOUD_DEFS.length; i++) {
    const cd  = CLOUD_DEFS[i];
    const off = i % 2 === 0 ? cloudOffsetA : cloudOffsetB;
    const cx  = (cd.x - off + GAME_W) % GAME_W;

    const grad = ctx.createRadialGradient(cx, cd.y, 0, cx, cd.y, cd.rx);
    grad.addColorStop(0, 'rgba(180, 200, 255, 0.055)');
    grad.addColorStop(1, 'rgba(180, 200, 255, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(cx, cd.y, cd.rx, cd.ry, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

// ─── Collision Detection ─────────────────────────────────────────────
/** Classic AABB overlap test. Returns true if the two rects overlap. */
function rectsOverlap(ax, ay, aw, ah, bx, by, bw, bh) {
  return ax < bx + bw && ax + aw > bx &&
         ay < by + bh && ay + ah > by;
}

function checkCollisions() {
  const hb = ghost.hitbox();

  for (const ob of obstacles) {
    // Top pillar
    if (rectsOverlap(hb.x, hb.y, hb.w, hb.h, ob.x, 0, ob.w, ob.gapY)) {
      return ob.label;
    }
    // Bottom pillar
    const botY = ob.gapY + ob.gapH;
    if (rectsOverlap(hb.x, hb.y, hb.w, hb.h, ob.x, botY, ob.w, FLOOR_Y - botY)) {
      return ob.label;
    }
  }

  // Floor
  if (ghost.y + ghost.h >= FLOOR_Y) {
    return 'Floor';
  }

  return null;
}

// ─── Scoring ─────────────────────────────────────────────────────────
function addScore(pts) {
  score += pts;
  speedMult = 1 + Math.floor(score / 100) * 0.1; // Speed up every 100 pts

  // Animate HUD
  const el = document.getElementById('score-display');
  el.textContent = score;
  el.classList.remove('bump');
  void el.offsetWidth; // reflow to restart animation
  el.classList.add('bump');
}

function saveHighScore() {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('kgr_highscore', String(highScore));
    return true; // new best
  }
  return false;
}

// ─── Screen Management ───────────────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll('.overlay').forEach(el => el.classList.remove('active'));
  if (id) document.getElementById(id).classList.add('active');
}

function updateHUD() {
  document.getElementById('score-display').textContent     = score;
  document.getElementById('highscore-display').textContent = highScore;
}

// ─── Game State Machine ──────────────────────────────────────────────
function startGame() {
  state         = 'playing';
  score         = 0;
  speedMult     = 1;
  frameCount    = 0;
  obstacles     = [];
  credits       = [];
  particles     = [];
  obstacleTimer = 0;
  creditTimer   = 0;

  ghost.x          = 120;
  ghost.y          = GAME_H / 2;
  ghost.vy         = 0;
  ghost.alive      = true;
  ghost.flickerTimer = 0;

  updateHUD();
  showScreen(null); // hide all overlays → canvas visible
}

function triggerGameOver(collidedWith) {
  state = 'gameover';
  ghost.alive = false;

  spawnDeathParticles(ghost.x + ghost.w / 2, ghost.y + ghost.h / 2);
  playSound('gamelost', 0.9);

  const isNewBest = saveHighScore();

  // Populate game over screen
  document.getElementById('final-score').textContent = score;
  document.getElementById('death-reason').textContent =
    collidedWith === 'Floor'
      ? 'Hit the ground floor'
      : `Collision with: ${collidedWith}`;

  const newBestRow  = document.getElementById('new-best-row');
  const bestRow     = document.getElementById('best-row');

  if (isNewBest) {
    newBestRow.style.display = 'flex';
    bestRow.style.display    = 'none';
    document.getElementById('final-best').textContent = highScore;
  } else {
    newBestRow.style.display = 'none';
    bestRow.style.display    = 'flex';
    document.getElementById('final-best-prev').textContent = highScore;
  }

  updateHUD();

  // Short delay before showing game over screen so death particles are visible
  setTimeout(() => showScreen('screen-gameover'), 500);
}

// ─── Main Game Loop ──────────────────────────────────────────────────
function gameLoop(timestamp) {
  const dt = Math.min(timestamp - lastTime, 50); // cap dt to avoid spiral
  lastTime = timestamp;

  ctx.clearRect(0, 0, GAME_W, GAME_H);

  if (state === 'playing') {
    // ── Update ──
    updateStars();
    ghost.update();

    updateObstacles(dt);
    updateCredits(dt);
    updateParticles();

    // ── Collision Check ──
    const hit = checkCollisions();
    if (hit && ghost.alive) {
      triggerGameOver(hit);
    }

    frameCount++;

    // ── Draw ──
    drawBackground();
    obstacles.forEach(drawObstacle);
    credits.forEach(drawCredit);
    drawParticles();
    if (ghost.alive) ghost.draw();

    // Subtle scanline overlay for CRT vibe (very cheap)
    drawScanlines();

  } else if (state === 'gameover') {
    // Keep rendering the frozen scene during death-particle burst
    drawBackground();
    obstacles.forEach(drawObstacle);
    credits.forEach(drawCredit);
    updateParticles();
    drawParticles();
    drawScanlines();

  } else {
    // 'start' state — animated background only
    updateStars();
    drawBackground();
    drawScanlines();
  }

  requestAnimationFrame(gameLoop);
}

/** Cheap CRT scanline effect using semi-transparent horizontal lines. */
function drawScanlines() {
  ctx.save();
  ctx.globalAlpha = 0.025;
  ctx.fillStyle   = '#000';
  for (let y = 0; y < GAME_H; y += 2) {
    ctx.fillRect(0, y, GAME_W, 1);
  }
  ctx.restore();
}

// ─── Canvas Sizing ───────────────────────────────────────────────────
/**
 * Scales the canvas to fill the viewport while keeping 16:9 aspect ratio.
 * The CSS scales the element; logical pixel size stays GAME_W × GAME_H.
 */
function resizeCanvas() {
  const vpW   = window.innerWidth;
  const vpH   = window.innerHeight;
  const scale = Math.min(vpW / GAME_W, vpH / GAME_H);

  canvas.width  = GAME_W;
  canvas.height = GAME_H;
  canvas.style.width  = `${GAME_W  * scale}px`;
  canvas.style.height = `${GAME_H * scale}px`;
}

// ─── Input Handling ──────────────────────────────────────────────────
function handleFlapInput() {
  initAudio();   // initialise AudioContext on first user gesture (browser autoplay policy)
  if (state === 'playing') {
    ghost.flap();
  }
}

// Keyboard
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space' || e.code === 'ArrowUp') {
    e.preventDefault();
    handleFlapInput();
  }
});

// Touch / mouse on canvas (gameplay flap)
canvas.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  handleFlapInput();
});

// UI Buttons
document.getElementById('btn-start').addEventListener('click', () => { initAudio(); startGame(); });
document.getElementById('btn-restart').addEventListener('click', () => { initAudio(); startGame(); });
document.getElementById('btn-menu').addEventListener('click', () => {
  state = 'start';
  showScreen('screen-start');
  updateHUD();
});

// ─── Bootstrap ───────────────────────────────────────────────────────
(function init() {
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  initStars();

  // Display saved high score on start screen
  document.getElementById('highscore-display').textContent = highScore;

  // Start loop once the sprite is loaded (or immediately if it errors)
  function startLoop() {
    requestAnimationFrame((ts) => {
      lastTime = ts;
      gameLoop(ts);
    });
  }

  if (ghostImg.complete) {
    startLoop();
  } else {
    ghostImg.addEventListener('load',  startLoop);
    ghostImg.addEventListener('error', startLoop);
  }
})();
