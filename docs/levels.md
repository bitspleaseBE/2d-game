# Levels Overview

This document provides an overview of the five levels in "Wandertrap," including their theme, the entities present, and a brief story for each.

Layout legend: `#` wall · `P` player spawn · `X` exit · `G` guard · `B` boss · `E` hidden explosive trap · `C` powerup crystal · `K` key · `D` locked door · `O` boulder · `T` tree

## Level 1: Easy — Forest clearing

### Story

Theo finds himself in the first level of the labyrinth, an easy introduction ringed by a palm forest. A tree blocks the corridor right of the spawn — his first chance to swing the sword. A couple of guards patrol the small maze, a powerup or two glitter in the corners, and one hidden trap waits near the bottom corridor.

### Entities

Player, walls, trees, a boulder, 2 guards, 2 powerups, 1 explosive trap, exit.

## Level 2: Easy — Forest maze

### Story

A full-screen maze with no distractions: Theo must master navigation through narrow passages while three guards patrol the corridors.

### Entities

Player, walls, 3 guards, exit.

## Level 3: Medium — Desert ruins

### Story

The labyrinth shifts to sun-bleached desert ruins. The corridors are wider and loop back on themselves, guards patrol in greater numbers, and for the first time Theo's own hidden explosive traps arm themselves when he wanders too close — after a short fuse they detonate, hurting anything in the blast, guards included. A clever wizard turns his traps into weapons.

### Entities

Player, walls, a tree, a boulder, 3 guards, 3 powerups, 2 explosive traps, exit (sand ruin).

## Level 4: Hard — Frozen halls

### Story

Snow blankets the fourth level. The corridors tighten, four guards patrol the halls, and three traps lie buried in the ice. For the first time the exit pocket is sealed behind a locked door — the key lies in the guarded south-west corner, so escaping means crossing the whole maze twice.

### Entities

Player, walls, 2 boulders, 4 guards, 3 powerups, 3 explosive traps, 1 key, 1 locked door, exit (snow ruin).

## Level 5: Expert — The dark heart

### Story

The final level. In the labyrinth's darkest depths, the boss corridor is sealed behind a locked door whose key lies in the southern passage. Beyond the door waits the labyrinth's most formidable guardian — a hulking boss with triple health, heavier blows, and a longer reach for spotting intruders. Theo must fight his way past four guards, dodge three traps, claim the key, and bring the guardian down (or lure it onto a trap...) to escape the Wandertrap.

### Entities

Player, walls, 4 guards, 1 boss, 4 powerups, 3 explosive traps, 1 key, 1 locked door, exit.

## Design notes

- Levels are declared in `game/levels/level-data.js`; rows can be written as plain strings for readability.
- Every level is BFS-verified solvable by an automated test (`all levels are distinct and solvable`), which also asserts no two levels share a layout and that any key is reachable before its door.
- Each level has a `theme` (`forest`, `sand`, `snow`, `dark`) that controls the background palette, the exit ruin sprite, and the tree sprite.
