// Per-level visual theme registry.
// Theme entries point at keys in the loaded level-assets object.

export const DEFAULT_THEME = "forest";

export const THEMES = {
  forest: {
    name: "Forest",
    floor: "forestFloor",
    wall: "forestWall",
    trees: ["forestTree1", "forestTree2"],
    boulder: "forestBoulder",
    exit: "forestExit",
    floorFallback: "#2f7d3b",
  },
  desert: {
    name: "Desert Ruins",
    floor: "desertFloor",
    wall: "desertWall",
    trees: ["desertTree1", "desertTree2"],
    boulder: "desertBoulder",
    exit: "desertExit",
    floorFallback: "#b8904d",
  },
  snow: {
    name: "Frozen Halls",
    floor: "snowFloor",
    wall: "snowWall",
    trees: ["snowTree1", "snowTree2"],
    boulder: "snowBoulder",
    exit: "snowExit",
    floorFallback: "#d8e7ef",
  },
  dungeon: {
    name: "Dungeon Depths",
    floor: "dungeonFloor",
    wall: "dungeonWall",
    trees: ["dungeonObstacle1", "dungeonObstacle2"],
    boulder: "dungeonBoulder",
    exit: "dungeonExit",
    floorFallback: "#27262d",
  },
};

const assetFromTheme = (levelAssets, theme, fallbackTheme, key) =>
  levelAssets[theme[key]] || levelAssets[fallbackTheme[key]];

export function getTheme(themeId) {
  return THEMES[themeId] || THEMES[DEFAULT_THEME];
}

export function resolveThemeAssets(levelAssets, themeId = DEFAULT_THEME) {
  const theme = getTheme(themeId);
  const fallbackTheme = THEMES[DEFAULT_THEME];
  const trees = theme.trees
    .map((key) => levelAssets[key])
    .filter(Boolean);

  return {
    id: THEMES[themeId] ? themeId : DEFAULT_THEME,
    name: theme.name,
    floor: assetFromTheme(levelAssets, theme, fallbackTheme, "floor"),
    wall: assetFromTheme(levelAssets, theme, fallbackTheme, "wall"),
    trees: trees.length
      ? trees
      : fallbackTheme.trees.map((key) => levelAssets[key]).filter(Boolean),
    boulder: assetFromTheme(levelAssets, theme, fallbackTheme, "boulder"),
    exit: assetFromTheme(levelAssets, theme, fallbackTheme, "exit"),
    floorFallback: theme.floorFallback || fallbackTheme.floorFallback,
  };
}
