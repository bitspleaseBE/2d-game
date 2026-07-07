---
name: Hero evolution rebalance
overview: Rebalance the loot economy, turn weapons into a fixed one-per-level progression (axe, sword, bow), let corpses lie for 1.5 seconds, add a bow-and-arrow projectile system for both the hero and a new orc archer ('A'), and pause on every weapon unlock with an animated explainer screen.
todos:
  - id: loot-economy
    content: Rebalance drops in items.js/game.js — weapons and runes out of the guard pool, potion cap, dream-shard score drops
    status: pending
  - id: corpse-linger
    content: Corpses lie for 1.5 s — corpseLingerMs for guards, longer defeat pause for the player
    status: pending
  - id: weapon-progression
    content: One fixed weapon per level ('W' cell + weaponReward metadata), distinct weapon behaviors, weapon cycling
    status: pending
  - id: projectile-system
    content: Projectile entity + player bow (arrow ammo, HUD counter) using the committed Player_Bow.png and arrow.png
    status: pending
  - id: orc-archer
    content: Orc archer guard variant on 'A' cells (random orc1-3 with bow sheets) with keep-distance AI; place archers in levels 5+
    status: pending
  - id: wire-bow-assets
    content: Wire the committed bow sheets (orc1-3 bow attack, Player_Bow, arrow) into assets.js and the sprite manifests
    status: pending
  - id: weapon-screen
    content: Weapon-unlocked pause screen with the hero attacking right on repeat over a grass background
    status: pending
  - id: balance-pass
    content: Tune numbers, update docs (README, entities, levels) and extend the Playwright e2e suite
    status: pending
isProject: false
---

# Hero Evolution Rebalance for Wandertrap

## Ordering

This plan runs **after** the Dream story rework
([dream_story_rework_77a42c4a.plan.md](.cursor/plans/dream_story_rework_77a42c4a.plan.md)).
It builds on what that plan introduces: the dream premise (Sleep Thief orcs,
dream-shards, the Orc King), per-level story lines, level-intro cards, and the
narration pipeline. Weapon unlocks become story beats in that fiction, so the
copy and (optional) narration lines for them should be written in the same
voice.

## Problems today (from playing and reading the code)

- **Too much loot, none of it matters.** Every defeated guard spawns a drop
  (`Game.spawnDrop` in [game/game.js](game/game.js)); the pool in
  [game/items.js](game/items.js) is 2x potion + steel sword + war axe + three
  runes. Weapons/runes are flat stat sticks: a second War Axe does nothing, and
  by level 3 you can own five of them. The best weapon (+50) can drop on level
  1, flattening the rest of the game.
- **No progression.** The hero starts with 50 attack and one melee verb.
  Nothing new is ever learned; combat only gets easier as duplicate loot
  stacks up. The `x` axe action is nearly identical to the space attack.
- **Deaths vanish.** A guard is removed the moment its 8-frame death
  animation completes (~640 ms, `isReadyToRemove` in
  [game/entities/guard.js](game/entities/guard.js)); with knockback pushing
  bodies around it reads as "the orc popped out of existence". The player's own
  defeat cuts to game-over after 700 ms, and losing a life respawns instantly.
- **No ranged play.** All threats and all answers are melee contact, so every
  fight is the same dance.

## 1. Loot economy rebalance (`loot-economy`)

Files: [game/items.js](game/items.js), [game/game.js](game/game.js),
[game/entities/player.js](game/entities/player.js).

- Remove `steelSword`, `warAxe` and the runes from `guardDropPool`. Weapons
  become progression rewards (section 3); runes become **fixed, hand-placed**
  pickups in risky spots (one of each per run: Haste in level 4, Warding in
  level 7, Might in level 9) so finding one is an event, not noise.
- Guard drops become: guaranteed key while a locked door needs one (unchanged
  logic), otherwise ~35% potion, ~15% **dream-shard** (new drop: +150 score,
  ties into the story's "reclaim the shards" fiction), ~50% nothing. Falling
  loot frequency is the point: scarcity is what makes the potion you do get
  interesting.
- Cap carried potions at 3. A potion picked up at the cap converts to score
  with a notification ("Your pack is full — +50").
- Once the bow is unlocked, guards may drop **arrow bundles (x5)** — the
  consumable that keeps kills rewarding late game (section 4).
- Remove the `explosive` item from the catalog's dead end (its description
  literally says "no use for it yet") or give it its one use: placeable bomb.
  Recommended: remove from drops now, placeable bomb as a follow-up.

## 2. Corpses lie for 1.5 seconds (`corpse-linger`)

