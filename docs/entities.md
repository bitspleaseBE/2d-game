# Entity Overview

This document provides an overview of the entities in "Wandertrap" and the letters that represent them in the game layout.

## Entities and Their Representations

- **Player (P)**
  - Moves left, right, up, and down — movement is applied every frame while a key is held, so diagonals work and speed is frame-consistent.
  - Attacks with the sword (Space). Attacks have a short cooldown (~0.4s) and only hit in the facing direction.
  - Collects powerup crystals by walking over them.
  - Has 100 health and a short invulnerability window (with a flicker) after each hit.

- **Guard (G)**
  - Patrols in place, looking around; detects the player within 5 cells when it has a clear line of sight.
  - Chases the player and deals contact damage (10).
  - Takes two sword hits to defeat; plays a hurt flash and a death animation.
  - Has a 40% chance to drop a random powerup where it fell.

- **Boss (B)**
  - A hulking guard that protects the final exit on level 5.
  - Triple health (300, with a visible health bar), double contact damage (20), faster, and spots the player from 7 cells.
  - Defeating it awards 500 points. It can also be lured onto an explosive trap.

- **Obstacle (O boulder / T tree)**
  - Blocks the player like a wall until destroyed (two sword hits).
  - The tree sprite varies with the level theme.

- **Powerup (C)**
  - A crystal collected on touch (+50 points). Four types:
    - **Health** (red): restores 25 health.
    - **Speed** (blue): +60% movement speed for ~8 seconds.
    - **Strength** (green): double attack damage for ~8 seconds.
    - **Invincibility** (yellow): blocks all damage for ~8 seconds (golden aura).
  - Active timed effects are shown in the HUD with seconds remaining.

- **Explosive (E)**
  - A hidden trap. Invisible until the player comes within 1.5 cells, then it reveals itself and arms: the fuse burns for ~1.5 seconds with an accelerating red warning flash.
  - On detonation it damages everything in the blast radius — 30 to the player, 100 to guards (enough to kill a regular guard). Traps can be used tactically against pursuers.

- **Wall (#)**
  - Cannot be destroyed by the player.

- **Exit (X)**
  - A glowing, sparkling ruin. Reaching it completes the level and awards a bonus (100 × level number). Its sprite matches the level theme (golden, sand, or snow ruin).

## Example Level Layout

Levels are 20×10 grids declared in `game/levels/level-data.js`; rows can be written as plain strings:

```javascript
[
    '####################',
    '#P  #      E   G  ##',
    '###   #C#####E### ##',
    '# # # #  G C#O#   ##',
    '# # # ##  # # # ####',
    '#   # #   # # #   ##',
    '#E ## # # # # ##OC##',
    '#G    # #G    #  X##',
    '####################',
    '####################',
]
```

An automated test BFS-checks every level for solvability and asserts that no two levels share a layout.

## Planned / not yet implemented

- **Key (K)** — doors and keys are not in the game yet; `pick` (p), `axe` (x) and `potion` (u) currently only play their animations.
