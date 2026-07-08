import { itemCatalog, weaponCatalog } from "../items.js";

export function getWeaponUnlockCopy(itemId) {
  const item = itemCatalog[itemId];
  if (!item) return null;
  if (itemId === "moonlitQuiver") {
    return {
      itemId,
      title: item.name,
      line: "The ninth shard becomes a quiver bright enough to carry more moonlit arrows.",
      hint: "Arrow capacity raised to 20. Press 4 for the bow.",
    };
  }

  const weapon = weaponCatalog[item.weaponId || itemId];
  return {
    itemId,
    title: item.name,
    line: weapon?.unlockLine || item.description,
    hint: weapon?.hint || item.description,
  };
}
