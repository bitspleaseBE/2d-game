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

export async function loadPlayerAssets(onProgress) {
  console.log("Loading player assets...");
  const playerMovement = await loadImage(
    new URL("../assets/images/player/Player.png", import.meta.url).href,
    onProgress
  );
  const playerActions = await loadImage(
    new URL("../assets/images/player/Player_Actions.png", import.meta.url).href,
    onProgress
  );

  return { playerMovement, playerActions };
}

export async function loadGuardAssets(onProgress) {
  console.log("Loading guard assets...");
  // ORC 1
  const orc1_Attack = await loadImage(
    new URL("../assets/images/enemies/orc1/orc1_attack_full.png", import.meta.url).href,
    onProgress
  );
  const orc1_Death = await loadImage(
    new URL("../assets/images/enemies/orc1/orc1_death_full.png", import.meta.url).href,
    onProgress
  );
  const orc1_Hurt = await loadImage(
    new URL("../assets/images/enemies/orc1/orc1_hurt_full.png", import.meta.url).href,
    onProgress
  );
  const orc1_Idle = await loadImage(
    new URL("../assets/images/enemies/orc1/orc1_idle_full.png", import.meta.url).href,
    onProgress
  );
  const orc1_Run = await loadImage(
    new URL("../assets/images/enemies/orc1/orc1_run_full.png", import.meta.url).href,
    onProgress
  );
  const orc1_Run_Attack = await loadImage(
    new URL("../assets/images/enemies/orc1/orc1_run_attack_front_full.png", import.meta.url).href,
    onProgress
  );
  const orc1_Walk = await loadImage(
    new URL("../assets/images/enemies/orc1/orc1_walk_full.png", import.meta.url).href,
    onProgress
  );
  const orc1_Walk_Attack = await loadImage(
    new URL("../assets/images/enemies/orc1/orc1_walk_attack_front_full.png", import.meta.url).href,
    onProgress
  );

  // ORC 2
  const orc2_Attack = await loadImage(
    new URL("../assets/images/enemies/orc2/orc2_attack_full.png", import.meta.url).href,
    onProgress
  );
  const orc2_Death = await loadImage(
    new URL("../assets/images/enemies/orc2/orc2_death_full.png", import.meta.url).href,
    onProgress
  );
  const orc2_Hurt = await loadImage(
    new URL("../assets/images/enemies/orc2/orc2_hurt_full.png", import.meta.url).href,
    onProgress
  );
  const orc2_Idle = await loadImage(
    new URL("../assets/images/enemies/orc2/orc2_idle_full.png", import.meta.url).href,
    onProgress
  );
  const orc2_Run = await loadImage(
    new URL("../assets/images/enemies/orc2/orc2_run_full.png", import.meta.url).href,
    onProgress
  );
  const orc2_Run_Attack = await loadImage(
    new URL("../assets/images/enemies/orc2/orc2_run_attack_full.png", import.meta.url).href,
    onProgress
  );
  const orc2_Walk = await loadImage(
    new URL("../assets/images/enemies/orc2/orc2_walk_full.png", import.meta.url).href,
    onProgress
  );
  const orc2_Walk_Attack = await loadImage(
    new URL("../assets/images/enemies/orc2/orc2_walk_attack_full.png", import.meta.url).href,
    onProgress
  );

  // ORC 3
  const orc3_Attack = await loadImage(
    new URL("../assets/images/enemies/orc3/orc3_attack_full.png", import.meta.url).href,
    onProgress
  );
  const orc3_Death = await loadImage(
    new URL("../assets/images/enemies/orc3/orc3_death_full.png", import.meta.url).href,
    onProgress
  );
  const orc3_Hurt = await loadImage(
    new URL("../assets/images/enemies/orc3/orc3_hurt_full.png", import.meta.url).href,
    onProgress
  );
  const orc3_Idle = await loadImage(
    new URL("../assets/images/enemies/orc3/orc3_idle_full.png", import.meta.url).href,
    onProgress
  );
  const orc3_Run = await loadImage(
    new URL("../assets/images/enemies/orc3/orc3_run_full.png", import.meta.url).href,
    onProgress
  );
  const orc3_Run_Attack = await loadImage(
    new URL("../assets/images/enemies/orc3/orc3_run_attack_full.png", import.meta.url).href,
    onProgress
  );
  const orc3_Walk = await loadImage(
    new URL("../assets/images/enemies/orc3/orc3_walk_full.png", import.meta.url).href,
    onProgress
  );
  const orc3_Walk_Attack = await loadImage(
    new URL("../assets/images/enemies/orc3/orc3_walk_attack_full.png", import.meta.url).href,
    onProgress
  );

  return {
    orc1_Attack,
    orc1_Death,
    orc1_Hurt,
    orc1_Idle,
    orc1_Run,
    orc1_Run_Attack,
    orc1_Walk,
    orc1_Walk_Attack,
    orc2_Attack,
    orc2_Death,
    orc2_Hurt,
    orc2_Idle,
    orc2_Run,
    orc2_Run_Attack,
    orc2_Walk,
    orc2_Walk_Attack,
    orc3_Attack,
    orc3_Death,
    orc3_Hurt,
    orc3_Idle,
    orc3_Run,
    orc3_Run_Attack,
    orc3_Walk,
    orc3_Walk_Attack,
  };
}

