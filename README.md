# Wandertrap

Welcome to "Wandertrap," a 2D top-down maze game where you navigate a dream labyrinth filled with traps, powerups, and Sleep Thief orcs.

*Help Theo in his blue pyjamas reclaim the dream-shards and wake before dawn*

<img src="assets/images/banner.jpeg" alt="Wandertrap Game Screenshot" width="50%" style="display: block; margin: 0 auto;">

## Overview

Wandertrap is an exciting 2D top-down maze game that challenges players to navigate through intricate dream labyrinths filled with puzzles, traps, and Sleep Thief orcs. As you progress through the levels, Theo reclaims stolen dream-shards, collects power-ups, and faces Wardens on the way to the Orc King's throne. Your goal is to find the exit in each level while maximizing your score and preserving your lives.

### Key Features

- Engaging top-down maze gameplay with smooth, frame-based movement (diagonals included)
- Ten distinct, themed levels (forest, desert, snow, dungeon) with increasing difficulty — all verified solvable by automated tests
- Hero weapon progression: Rusty Dagger, Wooden Axe, Steel Sword, Dream Bow, and a Moonlit Quiver upgrade — only the axe can cut trees and break boulders
- Melee and ranged combat with attack cooldowns, arrows, lingering guard corpses, archers, Wardens, and a final boss guarding the last exit
- Hidden explosive traps that arm on approach and damage player and guards alike
- Four powerups — health, speed, strength, invincibility (timed effects shown in the HUD) — plus healing potions you carry between levels
- Keys and locked doors gate the later exits; hidden traps can be disarmed with a well-timed pick
- Sleep Thief orcs with line-of-sight detection: melee guards chase, archers keep distance and fire arrows, and scarce drops make potions and arrows matter
- Short story beats between levels, illustrated intro scenes, and optional generated narration
- Pixel art graphics for a retro gaming feel, plus synthesized sound effects
- Score tracking with a persistent local high score table

### Controls

| Key | Action |
| --- | --- |
| Arrow keys | Move (hold for continuous movement) |
| Space | Attack with the selected weapon |
| Tab / 1 / 2 / 3 / 4 | Cycle or select Rusty Dagger / Wooden Axe / Steel Sword / Dream Bow |
| X | Wooden Axe shortcut — the only tool that fells trees and boulders (once found) |
| P | Pick — disarm an armed trap next to you |
| U | Drink a healing potion |
| I | Inventory and weapon recap |
| Escape | Pause / back to menu |

On touch devices an on-screen D-pad and action buttons appear automatically.

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

   This will create a `dist` folder with the optimized and bundled files ready for deployment.

Note: The game uses Parcel as its bundler, which is included in the dev dependencies and will be installed automatically when you run `npm install`.

## Story Narration

Story narration is generated once with ElevenLabs and saved as MP3 files in `assets/audio/narration/`:

```bash
ELEVENLABS_API_KEY=your_key npm run narrate:story
```

Set `ELEVENLABS_VOICE_ID` to use a different voice. If narration files are missing, the game still shows the story text and advances normally.
