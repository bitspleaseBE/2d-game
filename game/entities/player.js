import Entity from './entity.js';
import { canvasSettings, playerSettings, powerupSettings } from "../utils/settings.js";
import Animator from "./animator.js";
import { playerSpriteManifest } from "../assets/sprite-manifest.js";
import { itemCatalog, weaponCatalog, weaponOrder } from "../items.js";

class Player extends Entity {
  #health;
  #baseSpeed;
  #attackPower;
  #isHurt = false;
  #hurtInterval = null;
  #effectMs = { speed: 0, strength: 0, invincibility: 0 };

  constructor(x, y, assets) {
    super(x, y, 'player', assets);
    this.#health = 100;
    this.#baseSpeed = playerSettings.speed;
    this.#attackPower = playerSettings.baseAttackPower;
    this.powerups = [];
    // Item ids (see items.js) mapped to how many the player carries; the pack
    // survives level changes (see Game.initializePlayer) but not a new run
    this.inventory = {};
    // Weapons are learned verbs; runes still equip from inventory.
    // Theo starts with only the dagger; axe, sword and bow come from pedestals.
    this.ownedWeapons = ["dagger"];
    this.equipment = { weapon: null, rune: null };
    this.weaponId = "dagger";
    this.arrowCount = 0;
    this.arrowCapacity = 10;
    this.quiverUpgraded = false;

    this.animator = new Animator(playerSpriteManifest);
    this.currentFrame = 0;
    this.movement = "down";
    this.action = "idle";
    this.visible = true;
  }

  selectSprites(assets) {
    return {
      movement: assets.playerMovement,
      actions: assets.playerActions,
      bow: assets.playerBow,
    };
  }

  getPickupRange() {
    return {
      x: this._position.x,
      y: this._position.y,
      width: this._width,
      height: this._height,
    };
  }

  getHitBox() {
    return {
      x: this._position.x + this._width * 0.25,
      y: this._position.y + this._height * 0.25,
      width: this._width * 0.5,
      height: this._height * 0.5,
    };
  }

  getAttackBox() {
    const hitBox = this.getHitBox();
    const reach = this._width * 0.6;
    switch (this.movement) {
      case "up":
        return { x: hitBox.x, y: hitBox.y - reach, width: hitBox.width, height: reach };
      case "down":
        return { x: hitBox.x, y: hitBox.y + hitBox.height, width: hitBox.width, height: reach };
      case "left":
        return { x: hitBox.x - reach, y: hitBox.y, width: reach, height: hitBox.height };
      case "right":
      default:
        return { x: hitBox.x + hitBox.width, y: hitBox.y, width: reach, height: hitBox.height };
    }
  }

  getHealth() {
    return this.#health;
  }