Files: [game/utils/settings.js](game/utils/settings.js),
[game/entities/guard.js](game/entities/guard.js), [game/game.js](game/game.js).

- Add `combatSettings.corpseLingerMs = 1500`. In `Guard`, track time since
  `defeat()`; `isReadyToRemove()` becomes "death animation complete **and**
  1500 ms elapsed". Fade the corpse out over the final ~300 ms
  (`globalAlpha`) so the removal never pops. The death sheets already
  `holdLast` on the final frame, so nothing else changes.
- Player symmetry: raise `pendingGameOverMs` from 700 to 1500, and when a
  life (not the run) is lost, show the defeated pose for 1500 ms before
  respawning instead of teleporting instantly (small state in
  `checkPlayerDeath`, input ignored while down).

## 3. Weapon progression — the hero evolves (`weapon-progression`)

Files: [game/levels/level-data.js](game/levels/level-data.js),
[game/items.js](game/items.js), [game/entities/player.js](game/entities/player.js),
[game/game.js](game/game.js), [game/assets/sprite-manifest.js](game/assets/sprite-manifest.js).

- **Max one weapon per level**, on a fixed schedule tied to the story acts:

  | Level | Weapon | What it teaches |
  |---|---|---|
  | 1 | Wooden Axe (start) | chops trees/boulders, weak vs orcs (30) |
  | 3 | Steel Sword | real melee damage (60) + knockback |
  | 6 | Dream Bow | ranged attack, arrow ammo (35 per arrow) |
  | 9 | Moonlit Quiver (upgrade, not a weapon) | +arrow capacity, faster draw |

  Levels 5 and 8 (the Warden bosses) intentionally give nothing — the reward
  there is survival; 10 is the finale.
- New layout letter **`W`** in `level-data.js`: the level's single weapon
  pedestal. Which weapon it holds comes from a new `weaponReward` field on the
  `Level`, so layouts stay readable. Update the legend comment.
- Weapons stop being equip-slot stat sticks and become **owned verbs**: the
  player keeps every weapon found, `Space` attacks with the selected one, and
  `Tab` (or `1`/`2`/`3`) cycles. `weaponId` on Player already exists and the
  manifest already has a per-weapon `weapons` section — extend both. Remove
  the now-redundant separate `x` axe key or keep it as a shortcut to the axe.
- Guard toughness scales gently with level (e.g. +10% health per act) so the
  schedule keeps tension instead of trivializing it.

## 4. Projectiles — bow and arrow for hero AND orcs (`projectile-system`, `orc-archer`)

New file: `game/entities/projectile.js`. Files touched:
[game/game.js](game/game.js), [game/entities/guard.js](game/entities/guard.js),
[game/assets.js](game/assets.js), [game/assets/sprite-manifest.js](game/assets/sprite-manifest.js),
[game/levels/level-data.js](game/levels/level-data.js).

- **Projectile entity**: position, unit direction, speed (~480 px/s), damage,
  `owner` ("player" | "guard"), max range (~7 cells). Advances each update;
  removed on wall/door/obstacle hit; player arrows damage guards, orc arrows
  damage the player (both reuse the existing `takeDamage` paths). Drawn from
  `assets/images/projectiles/arrow.png` (committed, points right) rotated to
  its direction. Game keeps a `this.projectiles` array (update/render/clear
  per level).
- **Player bow**: firing waits for the draw animation's release frame (use the
  manifest `activeStartMs/activeEndMs` window like the sword swing), consumes
  1 arrow, starts with 10 arrows on unlock, HUD shows an arrow counter next to
  keys/potions. No arrows left → notification + no shot.
- **Orc archer, layout letter `A`**: a `Guard` variant (`ranged: true`) of a
  random orc type 1–3, exactly like `G` picks a random melee orc. An archer
  keeps its distance — retreats when the player is closer than ~2 cells, fires
  on line-of-sight within ~6 cells with a ~1.5 s cooldown, weaker in melee (60
  health, 5 contact damage). Archers use their orc's `*_bow_attack_full.png`
  sheet for attacks and reuse the orc's existing idle/walk/hurt/death sheets
  for everything else, so no further enemy sheets are needed. Add `A` to the
  legend and seed archers into levels 5+ (e.g. one guarding each Warden, pairs
  in The Gauntlet), replacing some existing `G`s rather than raising the body
  count.

