import Entity from "./entity.js";
import { canvasSettings, entitySettings } from "../utils/settings.js";
import { isColliding } from "../utils/game.js";

// Guard entity class
// - Represents the guards in the game
// - Can move towards the player
// - Can detect the player's position
// - Can attack the player
// - Can be defeated by the player
// - Can drop powerups when defeated
// - Can drop explosives when defeated
// - Can drop keys when defeated
// - Can drop keys when defeated

class Guard extends Entity {
  #speed;
  #detectionRange;
  #currentSprite;

  constructor(x, y, type, assets) {
    super(
      x,
      y,
      type,
      assets,
      entitySettings.enemyWidth,
      entitySettings.enemyHeight
    );
    this.action = "idle";
    this.movement = ["down", "up", "left", "right"][
      Math.floor(Math.random() * 4)
    ];
    this.damage = 10;
    this.#speed = 1;
    this.#detectionRange = 5 * canvasSettings.cellWidth;
    this.#currentSprite = this._sprites.idle;
    this.frameCount = 0;
    this.currentFrame = 0;
  }

  selectSprites(assets) {
    return {
      attack: assets[`${this._type}_Attack`],
      death: assets[`${this._type}_Death`],
      hurt: assets[`${this._type}_Hurt`],
      idle: assets[`${this._type}_Idle`],
      run: assets[`${this._type}_Run`],
      runAttack: assets[`${this._type}_Run_Attack`],
      walk: assets[`${this._type}_Walk`],
      walkAttack: assets[`${this._type}_Walk_Attack`],
    };
  }

  moveTowards(target, walls) {
    const dx = target.x - this._position.x;
    const dy = target.y - this._position.y;

    // Determine primary direction
    if (Math.abs(dx) > Math.abs(dy)) {
      this.movement = dx > 0 ? "right" : "left";
    } else {
      this.movement = dy > 0 ? "down" : "up";
    }

    // Check if movement is possible (not blocked by a wall)
    const nextPosition = { ...this._position, width: canvasSettings.cellWidth / 2, height: canvasSettings.cellHeight / 2 };
    switch (this.movement) {
      case "up":
        nextPosition.y -= this.#speed;
        break;
      case "down":
        nextPosition.y += this.#speed;
        break;
      case "left":
        nextPosition.x -= this.#speed;
        break;
      case "right":
        nextPosition.x += this.#speed;
        break;
    }

    const willCollideWithWalls = walls.some((wall) =>
      isColliding(nextPosition, wall.getHitBox())
    );

    const willCollideWithPlayer = isColliding(nextPosition, target);
    if (willCollideWithPlayer) {
      // Determine guard's facing direction based on target position
      if (Math.abs(dx) > Math.abs(dy)) {
        this.movement = dx > 0 ? "right" : "left";
      } else {
        this.movement = dy > 0 ? "down" : "up";
      }
      this.attack();

    } else if (!willCollideWithWalls) {
      this._position = nextPosition;
      this.walk();
    } else {
      this.idle();
    }
  }

  detectPlayer(playerPosition, walls) {
    const dx = playerPosition.x - this._position.x;
    const dy = playerPosition.y - this._position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= this.#detectionRange) {
      // Check if there's a clear line of sight
      const step = {
        x: dx / distance,
        y: dy / distance,
      };

      let checkPosition = {
        ...this._position,
        width: canvasSettings.cellWidth / 2,
        height: canvasSettings.cellHeight / 2,
      };
      for (let i = 0; i < distance; i += canvasSettings.cellWidth / 2) {
        checkPosition.x += step.x * (canvasSettings.cellWidth / 2);
        checkPosition.y += step.y * (canvasSettings.cellWidth / 2);

        if (
          walls.some((wall) => isColliding(checkPosition, wall.getHitBox()))
        ) {
          return false; // Wall blocking the line of sight
        }
      }
      return true; // Clear line of sight to the player
    }
    return false; // Player out of detection range
  }

  idle() {
    this.action = "idle";
    this.#currentSprite = this._sprites.idle;
  }

  walk() {
    this.action = "walk";
    this.#currentSprite = this._sprites.walk;
  }

  attack() {
    this.action = "attack";
    this.#currentSprite = this._sprites.attack;
  }

  defeat() {
    this.action = "dead";
    this.#currentSprite = this._sprites.death;
    // Return dropped items (powerups, explosives, keys)
  }

  lookAround() {
    this.action = "idle";
    this.#currentSprite = this._sprites.idle;
    const directions = ['up', 'right', 'down', 'left'];
    const currentIndex = directions.indexOf(this.movement);
    if (currentIndex !== -1) {
      this.movement = directions[(currentIndex + 1) % 4];
    } else {
      this.movement = 'up';
    }
  }

  update(playerPosition, walls) {
    const frames_per_action = 4;
    const frames_per_look =  60*3; // Look around every 60 frames (about 1 second at 60 FPS)
    const max_frame_count = this.action === 'idle' ? 60*3 : 20; 
    this.frameCount++;
    if (this.frameCount >= max_frame_count) {
      this.frameCount = 0;
      this.currentFrame = (this.currentFrame + 1) % frames_per_action;
    }

    if (this.detectPlayer(playerPosition, walls)) {
      this.moveTowards(playerPosition, walls);
    } else {
      if (this.frameCount % frames_per_look === 0) {
        this.lookAround();
      } else {
        this.idle();
      }
    }
  }

  draw(ctx) {
    let spriteHeight = 64;
    let spriteWidth = 64;
    let spriteX = this.currentFrame * spriteWidth;
    let spriteY = 0;

    // Determine spriteY based on movement direction
    switch (this.movement) {
      case "down":
        spriteY = 0 * spriteHeight;
        break;
     case "up":
        spriteY = 1 * spriteHeight;
        break;
      case "left":
        spriteY = 2 * spriteHeight;
        break;
      case "right":
        spriteY = 3 * spriteHeight;
        break;
      
    }

    ctx.drawImage(
        this.#currentSprite,
        spriteX,
        spriteY,
        spriteWidth,
        spriteHeight,
        this._position.x - 10,
        this._position.y - 10,
        this._width,
        this._height
      );
  }
}

export default Guard;
