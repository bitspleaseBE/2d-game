# Levels Overview

This document provides an overview of the ten levels in "Wandertrap," including their theme, the entities present, and a brief story for each.

Layout legend: `#` wall · `P` player spawn · `X` exit · `G` guard · `A` archer · `B` boss · `E` hidden explosive trap · `C` powerup crystal · `W` weapon pedestal · `H` Haste rune · `V` Warding rune · `M` Might rune · `D` locked door · `O` boulder · `T` tree · `R` cracked wall (breaks to an axe swing and hides a stash — two secrets per act)

## Level 1: Easy — The Glade

### Story

Moonlit grass whispers around Theo as the first stolen dream-shard glows beyond the Glade.

### Entities

Player, walls, trees (one sealing the spawn corridor), a boulder, 2 guards, 2 powerups, Wooden Axe pedestal, 1 explosive trap, exit.

## Level 2: Easy — The Gatehouse

### Story

At the Gatehouse, a Sleep Thief guard carries the key to the path home.

### Entities

Player, walls, 3 guards, 1 locked door, exit.

## Level 3: Medium — The Orchard

### Story

In the Orchard, crooked trees twist into gates and orcs drag more shards through the leaves.

### Entities

Player, walls, trees, 4 guards, powerups, Steel Sword pedestal, 1 explosive trap, exit.

## Level 4: Medium — The Quarry

### Story

The Quarry rumbles with buried traps, but every broken stone brings Theo closer to dawn.

### Entities

Player, walls, boulders, 5 guards, powerups, Haste rune, 4 explosive traps, exit.

### Twist

Defuse objective: a HUD counter tracks the buried traps, and disarming all four with the pick (`p`) pays a +300 bonus.

## Level 5: Medium — The Warden

### Story

The first Warden waits in the sand, sworn to keep the Orc King's nightmare alive. Slip past it, or bring it down — the dream rewards both.

### Entities

Player, walls, 1 guard, 1 archer, 1 boss, powerups, exit.

### Twist

Sneak-or-fight: reaching the exit with the Warden still alive pays a +250 sneak bonus; felling it pays the +500 boss score instead.

## Level 6: Hard — Twin Halls

### Story

Twin Halls split the dream in two; Theo must find the right keys before sleep closes in.

### Entities

Player, walls, 5 guards, 1 archer, Dream Bow pedestal, powerups, 2 locked doors, 1 explosive trap, exit.

## Level 7: Hard — The Serpent

### Story

The Serpent coils through darkness, and Theo can only trust the small light around him.

### Entities

Player, walls, trees, a boulder, 4 guards, 1 archer, Warding rune, powerups, 1 explosive trap, fog of war, exit.

### Twist

Dawn timer: 75 seconds to reach the exit. When the timer runs out the dream starts collapsing — periodic damage until Theo escapes. Dying resets the countdown.

## Level 8: Hard — The Crossroads

### Story

At the Crossroads, a second Warden patrols the center where stolen shards burn like stars.

### Entities

Player, walls, 5 guards, 1 archer, 1 boss, powerups, 1 explosive trap, exit.

## Level 9: Expert — The Gauntlet

### Story

The Gauntlet locks each dream behind another door, daring Theo to lose heart before morning.

### Entities

Player, walls, 5 guards, 3 archers, Moonlit Quiver pedestal, Might rune, powerups, 3 locked doors, 1 explosive trap, fog of war, exit.

## Level 10: Expert — The Throne

### Story

On the Throne, the Orc King clutches the final shard between Theo and his own bed.

### Entities

Player, walls, trees, 3 guards, 2 archers, 1 boss, powerups, 1 locked door, 1 explosive trap, fog of war, exit.

### Twist

Sneak-or-fight: the exit sits at the Orc King's back — slipping out with the boss alive pays a +250 sneak bonus. A cracked wall hides a secret entrance into the sanctum for those who spot it.

## Design notes

- Levels are declared in `game/levels/level-data.js`; rows can be written as plain strings for readability.
- Every level is BFS-verified solvable by an automated test (`all levels are distinct and solvable`), which also asserts no two levels share a layout and that any key is reachable before its door.
- Each level has a `theme` (`forest`, `desert`, `snow`, `dungeon`) that controls the floor tile, wall tile, obstacle sprites, boulder sprite, and exit ruin.
- Weapon progression is fixed: Rusty Dagger at start, Wooden Axe on level 1, Steel Sword on level 3, Dream Bow on level 6, and Moonlit Quiver on level 9. Wardens intentionally do not grant a weapon.
- Only the Wooden Axe chops trees and boulders, so its level 1 pedestal sits on the forced path out of the spawn, and the level checker verifies no earlier route ever requires chopping.
- Runes are fixed pickups in riskier spots: Haste on level 4, Warding on level 7, Might on level 9.

## Theme assignment

| Levels | Theme | Visual direction |
| --- | --- | --- |
| 1-3 | `forest` | Current grass-and-stone look with palms and forest trees |
| 4-5 | `desert` | Sand floors, sandstone walls, dead/burned trees, desert rocks |
| 6-7 | `snow` | Snow floors, icy walls, frosted trees, snow-capped boulders |
| 8-10 | `dungeon` | Dark cracked floors, mossy brick walls, broken pillars and burned barricades |
