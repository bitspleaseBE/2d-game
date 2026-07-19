# Wandertrap — An Indie Critic's Second Opinion

*Reviewed July 2026 by playing a build in Chromium and reading every system in the source. This is a follow-up to the original internal review (`docs/game-review.md`), whose P0–P3 fixes have all shipped. Verdict format: what sings, what's missing, and a prioritized punch list. Constraint honored: every suggestion is client-side only — no backend anywhere.*

**Score: 7/10 — "A lovely dream that ends one act too early."**

---

## The hook

A boy in blue pyjamas falls asleep and has to fight his way out of his own dream before dawn, reclaiming dream-shards from Sleep Thief orcs. That is a genuinely good bedtime-story premise, and Wandertrap commits to it: levels are called *Dreams*, weapons are shards "remembering useful shapes," the game-over screen reads "The dream closed around Theo," and the win screen is a sunrise. The fiction and the mechanics hold hands. Most hobby games never get this part right.

## What sings

- **Movement feels correct.** Delta-time, pixel-based motion with normalized diagonals and per-axis collision resolution, so pressing diagonally into a wall *slides* you along it (`game.js:380`). That one choice is why the game doesn't feel janky.
- **The combat has secret sophistication.** Melee hits only land during the swing animation's active frames (`animator.js:63`), and bow arrows spawn on the exact release frame (`game.js:698`). That's fighting-game discipline in a bedtime maze game.
- **The archer is the best enemy.** Real line-of-sight raycasts blocked by walls, and a kiting AI that retreats when you close distance (`guard.js:343`). Cornering an archer in Twin Halls is the most alive the game ever feels.
- **Anti-frustration engineering.** If a locked door exists and no key is in play, the next guard you kill is *guaranteed* to drop one — correctly generalized to multi-door levels (`game.js:614`). You cannot RNG yourself into a softlock. Solvability of all ten levels is machine-verified by BFS tests.
- **The unlock ceremony.** New weapons pause the game for a modal with a *live animated demo* of the attack — the bow demo fires a real arrow across the panel (`game.js:1246`). Tutorializing by demonstration, not by wall of text.
- **Traps are tools.** Explosives deal 30 to Theo but 100 to orcs (`settings.js:93`), so luring the 300 HP Warden onto a trap is a sanctioned strategy. The accelerating red flash before detonation is the game's one perfect telegraph.
- **Graceful degradation as philosophy.** All SFX are synthesized Web Audio (the pickup arpeggio and level-complete fanfare are charming), narration falls back to text timers, storage is try/catch'd. The game can lose audio, art, and localStorage and keep running.
- **The rebalance was the right call.** Weapons moved from random drops to fixed pedestals, drops made scarce, and — the smartest line in the design docs — the player's new verb always answers the previous level's new threat: archers arrive at level 5, the bow at level 6. One level of being outgunned is deliberate tension.

## What's missing

This is the core of the review. The game graduated from tech demo to *game* — what it hasn't yet become is an *experience*.

### 1. It has no juice. None.

Hit an orc: it slides back. An explosive detonates: the screen doesn't so much as flinch. There is no screen shake, no hit-stop, no particles, no flash, no damage feedback beyond a health bar and a flicker. The player takes contact damage as a silent number drop — Theo is never knocked back, never staggers. The i-frames that make per-frame contact damage survivable exist only as a *side effect* of the hurt-flicker animation, running on wall-clock `setInterval` rather than game time (`player.js:377`). For a game whose movement layer is this solid, the impact layer is strikingly absent. Juice is the cheapest quality-per-hour investment left in this project.

### 2. The dream is silent.

There is no music. Between sword swings, the maze is dead air — fatal for atmosphere in a game *about a dream*. Meanwhile `soundSettings.mute` and `volume` exist in settings and are respected everywhere (`settings.js:98`)... but no UI exposes them. Only a code editor can mute this game.

