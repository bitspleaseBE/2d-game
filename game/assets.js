// handle the assets
// Load player sprite sheets
// Load enemy sprite sheets
// Load powerup sprite sheets
// Load guard sprite sheets
// Load obstacle images

// NOTE: asset URLs must be written inline as `new URL('literal', import.meta.url)`.
// Parcel only bundles the referenced file when the first argument is a string
// literal at the call site. Wrapping it in a helper (variable argument) defeats
// static analysis, leaving an unbundled `file://` path that the browser blocks.

const playerUrls = {
  playerMovement: new URL("../assets/images/player/Player.png", import.meta.url),
  playerActions: new URL("../assets/images/player/Player_Actions.png", import.meta.url),
};

const guardUrls = {
  orc1_Attack: new URL("../assets/images/enemies/orc1/orc1_attack_full.png", import.meta.url),
  orc1_Death: new URL("../assets/images/enemies/orc1/orc1_death_full.png", import.meta.url),
  orc1_Hurt: new URL("../assets/images/enemies/orc1/orc1_hurt_full.png", import.meta.url),
  orc1_Idle: new URL("../assets/images/enemies/orc1/orc1_idle_full.png", import.meta.url),
  orc1_Run: new URL("../assets/images/enemies/orc1/orc1_run_full.png", import.meta.url),
  orc1_Run_Attack: new URL("../assets/images/enemies/orc1/orc1_run_attack_front_full.png", import.meta.url),
  orc1_Walk: new URL("../assets/images/enemies/orc1/orc1_walk_full.png", import.meta.url),
  orc1_Walk_Attack: new URL("../assets/images/enemies/orc1/orc1_walk_attack_front_full.png", import.meta.url),
  orc2_Attack: new URL("../assets/images/enemies/orc2/orc2_attack_full.png", import.meta.url),
  orc2_Death: new URL("../assets/images/enemies/orc2/orc2_death_full.png", import.meta.url),
  orc2_Hurt: new URL("../assets/images/enemies/orc2/orc2_hurt_full.png", import.meta.url),
  orc2_Idle: new URL("../assets/images/enemies/orc2/orc2_idle_full.png", import.meta.url),
  orc2_Run: new URL("../assets/images/enemies/orc2/orc2_run_full.png", import.meta.url),
  orc2_Run_Attack: new URL("../assets/images/enemies/orc2/orc2_run_attack_full.png", import.meta.url),
  orc2_Walk: new URL("../assets/images/enemies/orc2/orc2_walk_full.png", import.meta.url),
  orc2_Walk_Attack: new URL("../assets/images/enemies/orc2/orc2_walk_attack_full.png", import.meta.url),
  orc3_Attack: new URL("../assets/images/enemies/orc3/orc3_attack_full.png", import.meta.url),
  orc3_Death: new URL("../assets/images/enemies/orc3/orc3_death_full.png", import.meta.url),
  orc3_Hurt: new URL("../assets/images/enemies/orc3/orc3_hurt_full.png", import.meta.url),
  orc3_Idle: new URL("../assets/images/enemies/orc3/orc3_idle_full.png", import.meta.url),
  orc3_Run: new URL("../assets/images/enemies/orc3/orc3_run_full.png", import.meta.url),
  orc3_Run_Attack: new URL("../assets/images/enemies/orc3/orc3_run_attack_full.png", import.meta.url),
  orc3_Walk: new URL("../assets/images/enemies/orc3/orc3_walk_full.png", import.meta.url),
  orc3_Walk_Attack: new URL("../assets/images/enemies/orc3/orc3_walk_attack_full.png", import.meta.url),
};

const levelUrls = {
  rock: new URL("../assets/images/obstacle/Rock6_1.png", import.meta.url),
  tree1: new URL("../assets/images/obstacle/Tree1.png", import.meta.url),
  tree2: new URL("../assets/images/obstacle/Tree2.png", import.meta.url),
  tree3: new URL("../assets/images/obstacle/Tree3.png", import.meta.url),
  palm1: new URL("../assets/images/obstacle/Palm_tree1_2.png", import.meta.url),
  palm2: new URL("../assets/images/obstacle/Palm_tree2_2.png", import.meta.url),
  sandRuin: new URL("../assets/images/exit/Sand_ruins3.png", import.meta.url),
  snowRuin: new URL("../assets/images/exit/Snow_ruins3.png", import.meta.url),
  yellowRuin: new URL("../assets/images/exit/Yellow_ruins3.png", import.meta.url),
};

const powerupUrls = {
  greenCrystal: new URL("../assets/images/powerups/Green_crystal2.png", import.meta.url),
  redCrystal: new URL("../assets/images/powerups/Red_crystal2.png", import.meta.url),
  blueCrystal: new URL("../assets/images/powerups/Blue_crystal2.png", import.meta.url),
  yellowCrystal: new URL("../assets/images/powerups/Yellow_crystal2.png", import.meta.url),
};

// Derived automatically so the splash progress bar can never drift when
// assets are added or removed
export const totalAssetCount =
  Object.keys(playerUrls).length +
  Object.keys(guardUrls).length +
  Object.keys(levelUrls).length +
  Object.keys(powerupUrls).length;

function loadImage(src, onProgress) {
  return new Promise((resolve, reject) => {
    try {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        onProgress(src, img);
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

// Load every image in a name->URL map in parallel; resolves to name->Image
async function loadImageSet(urls, onProgress) {
  const names = Object.keys(urls);
  const images = await Promise.all(
    names.map((name) => loadImage(urls[name].href, onProgress))
  );
  const set = {};
  names.forEach((name, i) => {
    set[name] = images[i];
  });
  return set;
}

export function loadPlayerAssets(onProgress) {
  return loadImageSet(playerUrls, onProgress);
}

export function loadGuardAssets(onProgress) {
  return loadImageSet(guardUrls, onProgress);
}

export function loadLevelAssets(onProgress) {
  return loadImageSet(levelUrls, onProgress);
}

export function loadPowerUpsAssets(onProgress) {
  return loadImageSet(powerupUrls, onProgress);
}
