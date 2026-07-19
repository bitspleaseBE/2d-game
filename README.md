# Wandertrap

Welcome to "Wandertrap," a 2D top-down maze game where you navigate a dream labyrinth filled with traps, powerups, and Sleep Thief orcs.

*Help Theo in his blue pyjamas reclaim the dream-shards and wake before dawn*

<img src="assets/images/banner.jpeg" alt="Wandertrap Game Screenshot" width="50%" style="display: block; margin: 0 auto;">

## Overview

Wandertrap is an exciting 2D top-down maze game that challenges players to navigate through intricate dream labyrinths filled with puzzles, traps, and Sleep Thief orcs. As you progress through the levels, Theo reclaims stolen dream-shards, collects power-ups, and faces Wardens on the way to the Orc King's throne. Your goal is to find the exit in each level while maximizing your score and preserving your lives.

### Key Features

- Engaging top-down maze gameplay with smooth, frame-based movement (diagonals included)
- Ten distinct, themed levels (forest, desert, snow, dungeon) with increasing difficulty — all verified solvable by automated tests
- Hero weapon progression with real personalities: the Rusty Dagger jabs, the Wooden Axe sweeps a wide arc with heavy knockback (and is the only tool that cuts trees, boulders and cracked walls), the Steel Sword thrusts fast and hard straight ahead, and the Dream Bow (plus Moonlit Quiver upgrade) fights at range
- Telegraphed combat: guards flash a "!" windup before contact hits land, archers visibly draw before loosing arrows — every hit can be dodged
- Game-feel polish throughout: hit-stop, screen shake, impact particles, knockback both ways
- Procedural lullaby music (Web Audio, zero assets) that shifts key with each act's theme and holds its breath while a boss is alive
- Sleep Thief orcs with line-of-sight detection: melee guards chase, investigate your last seen position and patrol near their posts; archers keep distance and kite
- Hidden explosive traps that arm on approach and damage player and guards alike — disarm them with the pick for score, or lure orcs into the blast
- Secret cracked walls (two per act) that fall to an axe swing and always hide a stash — including a hidden way into the Orc King's sanctum
- Level twists: a defuse-every-trap bonus in the Quarry, a wake-before-dawn timer in the Serpent, and sneak-or-fight choices against both the first Warden and the Orc King
- End-of-level mastery tally: time and untouched bonuses plus a persistent 1-3 star rating per dream, shown in Level Select
- The Daily Dream: one date-seeded attempt per day with a shareable, Wordle-style result string — entirely local
- Runs are bookmarked after each level, so Continue survives closing the browser
- Short story beats between levels — with dry commentary from Sooth the dream-dragon — plus illustrated intro scenes and optional generated narration
- Pixel art graphics for a retro gaming feel, plus synthesized sound effects
- Score tracking with a persistent local high score table

### Controls

| Key | Action |
| --- | --- |
| Arrow keys | Move (hold for continuous movement) |
| Space | Attack with the selected weapon |
| Tab / 1 / 2 / 3 / 4 | Cycle or select Rusty Dagger / Wooden Axe / Steel Sword / Dream Bow |
| X | Wooden Axe shortcut — the only tool that fells trees, boulders and cracked walls (once found) |
| P | Pick — disarm an armed trap beside you |
| U | Drink a healing potion |
| I | Inventory and weapon recap |
| Escape | Pause / back to menu |

On touch devices in **landscape**, an on-screen D-pad plus **ATK**, **INV**, **POT**, **PICK**, **WPN** and pause buttons appear automatically. Rotate to landscape on phones — a prompt appears if the device is held upright.

Use the **Sound on/off** toggle on the welcome screen or during gameplay. You can also skip repeating level story cards from the welcome screen once you know the dreams.

Embark on this thrilling adventure and see if you can outsmart the Wandertrap!

## Documentation

- [Story of Wandertrap](docs/story.md)
- [Entity Overview](docs/entities.md)
- [Levels Overview](docs/levels.md)

## Project Structure

The project is organized into several directories and files, each serving a specific purpose:

- **game/**: Contains the main game logic, assets, screens, levels, and utility functions.
  - **game.js**: Main game logic, including initializing the game board, handling player input, updating game state, and rendering the game board and entities.
  - **assets.js**: Handles loading game assets.
  - **screens/**: Contains different screen modules like welcome screen, game over screen, high score screen, and level completed screen.
  - **levels/**: Contains level-specific configurations and data.
  - **utils/**: Contains utility functions and settings for the game, including theme, date, and canvas utilities.
- **index.html**: The main HTML file that sets up the game container and includes the game script.

## Installation and Running

To get started with `Wandertrap`, follow these steps:

1. Clone the repository to your local machine.

2. Make sure you have [Node.js](https://nodejs.org/) installed on your system.

3. Open a terminal and navigate to the project directory.

4. Install the project dependencies by running:

   ```bash
   npm install
   ```

5. To start the development server and run the game, use:

   ```bash
   npm start
   ```

   This will start the Parcel bundler and serve the game at `http://localhost:1234` (or another port if 1234 is in use).

6. To build the project for production, run:

   ```bash
   npm run build
   ```

   This creates a `dist` folder locally. **Do not commit `dist`** — GitHub Pages builds it in CI (see `.github/workflows/pages.yml`).

### GitHub Pages

1. Repo **Settings → Pages → Build and deployment → Source**: choose **GitHub Actions** (not “Deploy from a branch”).
2. Push to `main`. The workflow builds and publishes `dist` automatically.
3. Site URL: `https://<user-or-org>.github.io/<repo>/`

Note: The game uses Parcel as its bundler, which is included in the dev dependencies and will be installed automatically when you run `npm install`.

## Story Narration

Story narration is generated once with ElevenLabs and saved as MP3 files in `assets/audio/narration/`:

```bash
ELEVENLABS_API_KEY=your_key npm run narrate:story
```

Set `ELEVENLABS_VOICE_ID` to use a different voice. If narration files are missing, the game still shows the story text and advances normally.
