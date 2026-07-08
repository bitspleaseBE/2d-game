// handle the assets
// Load player sprite sheets
// Load enemy sprite sheets
// Load powerup sprite sheets
// Load explosive sprite sheets
// Load guard sprite sheets
// Load obstacle images

// NOTE: asset URLs must be written inline as `new URL('literal', import.meta.url)`.
// Parcel only bundles the referenced file when the first argument is a string
// literal at the call site. Wrapping it in a helper (variable argument) defeats
// static analysis, leaving an unbundled `file://` path that the browser blocks.
// Storing the resulting URL objects in the maps below is fine: the literal is
// still at the `new URL(...)` call site.

const PLAYER_ASSET_URLS = {
  playerMovement: new URL("../assets/images/player/Player.png", import.meta.url),
  playerActions: new URL("../assets/images/player/Player_Actions.png", import.meta.url),
  playerBow: new URL("../assets/images/player/Player_Bow.png", import.meta.url),
};

const GUARD_ASSET_URLS = {
  // ORC 1
  orc1_Attack: new URL("../assets/images/enemies/orc1/orc1_attack_full.png", import.meta.url),
  orc1_Bow_Attack: new URL("../assets/images/enemies/orc1/orc1_bow_attack_full.png", import.meta.url),
  orc1_Death: new URL("../assets/images/enemies/orc1/orc1_death_full.png", import.meta.url),
  orc1_Hurt: new URL("../assets/images/enemies/orc1/orc1_hurt_full.png", import.meta.url),
  orc1_Idle: new URL("../assets/images/enemies/orc1/orc1_idle_full.png", import.meta.url),
  orc1_Run: new URL("../assets/images/enemies/orc1/orc1_run_full.png", import.meta.url),
  orc1_Run_Attack: new URL("../assets/images/enemies/orc1/orc1_run_attack_front_full.png", import.meta.url),
  orc1_Walk: new URL("../assets/images/enemies/orc1/orc1_walk_full.png", import.meta.url),
  orc1_Walk_Attack: new URL("../assets/images/enemies/orc1/orc1_walk_attack_front_full.png", import.meta.url),

  // ORC 2
  orc2_Attack: new URL("../assets/images/enemies/orc2/orc2_attack_full.png", import.meta.url),
  orc2_Bow_Attack: new URL("../assets/images/enemies/orc2/orc2_bow_attack_full.png", import.meta.url),
  orc2_Death: new URL("../assets/images/enemies/orc2/orc2_death_full.png", import.meta.url),
  orc2_Hurt: new URL("../assets/images/enemies/orc2/orc2_hurt_full.png", import.meta.url),
  orc2_Idle: new URL("../assets/images/enemies/orc2/orc2_idle_full.png", import.meta.url),
  orc2_Run: new URL("../assets/images/enemies/orc2/orc2_run_full.png", import.meta.url),
  orc2_Run_Attack: new URL("../assets/images/enemies/orc2/orc2_run_attack_full.png", import.meta.url),
  orc2_Walk: new URL("../assets/images/enemies/orc2/orc2_walk_full.png", import.meta.url),
  orc2_Walk_Attack: new URL("../assets/images/enemies/orc2/orc2_walk_attack_full.png", import.meta.url),

  // ORC 3
  orc3_Attack: new URL("../assets/images/enemies/orc3/orc3_attack_full.png", import.meta.url),
  orc3_Bow_Attack: new URL("../assets/images/enemies/orc3/orc3_bow_attack_full.png", import.meta.url),
  orc3_Death: new URL("../assets/images/enemies/orc3/orc3_death_full.png", import.meta.url),
  orc3_Hurt: new URL("../assets/images/enemies/orc3/orc3_hurt_full.png", import.meta.url),
  orc3_Idle: new URL("../assets/images/enemies/orc3/orc3_idle_full.png", import.meta.url),
  orc3_Run: new URL("../assets/images/enemies/orc3/orc3_run_full.png", import.meta.url),
  orc3_Run_Attack: new URL("../assets/images/enemies/orc3/orc3_run_attack_full.png", import.meta.url),
  orc3_Walk: new URL("../assets/images/enemies/orc3/orc3_walk_full.png", import.meta.url),
  orc3_Walk_Attack: new URL("../assets/images/enemies/orc3/orc3_walk_attack_full.png", import.meta.url),

  // ORC 4
  orc4_Attack: new URL("../assets/images/enemies/orc4/orc4_attack_full.png", import.meta.url),
  orc4_Death: new URL("../assets/images/enemies/orc4/orc4_death_full.png", import.meta.url),
  orc4_Hurt: new URL("../assets/images/enemies/orc4/orc4_hurt_full.png", import.meta.url),
  orc4_Idle: new URL("../assets/images/enemies/orc4/orc4_idle_full.png", import.meta.url),
  orc4_Run: new URL("../assets/images/enemies/orc4/orc4_run_full.png", import.meta.url),
  orc4_Run_Attack: new URL("../assets/images/enemies/orc4/orc4_run_attack_full.png", import.meta.url),
  orc4_Walk: new URL("../assets/images/enemies/orc4/orc4_walk_full.png", import.meta.url),
  orc4_Walk_Attack: new URL("../assets/images/enemies/orc4/orc4_walk_attack_full.png", import.meta.url),
};

