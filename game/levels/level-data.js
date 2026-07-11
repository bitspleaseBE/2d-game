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
//   'S' spike trap (telegraphed floor spikes)  'F' crumbling floor (collapses to a pit)
//   '^' 'v' '<' '>' dart shooter (solid wall that fires darts the way it points)
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
    '#   SD     SD  ## X#',
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
    '# G     E     C    <',
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
    '#### ##S##S## # ####',
    '#      G           #',
    '#  C     B      E  #',
    '#### ##S##S## # ####',
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
    '# A D  G D  E D  A <',
    '#   #    #    #    #',
    '## ##S## # ##S## ###',
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
    '#  # # #  F    ##  #',
    '#  #   ####D##### A#',
    '#E ## G   SC     ###',
    '#C     ##     G   T#',
    '####################',
]), 'The Throne', { theme: 'dungeon', fogOfWar: true }));

// ===========================================================================
// Act 2 — the Undermaze. The dream beneath the dream, where the floor itself
// turns against the dreamer. No new weapons here (the arsenal completes at
// level 9); the challenge comes from layered traps, enemy density and fog.
// ===========================================================================

// 11. The Spike Cellar — spike-trap tutorial. Four halls stacked north to
// south; every passage between them is a spike gate, so you learn the
// retract/extend rhythm before anything else is asked of you.
levelData.addLevel(new Level(11, 'hard', parse([
    '####################',
    '#P  C     G     C  #',
    '#####S########S#####',
    '#  G      C      G #',
    '#########S##########',
    '#C   G        S   C#',
    '####S###########S###',
    '#  G    #     G    #',
    '#C      #  S      X#',
    '####################',
]), 'The Spike Cellar', { theme: 'dungeon' }));

// 12. The Dart Gallery — dart-shooter tutorial. Three galleries swept by
// wall-mounted shooters; the gaps between them fall under a dart's line, so
// crossing is a matter of timing. A Haste rune waits at the far east.
levelData.addLevel(new Level(12, 'hard', parse([
    '####################',
    '#P   G        C    #',
    '########v# #########',
    '#  A     C      G  <',
    '######## ###########',
    '>  C      G       H#',
    '# ########v####### #',
    '# G   S     C   A  #',
    '#         G       X#',
    '####################',
]), 'The Dart Gallery', { theme: 'dungeon' }));

// 13. The Hollow Bridge — the first Act 2 boss, fought over a lattice of
// crumbling floors. Every step you take collapses the arena a little more,
// so kite the boss without stranding yourself on a shrinking island.
levelData.addLevel(new Level(13, 'expert', parse([
    '####################',
    '#P    C      C     #',
    '#                  #',
    '#   F  F   F  F    #',
    '#     F  B  F      #',
    '#   F  F   F  F    #',
    '#                  #',
    '#C          C    X #',
    '#                  #',
    '####################',
]), 'The Hollow Bridge', { theme: 'snow' }));

// 14. The Frozen Larder — fog of war over a pantry of spikes, with boulders
// plugging the shortcuts. Lure the guards onto the spikes and let the traps
// do the work.
levelData.addLevel(new Level(14, 'expert', parse([
    '####################',
    '#P   #  G  #  C    #',
    '# S  #     # ##  # #',
    '#    #  C  #  O    #',
    '## S###### ###S### #',
    '#   G   O     G    #',
    '# ######## ####### #',
    '#C  S    G    C  S #',
    '#       X          #',
    '####################',
]), 'The Frozen Larder', { theme: 'snow', fogOfWar: true }));

// 15. The Sandtrap — dart crossfire across the top, spikes below and archers
// throughout. A Warding rune sits at the end of a spiked eastern detour.
levelData.addLevel(new Level(15, 'expert', parse([
    '####################',
    '>  A    C     A    <',
    '#  ###### ######## #',
    '#P   S        S   V#',
    '#### ###  S ### ####',
    '#  C    G     C    #',
    '# ## ###### ### ## #',
    '#   S   A    S  G  #',
    '#          X       #',
    '####################',
]), 'The Sandtrap', { theme: 'desert' }));

// 16. The Mirage Court — a boss arena overlooked by two dart shooters, with
// an inner court sealed behind a locked door. Down a courtyard guard for the
// key, then decide whether to fight the boss or slip past it.
levelData.addLevel(new Level(16, 'expert', parse([
    '####################',
    '#P    C  A    C    #',
    '# ####### ######## #',
    '#      D       G   #',
    '# ## v######v ##   #',
    '#  C    B     C    #',
    '# ## ######## ##   #',
    '#   G     A    G   #',
    '#C     X           #',
    '####################',
]), 'The Mirage Court', { theme: 'desert' }));

// 17. The Rootways — fog, tree gates that only the axe opens, and crumbling
// shortcuts that seal behind you. A Might rune rewards the brave route.
levelData.addLevel(new Level(17, 'expert', parse([
    '####################',
    '#P  T   C   T   M  #',
    '# TT ### F ### TT  #',
    '#    T  G  T   F   #',
    '### F ##### ## ### #',
    '#  C   T  G   T  C #',
    '# ## F ### F ###  ##',
    '#   T   G    T  F  #',
    '#T  F      X    T  #',
    '####################',
]), 'The Rootways', { theme: 'forest', fogOfWar: true }));

// 18. The Choking Garden — a boss and archers among spiked flowerbeds, with
// two chained locked doors to open on the way through.
levelData.addLevel(new Level(18, 'nightmare', parse([
    '####################',
    '#P   S  A  S    C  #',
    '# ####### D ###### #',
    '#   C    S     A   #',
    '## S ##### ### S  ##',
    '#      B       C   #',
    '## # ### D ##### S #',
    '#  A   S     G  A  #',
    '#C        X        #',
    '####################',
]), 'The Choking Garden', { theme: 'forest' }));

// 19. The Long Dark — an endurance run: all three traps and roaming archers
// under fog, with crystals kept deliberately scarce. No boss; just survival.
levelData.addLevel(new Level(19, 'nightmare', parse([
    '####################',
    '>  A   S   F   A   <',
    '# ### ##### ### ## #',
    '#P  S   G   F   S  #',
    '## #### F ##### ## #',
    '#   F   A   S   G  #',
    '# ## ### F ### ##  #',
    '#  S   G   F   S A #',
    '#         X    C   #',
    '####################',
]), 'The Long Dark', { theme: 'dungeon', fogOfWar: true }));

// 20. The Nightmare King — the finale. A dart-swept ring corridor surrounds a
// locked keep; ring guards carry the key. Inside, the king waits before the
// exit nook, flanked by spikes, with crumbling floors on the northern route.
levelData.addLevel(new Level(20, 'nightmare', parse([
    '####################',
    '#P    S      C   G #',
    '# ################ #',
    '# #C   F     F  C# #',
    '# #    ##X##     # #',
    '# #  S   B    S  # #',
    '# #F    C     G F# #',
    '# ########D####### #',
    '#  G    C     S  G #',
    '#^################^#',
]), 'The Nightmare King', { theme: 'dungeon', fogOfWar: true }));

export default levelData;
