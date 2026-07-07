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
} from "./utils/settings.js";
import { sfx } from "./utils/sound.js";
import { playNarration, stopNarration } from "./utils/narration.js";
import Player from "./entities/player.js";
import levelData from "./levels/level-data.js";
import { clearContainer } from "./utils/canvas.js";
import { isColliding } from "./utils/game.js";
import { randomInt } from "./utils/rng.js";
import Wall from "./entities/wall.js";
import Explosive from "./entities/explosive.js";
import Guard from "./entities/guard.js";
import Obstacle from "./entities/obstacle.js";
import Powerup, { powerupDescriptions } from "./entities/powerup.js";
import Exit from "./entities/exit.js";
import Drop from "./entities/drop.js";
import Door from "./entities/door.js";
import { itemCatalog, guardDropPool } from "./items.js";
import { resolveThemeAssets } from "./assets/theme-manifest.js";

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
    this.guards = [];
    this.obstacles = [];
    this.powerups = [];
    this.playerStart = { x: 0, y: 0 };
    this.notifications = [];
    this.drops = [];
    this.doors = [];
    this.inventoryOpen = false;
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
    // Remaining time before the player may swing again
    this.attackCooldownMs = 0;
    // Fog of war (per-level option): explored[row][col] persists until the
    // next level; the fog canvas is an offscreen buffer composited per frame
    this.fogEnabled = false;
    this.explored = [];
    this.fogCanvas = null;
    this.levelIntro = null;
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
          if (level.layout[y][x] === "#") {
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
      if (this.levelIntro) {
        event.preventDefault();
        this.dismissLevelIntro();
      }
      // Stop the space bar (and arrow keys) from scrolling the page
      if (event.key === " " || event.key.startsWith("Arrow")) {
        event.preventDefault();
      }
      if (event.key === controlSettings.inventory) {
        this.toggleInventory();
        return;
      }
      // The world is frozen while the inventory is open
      if (this.inventoryOpen) return;
      const direction = directionForKey(event.key);
      if (direction) {
        this.pressedDirections.add(direction);
        return;
      }
      switch (event.key) {
        case controlSettings.attack:
          debounceAction(() => this.playerAttack(), 250)();
          break;
        case controlSettings.pick:
          debounceAction(() => this.playerPick(), 150)();
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
    this.attackCooldownMs = combatSettings.attackCooldownMs;

    this.player.attack();
    sfx.swing();
    if (!this.player.isActionActive("attack")) return;
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

    // Chop down obstacles (trees, boulders) that are struck
    const obstaclesBefore = this.obstacles.length;
    this.obstacles = this.obstacles.filter((obstacle) => {
      if (isColliding(attackBox, obstacle.getHitBox())) {
        obstacle.takeDamage(this.player.attackPower);
        return !obstacle.isDestroyed();
      }
      return true;
    });
    if (this.obstacles.length < obstaclesBefore) sfx.chop();
  }

  playerAxe() {
    if (this.attackCooldownMs > 0) return;
    this.attackCooldownMs = combatSettings.attackCooldownMs;

    this.player.axe();
    sfx.swing();
    if (!this.player.isActionActive("axe")) return;
    const attackBox = this.player.getAttackBox();

    const obstaclesBefore = this.obstacles.length;
    this.obstacles = this.obstacles.filter((obstacle) => {
      if (isColliding(attackBox, obstacle.getHitBox())) {
        obstacle.takeDamage(this.player.attackPower);
        return !obstacle.isDestroyed();
      }
      return true;
    });
    if (this.obstacles.length < obstaclesBefore) sfx.chop();
  }

  // Pick: disarm an armed explosive trap the player is standing near,
  // before its fuse runs out
  playerPick() {
    this.player.pick();
    const playerBox = this.player.getHitBox();
    const px = playerBox.x + playerBox.width / 2;
    const py = playerBox.y + playerBox.height / 2;

    const index = this.explosives.findIndex((explosive) => {
      if (!explosive.isArmed()) return false;
      const center = explosive.getCenter();
      return Math.hypot(px - center.x, py - center.y) <= entitySettings.explosiveTriggerRange;
    });
    if (index === -1) return;

    this.explosives.splice(index, 1);
    this.score += gameSettings.disarmScore;
    sfx.disarm();
    this.notify(`Trap disarmed! +${gameSettings.disarmScore} points`);
  }

  initializeEntities() {
    const level = levelData.getLevel(this.currentLevel);

    if (level) {
      this.explosives = [];
      this.guards = [];
      this.obstacles = [];
      this.powerups = [];
      this.drops = [];

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
              this.guards.push(new Guard(position.x, position.y, `orc${randomOrc}`, this.assets.guardAssets));
              break;
            case "B":
              // A boss: bigger, tougher and harder-hitting than a guard
              this.guards.push(
                new Guard(position.x, position.y, `orc${randomInt(1, 4)}`, this.assets.guardAssets, { boss: true })
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
          }
        }
      }
    }
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
      itemId = guardDropPool[randomInt(1, guardDropPool.length) - 1];
    }
    this.drops.push(new Drop(x, y, itemId, this.assets.itemAssets));
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

  showLevelIntro({ narrate = true } = {}) {
    const level = levelData.getLevel(this.currentLevel);
    if (!level) return;
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
    this.levelIntro = null;
    stopNarration();
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
    this.attackCooldownMs = Math.max(0, this.attackCooldownMs - deltaMs);
    this.applyMovementInput(deltaMs);
    this.revealAroundPlayer();
    this.checkCollisions();
    this.checkPlayerDeath(deltaMs);
    if (this.isGameOver) return;
    this.notifications = this.notifications.filter((n) => {
      n.msLeft -= deltaMs;
      return n.msLeft > 0;
    });
    this.player.update(deltaMs);
    this.updateExplosives(deltaMs);
    // Locked doors block guards (and their line of sight) like walls
    const guardBlockers = [...this.walls, ...this.lockedDoors()];
    this.guards.forEach((guard) => guard.update(this.player.getHitBox(), guardBlockers, deltaMs));
    this.guards = this.guards.filter((guard) => !guard.isReadyToRemove());
    this.obstacles.forEach((obstacle) => obstacle.update());
    this.powerups.forEach((powerup) => powerup.update());
    this.drops.forEach((drop) => drop.update(deltaMs));
    this.checkDoorUnlock();
    this.checkLockedDoorHint();
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

  checkPlayerDeath(deltaMs = 1000 / 60) {
    if (this.player.getHealth() > 0) return;
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
    if (this.lives <= 0) {
      this.player.defeat();
      this.pendingGameOverMs = 700;
      sfx.gameOver();
      return;
    }
    this.player.respawn(this.playerStart.x, this.playerStart.y);
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
        this.notifyOnce("A trap springs — run, or disarm it with 'p'!");
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
        this.player.addItem(drop.getType());
        this.notifyPickup(drop.getType());
        sfx.pickup();
        return false;
      }
      return true;
    });
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

    // Draw the entities
    this.obstacles.forEach((obstacle) => obstacle.draw(this.context));
    this.powerups.forEach((powerup) => powerup.draw(this.context));
    this.drops.forEach((drop) => drop.draw(this.context));
    this.guards.forEach((guard) => guard.draw(this.context));
    this.explosives.forEach((explosive) => explosive.draw(this.context));

    // Draw the exit
    if (this.exit) {
      this.exit.draw(this.context);
    }

    // Draw the player
    this.player.draw(this.context);

    // Fog of war covers the world but never the HUD
    this.drawFog();

    // Draw the HUD on top of everything
    this.drawHUD();

    // The inventory screen covers the frozen world; notifications (e.g.
    // "equipped") stay visible above it
    if (this.inventoryOpen) this.drawInventory();
    this.drawNotifications();
    if (this.levelIntro) this.drawLevelIntro();
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
      { label: "Weapon", slot: "weapon" },
      { label: "Rune", slot: "rune" },
    ].forEach((equip, i) => {
      const x = panelX + 24 + i * 170;
      ctx.font = "bold 14px monospace";
      ctx.fillStyle = "#80d8ff";
      ctx.fillText(equip.label, x, equipY - 12);
      this.drawInventorySlot(x, equipY, slotSize, this.player.equipment[equip.slot], 0);
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
      ctx.fillText("Nothing yet — defeat guards to find weapons, runes and potions.", panelX + 24, gridY + 28);
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
      "Click a weapon or rune to equip it — click a potion to drink it.",
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
    const equipped = item && this.player.equipment[item.kind] === itemId;

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
      item.kind === "weapon" || item.kind === "rune"
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

  drawHUD() {
    const ctx = this.context;
    ctx.save();

    // Background strip
    ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
    ctx.fillRect(8, 8, 452, 40);

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

    // Reminder that the inventory exists
    ctx.font = "14px monospace";
    ctx.fillStyle = "#aaa";
    ctx.fillText("(i)", 412, 28);

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
      this.notifications = this.notifications.filter((n) => {
        n.msLeft -= deltaMs;
        return n.msLeft > 0;
      });
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

  start() {
    // Fresh run: reset all progress
    this.started = true;
    this.paused = false;
    this.isGameOver = false;
    this.lives = playerSettings.initialLives;
    this.score = 0;
    this.currentLevel = gameSettings.initialLevel;
    this.notifications = [];
    this.player = null; // a fresh run starts with an empty pack
    this.inventoryOpen = false;
    this.pendingGameOverMs = null;
    this.attackCooldownMs = 0;
    this.pressedDirections.clear();
    this.lastFrameTime = null;
    if (this.rafId) cancelAnimationFrame(this.rafId);
    clearContainer(this.container);
    this.container.appendChild(this.canvas);
    this.initializeBoard();
    this.initializePlayer();
    this.initializeEntities();
    this.showLevelIntro();
    this.gameLoop();
  }

  continue() {
    this.started = true;
    this.paused = false;
    this.lastFrameTime = null;
    clearContainer(this.container);
    this.container.appendChild(this.canvas);
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
