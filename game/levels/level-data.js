// Level data
// - Define the structure of each level (layout of the labyrinth)
// - Specify positions of obstacles, powerups, explosives, guards
// - Include metadata (level number, difficulty, name)
//
// Layout legend:
//   '#' wall          ' ' floor         'P' player spawn   'X' exit
//   'T' tree (solid, choppable)         'O' boulder (solid, choppable)
//   'G' guard         'A' archer        'B' boss          'C' crystal
//   'E' explosive     'W' weapon pedestal
//   'H' Haste rune    'V' Warding rune  'M' Might rune
//   'D' locked door (a defeated guard drops the key)
//
// Every layout is 10 rows of exactly 20 characters. Trees and boulders can
// only be chopped down with the wooden axe (one swing), so they make soft
// walls once the axe is found — and hard walls before that. The axe waits on
// the level 1 pedestal, on the only path out of the spawn corridor.

import { getLevelStoryBeat } from '../story-content.js';

class LevelData {
    constructor() {
        this.levels = [];
    }

    addLevel(level) {
        this.levels.push(level);
    }

    getLevel(levelNumber) {
        return this.levels[levelNumber - 1] || null;
    }
}

class Level {
    constructor(number, difficulty, layout, name, options = {}) {
        const storyBeat = getLevelStoryBeat(number);
        this.number = number;
        this.difficulty = difficulty;
        this.layout = layout;
        this.name = name;
        this.story = options.story || (storyBeat && storyBeat.story) || '';
        this.audioId = options.audioId || (storyBeat && storyBeat.audioId) || '';
        this.theme = options.theme || 'forest';
        this.weaponReward = options.weaponReward || null;
        // With fog of war on, only explored parts of the map are visible
        this.fogOfWar = Boolean(options.fogOfWar);
    }
}

// Rows are written as strings for readability and converted to the
// character arrays the game consumes
const parse = (rows) => rows.map((row) => row.split(''));

const levelData = new LevelData();

// 1. The Glade — tutorial: a small maze inside a forest clearing. A tree
// seals the narrow corridor beside the spawn (bumping into it without an
// axe explains what is missing), and the wooden axe waits on a pedestal on
// the only other way out. One boulder guards a dead end.
levelData.addLevel(new Level(1, 'easy', parse([
    'TTTTTTTTTTTTTTTTTTTT',
    'T##################T',
    'T#  G #P#     C   #T',
    'T# ## #W# ####### #T',
    'T#    #O#  C # ## #T',
    'T# ## # ##   #    #T',
    'T#  # #    #   ## #T',
    'T# ## E ##G# X ## #T',
    'T##################T',
    'TTTTTTTTTTTTTTTTTTTT',
]), 'The Glade', { theme: 'forest', weaponReward: 'woodenAxe' }));

// 2. The Gatehouse — first locked door: defeat a guard to find the key
levelData.addLevel(new Level(2, 'easy', parse([
    '####################',
    '#P  #G  #####      #',
    '# # # #   #   #### #',
    '#     # # ## #     #',
    '#########    #D#####',
    '#X G    ######     #',
    '# # ###    #G##### #',
    '#     ###    #   # #',
    '#   #     ##   #   #',
    '####################',
]), 'The Gatehouse', { theme: 'forest' }));

// 3. The Orchard — rows of trees form choppable gates between corridors:
// chop straight through or walk around via the side openings
levelData.addLevel(new Level(3, 'medium', parse([
    '####################',
    '#P  TT   W  TT    C#',
    '#   TT      TT     #',
    '##T####T######T##T##',
    '#   G     E    G   #',
    '#C  TT      TT     #',
    '##T####T######T# ###',
    '#   G     C  G     #',
    '#  TTT      TT    X#',
    '####################',
]), 'The Orchard', { theme: 'forest', weaponReward: 'steelSword' }));

