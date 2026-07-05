import {
  controlSettings,
  canvasSettings,
  playerSettings,
  gameSettings,
  entitySettings,
  levelThemes,
} from "./utils/settings.js";
import Player from "./entities/player.js";
import levelData from "./levels/level-data.js";
import { clearContainer } from "./utils/canvas.js";
import { isColliding } from "./utils/game.js";
import { randomInt, random } from "./utils/rng.js";
import { sfx } from "./utils/sound.js";
import Wall from "./entities/wall.js";
import Explosive from "./entities/explosive.js";
import Guard from "./entities/guard.js";
import Obstacle from "./entities/obstacle.js";
import Powerup from "./entities/powerup.js";
import Exit from "./entities/exit.js";
import Door from "./entities/door.js";
import Key from "./entities/key.js";

// Main game logic
// - Initialize the game board (labyrinth)
// - Handle player input (movement, interactions)
// - Update game state (player position, lives, score)
// - Check for collisions (with obstacles, powerups, explosives, guards)
// - Handle level completion (transition to next level or game over)
// - Render the game board and entities (player, obstacles, powerups, guards)

const POWERUP_TYPES = ["health", "speed", "strength", "invincibility"];

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
    this.currentTheme = "forest";
    this.isGameOver = false;
    this.started = false;
    this.paused = false;
    this.assets = assets;
    this.explosives = [];
    this.guards = [];
    this.obstacles = [];
    this.powerups = [];
    this.doors = [];
    this.keys = [];
    this.playerStart = { x: 0, y: 0 };
    this.onGameOver = callbacks.onGameOver || (() => {});
    this.onLevelCompleted = callbacks.onLevelCompleted || (() => {});
    this.onGameWon = callbacks.onGameWon || (() => {});
    this.rafId = null;
    this.inputSetup = false;
    // Movement keys currently held down; movement is applied once per frame
    // in the game loop so speed is frame-consistent and diagonals work
    this.pressedDirections = new Set();
    this.controlsHintTimer = 0;
  }

  initializeBoard() {
    const level = levelData.getLevel(this.currentLevel);
    if (level) {
      this.walls = [];
      this.exit = null;
      this.board = level.layout;
      this.currentTheme = level.theme || "forest";
      this.controlsHintTimer = gameSettings.controlsHintFrames;
      for (let y = 0; y < level.layout.length; y++) {
        for (let x = 0; x < level.layout[y].length; x++) {
          if (level.layout[y][x] === "#") {
            this.walls.push(
              new Wall(
                x * canvasSettings.cellWidth,
                y * canvasSettings.cellHeight,
                "normal",
                this.assets.levelAssets
              )
            );
          }
          if (level.layout[y][x] === "X") {
            this.exit = new Exit(
              x * canvasSettings.cellWidth,
              y * canvasSettings.cellHeight,
              this.assets.levelAssets,
              this.currentTheme
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
            this.player = new Player(
              this.playerStart.x,
              this.playerStart.y,
              this.assets.playerAssets
            );
            this.setupInput();
            return;
          }
        }
      }
    }
  }

  #keyToDirection(key) {
    switch (key) {
      case controlSettings.up: return "up";
      case controlSettings.down: return "down";
      case controlSettings.left: return "left";
      case controlSettings.right: return "right";
      default: return null;
    }
  }

  setupInput() {
    // Only register the listeners once; initializePlayer runs again on every
    // level change and would otherwise stack duplicate handlers
    if (this.inputSetup) return;
    this.inputSetup = true;

    window.addEventListener("keydown", (event) => {
      if (!this.started || this.paused || this.isGameOver) return;
      // Stop the space bar (and arrow keys) from scrolling the page
      if (event.key === " " || event.key.startsWith("Arrow")) {
        event.preventDefault();
      }

      const direction = this.#keyToDirection(event.key);
      if (direction) {
        // Move once immediately so a quick tap still nudges the player,
        // then keep moving every frame while the key stays held.
        // OS auto-repeat events are ignored — the game loop is the repeater.
        if (!event.repeat) this.movePlayer(direction);
        this.pressedDirections.add(direction);
        return;
      }

      switch (event.key) {
        case controlSettings.attack:
          this.playerAttack(); // cooldown-gated, safe to fire on repeats
          break;
        case controlSettings.pick:
          if (!event.repeat) this.playerPick();
          break;
        case controlSettings.axe:
          if (!event.repeat) this.playerAxe();
          break;
        case controlSettings.potion:
          if (!event.repeat) this.playerDrinkPotion();
          break;
      }
    });

    // Track releases even while paused so keys can't get stuck "down"
    window.addEventListener("keyup", (event) => {
      const direction = this.#keyToDirection(event.key);
      if (direction) this.pressedDirections.delete(direction);
    });

    // Losing window focus never delivers the keyup; clear everything
    window.addEventListener("blur", () => {
      this.pressedDirections.clear();
    });
  }

  // Apply held movement keys, once per frame
  #applyMovementInput() {
    for (const direction of this.pressedDirections) {
      this.movePlayer(direction);
    }
    if (this.pressedDirections.size === 0 && this.player.action === "walk") {
      this.player.action = "idle";
    }
  }

  movePlayer(direction) {
    const next = this.player.checkCollision(direction);
    const hitBox = this.player.getHitBox();
    const current = this.player.getPosition();
    const nextHitBox = {
      x: next.x + (hitBox.x - current.x),
      y: next.y + (hitBox.y - current.y),
      width: hitBox.width,
      height: hitBox.height,
    };

    // Bumping a locked door with a key in hand opens it
    const bumpedDoor = this.doors.find((door) =>
      isColliding(nextHitBox, door.getHitBox())
    );
    if (bumpedDoor && this.player.useKey()) {
      this.doors = this.doors.filter((door) => door !== bumpedDoor);
      sfx.unlock();
    }

    const blocked =
      next.x < 0 ||
      next.y < 0 ||
      next.x > this.canvas.width - canvasSettings.cellWidth ||
      next.y > this.canvas.height - canvasSettings.cellHeight ||
      this.walls.some((wall) => isColliding(nextHitBox, wall.getHitBox())) ||
      this.doors.some((door) => isColliding(nextHitBox, door.getHitBox())) ||
      this.obstacles.some((obstacle) =>
        isColliding(nextHitBox, obstacle.getHitBox())
      );

    if (blocked) {
      // Face the direction anyway so the player can turn in place
      this.player.movement = direction;
      if (this.player.action === "walk") this.player.action = "idle";
      return;
    }

    switch (direction) {
      case "up":
        this.player.moveUp();
        break;
      case "down":
        this.player.moveDown();
        break;
      case "left":
        this.player.moveLeft();
        break;
      case "right":
        this.player.moveRight();
        break;
    }
  }

  playerAttack() {
    // attack() returns false while the previous swing is cooling down
    if (!this.player.attack()) return;
    sfx.swing();
    const attackBox = this.player.getAttackBox();

    // Damage guards caught in the swing; defeated guards stay in the list
    // until their death animation finishes (cleaned up in updateGameState)
    let hitSomething = false;
    this.guards.forEach((guard) => {
      if (guard.isDefeated()) return;
      if (isColliding(attackBox, guard.getHitBox())) {
        hitSomething = true;
        const defeated = guard.takeDamage(this.player.attackPower);
        if (defeated) this.#onGuardDefeated(guard);
      }
    });

    // Chop down obstacles (trees, boulders) that are struck
    this.obstacles = this.obstacles.filter((obstacle) => {
      if (isColliding(attackBox, obstacle.getHitBox())) {
        hitSomething = true;
        obstacle.takeDamage(this.player.attackPower);
        return !obstacle.isDestroyed();
      }
      return true;
    });

    if (hitSomething) sfx.hit();
  }

  // Axe swing: instantly destroys obstacles in front (but never hurts guards)
  playerAxe() {
    if (!this.player.axe()) return;
    const attackBox = this.player.getAttackBox();
    const before = this.obstacles.length;
    this.obstacles = this.obstacles.filter(
      (obstacle) => !isColliding(attackBox, obstacle.getHitBox())
    );
    if (this.obstacles.length < before) sfx.chop();
  }

  // Pick: disarm a revealed (armed) explosive the player is standing near
  playerPick() {
    this.player.pick();
    const playerBox = this.player.getHitBox();
    const px = playerBox.x + playerBox.width / 2;
    const py = playerBox.y + playerBox.height / 2;
    const index = this.explosives.findIndex((explosive) => {
      if (!explosive.isArmed()) return false;
      const center = explosive.getCenter();
      return Math.hypot(px - center.x, py - center.y) <= canvasSettings.cellWidth * 1.25;
    });
    if (index === -1) return;
    this.explosives.splice(index, 1);
    this.score += gameSettings.disarmScore;
    sfx.disarm();
  }

  playerDrinkPotion() {
    if (this.player.potion()) sfx.gulp();
  }

  #onGuardDefeated(guard) {
    this.score += guard.isBoss ? gameSettings.bossScore : gameSettings.scoreIncrement;
    sfx.guardDown();
    // Defeated guards sometimes drop a powerup where they fell
    if (random() < gameSettings.guardDropChance) {
      const position = guard.getPosition();
      const dropTypes = [...POWERUP_TYPES, "potion"];
      this.powerups.push(
        new Powerup(
          position.x,
          position.y,
          dropTypes[randomInt(0, dropTypes.length - 1)],
          this.assets.powerupsAssets
        )
      );
    }
  }

  initializeEntities() {
    const level = levelData.getLevel(this.currentLevel);

    if (level) {
      this.explosives = [];
      this.guards = [];
      this.obstacles = [];
      this.powerups = [];
      this.doors = [];
      this.keys = [];

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
            case "D":
              this.doors.push(new Door(position.x, position.y));
              break;
            case "K":
              this.keys.push(new Key(position.x, position.y));
              break;
            case "G": {
              const randomOrc = randomInt(1, 3);
              this.guards.push(new Guard(position.x, position.y, `orc${randomOrc}`, this.assets.guardAssets));
              break;
            }
            case "B":
              this.guards.push(new Guard(position.x, position.y, "boss", this.assets.guardAssets));
              break;
            case "O":
              this.obstacles.push(
                new Obstacle(position.x, position.y, "boulder", this.assets.levelAssets, level.theme)
              );
              break;
            case "T":
              this.obstacles.push(
                new Obstacle(position.x, position.y, "tree", this.assets.levelAssets, level.theme)
              );
              break;
            case "C": {
              const type = POWERUP_TYPES[randomInt(0, POWERUP_TYPES.length - 1)];
              this.powerups.push(
                new Powerup(position.x, position.y, type, this.assets.powerupsAssets)
              );
              break;
            }
          }
        }
      }
    }
  }

  updateGameState() {
    this.#applyMovementInput();
    this.updateExplosives();
    this.checkCollisions();
    this.checkPlayerDeath();
    if (this.isGameOver) return;
    this.player.update();
    const guardBlockers = [...this.walls, ...this.doors];
    this.guards.forEach((guard) => guard.update(this.player.getHitBox(), guardBlockers));
    // Remove corpses whose death animation has finished
    this.guards = this.guards.filter((guard) => !guard.isReadyToRemove());
    this.obstacles.forEach((obstacle) => obstacle.update());
    this.powerups.forEach((powerup) => powerup.update());
    this.keys.forEach((key) => key.update());
    if (this.controlsHintTimer > 0) this.controlsHintTimer--;
    this.checkLevelCompletion();
  }

  updateExplosives() {
    const playerHitBox = this.player.getHitBox();
    this.explosives.forEach((explosive) => {
      const wasHidden = explosive.isHidden();
      explosive.update(playerHitBox);
      if (wasHidden && explosive.isArmed()) sfx.fuse();

      // Apply the blast exactly once, on the frame the fuse runs out
      const blast = explosive.consumeBlast();
      if (!blast) return;
      sfx.explosion();

      const inBlast = (box) => {
        const cx = box.x + box.width / 2;
        const cy = box.y + box.height / 2;
        return Math.hypot(cx - blast.x, cy - blast.y) <= blast.radius;
      };

      if (inBlast(playerHitBox)) {
        this.player.takeDamage(entitySettings.explosivePlayerDamage);
      }
      this.guards.forEach((guard) => {
        if (guard.isDefeated()) return;
        if (inBlast(guard.getHitBox())) {
          const defeated = guard.takeDamage(entitySettings.explosiveGuardDamage);
          if (defeated) this.#onGuardDefeated(guard);
        }
      });
    });
    this.explosives = this.explosives.filter((explosive) => !explosive.isDone());
  }

  checkPlayerDeath() {
    if (this.player.getHealth() > 0) return;
    this.lives -= 1;
    if (this.lives <= 0) {
      this.isGameOver = true;
      this.started = false;
      sfx.gameOver();
      this.onGameOver(this.score);
      return;
    }
    this.player.respawn(this.playerStart.x, this.playerStart.y);
  }

  checkCollisions() {
    const playerPosition = this.player.getHitBox();

    const healthBefore = this.player.getHealth();
    this.guards.forEach((guard) => {
      if (guard.isDefeated()) return;
      if (isColliding(playerPosition, guard.getHitBox())) {
        this.player.takeDamage(guard.damage);
      }
    });
    if (this.player.getHealth() < healthBefore) sfx.hurt();

    const pickupRange = this.player.getPickupRange();
    this.keys = this.keys.filter((key) => {
      if (!isColliding(pickupRange, key.getHitBox())) return true;
      if (key.collect()) {
        this.player.collectKey();
        this.score += gameSettings.powerupScore;
        sfx.pickup();
      }
      return false;
    });

    this.powerups = this.powerups.filter((powerup) => {
      if (!isColliding(pickupRange, powerup.getHitBox())) return true;
      const effect = powerup.collect();
      if (effect) {
        this.player.applyPowerup(effect);
        this.score += gameSettings.powerupScore;
        sfx.pickup();
      }
      return false;
    });
  }

  checkLevelCompletion() {
    if (!this.isLevelComplete()) return;

    this.score += gameSettings.levelBonus * this.currentLevel;
    sfx.levelComplete();

    const nextLevel = levelData.getLevel(this.currentLevel + 1);
    if (nextLevel) {
      const carriedPotions = this.player.potions; // keys stay behind, potions travel
      this.currentLevel += 1;
      this.initializeBoard();
      this.initializePlayer();
      this.player.potions = carriedPotions;
      this.initializeEntities();
      this.pause();
      this.onLevelCompleted(this.score);
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

    // Draw the walls
    this.walls.forEach((wall) => wall.draw(this.context));

    // Draw the entities
    this.obstacles.forEach((obstacle) => obstacle.draw(this.context));
    this.powerups.forEach((powerup) => powerup.draw(this.context));
    this.doors.forEach((door) => door.draw(this.context));
    this.keys.forEach((key) => key.draw(this.context));
    this.guards.forEach((guard) => guard.draw(this.context));
    this.explosives.forEach((explosive) => explosive.draw(this.context));

    // Draw the exit
    if (this.exit) {
      this.exit.draw(this.context);
    }

    // Draw the player
    this.player.draw(this.context);

    // Draw the HUD on top of everything
    this.drawHUD();
  }

  drawHUD() {
    const ctx = this.context;
    ctx.save();

    // Background strip
    ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
    ctx.fillRect(8, 8, 470, 40);

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

    // Level indicator
    ctx.fillStyle = "#fff";
    ctx.fillText(`Lv ${this.currentLevel}/${levelData.getLevelCount()}`, 310, 28);

    // Active powerup effects with seconds remaining
    const effectLabels = { speed: "SPD", strength: "STR", invincibility: "INV" };
    const effectColors = { speed: "#42a5f5", strength: "#66bb6a", invincibility: "#ffd54f" };
    let effectX = 388;
    for (const [name, frames] of Object.entries(this.player.getActiveEffects())) {
      ctx.fillStyle = effectColors[name] || "#fff";
      ctx.fillText(`${effectLabels[name] || name} ${Math.ceil(frames / 60)}`, effectX, 28);
      effectX += 62;
    }

    // Inventory (keys and potions), top-right
    ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
    ctx.fillRect(this.canvas.width - 168, 8, 160, 40);
    ctx.font = "bold 18px monospace";
    ctx.fillStyle = "#ffd54f";
    ctx.fillText(`Keys:${this.player.keys}`, this.canvas.width - 158, 28);
    ctx.fillStyle = "#ef9a9a";
    ctx.fillText(`Pot:${this.player.potions}`, this.canvas.width - 78, 28);

    // Controls hint, shown briefly at the start of each level
    if (this.controlsHintTimer > 0) {
      const alpha = Math.min(1, this.controlsHintTimer / 60);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
      ctx.fillRect(8, this.canvas.height - 40, 700, 32);
      ctx.fillStyle = "#fff";
      ctx.font = "16px monospace";
      ctx.fillText(
        "Arrows move · Space attack · X axe · P disarm trap · U potion · Esc menu",
        16,
        this.canvas.height - 24
      );
      ctx.globalAlpha = 1;
    }

    ctx.restore();
  }

  drawGrid() {
    const theme = levelThemes[this.currentTheme] || levelThemes.forest;

    // Create a gradient for the background
    const gradient = this.context.createRadialGradient(
      this.canvas.width / 2, this.canvas.height / 2, 0,
      this.canvas.width / 2, this.canvas.height / 2, Math.max(this.canvas.width, this.canvas.height) / 2
    );
    gradient.addColorStop(0, theme.center);
    gradient.addColorStop(1, theme.edge);

    // Fill background with gradient
    this.context.fillStyle = gradient;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Set grid style
    this.context.strokeStyle = theme.grid;
    this.context.lineWidth = 1;

    // Draw grid lines
    this.context.beginPath();

    // Vertical lines
    for (let x = 0; x <= this.canvas.width; x += canvasSettings.cellWidth) {
      this.context.moveTo(x, 0);
      this.context.lineTo(x, this.canvas.height);
    }

    // Horizontal lines
    for (let y = 0; y <= this.canvas.height; y += canvasSettings.cellHeight) {
      this.context.moveTo(0, y);
      this.context.lineTo(this.canvas.width, y);
    }

    this.context.stroke();
  }

  gameLoop() {
    // Main game loop
    if (this.isGameOver || this.paused) return;
    this.updateGameState();
    if (this.isGameOver || this.paused) return;
    this.render();
    this.rafId = requestAnimationFrame(this.gameLoop.bind(this));
  }

  pause() {
    this.paused = true;
    this.pressedDirections.clear();
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
    this.pressedDirections.clear();
    if (this.rafId) cancelAnimationFrame(this.rafId);
    clearContainer(this.container);
    this.container.appendChild(this.canvas);
    this.initializeBoard();
    this.initializePlayer();
    this.initializeEntities();
    this.gameLoop();
  }

  continue() {
    this.started = true;
    this.paused = false;
    clearContainer(this.container);
    this.container.appendChild(this.canvas);
    if (this.rafId) cancelAnimationFrame(this.rafId);
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
  step(frames = 1) {
    if (!this.player) return;
    for (let i = 0; i < frames; i++) {
      if (this.isGameOver) break;
      this.updateGameState();
    }
    if (!this.isGameOver) this.render();
  }

  // Place the player at an exact pixel position
  teleportPlayer(x, y) {
    this.player.setPosition(x, y);
  }

  // Add a guard at an exact pixel position
  spawnGuard(x, y, type = "orc1") {
    const guard = new Guard(x, y, type, this.assets.guardAssets);
    this.guards.push(guard);
    return guard;
  }

  // Jump straight to a given level with a fresh board
  startAtLevel(levelNumber) {
    this.currentLevel = levelNumber;
    this.initializeBoard();
    this.initializePlayer();
    this.initializeEntities();
  }
}

export default Game;
