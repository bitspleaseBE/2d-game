# Wandertrap — Full Game & Gameplay Review

*Reviewed by playing the game in a real browser (Chromium via Playwright), reading every source file, and running the e2e suite (14/14 tests pass, no console errors).*

> **Status update:** the P0–P2 recommendations and the bug table below have been implemented in a follow-up commit — loop-driven movement, attack cooldown, guard death animations and tighter hitboxes, distinct themed levels 3–5, working explosive traps, the full powerup set with guard drops, a level-5 boss, persistent high scores, synthesized sound effects, and HUD/controls improvements. Still open (P3): touch controls, doors + keys, and the pick/axe/potion actions. This document is kept as the original review for context.

## Verdict

The skeleton is genuinely good: clean entity/screen/level structure, seeded RNG for reproducible runs, working pause/continue, a charming level 1, and a solid e2e test suite. But the game currently plays like a tech demo rather than a game — roughly **half of the designed mechanics are stubs**, 3 of the 5 levels are identical copies, and the two core verbs (moving and attacking) both have game-feel problems. That is the "low on details" feeling: the systems exist in name, but few of them push back on the player.

---

## What works well

- **Architecture**: entities inherit from a common `Entity` base, screens are isolated modules, levels are declarative ASCII grids, settings are centralized. Easy to extend.
- **Testing**: 14 passing Playwright tests, deterministic via `?seed=` and the `step()`/`teleportPlayer()`/`spawnGuard()` hooks. This is far better than most hobby games.
- **Guard AI**: line-of-sight detection with wall raycast, chase with axis-priority movement, attack-facing, and an idle "look around" rotation. Best-developed system in the game.
- **Presentation touches**: exit ruin with animated sparkle particles and glow, radial-gradient floor, hurt-flicker invulnerability, mirrored left-facing sprites, HUD with score/lives/health bar.
- **Screen flow**: splash → welcome → story/high-scores/game → level-complete/game-over/game-won all wired correctly, with pause-preserving Continue.

---

## Critical gameplay issues

### 1. Movement is event-driven, not loop-driven — the game feels stuttery
`game.js` moves the player 5px per `keydown` event. Holding a key therefore depends on OS key auto-repeat: an initial step, a ~500ms pause, then repeats at a rate the game doesn't control. Measured in-browser: holding ArrowDown for a full second moved the player **5px** (one event) before auto-repeat kicked in. Consequences:

- Movement speed varies per OS/keyboard settings and is decoupled from the frame rate.
- Diagonal movement is impossible.
- The 1000ms debounce that resets `action` to `"idle"` means the walk animation keeps playing for a second after you stop.

**Fix**: track pressed keys in a Set on `keydown`/`keyup` and apply movement every frame in `updateGameState()`. This is the single highest-impact change for game feel.

### 2. Attack has no cooldown — combat is trivially cheesable
`playerAttack()` applies 50 damage on every `keydown`. Verified: two spammed calls kill a 100hp guard in under 1ms. Holding spacebar (key repeat) melts any guard before it can respond. The 250ms debounce only resets the *animation*; it does not gate damage. There is effectively no combat risk, which removes most of the game's tension.

**Fix**: add an attack cooldown (~400ms) and only apply damage once per swing (ideally on a specific animation frame).

### 3. Levels 3, 4, and 5 are byte-for-byte identical
`level-data.js:70–119`: the "medium", "hard", and "expert" layouts are exact copies of each other, and near-copies of level 1's inner maze. The `difficulty` field is never read by any code. In practice the game has **2 real levels**, and a player who finishes level 2 replays the same small maze three times to win. This is the biggest content gap. Levels 3–5 also have no outer boundary — the maze floats in an open green field the player can freely wander (only the canvas edge stops them), and docs/levels.md describes 5 distinct levels that don't exist.

### 4. Explosives — the game's namesake traps — do nothing
`Explosive` spawns with `#isHidden = true` and nothing ever calls `reveal()` or `detonate()`; the collision branch for an active explosive is an empty comment (`game.js:311`). So the 'E' cells in levels 1/3/4/5 are completely inert: invisible, harmless, uncollectable. Additionally `new Explosive(x, y, this.assets)` reads `assets.explosiveSprite`, which doesn't exist in any loader — it only avoids a crash because `draw()` never passes the hidden check. A game called Wander*trap* currently has zero traps.

### 5. Half the powerups have no effect
`initializeEntities()` spawns `"health"` or `"mana"` crystals, but:
- `applyPowerup()` (`player.js:150`) only implements `"health"` — mana crystals award score and vanish.
- `Powerup.selectSprites()` supports health/speed/strength/invincibility, so `"mana"` silently falls through to the default blue crystal.
- Speed, strength, and invincibility (sprites loaded, settings defined) never spawn at all.

### 6. Three of the seven player actions are stubs
`pick` (p), `axe` (x), and `potion` (u) only switch the animation — no logic behind any of them (`player.js:121–136`). Collected explosives go into `player.explosives` but can never be used; `keys` is an array nothing ever fills; there are no doors to unlock. The controls also aren't documented anywhere in-game, so players can't even discover these keys exist.

