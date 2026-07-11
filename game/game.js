import {
  controlSettings,
  canvasSettings,
  playerSettings,
  gameSettings,
  powerupSettings,
  combatSettings,
  bossSettings,
  fogSettings,
  entitySettings,
  trapSettings,
} from "./utils/settings.js";
import { sfx } from "./utils/sound.js";
import { playNarration, stopNarration } from "./utils/narration.js";
import Player from "./entities/player.js";
import levelData from "./levels/level-data.js";
import {
  clearContainer,
  mountGameStage,
  removeGameOverlays,
} from "./utils/canvas.js";
import { isColliding } from "./utils/game.js";
import {
  shouldShowLevelIntro,
  markLevelIntroSeen,
} from "./utils/preferences.js";
import {
  createTouchControls,
  shouldShowTouchControls,
  syncTouchControlsVisibility,
  installTouchControlVisibilityListener,
} from "./utils/touch.js";
import { createSoundToggleButton } from "./utils/sound-controls.js";
import { randomInt } from "./utils/rng.js";
import Wall from "./entities/wall.js";
import Explosive from "./entities/explosive.js";
import SpikeTrap from "./entities/spike-trap.js";
import DartShooter from "./entities/dart-shooter.js";
import CrumblingFloor from "./entities/crumbling-floor.js";
import Guard from "./entities/guard.js";
import Obstacle from "./entities/obstacle.js";
import Powerup, { powerupDescriptions } from "./entities/powerup.js";
import Exit from "./entities/exit.js";
import Drop from "./entities/drop.js";
import Door from "./entities/door.js";
import Projectile from "./entities/projectile.js";
import { itemCatalog, guardDropPool, lateGuardDropPool, weaponCatalog, weaponOrder } from "./items.js";
import { resolveThemeAssets } from "./assets/theme-manifest.js";
import { random } from "./utils/rng.js";
import { getWeaponUnlockCopy } from "./screens/weapon-unlocked.js";

// Dart shooter cells encode their firing direction in the glyph. These cells
// are also solid walls (see initializeBoard / drawMinimap).
const DART_DIRECTIONS = {
  "^": { x: 0, y: -1 },
  v: { x: 0, y: 1 },
  "<": { x: -1, y: 0 },
  ">": { x: 1, y: 0 },
};
const isDartCell = (cell) => Object.prototype.hasOwnProperty.call(DART_DIRECTIONS, cell);

// Main game logic
// - Initialize the game board (labyrinth)
// - Handle player input (movement, interactions)
// - Update game state (player position, lives, score)
// - Check for collisions (with obstacles, powerups, explosives, guards)
// - Handle level completion (transition to next level or game over)
// - Render the game board and entities (player, obstacles, powerups, guards)

export class Game {
  constructor(containerId, canvas, context, assets, callbacks = {}) {
    this.container = document.getElementById(containerId);
    this.canvas = canvas;
    this.context = context;
    this.player = null;
    this.board = [];
    this.entities = [];
    this.walls = [];
    this.exit = null;
    this.lives = playerSettings.initialLives;
    this.score = 0;
    this.currentLevel = gameSettings.initialLevel;
    this.isGameOver = false;
    this.started = false;
    this.paused = false;
    this.assets = assets;
    this.themeAssets = resolveThemeAssets(this.assets.levelAssets);
    this.explosives = [];
    this.spikeTraps = [];
    this.dartShooters = [];
    this.crumblingFloors = [];
    this.guards = [];
    this.obstacles = [];
    this.powerups = [];
    this.playerStart = { x: 0, y: 0 };
    this.notifications = [];
    this.drops = [];
    this.doors = [];
    this.projectiles = [];
    this.weaponPedestals = [];
    this.inventoryOpen = false;
    this.weaponUnlock = null;
    this.weaponUnlockDemoMs = 0;
    this.mouse = { x: 0, y: 0 };
    this.inventorySlotRects = [];
    this.onGameOver = callbacks.onGameOver || (() => {});
    this.onLevelCompleted = callbacks.onLevelCompleted || (() => {});
    this.onGameWon = callbacks.onGameWon || (() => {});
    this.rafId = null;
    this.inputSetup = false;
    this.pressedDirections = new Set();
    this.lastFrameTime = null;
    this.pendingGameOverMs = null;
    this.pendingRespawnMs = null;
    this.pendingPlayerShot = null;
    // Remaining time before the player may swing again
    this.attackCooldownMs = 0;
    // Fog of war (per-level option): explored[row][col] persists until the
    // next level; the fog canvas is an offscreen buffer composited per frame
    this.fogEnabled = false;
    this.explored = [];
    this.fogCanvas = null;
    this.levelIntro = null;
    this.deathCount = 0;
    this.runElapsedMs = 0;
    this.touchControls = null;
  }

  initializeBoard() {
    const level = levelData.getLevel(this.currentLevel);
    if (level) {
      this.walls = [];
      this.doors = [];
      this.exit = null;
      this.board = level.layout;
      this.themeAssets = resolveThemeAssets(this.assets.levelAssets, level.theme);
      this.fogEnabled = level.fogOfWar;
      this.explored = level.layout.map((row) => row.map(() => false));
      if (this.fogEnabled) {
        this.notify("Fog of war — explore to reveal the map!");
      }
      for (let y = 0; y < level.layout.length; y++) {
        for (let x = 0; x < level.layout[y].length; x++) {
          if (level.layout[y][x] === "#" || isDartCell(level.layout[y][x])) {
            // Dart shooters sit in the wall and are solid like any wall cell
            this.walls.push(
              new Wall(
                x * canvasSettings.cellWidth,
                y * canvasSettings.cellHeight,
                "normal",
                this.themeAssets
              )
            );
          }
          if (level.layout[y][x] === "D") {
            this.doors.push(
              new Door(
                x * canvasSettings.cellWidth,
                y * canvasSettings.cellHeight,
                this.assets.itemAssets
              )
            );
          }
          if (level.layout[y][x] === "X") {
            this.exit = new Exit(
              x * canvasSettings.cellWidth,
              y * canvasSettings.cellHeight,
              this.themeAssets
            );
          }
        }
      }
    }
  }

  initializePlayer() {
    const level = levelData.getLevel(this.currentLevel);
    if (level) {
      for (let y = 0; y < level.layout.length; y++) {
        for (let x = 0; x < level.layout[y].length; x++) {
          if (level.layout[y][x] === "P") {
            this.playerStart = {
              x: x * canvasSettings.cellWidth,
              y: y * canvasSettings.cellHeight,
            };
            const previousPlayer = this.player;
            this.player = new Player(
              this.playerStart.x,
              this.playerStart.y,
              this.assets.playerAssets
            );
            // The pack and equipped gear travel with the player from level
            // to level; a fresh run starts empty (start() clears the player)
            if (previousPlayer) {
              this.player.inventory = { ...previousPlayer.inventory };
              this.player.equipment = { ...previousPlayer.equipment };
              this.player.ownedWeapons = [...previousPlayer.ownedWeapons];
              this.player.weaponId = previousPlayer.weaponId;
              this.player.arrowCount = previousPlayer.arrowCount;
              this.player.arrowCapacity = previousPlayer.arrowCapacity;
              this.player.quiverUpgraded = previousPlayer.quiverUpgraded;
            }
            this.setupInput();
            return;
          }
        }
      }
    }
  }

