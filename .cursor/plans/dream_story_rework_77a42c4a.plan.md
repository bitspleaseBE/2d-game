---
name: Dream story rework
overview: Rework the story into a short bedtime-dream adventure that gives the orcs a real purpose, add epic story background art, weave one-line story beats between levels, and narrate everything with pre-generated ElevenLabs audio.
todos:
  - id: story-text
    content: Rewrite story to 5 dream-premise beats in story.js; update docs and screen copy
    status: pending
  - id: story-art
    content: Generate 6 epic story backgrounds and rebuild story screen with art + cross-fades
    status: pending
  - id: level-beats
    content: Add per-level story lines and level-intro cards; update level-completed modal
    status: pending
  - id: narration-script
    content: Create ElevenLabs generation script and produce narration MP3s
    status: pending
  - id: narration-playback
    content: Add narration playback util and wire into story screen and level intros
    status: pending
isProject: false
---

# Dream Story Rework for Wandertrap

## Current state (what the review found)

- The story ([game/screens/story.js](game/screens/story.js)) is 13 paragraphs about a game designer, a rival named Max, and a Minotaur — none of which exist in the game. The actual enemies are all orcs, and there is no boss called Minotaur.
- The story screen is plain text on a brown panel; there is no artwork anywhere (menus are solid color, no story images exist in `assets/`).
- No story appears during play: level names like "The Glade" and "The Throne" exist in [game/levels/level-data.js](game/levels/level-data.js) but are never shown, and the level-completed modal is purely functional.
- There is zero audio: [game/utils/sound.js](game/utils/sound.js) exists but is never imported, and no audio files ship with the game.

## The new story (short, and it explains the orcs)

Premise: Theo, a boy in cozy blue pyjamas, falls asleep and wakes inside the Wandertrap — a labyrinth spun from his own dream. **Sleep Thief orcs** have stolen the **dream-shards** that mark his way home; every orc defeated and every level escaped reclaims a piece of the path. The **Orc King** hoards the last shard on his throne at the maze's heart (level 10 is already named "The Throne" — perfect fit). Defeat him before dawn and Theo wakes safely in his bed.

- Intro: 5 short beats (down from 13) shown on the story screen with epic art.
- Between levels: one narrated sentence per level (10 lines) tied to the existing level names (The Glade, The Gatehouse, ... The Throne). Bosses on levels 5 and 8 become the Orc King's Wardens.
- Ending: game-won screen becomes "Theo wakes at dawn" with a final image and line.

## Implementation

### 1. Rewrite the story text
- Replace the paragraphs in [game/screens/story.js](game/screens/story.js) with the 5 new beats; update [docs/story.md](docs/story.md) and [docs/levels.md](docs/levels.md) to match.
- Update copy on welcome ("Theo fell asleep..."), game-over, and game-won screens to the dream premise.

### 2. Epic story background art
- Generate 6 widescreen images (5 intro beats + 1 ending): moonlit bedroom, dream-labyrinth entrance, Sleep Thief orcs stealing glowing shards, the Orc King's throne, Theo stepping into the maze, dawn awakening. Style: painterly, epic-fantasy-meets-bedtime-storybook, consistent with the pyjama hero.
- Save to `assets/images/story/`, load via [game/assets.js](game/assets.js), and rebuild the story screen so each beat shows full-screen art with the text in a readable overlay band, cross-fading between beats.

### 3. Weave story into gameplay (between levels)
- Add `name` display and a one-line `story` field per level in [game/levels/level-data.js](game/levels/level-data.js).
- Show a brief level-intro card (level name + story line, auto-dismiss ~4s or on keypress) when each level starts, and add the line to the level-completed modal in [game/screens/level-completed.js](game/screens/level-completed.js).

### 4. ElevenLabs narration
- New script `scripts/generate-narration.js` (Node, reads `ELEVENLABS_API_KEY` from env) that generates MP3s for the 5 intro beats, 10 level lines, and the ending line into `assets/audio/narration/`. Run once; files are committed so players never need the API.
- New small playback util (`game/utils/narration.js`) using HTML `Audio`, respecting the existing `soundSettings.mute`/`volume` from [game/utils/settings.js](game/utils/settings.js). Wire it into the story screen (narrate each beat, advance when audio ends) and the level-intro cards.
- **Needs from you:** an ElevenLabs API key (set `ELEVENLABS_API_KEY` when I run the script), and a voice preference — I'll default to a warm storyteller voice unless you name one.

## Out of scope (can follow up later)
- Wiring up the unused `sound.js` SFX library and a mute button.
- Giving the Orc King a distinct sprite (he'll reuse the existing boss orc for now).