### 7. Combat depth is one-dimensional
- Guards deal **touch damage only** (10hp on overlap; measured ~10hp/sec given the 1s invulnerability window). Their attack animation plays, but there is no windup, no lunge, no ranged threat — the optimal strategy everywhere is "walk into the guard and spam space".
- Guard **death animation never shows**: defeated guards are removed from the array in the same frame (`game.js:211–220`). Death sprites are loaded for all three orcs and never render a single frame.
- Guard **hurt flash is invisible**: `hurt()` sets the sprite, but `update()` overwrites it with idle/walk on the next tick.
- Guards never drop anything, despite the class docstring promising powerups/explosives/keys drops.

### 8. Score and progression carry no meaning
Everything is a flat 100 points (powerup, kill, level clear). There is no time bonus, no completion bonus per difficulty, no reason to fight rather than run past guards. The **high-score table is hardcoded fake data** (`high-score.js`) — a real run's score is never saved, and there's no name entry. The story screen promises Max, the Minotaur, NPCs, and a sarcastic dragon; none exist. The final level has no boss — the game just ends.

---

## Bugs (smaller, but real)

| # | Where | Issue |
|---|-------|-------|
| 1 | `game.js:308–338` | `splice` inside `forEach` skips the next element — two adjacent pickups collected in one frame drops one collision check that frame. |
| 2 | `guard.js:242`, `settings.js:30` | Guard hitbox is 91×91 from its position, but the sprite draws offset (-10,-10); the hitbox is 1.4 cells wide, so contact damage triggers before sprites visibly touch. Feels unfair. |
| 3 | `player.js:212` | Hurt flicker uses wall-clock `setInterval` while everything else is frame-based — pausing mid-flicker keeps the timer running; `step()`-based tests can't reproduce it. |
| 4 | `player.js:13` / `settings.js:17` | Player speed hardcoded to 5, duplicating the unused `playerSettings.speed`. Same for `gameSettings.maxLevels` (unused; comment says it "must match" level-data — it will drift). |
| 5 | `index.js:40` | `totalAssets = 34` hardcoded — adding/removing one asset silently breaks the splash progress %. Count the URLs instead. |
| 6 | `game.js:206` | Attack box ignores walls; combined with the oversized guard hitbox you can damage a guard through a thin wall. |
| 7 | `level-data.js:38` | Level 1's decorative tree border is made of 'T' obstacles with 100hp — two axe hits open a hole and the player can wander the void outside the maze. |
| 8 | `powerup.js:29` | Unknown powerup types silently render as blue crystals instead of failing loudly — this is what hides bug #5 above. |
| 9 | `index.js:71` | Escape on the welcome screen re-renders the welcome screen (harmless but wasteful); Escape during game-over also drops you to a welcome screen with a stale Continue-less state. |
| 10 | `README.md:3` | Calls it a "2D platform game" — it's a top-down maze/dungeon crawler. Docs also reference a Key (K) entity and level themes that don't exist in code. |

---

## Missing systems (the "details" that would make it feel like a game)

1. **Audio — nothing at all.** `soundSettings` (mute/volume) exists but no sound is ever loaded or played. Even 4 sounds (swing, hurt, pickup, level-clear) would transform the feel.
2. **In-game controls/help.** Nothing tells the player about Space/p/x/u/Escape. A one-line footer under the canvas or a "How to play" screen would fix it.
3. **HUD gaps**: no level indicator ("Level 3/5"), no powerup/explosive inventory, hearts silently disappear at 0 lives. The health bar turning red below 30 is nice — build on that.
4. **Level themes**: sand/snow ruin exit sprites and 3 tree sprites are loaded but only `yellowRuin`/palms are used. The per-level `theme` field is never read. Reskinning levels 2–5 (snow maze, sand ruins) is nearly free — the assets are already shipped and bundled.
5. **Persistence**: no localStorage for high scores, settings, or level progress.
6. **Responsiveness**: fixed 1280×640 canvas, no scaling, no touch controls.

---

## Prioritized recommendations

**P0 — game feel (do these first, ~a day of work):**
1. Key-state-driven movement in the game loop (fixes stutter, enables diagonals).
2. Attack cooldown + let the death animation play before removing guards.
3. Shrink guard hitbox to match the sprite.

**P1 — content (turns 2 levels into a game):**
4. Design real layouts for levels 3–5 with escalating guard counts and layouts that use the whole 20×10 grid; use the loaded snow/sand tilesets to differentiate them.
5. Implement explosives: reveal on proximity, fuse timer, blast damage to player *and* guards (gives collected explosives a use: place with a key to break walls or kill guard clusters).
6. Implement the remaining powerups (speed/strength/invincibility with timed effects), and make guards drop them.
7. Add the Minotaur as a level-5 boss — the story already sells it.

**P2 — systems:**
8. Real high scores (localStorage + name entry on game over/won).
9. Sound effects and a mute toggle (settings already exist).
10. Controls overlay + level indicator in HUD.

**P3 — polish:**
11. Responsive canvas scaling; touch controls.
12. Score variety (time bonus, no-damage bonus); doors + keys to give `player.keys` meaning.
13. Fix the smaller bugs in the table above; align README/docs with reality.
