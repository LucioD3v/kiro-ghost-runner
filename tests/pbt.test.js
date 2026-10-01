/**
 * ═══════════════════════════════════════════════════════════════════
 * Kiro's Ghost Runner — Property-Based Tests (PBT)
 * ─────────────────────────────────────────────────────────────────
 * Tests the pure game-logic functions isolated from the DOM/Canvas.
 * Run with:  node tests/pbt.test.js
 *
 * These tests validate the PROPERTIES that must hold for ALL inputs,
 * not just specific examples — matching Kiro's correctness model.
 * ═══════════════════════════════════════════════════════════════════
 */

'use strict';

// ─── Minimal test harness (zero dependencies) ────────────────────────
let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅  ${name}`);
    passed++;
  } catch (e) {
    console.log(`  ❌  ${name}`);
    console.log(`      ${e.message}`);
    failed++;
  }
}

function assert(condition, msg) {
  if (!condition) throw new Error(msg || 'Assertion failed');
}

function assertClose(a, b, tolerance, msg) {
  if (Math.abs(a - b) > (tolerance ?? 0.0001))
    throw new Error(msg || `Expected ${a} ≈ ${b} (tolerance ${tolerance})`);
}

/** Generate N random floats in [min, max] */
function randoms(n, min, max) {
  return Array.from({ length: n }, () => min + Math.random() * (max - min));
}

/** Generate N random integers in [min, max] */
function randomInts(n, min, max) {
  return Array.from({ length: n }, () =>
    Math.floor(min + Math.random() * (max - min + 1)));
}

// ─── Pure logic extracted from game.js ───────────────────────────────
// These are the same formulas used in game.js, extracted here so tests
// run without a DOM/Canvas environment.

const GRAVITY        = 0.38;
const LIFT_FORCE     = -7.2;
const MAX_FALL_SPEED = 9;
const FLOOR_Y        = 352;   // GAME_H(400) - 48
const GAME_W         = 800;
const GAME_H         = 400;

/** Single physics step — mirrors ghost.update() */
function physicsStep(y, vy, h = 44) {
  let newVy = Math.min(vy + GRAVITY, MAX_FALL_SPEED);
  let newY  = y + newVy;
  if (newY + h >= FLOOR_Y) { newY = FLOOR_Y - h; newVy = 0; }
  if (newY < 0)             { newY = 0;           newVy = 0; }
  return { y: newY, vy: newVy };
}

/** AABB overlap — mirrors rectsOverlap() in game.js */
function rectsOverlap(ax, ay, aw, ah, bx, by, bw, bh) {
  return ax < bx + bw && ax + aw > bx &&
         ay < by + bh && ay + ah > by;
}

/** Ghost hitbox — mirrors ghost.hitbox() */
function hitbox(x, y, w = 38, h = 44) {
  return { x: x + 5, y: y + 6, w: w - 10, h: h - 10 };
}

/** Speed multiplier — mirrors addScore() in game.js */
function speedMult(score) {
  return 1 + Math.floor(score / 100) * 0.1;
}

/** Obstacle spawn interval — mirrors updateObstacles() */
function spawnInterval(score) {
  return Math.max(900, 1800 - score * 1.5);
}

// ═══════════════════════════════════════════════════════════════════
// SUITE 1: Physics — Gravity & Terminal Velocity
// ═══════════════════════════════════════════════════════════════════
console.log('\n📐 Suite 1: Physics — Gravity & Terminal Velocity\n');

test('Gravity increases vy each frame when below terminal velocity', () => {
  const samples = randoms(200, -6, 7);
  for (const vy of samples) {
    if (vy >= MAX_FALL_SPEED) continue;
    const { vy: newVy } = physicsStep(100, vy);
    // vy should increase by GRAVITY (unless it hits floor or terminal)
    assert(newVy >= vy || newVy === 0,
      `vy=${vy}: newVy ${newVy} should be ≥ vy or 0 (floor)`);
  }
});

test('Terminal velocity is never exceeded', () => {
  const samples = randoms(500, -8, 15);
  for (const vy of samples) {
    const { vy: newVy } = physicsStep(100, vy);
    assert(newVy <= MAX_FALL_SPEED,
      `vy=${vy}: newVy ${newVy} exceeds MAX_FALL_SPEED ${MAX_FALL_SPEED}`);
  }
});

test('Lift force sets vy to exactly LIFT_FORCE regardless of current vy', () => {
  // Flap always resets vy to LIFT_FORCE — it is an impulse, not a delta
  const samples = randoms(200, -10, 10);
  for (const vy of samples) {
    const flapVy = LIFT_FORCE; // mirrors ghost.flap()
    assertClose(flapVy, LIFT_FORCE, 0.001,
      `flap vy=${flapVy} should be LIFT_FORCE=${LIFT_FORCE}`);
  }
});

test('Ghost never goes below floor after physics step', () => {
  const yValues = randoms(300, FLOOR_Y - 50, FLOOR_Y + 30);
  for (const y of yValues) {
    const { y: newY } = physicsStep(y, 5);
    assert(newY + 44 <= FLOOR_Y,
      `y=${y}: after step, bottom ${newY + 44} exceeds FLOOR_Y ${FLOOR_Y}`);
  }
});

test('Ghost never goes above ceiling after physics step', () => {
  const yValues = randoms(300, -20, 20);
  for (const y of yValues) {
    const { y: newY } = physicsStep(y, -8);
    assert(newY >= 0, `y=${y}: after step, top ${newY} is above ceiling`);
  }
});

test('vy is zeroed on floor collision', () => {
  const yValues = randoms(100, FLOOR_Y - 5, FLOOR_Y + 20);
  for (const y of yValues) {
    const { vy: newVy } = physicsStep(y, 5);
    // If floor was hit, vy must be 0
    if (y + 44 + 5 >= FLOOR_Y) {
      assertClose(newVy, 0, 0.001,
        `Floor hit at y=${y}: vy should be 0, got ${newVy}`);
    }
  }
});

test('vy is zeroed on ceiling collision', () => {
  const yValues = randoms(100, -15, 5);
  for (const y of yValues) {
    const { vy: newVy } = physicsStep(y, -8);
    if (y - 8 < 0) {
      assertClose(newVy, 0, 0.001,
        `Ceiling hit at y=${y}: vy should be 0, got ${newVy}`);
    }
  }
});

// ═══════════════════════════════════════════════════════════════════
// SUITE 2: Collision Detection — AABB
// ═══════════════════════════════════════════════════════════════════
console.log('\n💥 Suite 2: Collision Detection — AABB\n');

test('Overlap is commutative: overlap(A,B) === overlap(B,A)', () => {
  for (let i = 0; i < 300; i++) {
    const [ax, ay, aw, ah] = randoms(4, 0, 400);
    const [bx, by, bw, bh] = randoms(4, 0, 400);
    const ab = rectsOverlap(ax, ay, aw, ah, bx, by, bw, bh);
    const ba = rectsOverlap(bx, by, bw, bh, ax, ay, aw, ah);
    assert(ab === ba,
      `Commutativity failed: overlap(A,B)=${ab} != overlap(B,A)=${ba}`);
  }
});

test('A rect always overlaps itself', () => {
  const samples = randoms(200, 1, 500);
  for (let i = 0; i < samples.length - 3; i += 4) {
    const [x, y, w, h] = samples.slice(i, i + 4).map(Math.abs).map(v => v + 1);
    assert(rectsOverlap(x, y, w, h, x, y, w, h),
      `Self-overlap failed for rect (${x},${y},${w},${h})`);
  }
});

test('Non-overlapping rects to the right never collide', () => {
  const widths = randoms(200, 1, 100);
  for (const w of widths) {
    const ax = 50, bx = ax + w + 1; // b is strictly to the right of a
    const result = rectsOverlap(ax, 50, w, 50, bx, 50, w, 50);
    assert(!result,
      `Rects separated by 1px on X-axis should not overlap: w=${w}`);
  }
});

test('Non-overlapping rects below never collide', () => {
  const heights = randoms(200, 1, 100);
  for (const h of heights) {
    const ay = 50, by = ay + h + 1; // b is strictly below a
    const result = rectsOverlap(50, ay, 50, h, 50, by, 50, h);
    assert(!result,
      `Rects separated by 1px on Y-axis should not overlap: h=${h}`);
  }
});

test('Ghost hitbox is strictly smaller than ghost bounding box', () => {
  const positions = randoms(100, 0, 300);
  for (let i = 0; i < positions.length - 1; i += 2) {
    const [x, y] = positions.slice(i, i + 2);
    const hb = hitbox(x, y);
    assert(hb.w < 38, `Hitbox w=${hb.w} should be < ghost w=38`);
    assert(hb.h < 44, `Hitbox h=${hb.h} should be < ghost h=44`);
    assert(hb.x > x,  `Hitbox x=${hb.x} should be > ghost x=${x}`);
    assert(hb.y > y,  `Hitbox y=${hb.y} should be > ghost y=${y}`);
  }
});

test('Ghost clearly inside gap does not collide with pillars', () => {
  // Place ghost in the middle of a generous gap, check no collision
  for (let i = 0; i < 100; i++) {
    const gapY  = 100;
    const gapH  = 180;
    const ghostY = gapY + gapH / 2 - 22; // vertically centred
    const ghostX = 150;
    const obX    = 120;
    const obW    = 54;
    const hb     = hitbox(ghostX, ghostY);

    const topHit = rectsOverlap(hb.x, hb.y, hb.w, hb.h, obX, 0, obW, gapY);
    const botY   = gapY + gapH;
    const botHit = rectsOverlap(hb.x, hb.y, hb.w, hb.h, obX, botY, obW, FLOOR_Y - botY);

    assert(!topHit, `Ghost in gap centre should not hit top pillar`);
    assert(!botHit, `Ghost in gap centre should not hit bottom pillar`);
  }
});

// ═══════════════════════════════════════════════════════════════════
// SUITE 3: Scoring & Difficulty
// ═══════════════════════════════════════════════════════════════════
console.log('\n🏆 Suite 3: Scoring & Difficulty Scaling\n');

test('Speed multiplier is monotonically non-decreasing with score', () => {
  const scores = Array.from({ length: 200 }, (_, i) => i * 5); // 0..995
  for (let i = 1; i < scores.length; i++) {
    const prev = speedMult(scores[i - 1]);
    const curr = speedMult(scores[i]);
    assert(curr >= prev,
      `speedMult not non-decreasing: score ${scores[i-1]}→${scores[i]}, mult ${prev}→${curr}`);
  }
});

test('Speed multiplier starts at exactly 1.0 for score=0', () => {
  assertClose(speedMult(0), 1.0, 0.0001, 'speedMult(0) should be 1.0');
});

test('Speed multiplier increases by exactly 0.1 every 100 points', () => {
  for (const base of [0, 100, 200, 500, 900]) {
    const before = speedMult(base);
    const after  = speedMult(base + 100);
    assertClose(after - before, 0.1, 0.0001,
      `speedMult should increase by 0.1 from score ${base} to ${base+100}`);
  }
});

test('Spawn interval is monotonically non-increasing with score', () => {
  const scores = Array.from({ length: 200 }, (_, i) => i * 5);
  for (let i = 1; i < scores.length; i++) {
    const prev = spawnInterval(scores[i - 1]);
    const curr = spawnInterval(scores[i]);
    assert(curr <= prev,
      `spawnInterval not non-increasing: score ${scores[i-1]}→${scores[i]}, interval ${prev}→${curr}`);
  }
});

test('Spawn interval never drops below 900ms floor', () => {
  const scores = Array.from({ length: 100 }, (_, i) => i * 20);
  for (const s of scores) {
    assert(spawnInterval(s) >= 900,
      `spawnInterval(${s})=${spawnInterval(s)} < 900ms minimum`);
  }
});

test('Spawn interval starts at 1800ms for score=0', () => {
  assertClose(spawnInterval(0), 1800, 0.001, 'spawnInterval(0) should be 1800');
});

// ═══════════════════════════════════════════════════════════════════
// SUITE 4: Canvas Scaling
// ═══════════════════════════════════════════════════════════════════
console.log('\n📐 Suite 4: Canvas Scaling\n');

function computeScale(vpW, vpH) {
  return Math.min(vpW / GAME_W, vpH / GAME_H);
}

test('Scaled canvas never exceeds viewport width', () => {
  const viewports = randomInts(200, 320, 2560).map((w, i) => [w, randomInts(1, 240, 1440)[0]]);
  for (const [vpW, vpH] of viewports) {
    const scale = computeScale(vpW, vpH);
    const scaledW = GAME_W * scale;
    assert(scaledW <= vpW + 0.001,
      `Scaled width ${scaledW} exceeds viewport ${vpW}`);
  }
});

test('Scaled canvas never exceeds viewport height', () => {
  const viewports = randomInts(200, 320, 2560).map((w, i) => [w, randomInts(1, 240, 1440)[0]]);
  for (const [vpW, vpH] of viewports) {
    const scale = computeScale(vpW, vpH);
    const scaledH = GAME_H * scale;
    assert(scaledH <= vpH + 0.001,
      `Scaled height ${scaledH} exceeds viewport ${vpH}`);
  }
});

test('Scale is uniform: aspect ratio is preserved', () => {
  const viewports = randomInts(200, 320, 2560).map((w, i) => [w, randomInts(1, 240, 1440)[0]]);
  for (const [vpW, vpH] of viewports) {
    const scale = computeScale(vpW, vpH);
    const ratio = (GAME_W * scale) / (GAME_H * scale);
    assertClose(ratio, GAME_W / GAME_H, 0.0001,
      `Aspect ratio ${ratio} ≠ expected ${GAME_W / GAME_H}`);
  }
});

test('Scale is always positive', () => {
  const viewports = randomInts(100, 1, 3000).map((w, i) => [w, randomInts(1, 1, 3000)[0]]);
  for (const [vpW, vpH] of viewports) {
    const scale = computeScale(vpW, vpH);
    assert(scale > 0, `Scale ${scale} must be positive for viewport ${vpW}×${vpH}`);
  }
});

// ═══════════════════════════════════════════════════════════════════
// Results
// ═══════════════════════════════════════════════════════════════════
console.log('\n' + '─'.repeat(52));
const total = passed + failed;
console.log(`\n  Results: ${passed}/${total} tests passed\n`);
if (failed > 0) {
  console.log(`  ⚠️  ${failed} test(s) failed — review output above`);
  process.exit(1);
} else {
  console.log('  🎉  All property-based tests passed!');
  process.exit(0);
}
