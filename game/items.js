// Item catalog
// - Single source of truth for every item that can live in the player's
//   inventory: pickups, guard drops, weapons and runes
// - `icon` refers to a key in the itemAssets loaded by assets.js
// - Weapons and runes are equipped from the inventory screen (one of each);
//   their bonuses are applied by the Player while equipped

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
  steelSword: {
    name: "Steel Sword",
    article: "a",
    kind: "weapon",
    icon: "steelSword",
    attackBonus: 25,
    description: "A sturdy blade. +25 attack power while equipped.",
  },
  warAxe: {
    name: "War Axe",
    article: "a",
    kind: "weapon",
    icon: "warAxe",
    attackBonus: 50,
    description: "Heavy and brutal. +50 attack power while equipped.",
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

// Items a defeated guard can drop (potions are twice as likely)
export const guardDropPool = [
  "potion",
  "potion",
  "steelSword",
  "warAxe",
  "runeHaste",
  "runeMight",
  "runeWarding",
];
