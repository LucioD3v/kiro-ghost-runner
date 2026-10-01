# Requirements — Kiro's Ghost Runner Core

## Overview

Kiro's Ghost Runner is a browser-based HTML5 Canvas runner game where the player
controls Kiro's official ghost mascot, dodging procedurally generated developer-themed
obstacles and collecting Kiro Credits to maximize their score.

---

## Functional Requirements

### FR-1: Player Character

WHEN the game starts
THE SYSTEM SHALL place the ghost at x=120, vertically centered on the canvas

WHEN the player presses Space, Arrow Up, clicks, or taps the canvas
THE SYSTEM SHALL apply an upward velocity impulse of -7.2 px/frame to the ghost

WHEN no input is received
THE SYSTEM SHALL apply a constant downward gravity of 0.38 px/frame to the ghost

WHEN the ghost's downward velocity exceeds 9 px/frame
THE SYSTEM SHALL clamp it to 9 px/frame (terminal velocity)

WHEN the ghost reaches the floor boundary (FLOOR_Y)
THE SYSTEM SHALL stop vertical movement and trigger game over

WHEN the ghost reaches the ceiling (y=0)
THE SYSTEM SHALL clamp position and zero vertical velocity

### FR-2: Obstacle System

WHEN the game state is 'playing'
THE SYSTEM SHALL spawn a new pillar-pair obstacle from the right edge every 1800ms (decreasing with score)

WHEN an obstacle is spawned
THE SYSTEM SHALL assign it a random vertical gap of 130–190px at a random Y position

WHEN an obstacle is spawned
THE SYSTEM SHALL assign it a random label from the bug-label pool

WHEN the ghost's hitbox clears an obstacle's right edge without collision
THE SYSTEM SHALL award +5 points and mark the obstacle as scored

WHEN an obstacle scrolls fully off the left edge
THE SYSTEM SHALL remove it from the entity pool

### FR-3: Credit Collectibles

WHEN the game state is 'playing'
THE SYSTEM SHALL spawn a Kiro Credit collectible every 900ms

WHEN the ghost's hitbox overlaps a credit's bounding box
THE SYSTEM SHALL award +10 points, mark the credit collected, and spawn a particle burst

WHEN a credit scrolls off the left edge
THE SYSTEM SHALL remove it from the entity pool

### FR-4: Scoring & Difficulty

WHEN the player's score increases
THE SYSTEM SHALL update the on-screen score display with a bump animation

WHEN the score crosses a multiple of 100
THE SYSTEM SHALL increase the speed multiplier by 0.1 (starting at ×1.0)

WHEN the game ends
THE SYSTEM SHALL compare the run score against the stored high score

WHEN a new high score is achieved
THE SYSTEM SHALL persist it to localStorage under key 'kgr_highscore'

### FR-5: Game States

WHEN the page loads
THE SYSTEM SHALL display the Start screen with the Kiro mascot and "Press Space to Start"

WHEN the player activates start input on the Start screen
THE SYSTEM SHALL transition to the 'playing' state and hide all overlay screens

WHEN a collision is detected
THE SYSTEM SHALL transition to 'gameover' state, spawn death particles, and show the Game Over screen after 500ms

WHEN the player clicks Restart on the Game Over screen
THE SYSTEM SHALL reset all entity pools, score, and speed and return to 'playing' state

WHEN the player clicks Main Menu on the Game Over screen
THE SYSTEM SHALL return to 'start' state and show the Start screen

### FR-6: Collision Detection

WHEN the ghost's inset hitbox (5px margin on all sides) overlaps any obstacle pillar rectangle
THE SYSTEM SHALL trigger game over with the obstacle's label as the cause

WHEN the ghost's inset hitbox overlaps the floor boundary
THE SYSTEM SHALL trigger game over with cause "Floor"

### FR-7: Visual & Audio

WHEN the game renders each frame
THE SYSTEM SHALL maintain 60 FPS via requestAnimationFrame

WHEN the ghost sprite PNG loads successfully
THE SYSTEM SHALL render it via drawImage() with a neon cyan radial glow

WHEN the ghost sprite PNG fails to load
THE SYSTEM SHALL fall back to a canvas-drawn blob with eyes

WHEN the canvas viewport changes
THE SYSTEM SHALL scale the 800×400 logical canvas to fill the viewport uniformly

---

## Non-Functional Requirements

### NFR-1: Performance
The game loop SHALL maintain ≥55 FPS on a mid-range device.
Delta time SHALL be capped at 50ms to prevent spiral-of-death on tab blur.

### NFR-2: Compatibility
The game SHALL run in any Chromium/Firefox/Safari browser released after 2020
without a build step, server, or external dependencies.

### NFR-3: Accessibility
All overlay screens SHALL use semantic HTML with aria-label attributes.
The game canvas SHALL have a text alternative describing the game for screen readers.

### NFR-4: Persistence
Only the high score SHALL be persisted (localStorage).
No user data, telemetry, or network requests SHALL be made.