### 3. One enemy, three outfits; one goal, ten times.

Melee guard, archer, boss are configurations of a single class. The chase AI is greedy axis-movement that stops dead on wall corners — no pathfinding, no patrols, no "investigate last seen position," which wastes the excellent LOS raycast (stealth *around* sight lines never matters because guards forget instantly). And every level is "reach the exit," occasionally with keys. The one exception — level 10 lets you sneak past the Orc King instead of fighting — proves the designers know better, but it arrives on the final screen.

### 4. The sword makes the axe a stick.

Steel Sword: 60 damage / 360ms. Wooden Axe: 30 / 430ms. The sword is strictly better in combat; the axe survives only because it chops obstacles. No reach, arc, or knockback differentiation. And there's no defensive verb at all — no dodge, no block; defense is "outrun everything at 300 px/s vs their 60."

### 5. No reason to dream twice.

Layouts are 100% static single screens (20×10 tiles). No secrets — in a maze game *with fog of war*, not one hidden room. No optional objectives, no per-level times or ratings, no level select, no NG+. A seedable RNG already exists (`?seed=` — currently a test hook) and is begging to become a player-facing feature. The score chase is the only hook, and score sources are too flat to sustain it.

### 6. A run evaporates on refresh.

Only high scores persist. "Continue" is in-memory; F5 deletes your run, your weapons, your level-9 progress, everything. Death on level 9 of 10 also means restarting from level 1. For a 45-minute game aimed at bedtime sessions, there is no way to put the book down and pick it up tomorrow.

### 7. Mobile support was built, then never plugged in.

`game/utils/touch.js` is a complete, well-made on-screen D-pad and action cluster — and it is imported by *nothing*. The README proudly advertises touch controls that are dead code. Even wired up, the canvas is fixed at 1280×640 with no responsive scaling, there's no pause or weapon-switch button on touch, and the quiver unlock says "Press 3 for the bow."

### 8. Menu gremlins.

- "New Game" mid-run silently *continues* the old run (`index.js:119`) — you cannot abandon a run without dying.
- "Exit" on the main menu shows... the Game Over screen (`index.js:106`).
- Escape from anywhere yanks you to the menu with no confirmation and no pause overlay — and from the story screen it leaves the narrator talking over the menu.
- Loose threads visible in-game: the inventory explosive item literally reads "No use for it yet," `obstacle.destroy()` is a `console.log` stub, breakable walls store a type that nothing reads, and the menus are set in Papyrus. In 2026.

### 9. The story is a haiku that wants to be a chapter book.

Five intro beats, one sentence per level, one ending. The sentences are good ("The Serpent coils through darkness, and Theo can only trust the small light around him") but there are no characters besides Theo and interchangeable orcs. An earlier draft reportedly had a sarcastic dragon. Bring back the dragon.

---

## Actionable improvements (all client-side, no backend)

### Do this weekend (biggest feel-per-hour)

> **Status:** every item in this review has now been implemented. The weekend list (1–4: juice pass, game-clock i-frames, menu fixes, touch buttons) landed first; touch wiring and canvas scaling had already landed on main independently. The month list (5–10) and the 1.0 list (11–14) followed: procedural lullaby music, weapon personalities (wide-arc axe with heavy knockback vs. fast narrow sword), enemy telegraphs, the Daily Dream, run bookmarking with level-select stars, cracked-wall secrets with finished obstacle drops, the dawn-timer and defuse-all level twists with sneak bonuses on both Wardens, the end-of-level tally, guard patrol/investigate AI, and Sooth the dream-dragon's act commentary.