const LEVEL_ASSET_URLS = {
  grassTile: new URL("../assets/images/generated/grass_tile.png", import.meta.url),
  wall: new URL("../assets/images/generated/stone_wall.png", import.meta.url),
  boulder: new URL("../assets/images/generated/boulder.png", import.meta.url),
  rock: new URL("../assets/images/obstacle/Rock6_1.png", import.meta.url),
  tree1: new URL("../assets/images/obstacle/Tree1.png", import.meta.url),
  tree2: new URL("../assets/images/obstacle/Tree2.png", import.meta.url),
  tree3: new URL("../assets/images/obstacle/Tree3.png", import.meta.url),
  palm1: new URL("../assets/images/generated/palm_a.png", import.meta.url),
  palm2: new URL("../assets/images/generated/palm_b.png", import.meta.url),
  sandRuin: new URL("../assets/images/exit/Sand_ruins3.png", import.meta.url),
  snowRuin: new URL("../assets/images/exit/Snow_ruins3.png", import.meta.url),
  yellowRuin: new URL("../assets/images/generated/exit_ruin.png", import.meta.url),
  forestFloor: new URL("../assets/images/themes/forest/floor.png", import.meta.url),
  forestWall: new URL("../assets/images/themes/forest/wall.png", import.meta.url),
  forestTree1: new URL("../assets/images/themes/forest/tree_1.png", import.meta.url),
  forestTree2: new URL("../assets/images/themes/forest/tree_2.png", import.meta.url),
  forestBoulder: new URL("../assets/images/themes/forest/boulder.png", import.meta.url),
  forestExit: new URL("../assets/images/themes/forest/exit.png", import.meta.url),
  desertFloor: new URL("../assets/images/themes/desert/floor.png", import.meta.url),
  desertWall: new URL("../assets/images/themes/desert/wall.png", import.meta.url),
  desertTree1: new URL("../assets/images/themes/desert/tree_1.png", import.meta.url),
  desertTree2: new URL("../assets/images/themes/desert/tree_2.png", import.meta.url),
  desertBoulder: new URL("../assets/images/themes/desert/boulder.png", import.meta.url),
  desertExit: new URL("../assets/images/themes/desert/exit.png", import.meta.url),
  snowFloor: new URL("../assets/images/themes/snow/floor.png", import.meta.url),
  snowWall: new URL("../assets/images/themes/snow/wall.png", import.meta.url),
  snowTree1: new URL("../assets/images/themes/snow/tree_1.png", import.meta.url),
  snowTree2: new URL("../assets/images/themes/snow/tree_2.png", import.meta.url),
  snowBoulder: new URL("../assets/images/themes/snow/boulder.png", import.meta.url),
  snowExit: new URL("../assets/images/themes/snow/exit.png", import.meta.url),
  dungeonFloor: new URL("../assets/images/themes/dungeon/floor.png", import.meta.url),
  dungeonWall: new URL("../assets/images/themes/dungeon/wall.png", import.meta.url),
  dungeonObstacle1: new URL("../assets/images/themes/dungeon/obstacle_1.png", import.meta.url),
  dungeonObstacle2: new URL("../assets/images/themes/dungeon/obstacle_2.png", import.meta.url),
  dungeonBoulder: new URL("../assets/images/themes/dungeon/boulder.png", import.meta.url),
  dungeonExit: new URL("../assets/images/themes/dungeon/exit.png", import.meta.url),
};

const ITEM_ASSET_URLS = {
  key: new URL("../assets/images/generated/items/key.png", import.meta.url),
  potion: new URL("../assets/images/generated/items/potion.png", import.meta.url),
  explosive: new URL("../assets/images/generated/items/explosive.png", import.meta.url),
  dreamShard: new URL("../assets/images/powerups/Green_crystal2.png", import.meta.url),
  arrowBundle: new URL("../assets/images/projectiles/arrow.png", import.meta.url),
  dagger: new URL("../assets/images/generated/items/sword_dagger.png", import.meta.url),
  steelSword: new URL("../assets/images/generated/items/sword_steel.png", import.meta.url),
  warAxe: new URL("../assets/images/generated/items/axe_war.png", import.meta.url),
  runeHaste: new URL("../assets/images/generated/items/rune_haste.png", import.meta.url),
  runeMight: new URL("../assets/images/generated/items/rune_might.png", import.meta.url),
  runeWarding: new URL("../assets/images/generated/items/rune_warding.png", import.meta.url),
  // Not an inventory item, but generated by the same tool: the locked door tile
  door: new URL("../assets/images/generated/items/door.png", import.meta.url),
};