**Sprites (already committed, generated per the orc sheet contract by editing
each orc's own attack sheet so frame positions match):**

- `assets/images/enemies/orc1/orc1_bow_attack_full.png`,
  `assets/images/enemies/orc2/orc2_bow_attack_full.png`,
  `assets/images/enemies/orc3/orc3_bow_attack_full.png` — bow attack per orc,
  512x256, 8x4 grid of 64x64, validated by
  [tools/validate-sprite-sheet.js](tools/validate-sprite-sheet.js)
- `assets/images/player/Player_Bow.png` — hero bow attack, same grid
- `assets/images/projectiles/arrow.png` — 64x64 arrow, points right
- Prompt contract: [assets/prompts/sheets/bow_sheet.md](assets/prompts/sheets/bow_sheet.md);
  raw generations are normalized with the new
  [tools/process-sprite-sheet.js](tools/process-sprite-sheet.js)

Wiring (`wire-bow-assets`): add the four new images to
[game/assets.js](game/assets.js) (`orcN_Bow_Attack`, `playerBow`, `arrow`);
in [game/entities/guard.js](game/entities/guard.js) `selectSprites` picks the
bow sheet as the attack sprite when `ranged`. The hero's bow state slots into
`playerSpriteManifest.weapons` with `frameWidth/frameHeight: 64`, `frames: 8`,
rows `{ down: 0, up: 1, left: 2, right: 3 }` (the sheet has a real left row,
so no `flipLeft`), `oneShot`, and a release window around frame 6.

## 5. Weapon-unlocked screen (`weapon-screen`)

New file: `game/screens/weapon-unlocked.js` (canvas overlay, not a DOM
screen, so the frozen world stays visible behind a dim like the inventory).

- Touching the `W` pedestal freezes the world (reuse the `inventoryOpen`
  freeze mechanism — the render loop keeps running, `updateGameState` is
  skipped) and shows the unlock panel until Space/click dismisses it.
- Panel content: weapon name and story line (dream fiction, narratable via the
  story plan's pipeline), its properties (damage, special: chops obstacles /
  knockback / ranged + ammo), and the control hint.
- **Live demo pane**: a framed strip inside the panel, tiled with
  `assets/images/generated/grass_tile.png`, where the hero sprite stands at
  the left and performs the new weapon's attack **facing right on repeat**
  (an `Animator` instance with the weapon's state, restarted on completion;
  for the bow, a demo arrow flies right across the strip each loop). This
  runs off the same manifests as gameplay, so it always matches reality.
- The pause menu gets a "Weapons" recap so explanations can be re-read.

## 6. Balance pass, docs and tests (`balance-pass`)

- Tune: base attack down to ~25 so the Wooden Axe matters; guard/boss health
  vs the new weapon curve; drop rates from section 1; archer cadence.
- Update [README.md](README.md) controls table, [docs/entities.md](docs/entities.md),
  [docs/levels.md](docs/levels.md) legend ('W', 'A'), and
  [docs/story.md](docs/story.md) weapon beats (coordinated with the story plan).
- Extend [tests/e2e/game.spec.js](tests/e2e/game.spec.js): corpse lingers
  1.5 s then disappears; guard drop probabilities honored (seeded RNG);
  weapon pedestal pauses and dismisses; arrow flies, hits, and stops at
  walls; archer keeps distance; `tools/check-levels.mjs` still proves every
  level solvable with the weapon schedule (levels must not require a weapon
  the player cannot own yet).

## Other suggestions to make it hang together (a developing hero)

1. **Weapons are reclaimed dream-shards.** Each pedestal is a shard the Sleep
   Thieves froze into a weapon; the unlock line is narrated like the level
   beats ("The second shard remembers the shape of a sword..."). The Moonlit
   Quiver at level 9 is the last gift before The Throne.
2. **Visible growth on the hero.** At each act boundary (levels 1/4/7) tint or
   accent the pyjama palette slightly (runtime palette swap on sheet load is
   cheap) — Theo literally looks more heroic as the dream deepens.
3. **End-of-level tally.** The level-completed modal (already getting story
   lines from the other plan) adds a small score breakdown: time bonus, shards
   reclaimed, no-damage bonus. Gives the score meaning and a reason to fight.
4. **Enemy curve mirrors the hero's.** Acts introduce one threat at a time:
   melee orcs → archers (level 5) → mixed squads escorting the Wardens →
   the Orc King with both. The player's new verb always answers the new threat
   (bow at 6 answers archers at 5, one level of being outgunned first).
5. **HUD identity strip.** Show the equipped weapon icon and the level name
   ("The Serpent — 7/10") in the HUD, so progression is always on screen.
6. **Potions become tactics.** With drops scarce (section 1), drinking mid
   boss-fight is a real decision; the u-key drink animation already exists.
7. **Explosive item payoff (follow-up).** Give the long-dead `explosive`
   item its promised use: place a bomb that breaks a wall segment marked
   breakable — a shortcut verb that rewards hoarders without inflating combat.