  get attackPower() {
    const weapon = this.getSelectedWeapon();
    let power = weapon?.damage || this.#attackPower;
    const rune = this.equipment.rune;
    const runeBonus = rune && itemCatalog[rune].attackBonus;
    if (runeBonus) power += runeBonus;
    if (this.#effectMs.strength > 0) power *= powerupSettings.strengthMultiplier;
    return power;
  }

  getSpeed() {
    let speed = this.#baseSpeed;
    if (this.#effectMs.speed > 0) speed += powerupSettings.speedBoost;
    const rune = this.equipment.rune;
    if (rune && itemCatalog[rune].speedBonus) speed += itemCatalog[rune].speedBonus;
    return speed;
  }

  getActiveEffects() {
    return Object.entries(this.#effectMs)
      .filter(([, ms]) => ms > 0)
      .map(([name, ms]) => ({ name, secondsLeft: Math.ceil(ms / 1000), msLeft: ms }));
  }

  hasEffect(name) {
    return this.#effectMs[name] > 0;
  }

  takeDamage(amount) {
    if (this.#effectMs.invincibility > 0) return;
    if (this.#isHurt || this.#health <= 0) return;
    if (this.equipment.rune === "runeWarding") amount = Math.ceil(amount / 2);
    this.#health = Math.max(0, this.#health - amount);
    if (this.#health <= 0) {
      this.defeat();
      return;
    }
    this.hurtAnimation();
  }

  respawn(x, y) {
    this._position = { x, y };
    this.#health = 100;
    // A short shield after respawning: a guard standing on the spawn point
    // could otherwise drain the fresh life before the player can react
    this.#effectMs = { speed: 0, strength: 0, invincibility: playerSettings.respawnProtectionMs };
    this.#isHurt = false;
    if (this.#hurtInterval) {
      clearInterval(this.#hurtInterval);
      this.#hurtInterval = null;
    }
    this.visible = true;
    this.movement = "down";
    this.animator.play("idle", { restart: true, direction: "down" });
    this.#syncAnimationState();
  }

  setMovement(direction) {
    if (direction) {
      this.movement = direction;
      this.animator.setDirection(direction);
    }
  }

  setWalking(isWalking) {
    this.animator.setState(isWalking ? "walk" : "idle");
    this.#syncAnimationState();
  }

  moveBy(deltaX, deltaY) {
    this._position.x += deltaX;
    this._position.y += deltaY;
    if (deltaX !== 0 || deltaY !== 0) {
      this.setMovement(Math.abs(deltaX) > Math.abs(deltaY)
        ? (deltaX > 0 ? "right" : "left")
        : (deltaY > 0 ? "down" : "up"));
      this.setWalking(true);
    }
  }

  moveLeft(distance = this.getSpeed() / 60) {
    this.moveBy(-distance, 0);
  }

  moveRight(distance = this.getSpeed() / 60) {
    this.moveBy(distance, 0);
  }

  moveUp(distance = this.getSpeed() / 60) {
    this.moveBy(0, -distance);
  }

  moveDown(distance = this.getSpeed() / 60) {
    this.moveBy(0, distance);
  }

  attack() {
    this.attackWithWeapon(this.weaponId);
    this.#syncAnimationState();
  }

  attackWithWeapon(weaponId = this.weaponId) {
    const weapon = weaponCatalog[weaponId] || weaponCatalog.dagger;
    this.weaponId = weapon.itemId;
    this.animator.play(weapon.actionState, { restart: true, direction: this.movement });
    this.#syncAnimationState();
  }

  pick() {
    this.animator.play("pick", { restart: true, direction: this.movement });
    this.#syncAnimationState();
  }

  axe() {
    const weapon = weaponCatalog.woodenAxe;
    this.animator.play(weapon?.actionState || "axe", { restart: true, direction: this.movement });
    this.#syncAnimationState();
  }

  potion() {
    this.animator.play("potion", { restart: true, direction: this.movement });
    this.#syncAnimationState();
  }

  defeat() {
    this.animator.play("defeated", { restart: true, direction: this.movement });
    this.#syncAnimationState();
  }

  isDefeated() {
    return this.#health <= 0;
  }

  isActionActive(action = this.action) {
    return this.animator.isActiveWindow(action);
  }

  // --- Inventory ---------------------------------------------------------

  addItem(itemId) {
    this.inventory[itemId] = (this.inventory[itemId] || 0) + 1;
  }

  hasItem(itemId) {
    return (this.inventory[itemId] || 0) > 0;
  }

  removeItem(itemId) {
    if (!this.hasItem(itemId)) return false;
    this.inventory[itemId] -= 1;
    if (this.inventory[itemId] === 0) delete this.inventory[itemId];
    return true;
  }

  // Carried items in catalog order, for the inventory screen
  getInventoryEntries() {
    return Object.keys(itemCatalog)
      .filter((id) => this.hasItem(id))
      .map((id) => ({ id, count: this.inventory[id] }));
  }

  // Consume one item and apply its effect. Returns true when consumed.
  useItem(itemId) {
    const item = itemCatalog[itemId];
    if (!item || !this.hasItem(itemId)) return false;
    if (item.kind === "potion") {
      this.removeItem(itemId);
      this.#health = Math.min(100, this.#health + item.healAmount);
      return true;
    }
    return false;
  }

  // Equip a weapon or rune from the inventory, or take it off when it is
  // already worn. Returns "equipped", "unequipped" or null when the item
  // cannot be equipped.
  equip(itemId) {
    const item = itemCatalog[itemId];
    if (!item) return null;
    if (item.kind === "weapon") {
      return this.selectWeapon(item.weaponId || itemId) ? "equipped" : null;
    }
    if (item.kind !== "rune" || !this.hasItem(itemId)) return null;
    if (this.equipment.rune === itemId) {
      this.equipment.rune = null;
      return "unequipped";
    }
    this.equipment.rune = itemId;
    return "equipped";
  }

  unlockWeapon(weaponId) {
    if (!weaponCatalog[weaponId]) return false;
    if (!this.ownedWeapons.includes(weaponId)) this.ownedWeapons.push(weaponId);
    this.weaponId = weaponId;
    if (weaponId === "dreamBow") {
      this.addArrows(weaponCatalog.dreamBow.unlockArrows);
    }
    return true;
  }

  unlockQuiver() {
    this.quiverUpgraded = true;
    this.arrowCapacity = 20;
    this.addArrows(10);
  }

  hasWeapon(weaponId) {
    return this.ownedWeapons.includes(weaponId);
  }

  selectWeapon(weaponId) {
    if (!this.hasWeapon(weaponId)) return false;
    this.weaponId = weaponId;
    return true;
  }

  cycleWeapon(delta = 1) {
    const available = weaponOrder.filter((id) => this.hasWeapon(id));
    if (available.length === 0) return null;
    const index = available.indexOf(this.weaponId);
    const nextIndex = (index + delta + available.length) % available.length;
    this.weaponId = available[nextIndex];
    return this.getSelectedWeapon();
  }

  getSelectedWeapon() {
    return weaponCatalog[this.weaponId] || weaponCatalog.dagger;
  }

  addArrows(amount) {
    this.arrowCount = Math.min(this.arrowCapacity, this.arrowCount + amount);
    return this.arrowCount;
  }

  useArrow() {
    if (this.arrowCount <= 0) return false;
    this.arrowCount -= 1;
    return true;
  }

  applyPowerup(effect) {
    if (!effect) return;
    this.powerups.push(effect);
    switch (effect) {
      case "health":
        this.#health = Math.min(100, this.#health + powerupSettings.healAmount);
        break;
      case "speed":
        this.#effectMs.speed = powerupSettings.speedDurationMs;
        break;
      case "strength":
        this.#effectMs.strength = powerupSettings.strengthDurationMs;
        break;
      case "invincibility":
        this.#effectMs.invincibility = powerupSettings.invincibilityDurationMs;
        break;
    }
  }

  update(deltaMs = 1000 / 60) {
    for (const name of Object.keys(this.#effectMs)) {
      this.#effectMs[name] = Math.max(0, this.#effectMs[name] - deltaMs);
    }
    this.animator.update(deltaMs);
    this.#syncAnimationState();
  }

  checkCollision(direction, distance = this.getSpeed() / 60) {
    const nextPosition = { ...this._position };
    switch (direction) {
      case 'left':
        nextPosition.x -= distance;
        break;
      case 'right':
        nextPosition.x += distance;
        break;
      case 'up':
        nextPosition.y -= distance;
        break;
      case 'down':
        nextPosition.y += distance;
        break;
    }
    return nextPosition;
  }

  hurtAnimation() {
    if (this.#isHurt) return;

    this.#isHurt = true;

    let flickerCount = 0;
    const maxFlickers = 10;
    const flickerDuration = 100;

    this.#hurtInterval = setInterval(() => {
      this.visible = !this.visible;
      flickerCount++;

      if (flickerCount >= maxFlickers) {
        clearInterval(this.#hurtInterval);
        this.#hurtInterval = null;
        this.#isHurt = false;
        this.visible = true;
      }
    }, flickerDuration);
  }

  draw(ctx) {
    if (!this.visible) return;

    const frame = this.animator.getFrame(this.movement);
    const spriteSheet = this._sprites[frame.sheet];
    const pixelScale = frame.frameWidth >= canvasSettings.cellWidth
      ? 1
      : canvasSettings.cellWidth / 32;
    const destWidth = frame.frameWidth * pixelScale;
    const destHeight = frame.frameHeight * pixelScale;
    const offsetX = (canvasSettings.cellWidth - destWidth) / 2;
    const offsetY = (canvasSettings.cellHeight - destHeight) / 2;

    ctx.save();
    if (frame.flip) {
      ctx.scale(-1, 1);
      ctx.drawImage(
        spriteSheet,
        frame.sourceX,
        frame.sourceY,
        frame.frameWidth,
        frame.frameHeight,
        -(this._position.x + offsetX) - destWidth,
        this._position.y + offsetY,
        destWidth,
        destHeight
      );
    } else {
      ctx.drawImage(
        spriteSheet,
        frame.sourceX,
        frame.sourceY,
        frame.frameWidth,
        frame.frameHeight,
        this._position.x + offsetX,
        this._position.y + offsetY,
        destWidth,
        destHeight
      );
    }
    ctx.restore();
  }

  #syncAnimationState() {
    this.action = this.animator.state;
    this.currentFrame = this.animator.frame;
  }
}

export default Player;
