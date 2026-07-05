import {
  controlSettings,
  canvasSettings,
  playerSettings,
  gameSettings,
} from "./utils/settings.js";
import Player from "./entities/player.js";
import levelData from "./levels/level-data.js";
import { clearContainer } from "./utils/canvas.js";
import { isColliding } from "./utils/game.js";
import { randomInt } from "./utils/rng.js";
import Wall from "./entities/wall.js";
import Explosive from "./entities/explosive.js";
import Guard from "./entities/guard.js";
import Obstacle from "./entities/obstacle.js";
import Powerup from "./entities/powerup.js";
import Exit from "./entities/exit.js";

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
    this.explosives = [];
    this.guards = [];
    this.obstacles = [];
    this.powerups = [];
    this.playerStart = { x: 0, y: 0 };
    this.onGameOver = callbacks.onGameOver || (() => {});
    this.onLevelCompleted = callbacks.onLevelCompleted || (() => {});
    this.onGameWon = callbacks.onGameWon || (() => {});
    this.rafId = null;
    this.inputSetup = false;
  }

  initializeBoard() {
    const level = levelData.getLevel(this.currentLevel);
    if (level) {
      this.walls = [];
      this.exit = null;
      this.board = level.layout;
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
              this.assets.levelAssets
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
          this.player.action = "idle";
        }, delay);
        callback();
      };
    };

    window.addEventListener("keydown", (event) => {
      if (!this.started || this.paused || this.isGameOver) return;
      // Stop the space bar (and arrow keys) from scrolling the page
      if (event.key === " " || event.key.startsWith("Arrow")) {
        event.preventDefault();
      }
      switch (event.key) {
        case controlSettings.up:
          debounceAction(() => this.movePlayer("up"), 1000)();
          break;
        case controlSettings.down:
          debounceAction(() => this.movePlayer("down"), 1000)();
          break;
        case controlSettings.left:
          debounceAction(() => this.movePlayer("left"), 1000)();
          break;
        case controlSettings.right:
          debounceAction(() => this.movePlayer("right"), 1000)();
          break;
        case controlSettings.attack:
          debounceAction(() => this.playerAttack(), 250)();
          break;
        case controlSettings.pick:
          debounceAction(() => this.player.pick(), 150)();
          break;
        case controlSettings.axe:
          debounceAction(() => this.player.axe(), 150)();
          break;
        case controlSettings.potion:
          debounceAction(() => this.player.potion(), 500)();
          break;
      }
    });
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

    const blocked =
      next.x < 0 ||
      next.y < 0 ||
      next.x > this.canvas.width - canvasSettings.cellWidth ||
      next.y > this.canvas.height - canvasSettings.cellHeight ||
      this.walls.some((wall) => isColliding(nextHitBox, wall.getHitBox())) ||
      this.obstacles.some((obstacle) =>
        isColliding(nextHitBox, obstacle.getHitBox())
      );

    if (blocked) {
      // Face the direction anyway so the player can turn in place
      this.player.movement = direction;
      this.player.action = "idle";
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
    this.player.attack();
    const attackBox = this.player.getAttackBox();

    // Damage guards caught in the swing and remove any that are defeated
    this.guards = this.guards.filter((guard) => {
      if (isColliding(attackBox, guard.getHitBox())) {
        const defeated = guard.takeDamage(this.player.attackPower);
        if (defeated) {
          this.score += gameSettings.scoreIncrement;
          return false;
        }
      }
      return true;
    });

    // Chop down obstacles (trees, boulders) that are struck
    this.obstacles = this.obstacles.filter((obstacle) => {
      if (isColliding(attackBox, obstacle.getHitBox())) {
        obstacle.takeDamage(this.player.attackPower);
        return !obstacle.isDestroyed();
      }
      return true;
    });
  }

  initializeEntities() {
    const level = levelData.getLevel(this.currentLevel);

    if (level) {
      this.explosives = [];
      this.guards = [];
      this.obstacles = [];
      this.powerups = [];

      for (let y = 0; y < level.layout.length; y++) {
        for (let x = 0; x < level.layout[y].length; x++) {
          const cell = level.layout[y][x];
          const position = {
            x: x * canvasSettings.cellWidth,
            y: y * canvasSettings.cellHeight,
          };

          switch (cell) {
            case "E":
              this.explosives.push(
                new Explosive(position.x, position.y, this.assets)
              );
              break;
            case "G":
              const randomOrc = randomInt(1, 3);
              this.guards.push(new Guard(position.x, position.y, `orc${randomOrc}`, this.assets.guardAssets));
              break;
            case "O":
              this.obstacles.push(
                new Obstacle(position.x, position.y, "boulder", this.assets.levelAssets)
              );
              break;
            case "T":
              this.obstacles.push(
                new Obstacle(position.x, position.y, "tree", this.assets.levelAssets)
              );
              break;
            case "C":
              const randomPowerup = randomInt(1, 2);
              this.powerups.push(
                new Powerup(position.x, position.y, randomPowerup == 1 ? "health" : "mana", this.assets.powerupsAssets)
              );
              break;
          }
        }
      }
    }
  }

  updateGameState() {
    this.checkCollisions();
    this.checkPlayerDeath();
    if (this.isGameOver) return;
    this.player.update();
    this.explosives.forEach((explosive) => explosive.update());
    this.guards.forEach((guard) => guard.update(this.player.getHitBox(), this.walls));
    this.obstacles.forEach((obstacle) => obstacle.update());
    this.powerups.forEach((powerup) => powerup.update());
    this.checkLevelCompletion();
  }

  checkPlayerDeath() {
    if (this.player.getHealth() > 0) return;
    this.lives -= 1;
    if (this.lives <= 0) {
      this.isGameOver = true;
      this.started = false;
      this.onGameOver(this.score);
      return;
    }
    this.player.respawn(this.playerStart.x, this.playerStart.y);
  }

  checkCollisions() {
    const playerPosition = this.player.getHitBox();

    this.explosives.forEach((explosive, index) => {
      if (isColliding(playerPosition, explosive.getHitBox())) {
        if (explosive.isActive()) {
          // Handle player damage
        } else if (!explosive.isHidden()) {
          this.player.collectExplosive(explosive);
          this.explosives.splice(index, 1);
        }
      }
    });

    this.guards.forEach((guard) => {
      if (isColliding(playerPosition, guard.getHitBox())) {
        this.player.takeDamage(guard.damage);
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
        this.powerups.splice(index, 1);
        this.score += gameSettings.scoreIncrement;
      }
    });
  }

  checkLevelCompletion() {
    if (!this.isLevelComplete()) return;

    this.score += gameSettings.scoreIncrement;

    const nextLevel = levelData.getLevel(this.currentLevel + 1);
    if (nextLevel) {
      this.currentLevel += 1;
      this.initializeBoard();
      this.initializePlayer();
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
    ctx.fillRect(8, 8, 300, 40);

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

    ctx.restore();
  }

  drawGrid() {
    // Create a gradient for the background
    const gradient = this.context.createRadialGradient(
      this.canvas.width / 2, this.canvas.height / 2, 0,
      this.canvas.width / 2, this.canvas.height / 2, Math.max(this.canvas.width, this.canvas.height) / 2
    );
    gradient.addColorStop(0, '#3E8948');  // Center color (lighter green)
    gradient.addColorStop(1, '#1A3B1F');  // Edge color (darker green)

    // Fill background with gradient
    this.context.fillStyle = gradient;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Set grid style
    this.context.strokeStyle = 'rgba(0, 255, 0, 0.1)';
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
