// handle the assets
// Load player sprite sheets
// Load enemy sprite sheets
// Load powerup sprite sheets
// Load explosive sprite sheets
// Load guard sprite sheets
// Load obstacle images

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
    require("../assets/images/player/Player.png"),
    onProgress
  );
  const playerActions = await loadImage(
    require("../assets/images/player/Player_Actions.png"),
    onProgress
  );

  return { playerMovement, playerActions };
}

export async function loadGuardAssets(onProgress) {
  console.log("Loading guard assets...");
  // ORC 1
  const orc1_Attack = await loadImage(
    require("../assets/images/enemies/orc1/orc1_attack_full.png"),
    onProgress
  );
  const orc1_Death = await loadImage(
    require("../assets/images/enemies/orc1/orc1_death_full.png"),
    onProgress
  );
  const orc1_Hurt = await loadImage(
    require("../assets/images/enemies/orc1/orc1_hurt_full.png"),
    onProgress
  );
  const orc1_Idle = await loadImage(
    require("../assets/images/enemies/orc1/orc1_idle_full.png"),
    onProgress
  );
  const orc1_Run = await loadImage(
    require("../assets/images/enemies/orc1/orc1_run_full.png"),
    onProgress
  );
  const orc1_Run_Attack = await loadImage(
    require("../assets/images/enemies/orc1/orc1_run_attack_front_full.png"),
    onProgress
  );
  const orc1_Walk = await loadImage(
    require("../assets/images/enemies/orc1/orc1_walk_full.png"),
    onProgress
  );
  const orc1_Walk_Attack = await loadImage(
    require("../assets/images/enemies/orc1/orc1_walk_attack_front_full.png"),
    onProgress
  );

  // ORC 2
  const orc2_Attack = await loadImage(
    require("../assets/images/enemies/orc2/orc2_attack_full.png"),
    onProgress
  );
  const orc2_Death = await loadImage(
    require("../assets/images/enemies/orc2/orc2_death_full.png"),
    onProgress
  );
  const orc2_Hurt = await loadImage(
    require("../assets/images/enemies/orc2/orc2_hurt_full.png"),
    onProgress
  );
  const orc2_Idle = await loadImage(
    require("../assets/images/enemies/orc2/orc2_idle_full.png"),
    onProgress
  );
  const orc2_Run = await loadImage(
    require("../assets/images/enemies/orc2/orc2_run_full.png"),
    onProgress
  );
  const orc2_Run_Attack = await loadImage(
    require("../assets/images/enemies/orc2/orc2_run_attack_full.png"),
    onProgress
  );
  const orc2_Walk = await loadImage(
    require("../assets/images/enemies/orc2/orc2_walk_full.png"),
    onProgress
  );
  const orc2_Walk_Attack = await loadImage(
    require("../assets/images/enemies/orc2/orc2_walk_attack_full.png"),
    onProgress
  );

  // ORC 3
  const orc3_Attack = await loadImage(
    require("../assets/images/enemies/orc3/orc3_attack_full.png"),
    onProgress
  );
  const orc3_Death = await loadImage(
    require("../assets/images/enemies/orc3/orc3_death_full.png"),
    onProgress
  );    
  const orc3_Hurt = await loadImage(
    require("../assets/images/enemies/orc3/orc3_hurt_full.png"),
    onProgress
  );
  const orc3_Idle = await loadImage(
    require("../assets/images/enemies/orc3/orc3_idle_full.png"),
    onProgress
  );    
  const orc3_Run = await loadImage(
    require("../assets/images/enemies/orc3/orc3_run_full.png"),
    onProgress
  );
  const orc3_Run_Attack = await loadImage(
    require("../assets/images/enemies/orc3/orc3_run_attack_full.png"),
    onProgress
  );    
  const orc3_Walk = await loadImage(
    require("../assets/images/enemies/orc3/orc3_walk_full.png"),
    onProgress
  );
  const orc3_Walk_Attack = await loadImage(
    require("../assets/images/enemies/orc3/orc3_walk_attack_full.png"),
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
  const rock = await loadImage(
    require("../assets/images/obstacle/Rock6_1.png"),
    onProgress
  );
  const tree1 = await loadImage(
    require("../assets/images/obstacle/Tree1.png"),
    onProgress
  );
  const tree2 = await loadImage(
    require("../assets/images/obstacle/Tree2.png"),
    onProgress
  );
  const tree3 = await loadImage(
    require("../assets/images/obstacle/Tree3.png"),
    onProgress
  );
  const palm1 = await loadImage(
    require("../assets/images/obstacle/Palm_tree1_2.png"),
    onProgress
  );
  const palm2 = await loadImage(
    require("../assets/images/obstacle/Palm_tree2_2.png"),
    onProgress
  );
  
  const sandRuin = await loadImage(
    require("../assets/images/exit/Sand_ruins3.png"),
    onProgress
  );    

  const snowRuin = await loadImage(
    require("../assets/images/exit/Snow_ruins3.png"),
    onProgress
  );

  const yellowRuin = await loadImage(
    require("../assets/images/exit/Yellow_ruins3.png"),
    onProgress
  );

  return { rock, tree1, tree2, tree3, palm1, palm2, sandRuin, snowRuin, yellowRuin };
}

export async function loadPowerUpsAssets(onProgress) {
  console.log("Loading powerups assets...");
  const greenCrystal = await loadImage(
    require("../assets/images/powerups/Green_crystal2.png"),
    onProgress
  );
  const redCrystal = await loadImage(
    require("../assets/images/powerups/Red_crystal2.png"),
    onProgress
  );
  const blueCrystal = await loadImage(
    require("../assets/images/powerups/Blue_crystal2.png"),
    onProgress
  );
  const yellowCrystal = await loadImage(
    require("../assets/images/powerups/Yellow_crystal2.png"),
    onProgress
  );

  return { greenCrystal, redCrystal, blueCrystal, yellowCrystal };
}