// 4. The Quarry — boulders plug the wall gaps: every shortcut costs two
// swings of the axe, every detour risks a patrol
levelData.addLevel(new Level(4, 'medium', parse([
    '####################',
    '#P   #  H  O  G   C#',
    '#    O     #       #',
    '## ###### ####O### #',
    '#  G   #     C   G #',
    '#    O #  E #      #',
    '# #### ##O### ###O##',
    '#  C      #     G  #',
    '#    G    O   C   X#',
    '####################',
]), 'The Quarry', { theme: 'desert' }));

// 5. The Warden — the first boss guards the open eastern arena. It is slow:
// keep moving, land a swing, and step away before it closes in.
levelData.addLevel(new Level(5, 'medium', parse([
    '####################',
    '#P #  C    #      C#',
    '#  # ## ## #  ### ##',
    '# A#  #  # #       #',
    '#  ## # ###    B   #',
    '#     #            #',
    '# ###### ###   ### #',
    '# C #  G   #       #',
    '#   #      ##  X   #',
    '####################',
]), 'The Warden', { theme: 'desert' }));

// 6. Twin Halls — two halls behind two locked doors: the guards of each
// hall carry the key to the next
levelData.addLevel(new Level(6, 'hard', parse([
    '####################',
    '#P   #  A   #  W  G#',
    '#  C #      #      #',
    '# G  #  E   #  ##  #',
    '#    D      D  ## X#',
    '#  ###      #      #',
    '#    #  C   #   G  #',
    '# ## #      # ###  #',
    '#  G #   G  #  C   #',
    '####################',
]), 'Twin Halls', { theme: 'snow', weaponReward: 'dreamBow' }));

// 7. The Serpent — one long winding corridor walked in the dark: fog of
// war hides what waits beyond the next bend. Gates of trees and boulders
// plug the wall gaps.
levelData.addLevel(new Level(7, 'hard', parse([
    '####################',
    '#P  V      A      G#',
    '################## #',
    '#    G     C      T#',
    '#T##################',
    '# G     E     C    #',
    '##################O#',
    '#  G     C    G    #',
    '#X                T#',
    '####################',
]), 'The Serpent', { theme: 'snow', fogOfWar: true }));

// 8. The Crossroads — four guarded quadrants around a central plaza where
// a boss patrols the loot
levelData.addLevel(new Level(8, 'hard', parse([
    '####################',
    '#P   #   C  #     A#',
    '#  G #      #  C   #',
    '#### ## ## ## # ####',
    '#      G           #',
    '#  C     B      E  #',
    '#### ## ## ## # ####',
    '#  G #      #   G  #',
    '#    # C    #    X #',
    '####################',
]), 'The Crossroads', { theme: 'dungeon' }));

// 9. The Gauntlet — four chambers in a row, each sealed by a locked door;
// every chamber's guards carry the next key
levelData.addLevel(new Level(9, 'expert', parse([
    '####################',
    '#P  #W  A#   G# M  #',
    '#   #    #    #    #',
    '# A D  G D  E D  A #',
    '#   #    #    #    #',
    '## ## ## # ## ## ###',
    '#C  #  G #  G #   G#',
    '#   #    #    #  ###',
    '# G #  C #  C #  X##',
    '####################',
]), 'The Gauntlet', { theme: 'dungeon', fogOfWar: true, weaponReward: 'moonlitQuiver' }));

// 10. The Throne — the final boss waits in an inner sanctum behind a locked
// door, with the exit at its back. Sneak past it or bring it down for glory.
levelData.addLevel(new Level(10, 'expert', parse([
    '####################',
    '#P   #     C    A  #',
    '# G  # ##########  #',
    '#    # #      X##  #',
    '## # # #  B    ## C#',
    '#  # # #       ##  #',
    '#  #   ####D##### A#',
    '#E ## G    C     ###',
    '#C     ##     G   T#',
    '####################',
]), 'The Throne', { theme: 'dungeon', fogOfWar: true }));

export default levelData;