const POWERUP_ASSET_URLS = {
  greenCrystal: new URL("../assets/images/powerups/Green_crystal2.png", import.meta.url),
  redCrystal: new URL("../assets/images/generated/health_crystal.png", import.meta.url),
  blueCrystal: new URL("../assets/images/generated/mana_crystal.png", import.meta.url),
  yellowCrystal: new URL("../assets/images/powerups/Yellow_crystal2.png", import.meta.url),
};

const STORY_ASSET_URLS = {
  introBedroom: new URL("../assets/images/story/intro_bedroom.png", import.meta.url),
  introDoorway: new URL("../assets/images/story/intro_doorway.png", import.meta.url),
  introOrcs: new URL("../assets/images/story/intro_orcs.png", import.meta.url),
  introThrone: new URL("../assets/images/story/intro_throne.png", import.meta.url),
  introStepForward: new URL("../assets/images/story/intro_step_forward.png", import.meta.url),
  endingDawn: new URL("../assets/images/story/ending_dawn.png", import.meta.url),
};

const PROJECTILE_ASSET_URLS = {
  arrow: new URL("../assets/images/projectiles/arrow.png", import.meta.url),
};

// Total number of images the splash screen progress bar should expect.
// Derived from the URL maps so it can never drift out of sync with the
// actual asset lists (which previously caused progress above 100%).
// Story assets are excluded: they are heavy cinematics that load lazily
// in the background after the game becomes playable.
export function getTotalAssetCount() {
  return [
    PLAYER_ASSET_URLS,
    GUARD_ASSET_URLS,
    LEVEL_ASSET_URLS,
    ITEM_ASSET_URLS,
    POWERUP_ASSET_URLS,
    PROJECTILE_ASSET_URLS,
  ].reduce((total, urls) => total + Object.keys(urls).length, 0);
}

function loadImage(src, onProgress) {
  return new Promise((resolve, reject) => {
    try {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        if (onProgress) onProgress(src, img);
        resolve(img);
      };
      img.onerror = (error) => {
        console.error("Error loading image:", src, error);
        reject(new Error(`Failed to load image: ${src}`));
      };
    } catch (error) {
      console.error("Error loading image:", src, error);
      reject(new Error(`Unexpected error loading image: ${src}`));
    }
  });
}

// Loads every image in a { name: URL } map in parallel and returns
// { name: HTMLImageElement }. Images are written to `target` as soon as each
// one finishes, so callers holding a reference to `target` (e.g. a lazily
// loaded asset map) can use images before the whole batch completes.
async function loadImages(urlMap, onProgress, target = {}) {
  await Promise.all(
    Object.entries(urlMap).map(async ([name, url]) => {
      target[name] = await loadImage(url.href, onProgress);
    })
  );
  return target;
}

export async function loadPlayerAssets(onProgress) {
  console.log("Loading player assets...");
  return loadImages(PLAYER_ASSET_URLS, onProgress);
}

export async function loadGuardAssets(onProgress) {
  console.log("Loading guard assets...");
  return loadImages(GUARD_ASSET_URLS, onProgress);
}

export async function loadLevelAssets(onProgress) {
  console.log("Loading level assets...");
  return loadImages(LEVEL_ASSET_URLS, onProgress);
}

export async function loadItemAssets(onProgress) {
  console.log("Loading item assets...");
  return loadImages(ITEM_ASSET_URLS, onProgress);
}

export async function loadPowerUpsAssets(onProgress) {
  console.log("Loading powerups assets...");
  return loadImages(POWERUP_ASSET_URLS, onProgress);
}

export async function loadProjectileAssets(onProgress) {
  console.log("Loading projectile assets...");
  return loadImages(PROJECTILE_ASSET_URLS, onProgress);
}

// Story cinematics are by far the heaviest assets (~15 MB) but are only
// shown on the story and game-won screens, so they load lazily in the
// background instead of blocking the splash screen. The returned map is
// shared and fills in progressively; screens fall back to a gradient for
// any image that hasn't arrived yet.
const storyAssets = {};
let storyAssetsPromise = null;

export function loadStoryAssetsInBackground() {
  if (!storyAssetsPromise) {
    console.log("Loading story assets in the background...");
    storyAssetsPromise = loadImages(STORY_ASSET_URLS, null, storyAssets).catch((error) => {
      // Non-fatal: screens render a gradient fallback without these images.
      console.error("Error loading story assets:", error);
      return storyAssets;
    });
  }
  return storyAssetsPromise;
}

export function getStoryAssets() {
  return storyAssets;
}
