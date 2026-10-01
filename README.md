# 👻 Kiro's Ghost Runner

> A dependency-free HTML5 Canvas mini-game built for the **Kiro University Challenge**.

![Game Preview](https://img.shields.io/badge/status-playable-brightgreen?style=flat-square)
![Stack](https://img.shields.io/badge/stack-HTML5%20%7C%20CSS3%20%7C%20JS%20ES6+-blue?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-purple?style=flat-square)

---

## 🎮 How to Play

1. Open `index.html` in any modern browser — **no build step required**.
2. Press `Space`, `↑`, or **click/tap** to make the ghost fly upward.
3. Dodge the bug obstacles (`Memory Leak`, `CORS Block`, `Timeout Error`…).
4. Collect the ★ **Kiro Credits** for bonus points.
5. Survive as long as possible — the game speeds up as your score climbs.

---

## 🚀 Running Locally

**Option A — Direct file open (simplest):**
```
Just double-click index.html
```

**Option B — Local dev server (recommended for video demos):**
```bash
npx serve .
# or
python -m http.server 8080
```
Then open `http://localhost:8080`.

---

## 📁 File Structure

```
kiro-ghost-runner/
├── index.html            # Game entry point
├── style.css             # Full UI & theme styles
├── game.js               # Complete game engine (~450 lines)
├── README.md             # This file
└── .kiro/
    └── steering/
        ├── project-overview.md   # Stack, goals, setup
        ├── architecture.md       # Engine design & data flow
        └── gameplay-design.md    # Mechanics, scoring, balance
```

---

## ⚙️ Technical Highlights

| Feature              | Implementation                              |
|----------------------|---------------------------------------------|
| Rendering            | HTML5 Canvas 2D, 60 FPS via `rAF`           |
| Ghost physics        | Gravity + lift impulse, terminal velocity   |
| Collision detection  | AABB with inset hitbox for forgiving play   |
| Obstacles            | Procedural pillar pairs with random gaps    |
| Difficulty scaling   | Speed multiplier increases every 100 pts   |
| Collectibles         | Spinning star credits, particle burst FX   |
| Background           | Parallax stars + scrolling cloud wisps      |
| Persistence          | High score via `localStorage`               |
| Canvas scaling       | Uniform scale to fill any viewport size     |

---

## 🎨 Visual Theme

Dark cloud/space environment with **neon cyan** ghost, **yellow** credits,
and **red/purple** obstacle pillars — styled to evoke a developer console
running in the cloud.

---

## 🏆 Scoring

| Event                  | Points |
|------------------------|--------|
| Clear obstacle gap     | +5     |
| Collect a Kiro Credit  | +10    |

---

## 📜 License

MIT — built for the Kiro University Challenge.

---

## 👤 Author

**Vicente Guzman** ([@LucioD3v](https://github.com/LucioD3v))
Built for the **Kiro University Challenge**.