export async function loadLevelAssets(onProgress) {
  console.log("Loading level assets...");
  const grassTile = await loadImage(
    new URL("../assets/images/generated/grass_tile.png", import.meta.url).href,
    onProgress
  );
  const wall = await loadImage(
    new URL("../assets/images/generated/stone_wall.png", import.meta.url).href,
    onProgress
  );
  const boulder = await loadImage(
    new URL("../assets/images/generated/boulder.png", import.meta.url).href,
    onProgress
  );
  const rock = await loadImage(
    new URL("../assets/images/obstacle/Rock6_1.png", import.meta.url).href,
    onProgress
  );
  const tree1 = await loadImage(
    new URL("../assets/images/obstacle/Tree1.png", import.meta.url).href,
    onProgress
  );
  const tree2 = await loadImage(
    new URL("../assets/images/obstacle/Tree2.png", import.meta.url).href,
    onProgress
  );
  const tree3 = await loadImage(
    new URL("../assets/images/obstacle/Tree3.png", import.meta.url).href,
    onProgress
  );
  const palm1 = await loadImage(
    new URL("../assets/images/generated/palm_a.png", import.meta.url).href,
    onProgress
  );
  const palm2 = await loadImage(
    new URL("../assets/images/generated/palm_b.png", import.meta.url).href,
    onProgress
  );

  const sandRuin = await loadImage(
    new URL("../assets/images/exit/Sand_ruins3.png", import.meta.url).href,
    onProgress
  );

  const snowRuin = await loadImage(
    new URL("../assets/images/exit/Snow_ruins3.png", import.meta.url).href,
    onProgress
  );

  const yellowRuin = await loadImage(
    new URL("../assets/images/generated/exit_ruin.png", import.meta.url).href,
    onProgress
  );

  return {
    grassTile,
    wall,
    boulder,
    rock,
    tree1,
    tree2,
    tree3,
    palm1,
    palm2,
    sandRuin,
    snowRuin,
    yellowRuin,
  };
}

export async function loadItemAssets(onProgress) {
  console.log("Loading item assets...");
  const key = await loadImage(
    new URL("../assets/images/generated/items/key.png", import.meta.url).href,
    onProgress
  );
  const potion = await loadImage(
    new URL("../assets/images/generated/items/potion.png", import.meta.url).href,
    onProgress
  );
  const explosive = await loadImage(
    new URL("../assets/images/generated/items/explosive.png", import.meta.url).href,
    onProgress
  );
  const steelSword = await loadImage(
    new URL("../assets/images/generated/items/sword_steel.png", import.meta.url).href,
    onProgress
  );
  const warAxe = await loadImage(
    new URL("../assets/images/generated/items/axe_war.png", import.meta.url).href,
    onProgress
  );
  const runeHaste = await loadImage(
    new URL("../assets/images/generated/items/rune_haste.png", import.meta.url).href,
    onProgress
  );
  const runeMight = await loadImage(
    new URL("../assets/images/generated/items/rune_might.png", import.meta.url).href,
    onProgress
  );
  const runeWarding = await loadImage(
    new URL("../assets/images/generated/items/rune_warding.png", import.meta.url).href,
    onProgress
  );
  // Not an inventory item, but generated by the same tool: the locked door tile
  const door = await loadImage(
    new URL("../assets/images/generated/items/door.png", import.meta.url).href,
    onProgress
  );

  return { key, potion, explosive, steelSword, warAxe, runeHaste, runeMight, runeWarding, door };
}

export async function loadPowerUpsAssets(onProgress) {
  console.log("Loading powerups assets...");
  const greenCrystal = await loadImage(
    new URL("../assets/images/powerups/Green_crystal2.png", import.meta.url).href,
    onProgress
  );
  const redCrystal = await loadImage(
    new URL("../assets/images/generated/health_crystal.png", import.meta.url).href,
    onProgress
  );
  const blueCrystal = await loadImage(
    new URL("../assets/images/generated/mana_crystal.png", import.meta.url).href,
    onProgress
  );
  const yellowCrystal = await loadImage(
    new URL("../assets/images/powerups/Yellow_crystal2.png", import.meta.url).href,
    onProgress
  );

  return { greenCrystal, redCrystal, blueCrystal, yellowCrystal };
}
