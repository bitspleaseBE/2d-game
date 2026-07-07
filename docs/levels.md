# Levels Overview

This document provides an overview of the ten levels in "Wandertrap," including their theme, the entities present, and a brief story for each.

Layout legend: `#` wall · `P` player spawn · `X` exit · `G` guard · `B` boss · `E` hidden explosive trap · `C` powerup crystal · `K` key · `D` locked door · `O` boulder · `T` tree

## Level 1: Easy — The Glade

### Story

Moonlit grass whispers around Theo as the first stolen dream-shard glows beyond the Glade.

### Entities

Player, walls, trees, a boulder, 2 guards, 2 powerups, 1 explosive trap, exit.

## Level 2: Easy — The Gatehouse

### Story

At the Gatehouse, a Sleep Thief guard carries the key to the path home.

### Entities

Player, walls, 3 guards, 1 locked door, exit.

## Level 3: Medium — The Orchard

### Story

In the Orchard, crooked trees twist into gates and orcs drag more shards through the leaves.

### Entities

Player, walls, trees, 4 guards, powerups, 1 explosive trap, exit.

## Level 4: Medium — The Quarry

### Story

The Quarry rumbles with buried traps, but every broken stone brings Theo closer to dawn.

### Entities

Player, walls, boulders, 5 guards, powerups, 1 explosive trap, exit.

## Level 5: Medium — The Warden

### Story

The first Warden waits in the sand, sworn to keep the Orc King's nightmare alive.

### Entities

Player, walls, 2 guards, 1 boss, powerups, exit.

## Level 6: Hard — Twin Halls

### Story

Twin Halls split the dream in two; Theo must find the right keys before sleep closes in.

### Entities

Player, walls, 6 guards, powerups, 2 locked doors, 1 explosive trap, exit.

## Level 7: Hard — The Serpent

### Story

The Serpent coils through darkness, and Theo can only trust the small light around him.

### Entities

Player, walls, trees, a boulder, 5 guards, powerups, 1 explosive trap, fog of war, exit.

## Level 8: Hard — The Crossroads

### Story

At the Crossroads, a second Warden patrols the center where stolen shards burn like stars.

### Entities

Player, walls, 6 guards, 1 boss, powerups, 1 explosive trap, exit.

## Level 9: Expert — The Gauntlet

### Story

The Gauntlet locks each dream behind another door, daring Theo to lose heart before morning.

### Entities

Player, walls, 8 guards, powerups, 3 locked doors, 1 explosive trap, fog of war, exit.

## Level 10: Expert — The Throne

### Story

On the Throne, the Orc King clutches the final shard between Theo and his own bed.

### Entities

Player, walls, trees, 5 guards, 1 boss, powerups, 1 locked door, 1 explosive trap, fog of war, exit.

## Design notes

- Levels are declared in `game/levels/level-data.js`; rows can be written as plain strings for readability.
- Every level is BFS-verified solvable by an automated test (`all levels are distinct and solvable`), which also asserts no two levels share a layout and that any key is reachable before its door.
- Each level has a `theme` (`forest`, `desert`, `snow`, `dungeon`) that controls the floor tile, wall tile, obstacle sprites, boulder sprite, and exit ruin.

## Theme assignment

| Levels | Theme | Visual direction |
| --- | --- | --- |
| 1-3 | `forest` | Current grass-and-stone look with palms and forest trees |
| 4-5 | `desert` | Sand floors, sandstone walls, dead/burned trees, desert rocks |
| 6-7 | `snow` | Snow floors, icy walls, frosted trees, snow-capped boulders |
| 8-10 | `dungeon` | Dark cracked floors, mossy brick walls, broken pillars and burned barricades |
