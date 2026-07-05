// Level data
// - Define the structure of each level (layout of the labyrinth)
// - Specify positions of obstacles, powerups, explosives, guards
// - Include metadata (level number, difficulty, theme)
//
// Layout legend:
//   '#' wall        'P' player spawn   'X' exit
//   'G' guard       'B' boss guard     'E' hidden explosive trap
//   'C' powerup     'O' boulder        'T' tree
//   ' ' open floor
//
// Layout rows may be written as strings (easier to read and edit) or as
// arrays of characters; the Level constructor normalizes both forms.

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

    getLevelCount() {
        return this.levels.length;
    }
}

class Level {
    constructor(number, difficulty, layout, theme = 'forest') {
        this.number = number;
        this.difficulty = difficulty;
        this.layout = layout.map((row) =>
            typeof row === 'string' ? row.split('') : row
        );
        this.theme = theme;
    }
}

const levelData = new LevelData();

// Level 1 — gentle introduction: one small maze ringed by a palm forest
levelData.addLevel(new Level(
    1,
    'easy',
    [
        ['T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T'],
        ['T', 'T', 'T', 'T', 'T', 'T', '#', '#', '#', '#', '#', '#', '#', '#', 'T', 'T', 'T', 'T', 'T', 'T'],
        ['T', 'T', 'T', 'T', 'T', 'T', '#', 'P', 'T', ' ', ' ', ' ', ' ', '#', 'T', 'T', 'T', 'T', 'T', 'T'],
        ['T', 'T', 'T', 'T', 'T', 'T', '#', ' ', '#', '#', '#', ' ', ' ', '#', 'T', 'T', 'T', 'T', 'T', 'T'],
        ['T', 'T', 'T', 'T', 'T', 'T', '#', 'O', '#', 'X', '#', ' ', 'C', '#', 'T', 'T', 'T', 'T', 'T', 'T'],
        ['T', 'T', 'T', 'T', 'T', 'T', '#', ' ', '#', ' ', ' ', ' ', ' ', '#', 'T', 'T', 'T', 'T', 'T', 'T'],
        ['T', 'T', 'T', 'T', 'T', 'T', '#', '#', '#', ' ', '#', ' ', 'G', '#', 'T', 'T', 'T', 'T', 'T', 'T'],
        ['T', 'T', 'T', 'T', 'T', 'T', '#', ' ', 'C', 'G', ' ', 'E', ' ', '#', 'T', 'T', 'T', 'T', 'T', 'T'],
        ['T', 'T', 'T', 'T', 'T', 'T', '#', '#', '#', '#', '#', '#', '#', '#', 'T', 'T', 'T', 'T', 'T', 'T'],
        ['T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T']
    ],
    'forest'
));

// Level 2 — a full-screen maze, no extras: learn to navigate
levelData.addLevel(new Level(
    2,
    'easy',
    [
        ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
        ['#', 'P', ' ', ' ', '#', 'G', ' ', ' ', '#', '#', '#', '#', '#', ' ', ' ', ' ', ' ', ' ', ' ', '#'],
        ['#', ' ', '#', ' ', '#', ' ', '#', ' ', ' ', ' ', '#', ' ', ' ', ' ', '#', '#', '#', '#', ' ', '#'],
        ['#', ' ', ' ', ' ', ' ', ' ', '#', ' ', '#', ' ', '#', '#', ' ', '#', ' ', ' ', ' ', ' ', ' ', '#'],
        ['#', '#', '#', '#', '#', '#', '#', '#', '#', ' ', ' ', ' ', ' ', '#', ' ', '#', '#', '#', '#', '#'],
        ['#', 'X', ' ', 'G', ' ', ' ', ' ', ' ', '#', '#', '#', '#', '#', '#', ' ', ' ', ' ', ' ', ' ', '#'],
        ['#', ' ', '#', ' ', '#', '#', '#', ' ', ' ', ' ', ' ', '#', 'G', '#', '#', '#', '#', '#', ' ', '#'],
        ['#', ' ', ' ', ' ', ' ', ' ', '#', '#', '#', ' ', ' ', ' ', ' ', '#', ' ', ' ', ' ', '#', ' ', '#'],
        ['#', ' ', ' ', ' ', '#', ' ', ' ', ' ', ' ', ' ', '#', '#', ' ', ' ', ' ', '#', ' ', ' ', ' ', '#'],
        ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#']
    ],
    'forest'
));

// Level 3 — desert ruins: guards patrol wider corridors with looping paths,
// and the first hidden explosive traps appear
levelData.addLevel(new Level(
    3,
    'medium',
    [
        '####################',
        '#P#  G            ##',
        '#   # ## #### # # ##',
        '#   #       C   # ##',
        '# #######T### ### ##',
        '#      E#   #     ##',
        '### #G# ###C## ##X##',
        '#EG  O#  C        ##',
        '####################',
        '####################',
    ],
    'sand'
));

// Level 4 — frozen halls: tighter corridors, more guards, more traps
levelData.addLevel(new Level(
    4,
    'hard',
    [
        '####################',
        '#P  #      E   G  ##',
        '###   #C#####E### ##',
        '# # # #  G C#O#   ##',
        '# # # ##  # # # ####',
        '#   # #   # # #   ##',
        '#E ## # # # # ##OC##',
        '#G    # #G    #  X##',
        '####################',
        '####################',
    ],
    'snow'
));

// Level 5 — the dark heart of the labyrinth: the exit is guarded by the boss
levelData.addLevel(new Level(
    5,
    'expert',
    [
        '####################',
        '#P  # C #     #  G##',
        '### # # # ### #B#C##',
        '#     # #  E#G#X# ##',
        '#  ####C### # ### ##',
        '#        G E#   # ##',
        '# ### ######### # ##',
        '#GE    C          ##',
        '####################',
        '####################',
    ],
    'dark'
));

export default levelData;