  setupInput() {
    // Only register the listener once; initializePlayer runs again on every
    // level change and would otherwise stack duplicate handlers
    if (this.inputSetup) return;
    this.inputSetup = true;

    let actionTimeout;
    const debounceAction = (callback, delay) => {
      return () => {
        clearTimeout(actionTimeout);
        actionTimeout = setTimeout(() => {
          this.player.setWalking(false);
        }, delay);
        callback();
      };
    };

    const directionForKey = (key) => {
      switch (key) {
        case controlSettings.up:
          return "up";
        case controlSettings.down:
          return "down";
        case controlSettings.left:
          return "left";
        case controlSettings.right:
          return "right";
        default:
          return null;
      }
    };

    window.addEventListener("keydown", (event) => {
      if (!this.started || this.paused || this.isGameOver) return;
      if (this.weaponUnlock) {
        if (event.key === " " || event.key === "Enter" || event.key === "Escape") {
          event.preventDefault();
          this.dismissWeaponUnlock();
        }
        return;
      }
      if (this.levelIntro) {
        event.preventDefault();
        this.dismissLevelIntro();
        return;
      }
      // Stop the space bar (and arrow keys) from scrolling the page
      if (event.key === " " || event.key === "Tab" || event.key.startsWith("Arrow")) {
        event.preventDefault();
      }
      if (event.key === controlSettings.inventory) {
        this.toggleInventory();
        return;
      }
      // The world is frozen while the inventory is open
      if (this.inventoryOpen) return;
      if (this.isPlayerDown()) return;
      const direction = directionForKey(event.key);
      if (direction) {
        this.pressedDirections.add(direction);
        return;
      }
      switch (event.key) {
        case "Tab":
          this.cycleWeapon();
          break;
        case "1":
          this.selectWeapon("dagger");
          break;
        case "2":
          this.selectWeapon("woodenAxe");
          break;
        case "3":
          this.selectWeapon("steelSword");
          break;
        case "4":
          this.selectWeapon("dreamBow");
          break;
        case controlSettings.attack:
          debounceAction(() => this.playerAttack(), 250)();
          break;
        case controlSettings.axe:
          debounceAction(() => this.playerAxe(), 250)();
          break;
        case controlSettings.potion:
          debounceAction(() => this.playerDrinkPotion(), 500)();
          break;
      }
    });

    window.addEventListener("keyup", (event) => {
      const direction = directionForKey(event.key);
      if (direction) this.pressedDirections.delete(direction);
    });

    // Mouse support for the inventory screen (hover = tooltip, click = use)
    this.canvas.addEventListener("mousemove", (event) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse = {
        x: (event.clientX - rect.left) * (this.canvas.width / rect.width),
        y: (event.clientY - rect.top) * (this.canvas.height / rect.height),
      };
    });
    this.canvas.addEventListener("click", () => {
      if (this.weaponUnlock) {
        this.dismissWeaponUnlock();
        return;
      }
      if (!this.inventoryOpen) return;
      const slot = this.inventorySlotRects.find(
        (r) =>
          this.mouse.x >= r.x &&
          this.mouse.x <= r.x + r.size &&
          this.mouse.y >= r.y &&
          this.mouse.y <= r.y + r.size
      );
      if (slot && slot.itemId) this.activateInventoryItem(slot.itemId);
    });
  }

  toggleInventory() {
    if (!this.started || this.paused || this.isGameOver) return;
    this.inventoryOpen = !this.inventoryOpen;
    this.pressedDirections.clear();
  }

  // Click on an inventory slot: equip/unequip gear, drink potions
  activateInventoryItem(itemId) {
    const item = itemCatalog[itemId];
    if (item.kind === "weapon" || item.kind === "rune") {
      const result = this.player.equip(itemId);
      if (result === "equipped") this.notify(`${item.name} equipped`);
      if (result === "unequipped") this.notify(`${item.name} unequipped`);
    } else if (item.kind === "potion") {
      this.playerDrinkPotion();
    }
  }

  playerDrinkPotion() {
    if (this.player.useItem("potion")) {
      this.player.potion(); // drink animation
      sfx.gulp();
      this.notify(`You drank a Health Potion (+${itemCatalog.potion.healAmount} health)`);
    } else {
      this.notifyOnce("You have no potions — defeated guards sometimes drop them.");
    }
  }

  getMovementVector() {
    const x =
      (this.pressedDirections.has("right") ? 1 : 0) -
      (this.pressedDirections.has("left") ? 1 : 0);
    const y =
      (this.pressedDirections.has("down") ? 1 : 0) -
      (this.pressedDirections.has("up") ? 1 : 0);
    if (x === 0 && y === 0) return { x: 0, y: 0 };
    const length = Math.hypot(x, y);
    return { x: x / length, y: y / length };
  }

  canPlayerMoveTo(next) {
    const hitBox = this.player.getHitBox();
    const current = this.player.getPosition();
    const nextHitBox = {
      x: next.x + (hitBox.x - current.x),
      y: next.y + (hitBox.y - current.y),
      width: hitBox.width,
      height: hitBox.height,
    };

    return !(
      next.x < 0 ||
      next.y < 0 ||
      next.x > this.canvas.width - canvasSettings.cellWidth ||
      next.y > this.canvas.height - canvasSettings.cellHeight ||
      this.walls.some((wall) => isColliding(nextHitBox, wall.getHitBox())) ||
      this.lockedDoors().some((door) => isColliding(nextHitBox, door.getHitBox())) ||
      this.obstacles.some((obstacle) =>
        isColliding(nextHitBox, obstacle.getHitBox())
      ) ||
      // Collapsed pits block entry only — a player caught standing over a pit
      // as it forms can always step off, never get sealed in.
      this.crumblingFloors.some(
        (floor) =>
          floor.isCollapsed() &&
          isColliding(nextHitBox, floor.getHitBox()) &&
          !isColliding(hitBox, floor.getHitBox())
      )
    );
  }

  // Doors that still block passage (an opened door is a free corridor)
  lockedDoors() {
    return this.doors.filter((door) => door.locked);
  }

  applyMovementInput(deltaMs) {
    const vector = this.getMovementVector();
    if (vector.x === 0 && vector.y === 0) {
      this.player.setWalking(false);
      return;
    }

    const distance = this.player.getSpeed() * (deltaMs / 1000);
    const deltaX = vector.x * distance;
    const deltaY = vector.y * distance;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      this.player.setMovement(deltaX > 0 ? "right" : "left");
    } else {
      this.player.setMovement(deltaY > 0 ? "down" : "up");
    }

    const current = this.player.getPosition();
    let moved = false;
    const nextX = { x: current.x + deltaX, y: current.y };
    if (deltaX !== 0 && this.canPlayerMoveTo(nextX)) {
      this.player.moveBy(deltaX, 0);
      moved = true;
    }

    const afterX = this.player.getPosition();
    const nextY = { x: afterX.x, y: afterX.y + deltaY };
    if (deltaY !== 0 && this.canPlayerMoveTo(nextY)) {
      this.player.moveBy(0, deltaY);
      moved = true;
    }

    this.player.setWalking(moved);
  }

  movePlayer(direction, deltaMs = 1000 / 60) {
    const distance = this.player.getSpeed() * (deltaMs / 1000);
    const next = this.player.checkCollision(direction, distance);
    this.player.setMovement(direction);
    if (!this.canPlayerMoveTo(next)) {
      this.player.setWalking(false);
      return;
    }
    switch (direction) {
      case "up":
        this.player.moveUp(distance);
        break;
      case "down":
        this.player.moveDown(distance);
        break;
      case "left":
        this.player.moveLeft(distance);
        break;
      case "right":
        this.player.moveRight(distance);
        break;
    }
  }

  playerAttack() {
    // Ignore swings while the previous one is still recovering, so holding
    // the key down (auto-repeat) cannot land a hit every keyboard event
    if (this.attackCooldownMs > 0) return;
    const weapon = this.player.getSelectedWeapon();
    if (weapon.itemId === "dreamBow") {
      this.playerBowAttack(weapon);
      return;
    }
    this.attackCooldownMs = weapon.cooldownMs || combatSettings.attackCooldownMs;

    this.player.attackWithWeapon(weapon.itemId);
    sfx.swing();
    if (!this.player.isActionActive(weapon.actionState)) return;
    const attackBox = this.player.getAttackBox();

    // Damage guards caught in the swing; defeated guards play their death
    // animation before updateGameState removes them. Survivors are knocked
    // back away from the swing and show their health bar for a few seconds.
    this.guards.forEach((guard) => {
      if (guard.isDefeated()) return;
      if (isColliding(attackBox, guard.getHitBox())) {
        guard.takeDamage(this.player.attackPower, this.player.movement);
        if (guard.consumeDefeatAward()) {
          sfx.guardDown();
          this.score += guard.isBoss() ? bossSettings.scoreValue : gameSettings.scoreIncrement;
          this.spawnDrop(guard.getPosition());
        } else {
          sfx.hit();
        }
      }
    });

    // Only the axe can chop down obstacles (trees, boulders); a blade that
    // strikes one just bounces off with a reminder of what is needed
    if (weapon.canChopObstacles) {
      const obstaclesBefore = this.obstacles.length;
      this.obstacles = this.obstacles.filter((obstacle) => {
        if (isColliding(attackBox, obstacle.getHitBox())) {
          obstacle.takeDamage(weapon.obstacleDamage || this.player.attackPower);
          return !obstacle.isDestroyed();
        }
        return true;
      });
      if (this.obstacles.length < obstaclesBefore) sfx.chop();
    } else if (
      this.obstacles.some((obstacle) => isColliding(attackBox, obstacle.getHitBox()))
    ) {
      this.notifyOnce(
        this.player.hasWeapon("woodenAxe")
          ? "Only the axe can cut trees and break boulders — press 2 to ready it."
          : "Only an axe could clear this — find one!"
      );
    }
  }

  playerBowAttack(weapon) {
    if (!this.player.hasWeapon("dreamBow")) {
      this.notifyOnce("The bow has not awakened yet.");
      return;
    }
    if (!this.player.useArrow()) {
      this.notifyOnce("No arrows left.");
      return;
    }
    this.attackCooldownMs = weapon.cooldownMs || combatSettings.attackCooldownMs;
    this.player.attackWithWeapon("dreamBow");
    sfx.swing();
    this.pendingPlayerShot = { fired: false, damage: weapon.damage };
  }

  playerAxe() {
    if (this.attackCooldownMs > 0) return;
    // The axe shortcut only works once the axe has been found
    if (!this.player.hasWeapon("woodenAxe")) {
      this.notifyOnce("You have no axe yet — look for one on a glowing pedestal.");
      return;
    }
    const weapon = weaponCatalog.woodenAxe;
    this.attackCooldownMs = weapon.cooldownMs || combatSettings.attackCooldownMs;

    this.player.axe();
    sfx.swing();
    if (!this.player.isActionActive("axe")) return;
    const attackBox = this.player.getAttackBox();

    const obstaclesBefore = this.obstacles.length;
    this.obstacles = this.obstacles.filter((obstacle) => {
      if (isColliding(attackBox, obstacle.getHitBox())) {
        obstacle.takeDamage(weapon.obstacleDamage || this.player.attackPower);
        return !obstacle.isDestroyed();
      }
      return true;
    });
    if (this.obstacles.length < obstaclesBefore) sfx.chop();
  }

  initializeEntities() {
    const level = levelData.getLevel(this.currentLevel);

    if (level) {
      this.explosives = [];
      this.spikeTraps = [];
      this.dartShooters = [];
      this.crumblingFloors = [];
      this.guards = [];
      this.obstacles = [];
      this.powerups = [];
      this.drops = [];
      this.projectiles = [];
      this.weaponPedestals = [];
      const healthScale = this.guardHealthScale(level.number);
      const bossScale = level.number <= 10 ? 1 : Math.min(1.5, 1 + (level.number - 10) * 0.05);

      for (let y = 0; y < level.layout.length; y++) {
        for (let x = 0; x < level.layout[y].length; x++) {
          const cell = level.layout[y][x];
          const position = {
            x: x * canvasSettings.cellWidth,
            y: y * canvasSettings.cellHeight,
          };

          switch (cell) {
            case "E":
              this.explosives.push(new Explosive(position.x, position.y));
              break;
            case "G":
              const randomOrc = randomInt(1, 4);
              this.guards.push(new Guard(position.x, position.y, `orc${randomOrc}`, this.assets.guardAssets, { healthScale }));
              break;
            case "A":
              this.guards.push(
                new Guard(position.x, position.y, `orc${randomInt(1, 3)}`, this.assets.guardAssets, {
                  ranged: true,
                  healthScale,
                })
              );
              break;
            case "B":
              // A boss: bigger, tougher and harder-hitting than a guard.
              // Bosses only gain health past level 10 (bossScale).
              this.guards.push(
                new Guard(position.x, position.y, `orc${randomInt(1, 4)}`, this.assets.guardAssets, {
                  boss: true,
                  healthScale: bossScale,
                })
              );
              break;
            case "O":
              this.obstacles.push(
                new Obstacle(position.x, position.y, "boulder", this.themeAssets)
              );
              break;
            case "T":
              this.obstacles.push(
                new Obstacle(position.x, position.y, "tree", this.themeAssets)
              );
              break;
            case "C":
              const powerupTypes = Object.keys(powerupDescriptions);
              const randomPowerup = randomInt(1, powerupTypes.length);
              this.powerups.push(
                new Powerup(position.x, position.y, powerupTypes[randomPowerup - 1], this.assets.powerupsAssets)
              );
              break;
            case "W":
              if (level.weaponReward) {
                this.weaponPedestals.push({
                  x: position.x,
                  y: position.y,
                  itemId: level.weaponReward,
                  collected: this.hasCollectedReward(level.weaponReward),
                });
              }
              break;
            case "H":
              this.drops.push(new Drop(position.x, position.y, "runeHaste", this.assets.itemAssets));
              break;
            case "V":
              this.drops.push(new Drop(position.x, position.y, "runeWarding", this.assets.itemAssets));
              break;
            case "M":
              this.drops.push(new Drop(position.x, position.y, "runeMight", this.assets.itemAssets));
              break;
            case "S":
              // Stagger neighbouring spikes so a row does not fire in unison
              this.spikeTraps.push(new SpikeTrap(position.x, position.y, { phaseMs: (x + y) * 350 }));
              break;
            case "F":
              this.crumblingFloors.push(new CrumblingFloor(position.x, position.y));
              break;
            case "^":
            case "v":
            case "<":
            case ">":
              this.dartShooters.push(new DartShooter(position.x, position.y, DART_DIRECTIONS[cell]));
              break;
          }
        }
      }
    }
  }

  guardHealthScale(levelNumber) {
    // Same +10% every three levels as before, now capped at 1.6x so the deep
    // Act 2 levels lean on layout pressure rather than bullet-sponge guards.
    return Math.min(1.6, 1 + Math.floor((levelNumber - 1) / 3) * 0.1);
  }

  // Something a defeated guard leaves behind on the ground
  spawnDrop({ x, y }) {
    let itemId;
    // While any door is still locked and no key is in reach (carried or on
    // the ground), the defeated guard always carries one. This also covers
    // levels with several locked doors: each door gets its key in turn.
    const keyInReach =
      this.player.hasItem("key") ||
      this.drops.some((drop) => drop.getType() === "key");
    if (this.lockedDoors().length > 0 && !keyInReach) {
      itemId = "key";
    } else {
      itemId = this.rollGuardDrop();
    }
    if (!itemId) return null;
    const drop = new Drop(x, y, itemId, this.assets.itemAssets);
    this.drops.push(drop);
    return drop;
  }

  rollGuardDrop() {
    const pool = this.player && this.player.hasWeapon("dreamBow") ? lateGuardDropPool : guardDropPool;
    const total = pool.reduce((sum, entry) => sum + entry.weight, 0);
    let roll = random() * total;
    for (const entry of pool) {
      roll -= entry.weight;
      if (roll <= 0) return entry.itemId;
    }
    return null;
  }

  // Queue a short-lived message shown at the top of the canvas (e.g. what a
  // picked-up item does); it fades out during its last second on screen
  notify(text) {
    this.notifications.push({ text, msLeft: powerupSettings.notificationDurationMs });
  }

  // Like notify, but skipped while the same message is still on screen
  // (for messages that would otherwise repeat every frame)
  notifyOnce(text) {
    if (!this.notifications.some((n) => n.text === text)) this.notify(text);
  }

  updateNotifications(deltaMs) {
    this.notifications = this.notifications.filter((n) => {
      n.msLeft -= deltaMs;
      return n.msLeft > 0;
    });
  }

  cycleWeapon() {
    const weapon = this.player.cycleWeapon();
    if (weapon) this.notify(`${weapon.name} readied`);
  }

  selectWeapon(weaponId) {
    if (this.player.selectWeapon(weaponId)) {
      this.notify(`${this.player.getSelectedWeapon().name} readied`);
    }
  }

  hasCollectedReward(itemId) {
    if (!this.player) return false;
    if (itemId === "moonlitQuiver") return this.player.quiverUpgraded;
    const item = itemCatalog[itemId];
    return item?.kind === "weapon" && this.player.hasWeapon(item.weaponId || itemId);
  }

  showWeaponUnlock(itemId) {
    this.weaponUnlock = getWeaponUnlockCopy(itemId);
    if (!this.weaponUnlock) return;
    this.weaponUnlockDemoMs = 0;
    this.pressedDirections.clear();
  }

  dismissWeaponUnlock() {
    this.weaponUnlock = null;
    this.weaponUnlockDemoMs = 0;
  }

  updateWeaponUnlock(deltaMs) {
    this.weaponUnlockDemoMs += deltaMs;
    this.updateNotifications(deltaMs);
  }

  updatePlayerShot() {
    if (!this.pendingPlayerShot || this.pendingPlayerShot.fired) return;
    if (!this.player.isActionActive("bow")) return;
    const center = this.playerCenter();
    this.spawnProjectile({
      x: center.x,
      y: center.y,
      direction: this.directionVector(this.player.movement),
      owner: "player",
      damage: this.pendingPlayerShot.damage,
    });
    this.pendingPlayerShot.fired = true;
  }

  directionVector(direction) {
    return {
      up: { x: 0, y: -1 },
      down: { x: 0, y: 1 },
      left: { x: -1, y: 0 },
      right: { x: 1, y: 0 },
    }[direction] || { x: 1, y: 0 };
  }

  spawnProjectile({ x, y, direction, owner, damage, speed, rangeCells }) {
    const projectile = new Projectile(
      x - 12,
      y - 6,
      direction,
      this.assets.projectileAssets,
      { owner, damage, speed, rangeCells }
    );
    this.projectiles.push(projectile);
    return projectile;
  }

  updateProjectiles(deltaMs) {
    const blockers = [...this.walls, ...this.lockedDoors(), ...this.obstacles];
    this.projectiles.forEach((projectile) => {
      projectile.update(deltaMs);
      const box = projectile.getHitBox();
      if (
        box.x < 0 ||
        box.y < 0 ||
        box.x > this.canvas.width ||
        box.y > this.canvas.height ||
        blockers.some((blocker) => isColliding(box, blocker.getHitBox()))
      ) {
        projectile.destroy();
        return;
      }

      if (projectile.owner === "player") {
        const guard = this.guards.find((candidate) =>
          !candidate.isDefeated() && isColliding(box, candidate.getHitBox())
        );
        if (!guard) return;
        guard.takeDamage(projectile.damage, this.player.movement);
        projectile.destroy();
        if (guard.consumeDefeatAward()) {
          sfx.guardDown();
          this.score += guard.isBoss() ? bossSettings.scoreValue : gameSettings.scoreIncrement;
          this.spawnDrop(guard.getPosition());
        } else {
          sfx.hit();
        }
      } else if (isColliding(box, this.player.getHitBox())) {
        this.damagePlayer(projectile.damage);
        projectile.destroy();
      }
    });
    this.projectiles = this.projectiles.filter((projectile) => !projectile.isDone());
  }

  showLevelIntro({ narrate = true } = {}) {
    const level = levelData.getLevel(this.currentLevel);
    if (!level || !shouldShowLevelIntro(this.currentLevel)) return;
    this.levelIntro = {
      name: level.name,
      number: level.number,
      story: level.story,
      msLeft: gameSettings.levelIntroDurationMs,
    };
    if (narrate) playNarration(level.audioId);
  }

  dismissLevelIntro() {
    if (!this.levelIntro) return;
    markLevelIntroSeen(this.currentLevel);
    this.levelIntro = null;
    stopNarration();
  }

  bootstrapProgressionForLevel(levelNumber) {
    if (!this.player || levelNumber <= 1) return;
    for (let level = 1; level < levelNumber; level += 1) {
      const data = levelData.getLevel(level);
      if (!data?.weaponReward) continue;
      if (data.weaponReward === "moonlitQuiver") {
        this.player.unlockQuiver();
      } else {
        this.player.unlockWeapon(data.weaponReward);
      }
    }
  }

  mountGameUi() {
    const stage = this.container.querySelector("#game-stage") || this.container;

    if (shouldShowTouchControls()) {
      if (!this.touchControls) {
        this.touchControls = createTouchControls(this);
        installTouchControlVisibilityListener(this.touchControls);
      }
      if (this.touchControls.parentElement !== stage) {
        stage.appendChild(this.touchControls);
      }
      syncTouchControlsVisibility(this.touchControls);
    } else if (this.touchControls) {
      this.touchControls.remove();
      this.touchControls = null;
    }

    let soundToggle = stage.querySelector("#in-game-sound-toggle");
    if (!soundToggle) {
      soundToggle = createSoundToggleButton({ compact: true });
      soundToggle.id = "in-game-sound-toggle";
      soundToggle.style.position = "absolute";
      soundToggle.style.top = "12px";
      soundToggle.style.right = "12px";
      soundToggle.style.zIndex = "11";
      stage.appendChild(soundToggle);
    }
  }

  formatRunTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  }

  // Mark every cell within the light radius of the player as explored
  revealAroundPlayer() {
    if (!this.fogEnabled) return;
    const center = this.playerCenter();
    for (let y = 0; y < this.explored.length; y++) {
      for (let x = 0; x < this.explored[y].length; x++) {
        if (this.explored[y][x]) continue;
        const cellCenterX = x * canvasSettings.cellWidth + canvasSettings.cellWidth / 2;
        const cellCenterY = y * canvasSettings.cellHeight + canvasSettings.cellHeight / 2;
        const distance = Math.hypot(cellCenterX - center.x, cellCenterY - center.y);
        if (distance <= fogSettings.revealRadius) this.explored[y][x] = true;
      }
    }
  }

  playerCenter() {
    const position = this.player.getPosition();
    return {
      x: position.x + canvasSettings.cellWidth / 2,
      y: position.y + canvasSettings.cellHeight / 2,
    };
  }

  isCellExplored(col, row) {
    return Boolean(this.explored[row] && this.explored[row][col]);
  }

  updateGameState(deltaMs = 1000 / 60) {
    if (this.levelIntro) {
      this.levelIntro.msLeft -= deltaMs;
      if (this.levelIntro.msLeft <= 0) this.dismissLevelIntro();
      return;
    }
    if (this.weaponUnlock) {
      this.updateWeaponUnlock(deltaMs);
      return;
    }
    if (!this.inventoryOpen && !this.isPlayerDown()) {
      this.runElapsedMs += deltaMs;
    }
    this.attackCooldownMs = Math.max(0, this.attackCooldownMs - deltaMs);
    if (this.isPlayerDown()) {
      this.checkPlayerDeath(deltaMs);
      this.player.update(deltaMs);
      this.updateNotifications(deltaMs);
      return;
    }
    this.applyMovementInput(deltaMs);
    this.revealAroundPlayer();
    this.checkCollisions();
    this.checkPlayerDeath(deltaMs);
    if (this.isGameOver) return;
    this.updateNotifications(deltaMs);
    this.player.update(deltaMs);
    this.updatePlayerShot();
    this.updateExplosives(deltaMs);
    this.updateTraps(deltaMs);
    // Locked doors block guards (and their line of sight) like walls; a
    // collapsed pit is impassable to guards too (only the player triggers it)
    const guardBlockers = [...this.walls, ...this.lockedDoors(), ...this.collapsedPits()];
    this.guards.forEach((guard) => {
      const shot = guard.update(this.player.getHitBox(), guardBlockers, deltaMs);
      if (shot) this.spawnProjectile({ ...shot, owner: "guard" });
    });
    this.updateProjectiles(deltaMs);
    this.guards = this.guards.filter((guard) => !guard.isReadyToRemove());
    this.obstacles.forEach((obstacle) => obstacle.update());
    this.powerups.forEach((powerup) => powerup.update());
    this.drops.forEach((drop) => drop.update(deltaMs));
    this.checkDoorUnlock();
    this.checkLockedDoorHint();
    this.checkObstacleHint();
    this.checkLevelCompletion();
  }

  // Rectangle around a door: touching it means "at the door", one cell of
  // margin means "in front of the door"
  static inflateBox(box, margin) {
    return {
      x: box.x - margin,
      y: box.y - margin,
      width: box.width + margin * 2,
      height: box.height + margin * 2,
    };
  }

  // Walking up to a locked door while carrying a key opens it
  checkDoorUnlock() {
    if (!this.player.hasItem("key")) return;
    const playerBox = this.player.getHitBox();
    for (const door of this.lockedDoors()) {
      // The player is stopped flush against the door, so allow a small gap
      const atDoor = isColliding(playerBox, Game.inflateBox(door.getHitBox(), 10));
      if (atDoor) {
        this.player.removeItem("key");
        door.unlock();
        sfx.unlock();
        this.notify("You unlocked the door with your key!");
        return;
      }
    }
  }

  // Approaching a locked door without the key explains what is missing,
  // before the player even touches it
  checkLockedDoorHint() {
    if (this.player.hasItem("key")) return;
    const playerBox = this.player.getHitBox();
    const nearDoor = this.lockedDoors().some((door) =>
      isColliding(playerBox, Game.inflateBox(door.getHitBox(), canvasSettings.cellWidth))
    );
    if (!nearDoor) return;

    const keyOnGround = this.drops.some((drop) => drop.getType() === "key");
    this.notifyOnce(
      keyOnGround
        ? "The door is locked — pick up the key first!"
        : "The door is locked — defeat a guard to find the key."
    );
  }

  // Bumping into a tree or boulder before the axe is found explains why the
  // path will not budge (only the axe can cut trees and break boulders)
  checkObstacleHint() {
    if (this.player.hasWeapon("woodenAxe")) return;
    const playerBox = this.player.getHitBox();
    const blocking = this.obstacles.find((obstacle) =>
      isColliding(playerBox, Game.inflateBox(obstacle.getHitBox(), 12))
    );
    if (!blocking) return;
    this.notifyOnce(
      blocking.getType() === "tree"
        ? "A tree blocks the path — only an axe can cut it down."
        : "A boulder blocks the way — only an axe can break it."
    );
  }

  checkPlayerDeath(deltaMs = 1000 / 60) {
    if (this.player.getHealth() > 0) return;
    if (this.pendingRespawnMs !== null) {
      this.pendingRespawnMs -= deltaMs;
      if (this.pendingRespawnMs <= 0) {
        this.pendingRespawnMs = null;
        this.player.respawn(this.playerStart.x, this.playerStart.y);
      }
      return;
    }
    if (this.pendingGameOverMs !== null) {
      this.pendingGameOverMs -= deltaMs;
      if (this.pendingGameOverMs <= 0) {
        this.isGameOver = true;
        this.started = false;
        this.pendingGameOverMs = null;
        this.onGameOver(this.score);
      }
      return;
    }

    this.lives -= 1;
    this.deathCount += 1;
    if (this.lives <= 0) {
      this.player.defeat();
      this.pendingGameOverMs = playerSettings.defeatPauseMs;
      sfx.gameOver();
      return;
    }
    this.player.defeat();
    this.pendingRespawnMs = playerSettings.defeatPauseMs;
  }

  isPlayerDown() {
    return this.pendingRespawnMs !== null || this.pendingGameOverMs !== null;
  }

  // Hidden traps arm when the player comes close, burn a fuse, then blast
  // everything (player and guards) inside the radius exactly once
  updateExplosives(deltaMs) {
    const playerHitBox = this.player.getHitBox();

    this.explosives.forEach((explosive) => {
      const wasHidden = explosive.isHidden();
      explosive.update(playerHitBox, deltaMs);
      if (wasHidden && explosive.isArmed()) {
        sfx.fuse();
        this.notifyOnce("A trap springs — run!");
      }

      const blast = explosive.consumeBlast();
      if (!blast) return;
      sfx.explosion();

      const inBlast = (box) => {
        const cx = box.x + box.width / 2;
        const cy = box.y + box.height / 2;
        return Math.hypot(cx - blast.x, cy - blast.y) <= blast.radius;
      };

      if (inBlast(playerHitBox)) {
        this.damagePlayer(entitySettings.explosivePlayerDamage);
      }
      this.guards.forEach((guard) => {
        if (guard.isDefeated()) return;
        if (inBlast(guard.getHitBox())) {
          guard.takeDamage(entitySettings.explosiveGuardDamage);
          if (guard.consumeDefeatAward()) {
            this.score += guard.isBoss() ? bossSettings.scoreValue : gameSettings.scoreIncrement;
            this.spawnDrop(guard.getPosition());
          }
        }
      });
    });

    this.explosives = this.explosives.filter((explosive) => !explosive.isDone());
  }

  // Collapsed crumbling floors, treated as impassable by guards
  collapsedPits() {
    return this.crumblingFloors.filter((floor) => floor.isCollapsed());
  }

  updateTraps(deltaMs) {
    const playerBox = this.player.getHitBox();
    const playerCenter = {
      x: playerBox.x + playerBox.width / 2,
      y: playerBox.y + playerBox.height / 2,
    };

    // Spike traps: hurt the player and any guard standing on extended spikes
    this.spikeTraps.forEach((spike) => {
      spike.update(deltaMs);
      if (!spike.isExtended()) return;
      const box = spike.getDamageBox();
      if (isColliding(playerBox, box)) this.damagePlayer(trapSettings.spikePlayerDamage);
      this.guards.forEach((guard) => {
        if (guard.isDefeated() || !spike.canHurtGuard(guard)) return;
        if (!isColliding(box, guard.getHitBox())) return;
        spike.markGuardHurt(guard);
        guard.takeDamage(trapSettings.spikeGuardDamage);
        if (guard.consumeDefeatAward()) {
          sfx.guardDown();
          this.score += guard.isBoss() ? bossSettings.scoreValue : gameSettings.scoreIncrement;
          this.spawnDrop(guard.getPosition());
        }
      });
    });

    // Dart shooters: fire darts (owner "guard") along their facing direction
    this.dartShooters.forEach((shooter) => {
      const shot = shooter.update(playerCenter, deltaMs);
      if (shot) {
        this.spawnProjectile({ ...shot, owner: "guard" });
        sfx.swing?.();
      }
    });

    // Crumbling floors: collapse under the player, damaging them if still on it
    this.crumblingFloors.forEach((floor) => {
      const collapsedNow = floor.update(playerBox, deltaMs);
      if (collapsedNow && isColliding(playerBox, floor.getHitBox())) {
        this.damagePlayer(trapSettings.crumbleCollapseDamage);
      }
    });
  }

  // Route all player damage through one place so the hurt sound plays
  // only when damage actually lands (not while invincible or flashing)
  damagePlayer(amount) {
    const healthBefore = this.player.getHealth();
    this.player.takeDamage(amount);
    if (this.player.getHealth() < healthBefore) sfx.hurt();
  }

  checkCollisions() {
    const playerPosition = this.player.getHitBox();

    this.guards.forEach((guard) => {
      if (guard.isDefeated()) return;
      if (isColliding(playerPosition, guard.getHitBox())) {
        this.damagePlayer(guard.damage);
      }
    });

    this.obstacles.forEach((obstacle, index) => {
      if (isColliding(playerPosition, obstacle.getHitBox())) {
        // Handle player-obstacle interaction
      }
    });

    this.powerups.forEach((powerup, index) => {
      if (isColliding(this.player.getPickupRange(), powerup.getHitBox())) {
        const effect = powerup.collect();
        this.player.applyPowerup(effect);
        if (powerupDescriptions[effect]) {
          this.notify(powerupDescriptions[effect]);
        }
        this.powerups.splice(index, 1);
        this.score += gameSettings.scoreIncrement;
        sfx.pickup();
      }
    });

    // Items dropped by defeated guards go into the inventory
    this.drops = this.drops.filter((drop) => {
      if (isColliding(this.player.getPickupRange(), drop.getHitBox())) {
        this.collectDrop(drop.getType());
        sfx.pickup();
        return false;
      }
      return true;
    });

    this.weaponPedestals.forEach((pedestal) => {
      if (pedestal.collected) return;
      const box = { x: pedestal.x, y: pedestal.y, width: canvasSettings.cellWidth, height: canvasSettings.cellHeight };
      if (!isColliding(this.player.getPickupRange(), box)) return;
      pedestal.collected = true;
      this.collectWeaponReward(pedestal.itemId);
    });
  }

  collectDrop(itemId) {
    const item = itemCatalog[itemId];
    if (!item) return;
    if (item.kind === "score") {
      this.score += item.scoreValue;
      this.notify(`Dream-shard reclaimed! +${item.scoreValue}`);
      return;
    }
    if (item.kind === "ammo") {
      this.player.addArrows(item.arrowAmount);
      this.notify(`Arrows gathered +${item.arrowAmount} (${this.player.arrowCount}/${this.player.arrowCapacity})`);
      return;
    }
    if (item.kind === "potion" && (this.player.inventory.potion || 0) >= 3) {
      this.score += 50;
      this.notify("Your pack is full - +50");
      return;
    }
    this.player.addItem(itemId);
    this.notifyPickup(itemId);
  }

  collectWeaponReward(itemId) {
    if (itemId === "moonlitQuiver") {
      this.player.unlockQuiver();
    } else {
      const item = itemCatalog[itemId];
      this.player.unlockWeapon(item?.weaponId || itemId);
    }
    sfx.pickup();
    this.showWeaponUnlock(itemId);
  }

  notifyPickup(itemId) {
    const item = itemCatalog[itemId];
    this.notify(
      `You picked up ${item.article} ${item.name} — press 'i' to inspect your inventory.`
    );
  }

  checkLevelCompletion() {
    if (!this.isLevelComplete()) return;

    this.score += gameSettings.scoreIncrement;
    sfx.levelComplete();

    const completedLevel = levelData.getLevel(this.currentLevel);
    const nextLevel = levelData.getLevel(this.currentLevel + 1);
    if (nextLevel) {
      this.currentLevel += 1;
      this.initializeBoard();
      this.initializePlayer();
      this.initializeEntities();
      this.showLevelIntro({ narrate: false });
      this.pause();
      this.onLevelCompleted(this.score, completedLevel, nextLevel);
    } else {
      // Last level cleared: the player won the game
      this.isGameOver = true;
      this.started = false;
      this.onGameWon(this.score);
    }
  }

  isLevelComplete() {
    // A level is complete when the player reaches the exit
    return this.exit && isColliding(this.player.getHitBox(), this.exit.getHitBox());
  }

  render() {
    // Render the game board and entities (player, obstacles, powerups, guards)
    // Clear the canvas
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw the grid
    this.drawGrid();

    // Draw the walls and doors
    this.walls.forEach((wall) => wall.draw(this.context));
    this.doors.forEach((door) => door.draw(this.context));

    // Floor traps sit under the entities (dart shooters decorate their wall tile)
    this.crumblingFloors.forEach((floor) => floor.draw(this.context));
    this.spikeTraps.forEach((spike) => spike.draw(this.context));
    this.dartShooters.forEach((shooter) => shooter.draw(this.context));

    // Draw the entities
    this.obstacles.forEach((obstacle) => obstacle.draw(this.context));
    this.powerups.forEach((powerup) => powerup.draw(this.context));
    this.drawWeaponPedestals();
    this.drops.forEach((drop) => drop.draw(this.context));
    this.guards.forEach((guard) => guard.draw(this.context));
    this.explosives.forEach((explosive) => explosive.draw(this.context));
    this.projectiles.forEach((projectile) => projectile.draw(this.context));

    // Draw the exit
    if (this.exit) {
      this.exit.draw(this.context);
    }

    // Draw the player
    this.player.draw(this.context);

    // Fog of war covers the world but never the HUD
    this.drawFog();
    this.drawMinimap();

    // Draw the HUD on top of everything
    this.drawHUD();

    // The inventory screen covers the frozen world; notifications (e.g.
    // "equipped") stay visible above it
    if (this.inventoryOpen) this.drawInventory();
    this.drawNotifications();
    if (this.levelIntro) this.drawLevelIntro();
    if (this.weaponUnlock) this.drawWeaponUnlock();
  }

  drawLevelIntro() {
    const ctx = this.context;
    const panelWidth = 760;
    const panelHeight = 250;
    const panelX = (this.canvas.width - panelWidth) / 2;
    const panelY = (this.canvas.height - panelHeight) / 2;

    ctx.save();
    ctx.fillStyle = "rgba(5, 4, 10, 0.68)";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.fillStyle = "rgba(18, 12, 24, 0.92)";
    ctx.strokeStyle = "#ffd54f";
    ctx.lineWidth = 2;
    ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
    ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#80d8ff";
    ctx.font = "bold 18px monospace";
    ctx.fillText(`Dream ${this.levelIntro.number}`, this.canvas.width / 2, panelY + 42);

    ctx.fillStyle = "#ffd54f";
    ctx.font = "bold 34px monospace";
    ctx.fillText(this.levelIntro.name, this.canvas.width / 2, panelY + 84);

    ctx.fillStyle = "#f8e7a1";
    ctx.font = "20px monospace";
    this.drawWrappedText(this.levelIntro.story, this.canvas.width / 2, panelY + 136, panelWidth - 90, 28);

    ctx.fillStyle = "rgba(255, 255, 255, 0.68)";
    ctx.font = "14px monospace";
    ctx.fillText("Press any key to begin", this.canvas.width / 2, panelY + panelHeight - 34);
    ctx.restore();
  }

  drawWrappedText(text, centerX, y, maxWidth, lineHeight) {
    const words = text.split(" ");
    let line = "";
    const lines = [];

    words.forEach((word) => {
      const testLine = line ? `${line} ${word}` : word;
      if (this.context.measureText(testLine).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = testLine;
      }
    });
    if (line) lines.push(line);

    const startY = y - ((lines.length - 1) * lineHeight) / 2;
    lines.forEach((wrappedLine, index) => {
      this.context.fillText(wrappedLine, centerX, startY + index * lineHeight);
    });
  }

  drawNotifications() {
    const ctx = this.context;
    ctx.save();
    ctx.font = "bold 18px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    this.notifications.forEach((notification, i) => {
      // Fade out over the last second on screen
      ctx.globalAlpha = Math.min(1, notification.msLeft / 1000);
      const y = 72 + i * 30;
      const width = ctx.measureText(notification.text).width + 24;
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      ctx.fillRect(this.canvas.width / 2 - width / 2, y - 13, width, 26);
      ctx.fillStyle = "#ffd54f";
      ctx.fillText(notification.text, this.canvas.width / 2, y);
    });
    ctx.restore();
  }

  drawWeaponPedestals() {
    const ctx = this.context;
    this.weaponPedestals.forEach((pedestal) => {
      if (pedestal.collected) return;
      const item = itemCatalog[pedestal.itemId];
      const icon = item && this.assets.itemAssets[item.icon];
      if (!icon) return;
      const pulse = (Math.sin(performance.now() / 220) + 1) / 2;
      ctx.save();
      ctx.fillStyle = "rgba(20, 12, 34, 0.82)";
      ctx.strokeStyle = `rgba(255, 213, 79, ${0.55 + pulse * 0.45})`;
      ctx.lineWidth = 3;
      ctx.fillRect(pedestal.x + 8, pedestal.y + 10, 48, 44);
      ctx.strokeRect(pedestal.x + 8, pedestal.y + 10, 48, 44);
      ctx.drawImage(icon, pedestal.x + 16, pedestal.y + 14, 32, 32);
      ctx.restore();
    });
  }

  drawWeaponUnlock() {
    const ctx = this.context;
    const panelWidth = 760;
    const panelHeight = 360;
    const panelX = (this.canvas.width - panelWidth) / 2;
    const panelY = (this.canvas.height - panelHeight) / 2;
    const item = itemCatalog[this.weaponUnlock.itemId];

    ctx.save();
    ctx.fillStyle = "rgba(5, 4, 10, 0.7)";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.fillStyle = "rgba(18, 12, 24, 0.96)";
    ctx.strokeStyle = "#ffd54f";
    ctx.lineWidth = 2;
    ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
    ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#80d8ff";
    ctx.font = "bold 18px monospace";
    ctx.fillText("Dream-shard awakened", this.canvas.width / 2, panelY + 36);

    ctx.fillStyle = "#ffd54f";
    ctx.font = "bold 34px monospace";
    ctx.fillText(this.weaponUnlock.title, this.canvas.width / 2, panelY + 78);

    ctx.fillStyle = "#f8e7a1";
    ctx.font = "18px monospace";
    this.drawWrappedText(this.weaponUnlock.line || item.description, this.canvas.width / 2, panelY + 126, panelWidth - 90, 24);

    ctx.fillStyle = "#fff";
    ctx.font = "16px monospace";
    this.drawWrappedText(this.weaponUnlock.hint || item.description, this.canvas.width / 2, panelY + 172, panelWidth - 100, 22);

    this.drawWeaponDemo(panelX + 120, panelY + 210, panelWidth - 240, 78);

    ctx.fillStyle = "rgba(255, 255, 255, 0.68)";
    ctx.font = "14px monospace";
    ctx.fillText("Press Space, Enter or click to continue", this.canvas.width / 2, panelY + panelHeight - 32);
    ctx.restore();
  }

  drawWeaponDemo(x, y, width, height) {
    const ctx = this.context;
    const item = itemCatalog[this.weaponUnlock.itemId];
    const weaponId = item?.weaponId || this.weaponUnlock.itemId;
    const weapon = weaponCatalog[weaponId] || weaponCatalog.dreamBow;
    const manifestState = weapon.actionState || "attack";
    const cycleMs = weaponId === "dreamBow" ? 900 : 620;
    const frameMs = this.weaponUnlockDemoMs % cycleMs;
    const frame = Math.floor(frameMs / (weaponId === "dreamBow" ? 70 : 80));
    const row = weaponId === "dreamBow" ? 3 : manifestState === "axe" ? 10 : 7;
    const sheet = weaponId === "dreamBow"
      ? this.assets.playerAssets.playerBow
      : manifestState === "axe"
        ? this.assets.playerAssets.playerActions
        : this.assets.playerAssets.playerMovement;
    const frameSize = weaponId === "dreamBow" ? 64 : manifestState === "axe" ? 48 : 32;
    const frames = weaponId === "dreamBow" ? 8 : manifestState === "axe" ? 2 : 4;

    ctx.save();
    ctx.fillStyle = this.themeAssets.floor
      ? ctx.createPattern(this.assets.levelAssets.grassTile, "repeat")
      : "#2f7d3b";
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = "#80d8ff";
    ctx.strokeRect(x, y, width, height);

    ctx.drawImage(
      sheet,
      (frame % frames) * frameSize,
      row * frameSize,
      frameSize,
      frameSize,
      x + 32,
      y + (height - 64) / 2,
      64,
      64
    );

    if (weaponId === "dreamBow" && frameMs > 430) {
      const arrowX = x + 110 + ((frameMs - 430) / 470) * (width - 160);
      ctx.drawImage(this.assets.projectileAssets.arrow, arrowX, y + height / 2 - 32, 64, 64);
    }
    ctx.restore();
  }

  // Full-screen inventory: equipment slots on top, carried items below.
  // Hovering a slot shows the item's description; clicking equips or drinks.
  drawInventory() {
    const ctx = this.context;
    const panelWidth = 640;
    const panelHeight = 400;
    const panelX = (this.canvas.width - panelWidth) / 2;
    const panelY = (this.canvas.height - panelHeight) / 2;
    const slotSize = 56;
    this.inventorySlotRects = [];

    ctx.save();

    // Dim the frozen world behind the panel
    ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Panel
    ctx.fillStyle = "#20222c";
    ctx.strokeStyle = "#ffd54f";
    ctx.lineWidth = 2;
    ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
    ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);

    // Title bar
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    ctx.font = "bold 22px monospace";
    ctx.fillStyle = "#ffd54f";
    ctx.fillText("Inventory", panelX + 24, panelY + 30);
    ctx.font = "14px monospace";
    ctx.fillStyle = "#999";
    ctx.textAlign = "right";
    ctx.fillText("press 'i' to close", panelX + panelWidth - 24, panelY + 30);
    ctx.textAlign = "left";

    // Equipment slots
    const equipY = panelY + 84;
    [
      { label: "Weapon", itemId: this.player.getSelectedWeapon().itemId },
      { label: "Rune", itemId: this.player.equipment.rune },
    ].forEach((equip, i) => {
      const x = panelX + 24 + i * 170;
      ctx.font = "bold 14px monospace";
      ctx.fillStyle = "#80d8ff";
      ctx.fillText(equip.label, x, equipY - 12);
      this.drawInventorySlot(x, equipY, slotSize, equip.itemId, 0);
    });

    ctx.font = "bold 14px monospace";
    ctx.fillStyle = "#80d8ff";
    ctx.fillText("Weapons", panelX + 370, equipY - 12);
    weaponOrder.forEach((weaponId, i) => {
      const itemId = weaponCatalog[weaponId].itemId;
      this.drawInventorySlot(
        panelX + 370 + i * (slotSize + 10),
        equipY,
        slotSize,
        this.player.hasWeapon(weaponId) ? itemId : null,
        0
      );
    });

    // Carried items
    const gridY = equipY + slotSize + 44;
    ctx.font = "bold 14px monospace";
    ctx.fillStyle = "#80d8ff";
    ctx.fillText("Items", panelX + 24, gridY - 12);
    const entries = this.player.getInventoryEntries();
    if (entries.length === 0) {
      ctx.font = "14px monospace";
      ctx.fillStyle = "#999";
      ctx.fillText("Nothing yet - guards may drop potions, shards and arrows.", panelX + 24, gridY + 28);
    }
    entries.forEach((entry, i) => {
      const columns = 9;
      const x = panelX + 24 + (i % columns) * (slotSize + 10);
      const y = gridY + Math.floor(i / columns) * (slotSize + 10);
      this.drawInventorySlot(x, y, slotSize, entry.id, entry.count);
    });

    // Footer hint
    ctx.font = "14px monospace";
    ctx.fillStyle = "#999";
    ctx.fillText(
      "Click a weapon to ready it, a rune to equip it, or a potion to drink it.",
      panelX + 24,
      panelY + panelHeight - 24
    );

    this.drawInventoryTooltip();
    ctx.restore();
  }

  drawInventorySlot(x, y, size, itemId, count) {
    const ctx = this.context;
    this.inventorySlotRects.push({ x, y, size, itemId });

    const hovered =
      this.mouse.x >= x && this.mouse.x <= x + size &&
      this.mouse.y >= y && this.mouse.y <= y + size;
    const item = itemId ? itemCatalog[itemId] : null;
    const equipped = item && (
      (item.kind === "weapon" && this.player.weaponId === (item.weaponId || itemId)) ||
      this.player.equipment[item.kind] === itemId
    );

    ctx.fillStyle = "#2c2f3d";
    ctx.fillRect(x, y, size, size);
    ctx.strokeStyle = hovered ? "#ffd54f" : equipped ? "#80d8ff" : "#4a4e63";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, size, size);

    if (!item) return;
    ctx.drawImage(this.assets.itemAssets[item.icon], x + 6, y + 6, size - 12, size - 12);
    if (count > 1) {
      ctx.font = "bold 13px monospace";
      ctx.fillStyle = "#fff";
      ctx.textAlign = "right";
      ctx.fillText(`x${count}`, x + size - 4, y + size - 9);
      ctx.textAlign = "left";
    }
    if (equipped) {
      ctx.font = "bold 11px monospace";
      ctx.fillStyle = "#80d8ff";
      ctx.fillText("ON", x + 4, y + 10);
    }
  }

  drawInventoryTooltip() {
    const hoveredSlot = this.inventorySlotRects.find(
      (r) =>
        r.itemId &&
        this.mouse.x >= r.x && this.mouse.x <= r.x + r.size &&
        this.mouse.y >= r.y && this.mouse.y <= r.y + r.size
    );
    if (!hoveredSlot) return;

    const ctx = this.context;
    const item = itemCatalog[hoveredSlot.itemId];
    const hint =
      item.kind === "weapon"
        ? "Click to ready"
        : item.kind === "rune"
          ? "Click to equip or take off"
        : item.kind === "potion"
          ? "Click to drink"
          : null;
    const lines = [item.name, item.description];
    if (hint) lines.push(hint);

    ctx.font = "14px monospace";
    const boxWidth = Math.max(...lines.map((l) => ctx.measureText(l).width)) + 24;
    const boxHeight = lines.length * 20 + 16;
    // Keep the tooltip on screen, above-right of the cursor when possible
    const boxX = Math.min(this.mouse.x + 14, this.canvas.width - boxWidth - 4);
    const boxY = Math.max(4, this.mouse.y - boxHeight - 6);

    ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
    ctx.strokeStyle = "#ffd54f";
    ctx.lineWidth = 1;
    ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
    ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

    lines.forEach((line, i) => {
      ctx.fillStyle = i === 0 ? "#ffd54f" : i === lines.length - 1 && hint ? "#80d8ff" : "#eee";
      ctx.font = i === 0 ? "bold 14px monospace" : "14px monospace";
      ctx.fillText(line, boxX + 12, boxY + 18 + i * 20);
    });
  }

  drawMinimap() {
    if (!this.fogEnabled || !this.explored.length) return;

    const ctx = this.context;
    const cols = this.explored[0].length;
    const rows = this.explored.length;
    const mapWidth = 120;
    const mapHeight = 60;
    const mapX = this.canvas.width - mapWidth - 12;
    const mapY = this.canvas.height - mapHeight - 12;
    const cellW = mapWidth / cols;
    const cellH = mapHeight / rows;
    const playerCell = {
      col: Math.floor(this.player.getPosition().x / canvasSettings.cellWidth),
      row: Math.floor(this.player.getPosition().y / canvasSettings.cellHeight),
    };

    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
    ctx.strokeStyle = "rgba(255, 213, 79, 0.7)";
    ctx.lineWidth = 1;
    ctx.fillRect(mapX - 4, mapY - 4, mapWidth + 8, mapHeight + 8);
    ctx.strokeRect(mapX - 4, mapY - 4, mapWidth + 8, mapHeight + 8);

    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        if (!this.explored[row][col]) continue;
        const cell = this.board[row]?.[col];
        const isWall = cell === "#" || cell === "D" || isDartCell(cell);
        ctx.fillStyle = isWall ? "rgba(120, 120, 140, 0.9)" : "rgba(70, 90, 120, 0.75)";
        ctx.fillRect(mapX + col * cellW, mapY + row * cellH, cellW, cellH);
      }
    }

    ctx.fillStyle = "#ffd54f";
    ctx.fillRect(
      mapX + playerCell.col * cellW,
      mapY + playerCell.row * cellH,
      cellW,
      cellH
    );
    ctx.restore();
  }

  drawHUD() {
    const ctx = this.context;
    ctx.save();

    // Background strip
    ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
    ctx.fillRect(8, 8, 760, 40);

    ctx.font = "bold 18px monospace";
    ctx.textBaseline = "middle";

    // Score
    ctx.fillStyle = "#ffd54f";
    ctx.fillText(`Score: ${this.score}`, 18, 28);

    // Lives
    ctx.fillStyle = "#ff5252";
    ctx.fillText(`${"♥".repeat(Math.max(0, this.lives))}`, 160, 28);

    // Health bar
    const health = Math.max(0, this.player.getHealth());
    ctx.fillStyle = "#444";
    ctx.fillRect(226, 20, 70, 14);
    ctx.fillStyle = health > 30 ? "#4caf50" : "#c62828";
    ctx.fillRect(226, 20, (health / 100) * 70, 14);
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1;
    ctx.strokeRect(226, 20, 70, 14);

    // Keys and potions carried, as icons with a count
    const icons = this.assets.itemAssets;
    const iconSize = 26;
    ctx.font = "bold 16px monospace";
    ctx.fillStyle = "#fff";
    ctx.drawImage(icons.key, 306, 15, iconSize, iconSize);
    ctx.fillText(`${this.player.inventory.key || 0}`, 306 + iconSize + 2, 28);
    ctx.drawImage(icons.potion, 356, 15, iconSize, iconSize);
    ctx.fillText(`${this.player.inventory.potion || 0}`, 356 + iconSize + 2, 28);

    const weapon = this.player.getSelectedWeapon();
    ctx.drawImage(icons[weapon.icon], 412, 15, iconSize, iconSize);
    ctx.fillText(weapon.name.replace(/^(?:Rusty|Wooden|Steel|Dream) /, ""), 442, 28);
    ctx.drawImage(icons.arrowBundle, 548, 15, iconSize, iconSize);
    ctx.fillText(`${this.player.arrowCount}`, 578, 28);

    // Reminder that the inventory exists
    ctx.font = "14px monospace";
    ctx.fillStyle = "#aaa";
    ctx.fillText("(i)", 616, 28);

    ctx.font = "14px monospace";
    ctx.fillStyle = "#bbb";
    ctx.textAlign = "right";
    ctx.fillText(`Time ${this.formatRunTime(this.runElapsedMs)}`, this.canvas.width - 18, 28);
    ctx.fillText(`Deaths ${this.deathCount}`, this.canvas.width - 18, 48);
    ctx.textAlign = "left";

    // Active powerup effects with their remaining time
    const effects = this.player.getActiveEffects();
    if (effects.length > 0) {
      ctx.font = "bold 14px monospace";
      ctx.fillStyle = "#80d8ff";
      const label = effects.map((e) => `${e.name} ${e.secondsLeft}s`).join("  ");
      ctx.fillText(label, 18, 62);
    }

    ctx.restore();
  }

  drawGrid() {
    const floorPattern = this.themeAssets.floor
      ? this.context.createPattern(this.themeAssets.floor, "repeat")
      : null;
    this.context.fillStyle = floorPattern || this.themeAssets.floorFallback;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  // Fog of war: unexplored cells are pitch black, explored cells outside
  // the light radius stay dimly visible (map memory), and a soft torchlight
  // circle follows the player. Composed on an offscreen canvas so the
  // torch can be erased out of the fog without touching the world below.
  drawFog() {
    if (!this.fogEnabled) return;

    if (!this.fogCanvas) {
      this.fogCanvas = document.createElement("canvas");
      this.fogCanvas.width = this.canvas.width;
      this.fogCanvas.height = this.canvas.height;
    }
    const fogCtx = this.fogCanvas.getContext("2d");
    fogCtx.clearRect(0, 0, this.fogCanvas.width, this.fogCanvas.height);

    for (let y = 0; y < this.explored.length; y++) {
      for (let x = 0; x < this.explored[y].length; x++) {
        const alpha = this.explored[y][x]
          ? fogSettings.exploredAlpha
          : fogSettings.unexploredAlpha;
        fogCtx.fillStyle = `rgba(8, 8, 16, ${alpha})`;
        fogCtx.fillRect(
          x * canvasSettings.cellWidth,
          y * canvasSettings.cellHeight,
          canvasSettings.cellWidth,
          canvasSettings.cellHeight
        );
      }
    }

    // Erase a soft-edged torchlight circle around the player
    const center = this.playerCenter();
    const radius = fogSettings.revealRadius;
    const torch = fogCtx.createRadialGradient(
      center.x, center.y, radius * 0.5,
      center.x, center.y, radius
    );
    torch.addColorStop(0, "rgba(0, 0, 0, 1)");
    torch.addColorStop(1, "rgba(0, 0, 0, 0)");
    fogCtx.globalCompositeOperation = "destination-out";
    fogCtx.fillStyle = torch;
    fogCtx.fillRect(
      center.x - radius, center.y - radius,
      radius * 2, radius * 2
    );
    fogCtx.globalCompositeOperation = "source-over";

    this.context.drawImage(this.fogCanvas, 0, 0);
  }

  gameLoop(timestamp = performance.now()) {
    // Main game loop
    if (this.isGameOver || this.paused) return;
    if (this.lastFrameTime === null) this.lastFrameTime = timestamp;
    const deltaMs = Math.min(50, timestamp - this.lastFrameTime);
    this.lastFrameTime = timestamp;
    if (this.inventoryOpen) {
      // The world stands still while the player inspects the inventory, but
      // messages keep fading and the screen keeps rendering for hover effects
      this.updateNotifications(deltaMs);
    } else {
      this.updateGameState(deltaMs);
    }
    if (this.isGameOver || this.paused) return;
    this.render();
    this.rafId = requestAnimationFrame(this.gameLoop.bind(this));
  }

  pause() {
    this.paused = true;
    this.inventoryOpen = false;
    this.pressedDirections.clear();
    this.lastFrameTime = null;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  start({ fromLevel = null } = {}) {
    // Fresh run: reset all progress
    this.started = true;
    this.paused = false;
    this.isGameOver = false;
    this.lives = playerSettings.initialLives;
    this.score = 0;
    this.currentLevel = fromLevel || gameSettings.initialLevel;
    this.deathCount = 0;
    this.runElapsedMs = 0;
    this.notifications = [];
    this.player = null; // a fresh run starts with an empty pack
    this.inventoryOpen = false;
    this.weaponUnlock = null;
    this.pendingGameOverMs = null;
    this.pendingRespawnMs = null;
    this.pendingPlayerShot = null;
    this.attackCooldownMs = 0;
    this.projectiles = [];
    this.weaponPedestals = [];
    this.spikeTraps = [];
    this.dartShooters = [];
    this.crumblingFloors = [];
    this.pressedDirections.clear();
    this.lastFrameTime = null;
    if (this.rafId) cancelAnimationFrame(this.rafId);
    clearContainer(this.container);
    removeGameOverlays(this.container);
    mountGameStage(this.container, this.canvas);
    this.initializeBoard();
    this.initializePlayer();
    if (fromLevel && fromLevel > 1) {
      this.bootstrapProgressionForLevel(fromLevel);
    }
    this.initializeEntities();
    this.showLevelIntro();
    this.mountGameUi();
    this.gameLoop();
  }

  continue() {
    this.started = true;
    this.paused = false;
    this.lastFrameTime = null;
    clearContainer(this.container);
    removeGameOverlays(this.container);
    mountGameStage(this.container, this.canvas);
    this.mountGameUi();
    if (this.rafId) cancelAnimationFrame(this.rafId);
    if (this.levelIntro) {
      const level = levelData.getLevel(this.currentLevel);
      playNarration(level && level.audioId);
    }
    this.gameLoop();
  }

  // ---------------------------------------------------------------------
  // Test hooks
  // The methods below exist so automated (Playwright) tests can build exact
  // scenarios and advance the simulation deterministically. They are not
  // part of regular gameplay and should not be called from game code.
  // ---------------------------------------------------------------------

  // Advance the simulation a fixed number of frames, synchronously and
  // independently of requestAnimationFrame, then render the result
  step(frames = 1, deltaMs = 1000 / 60) {
    if (!this.player) return;
    if (this.levelIntro) this.dismissLevelIntro();
    for (let i = 0; i < frames; i++) {
      if (this.isGameOver) break;
      this.updateGameState(deltaMs);
    }
    if (!this.isGameOver) this.render();
  }

  // Place the player at an exact pixel position
  teleportPlayer(x, y) {
    this.player.setPosition(x, y);
  }

  // Add a guard (or boss) at an exact pixel position
  spawnGuard(x, y, type = "orc1", options = {}) {
    const guard = new Guard(x, y, type, this.assets.guardAssets, options);
    this.guards.push(guard);
    return guard;
  }

  // Jump straight to a given level with a fresh board
  startAtLevel(levelNumber) {
    this.currentLevel = levelNumber;
    this.initializeBoard();
    this.initializePlayer();
    this.initializeEntities();
    this.showLevelIntro();
  }
}

export default Game;