1. **Juice pass.** 4-6px screen shake on explosions and boss hits (offset the canvas transform for ~150ms); 40-60ms hit-stop when a swing connects; a burst of 6-10 canvas-drawn particles on hit/death/chop (colored squares are enough at this art scale); knock Theo back ~24px on contact damage. One file each, transforms the game.
2. **Wire in `touch.js`.** It's one import plus a pause/inventory/weapon-cycle button and CSS canvas scaling (`max-width:100vw; aspect-ratio:2/1`). The README already promises it.
3. **Fix the menu gremlins.** "New Game" prompts "Abandon Theo's dream?"; "Exit" either goes away or becomes credits; Escape opens a proper pause overlay (Resume / Restart / Quit) instead of dumping to the menu; stop narration on any exit path.
4. **Make i-frames a design constant.** Move invulnerability onto the game clock (`deltaMs`), expose it in `settings.js`, and give it a distinct flicker. It currently ticks during pause.

### Do this month (depth)

5. **A lullaby, procedurally.** The SFX are already synthesized — extend `sound.js` into a tiny Web Audio music box: a slow pentatonic arpeggio with a low-pass filter, tempo and key shifting per theme (forest/desert/snow/dungeon), dropping to sparse minor notes when a boss is alive. Zero assets, on-brand for a dream, and the mute/volume settings finally get a settings screen with a UI.
6. **Give every weapon a personality.** Axe: slower, wide 180° arc, double knockback — the crowd-control pick. Sword: fast, narrow, current numbers — the duelist. Bow: unchanged, ammo-gated. Suddenly weapon switching (which already has hotkeys) is a real decision.
7. **Telegraph enemy damage.** 250ms windup flash before a guard's contact hit; a visible draw animation on archers before the shot. Reaction beats memorization, especially for the kids this tone is aimed at.
8. **The Daily Dream.** The seedable RNG already exists. Derive a seed from today's date (`new Date().toISOString().slice(0,10)` hashed), shuffle guard/powerup/trap placements within the hand-authored layouts, one attempt per day, and emit a Wordle-style share string (`🌙 Wandertrap #142 — 7 dreams, 4,350 pts, 🗡️❤️❤️`) via `navigator.clipboard`. Replayability and word-of-mouth for a day's work, all local.
9. **Save the run.** Serialize level index, weapons, runes, potions, arrows, score, and lives to localStorage on level completion (the schema is nearly `JSON.stringify`-able already). "Continue" survives refresh; completed levels unlock a level-select on the map. Bedtime games need bookmarks.
10. **Secrets behind the walls you already built.** Breakable walls store a type nothing uses — honor it: a hairline crack tile, axe-only, hiding a shard cache or a shortcut. Two per act. Fog of war makes discovering them feel earned. While there: finish `obstacle.destroy()` drops (the stub's comments already specify them).

### Do before calling it 1.0 (arc)

11. **One level, one new rule.** Keep "reach the exit" as the spine but bend one level per act: a *dawn timer* escape (the fiction literally says "wake before dawn" — let one Dream collapse behind you), a "defuse all five traps" Dream using the underused pick verb, and move a sneak-or-fight choice up to the Warden at level 5 so level 10's isn't the first.
12. **End-of-level tally.** Time bonus, no-damage bonus, shards found — the design plan already specifies it; the code never shipped. Three lines of score math plus a results card, and suddenly per-level mastery exists. Star it 1-3 on the level select.
13. **A patrol and a memory.** Give guards 2-3 waypoint patrol routes (author them as letters in the ASCII grids, the format supports it) and an "investigate last seen position" state before returning. The LOS system deserves it, and stealth becomes real.
14. **One more voice.** A recurring dream-guide NPC — the cut sarcastic dragon — with one line of dialogue per act, delivered through the existing narration/story-card pipeline. Cheapest possible way to make ten Dreams feel like one story.

---

## Closing

Wandertrap's bones are better than they have any right to be: deterministic, tested, softlock-proof, with real animation-frame combat under the hood. What it's missing is everything a player *feels* rather than reads in a code review — impact, music, surprise, and a reason to return. The good news is that every one of those is a client-side afternoon, not an engine rewrite. Theo's dream is worth finishing.

*7/10 — wishlist it, then let it nap.*
