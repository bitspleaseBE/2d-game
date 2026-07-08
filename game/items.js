// Item catalog
// - Single source of truth for every item that can live in the player's
//   inventory: pickups, guard drops, weapons and runes
// - `icon` refers to a key in the itemAssets loaded by assets.js
// - Weapons are progression verbs (owned by the Player), while inventory still
//   carries keys, potions, runes and late-game arrow bundles.

export const itemCatalog = {
  key: {
    name: "Key",
    article: "a",
    kind: "key",
    icon: "key",
    description: "Unlocks a locked door — walk into the door while carrying it.",
  },
  potion: {
    name: "Health Potion",
    article: "a",
    kind: "potion",
    icon: "potion",
    healAmount: 50,
    description: "Restores 50 health. Press 'u' or click it here to drink one.",
  },
  explosive: {
    name: "Explosive",
    article: "an",
    kind: "explosive",
    icon: "explosive",
    description: "Unstable and powerful. No use for it yet — handle with care.",
  },
  dreamShard: {
    name: "Dream-Shard",
    article: "a",
    kind: "score",
    icon: "dreamShard",
    scoreValue: 150,
    description: "A stolen glimmer of morning. Collect for +150 score.",
  },
  arrowBundle: {
    name: "Arrow Bundle",
    article: "an",
    kind: "ammo",
    icon: "arrowBundle",
    arrowAmount: 5,
    description: "Five dream-arrows for the bow.",
  },
  dagger: {
    name: "Rusty Dagger",
    article: "a",
    kind: "weapon",
    icon: "dagger",
    weaponId: "dagger",
    damage: 25,
    description: "Theo's first dream-tool. Quick jabs that sting orcs a little.",
  },
  woodenAxe: {
    name: "Wooden Axe",
    article: "a",
    kind: "weapon",
    icon: "warAxe",
    weaponId: "woodenAxe",
    damage: 30,
    description: "The only tool that cuts trees and breaks boulders. Hurts orcs too.",
  },
  steelSword: {
    name: "Steel Sword",
    article: "a",
    kind: "weapon",
    icon: "steelSword",
    weaponId: "steelSword",
    damage: 60,
    description: "A sturdy blade with reliable knockback. Cannot cut trees or rocks.",
  },
  dreamBow: {
    name: "Dream Bow",
    article: "a",
    kind: "weapon",
    icon: "arrowBundle",
    weaponId: "dreamBow",
    damage: 35,
    description: "Fires arrows across the dream. Uses one arrow per shot.",
  },
  moonlitQuiver: {
    name: "Moonlit Quiver",
    article: "a",
    kind: "upgrade",
    icon: "arrowBundle",
    description: "Raises arrow capacity and steadies Theo's bow draw.",
  },
  runeHaste: {
    name: "Rune of Haste",
    article: "a",
    kind: "rune",
    icon: "runeHaste",
    speedBonus: 120, // pixels per second, like playerSettings.speed
    description: "Ancient stone humming with energy. Move faster while equipped.",
  },
  runeMight: {
    name: "Rune of Might",
    article: "a",
    kind: "rune",
    icon: "runeMight",
    attackBonus: 25,
    description: "Burns with orcish rage. +25 attack power while equipped.",
  },
  runeWarding: {
    name: "Rune of Warding",
    article: "a",
    kind: "rune",
    icon: "runeWarding",
    description: "A protective sigil. Halves all damage taken while equipped.",
  },
};

// Only weapons with `canChopObstacles` can damage trees and boulders — the
// wooden axe is the sole tool that carves paths through the labyrinth.
export const weaponCatalog = {
  dagger: {
    itemId: "dagger",
    name: "Rusty Dagger",
    icon: "dagger",
    actionState: "attack",
    damage: 25,
    cooldownMs: 320,
    unlockLine: "Theo woke inside the dream clutching a rusty dagger.",
    hint: "Quick, light jabs. Too small to cut trees or break boulders.",
  },
  woodenAxe: {
    itemId: "woodenAxe",
    name: "Wooden Axe",
    icon: "warAxe",
    actionState: "axe",
    damage: 30,
    cooldownMs: 430,
    canChopObstacles: true,
    obstacleDamage: 100,
    unlockLine: "The first shard remembers a wooden axe. It can carve paths through the dream.",
    hint: "The only tool that cuts trees and breaks boulders.",
  },
  steelSword: {
    itemId: "steelSword",
    name: "Steel Sword",
    icon: "steelSword",
    actionState: "attack",
    damage: 60,
    cooldownMs: 360,
    unlockLine: "The second shard sharpens into a steel sword.",
    hint: "Higher melee damage with knockback. Keep the axe for trees and rocks.",
  },
  dreamBow: {
    itemId: "dreamBow",
    name: "Dream Bow",
    icon: "arrowBundle",
    actionState: "bow",
    damage: 35,
    cooldownMs: 520,
    unlockArrows: 10,
    unlockLine: "The sixth shard bends moonlight into a bow.",
    hint: "Fires arrows at range. Watch your ammo.",
  },
};

export const weaponOrder = ["dagger", "woodenAxe", "steelSword", "dreamBow"];

// Weighted non-key guard drops. `null` means nothing falls.
export const guardDropPool = [
  { itemId: "potion", weight: 35 },
  { itemId: "dreamShard", weight: 15 },
  { itemId: null, weight: 50 },
];

export const lateGuardDropPool = [
  { itemId: "potion", weight: 30 },
  { itemId: "dreamShard", weight: 15 },
  { itemId: "arrowBundle", weight: 20 },
  { itemId: null, weight: 35 },
];
