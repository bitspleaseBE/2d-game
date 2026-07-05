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
    - **Potion** (flask, dropped by guards): adds a potion to the inventory instead of an instant effect.
  - Active timed effects are shown in the HUD with seconds remaining.

- **Explosive (E)**
  - A hidden trap. Invisible until the player comes within 1.5 cells, then it reveals itself and arms: the fuse burns for ~1.5 seconds with an accelerating red warning flash.
  - On detonation it damages everything in the blast radius — 30 to the player, 100 to guards (enough to kill a regular guard). Traps can be used tactically against pursuers.
  - An armed trap can be defused: stand next to it and press **P** (pick) to disarm it for +50 points — if you're quick enough.

- **Key (K)**
  - A golden key collected on touch (+50 points).
  - Spent automatically when the player bumps into a locked door.

- **Door (D)**
  - Blocks movement like a wall until the player bumps into it while carrying a key (the key is consumed and the door swings open).
  - Guards cannot pass locked doors either.
  - Appears on levels 4 and 5, gating the exit area.

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

## Player actions

- **Sword (Space)** — damages guards and chops obstacles (2 hits), cooldown-gated.
- **Axe (X)** — destroys an obstacle in a single swing (shares the sword cooldown) but never hurts guards.
- **Pick (P)** — disarms an armed explosive trap the player is standing next to (+50 points).
- **Potion (U)** — drinks a carried potion, restoring 50 health. Every run starts with one potion; more drop from guards. Potions carry over between levels; keys do not.

## Touch controls

On touch devices (or with `?touch=1` in the URL) an on-screen D-pad and action buttons (ATK / AXE / POT / PICK) overlay the game, driving the same input paths as the keyboard.
