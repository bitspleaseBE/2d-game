# Entity Overview

This document provides an overview of the entities in "Wandertrap" and the letters that represent them in the game layout.

## Entities and Their Representations

- **Player (P)**
  - Moves left, right, up, and down — movement is applied every frame while a key is held, so diagonals work and speed is frame-consistent.
  - Starts with the Rusty Dagger, then unlocks Wooden Axe, Steel Sword, Dream Bow, and Moonlit Quiver at fixed pedestals. Space attacks with the selected weapon; Tab or number keys swap weapons.
  - Bow shots consume arrows and travel until they hit a guard, wall, locked door, obstacle, or their max range.
  - Collects powerup crystals by walking over them.
  - Has 100 health and a short invulnerability window (with a flicker) after each hit.

- **Guard (G)**
  - Patrols in place, looking around; detects the player within 5 cells when it has a clear line of sight.
  - Chases the player and deals contact damage (10).
  - Takes multiple hits depending on the current weapon and act; plays a hurt flash, death animation, then lingers as a fading corpse for 1.5 seconds.
  - Drops are scarce: locked-door keys are guaranteed when needed; otherwise guards may drop a potion, dream-shard, arrows after the bow unlocks, or nothing.

- **Archer (A)**
  - A lighter Sleep Thief variant using the orc bow sheets.
  - Keeps distance from Theo, fires on line of sight, and deals low contact damage if cornered.

- **Boss (B)**
  - A hulking guard that protects milestone arenas.
  - Triple health (300, with a visible health bar), double contact damage (20), faster, and spots the player from 7 cells.
  - Defeating it awards 500 points. It can also be lured onto an explosive trap.

- **Obstacle (O boulder / T tree)**
  - Blocks the player like a wall until destroyed. Only the Wooden Axe can cut trees and break boulders (one swing); other weapons bounce off with a hint, and bumping into an obstacle before the axe is found shows a message explaining what is missing.
  - The tree sprite varies with the level theme.

- **Powerup (C)**
  - A crystal collected on touch (+50 points). Four types:
    - **Health** (red): restores 25 health.
    - **Speed** (blue): +60% movement speed for ~8 seconds.
    - **Strength** (green): double attack damage for ~8 seconds.
    - **Invincibility** (yellow): blocks all damage for ~8 seconds (golden aura).
  - Active timed effects are shown in the HUD with seconds remaining.

- **Weapon Pedestal (W)**
  - A fixed story reward. Touching it unlocks the level's weapon or quiver upgrade and pauses the game with an explainer panel.

- **Runes (H / V / M)**
  - Fixed pickups for Haste, Warding, and Might. Runes live in the inventory and one rune can be equipped at a time.

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

- **Selected weapon (Space)** — Rusty Dagger jabs quickly, Wooden Axe chops obstacles and weakly hurts orcs, Steel Sword is stronger melee with knockback, Dream Bow fires arrows.
- **Axe (X)** — shortcut to the Wooden Axe chop (only once the axe has been found).
- **Pick (P)** — disarms an armed explosive trap the player is standing next to (+50 points).
- **Potion (U)** — drinks a carried potion, restoring 50 health. Potions carry between levels and cap at 3; overflow pickups convert to score.

## Touch controls

On touch devices (or with `?touch=1` in the URL) an on-screen D-pad and action buttons (ATK / AXE / POT / PICK) overlay the game, driving the same input paths as the keyboard.
