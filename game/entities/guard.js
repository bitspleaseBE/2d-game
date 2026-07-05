import Entity from "./entity.js";
import { canvasSettings, entitySettings } from "../utils/settings.js";
import { isColliding } from "../utils/game.js";
import { randomInt } from "../utils/rng.js";

// Guard entity class
// - Represents the guards in the game
// - Can move towards the player
// - Can detect the player's position
// - Can attack the player
// - Can be defeated by the player (plays its death animation, then is removed)
// - The 'boss' type is a bigger, tougher guard that protects the final exit

const DEATH_ANIMATION_FRAMES = 40; // how long the death animation plays
const HURT_ANIMATION_FRAMES = 15; // how long the hurt sprite is held

class Guard extends Entity {
  #speed;
  #detectionRange;
  #currentSprite;
  #health;
  #hurtTimer = 0;
  #deathTimer = 0;

  constructor(x, y, type, assets) {
    const isBoss = type === "boss";
    super(
      x,
      y,
      type,
      assets,
      isBoss ? entitySettings.bossWidth : entitySettings.enemyWidth,
      isBoss ? entitySettings.bossHeight : entitySettings.enemyHeight
    );
    this.isBoss = isBoss;
    this.action = "idle";
    this.movement = ["down", "up", "left", "right"][randomInt(0, 3)];
    this.damage = isBoss ? 20 : 10;
    this.#health = isBoss ? 300 : 100;
    this.#speed = isBoss ? 1.5 : 1;
    this.#detectionRange = (isBoss ? 7 : 5) * canvasSettings.cellWidth;
    this.#currentSprite = this._sprites.idle;
    this.frameCount = 0;
    this.currentFrame = 0;
  }

  selectSprites(assets) {
    // The boss reuses the orc3 sheets, drawn larger
    const sheet = this._type === "boss" ? "orc3" : this._type;
    return {
      attack: assets[`${sheet}_Attack`],
      death: assets[`${sheet}_Death`],
      hurt: assets[`${sheet}_Hurt`],
      idle: assets[`${sheet}_Idle`],
      run: assets[`${sheet}_Run`],
      runAttack: assets[`${sheet}_Run_Attack`],
      walk: assets[`${sheet}_Walk`],
      walkAttack: assets[`${sheet}_Walk_Attack`],
    };
  }

  // The sprite sheet has generous transparent padding; shrink the hitbox to
  // the orc's body so contact damage only triggers when sprites visibly touch
  getHitBox() {
    const inset = this._width * 0.25;
    return {
      x: this._position.x + inset * 0.5,
      y: this._position.y + inset * 0.5,
      width: this._width - inset * 2,
      height: this._height - inset * 2,
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

  hurt() {
    this.action = "hurt";
    this.#currentSprite = this._sprites.hurt;
    this.#hurtTimer = HURT_ANIMATION_FRAMES;
  }

  // Apply damage from the player. Returns true when the guard is defeated.
  takeDamage(amount) {
    if (this.#health <= 0) return false;
    this.#health -= amount;
    if (this.#health <= 0) {
      this.defeat();
      return true;
    }
    this.hurt();
    return false;
  }

  isDefeated() {
    return this.#health <= 0;
  }

  // True once the death animation has finished and the corpse can be removed
  isReadyToRemove() {
    return this.isDefeated() && this.#deathTimer <= 0;
  }

  defeat() {
    this.action = "dead";
    this.#currentSprite = this._sprites.death;
    this.currentFrame = 0;
    this.frameCount = 0;
    this.#deathTimer = DEATH_ANIMATION_FRAMES;
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

    // Dead: only advance the death animation until it finishes
    if (this.isDefeated()) {
      if (this.#deathTimer > 0) {
        this.#deathTimer--;
        this.frameCount++;
        if (this.frameCount >= 10 && this.currentFrame < frames_per_action - 1) {
          this.frameCount = 0;
          this.currentFrame++;
        }
      }
      return;
    }

    // Freshly hurt: hold the hurt sprite briefly so the hit reads on screen
    if (this.#hurtTimer > 0) {
      this.#hurtTimer--;
      return;
    }

    const frames_per_look =  60*3; // Look around every ~3 seconds at 60 FPS
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

    // Fade the corpse out as the death animation ends
    ctx.save();
    if (this.isDefeated() && this.#deathTimer < 15) {
      ctx.globalAlpha = Math.max(0, this.#deathTimer / 15);
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
    ctx.restore();

    // Boss health bar so the fight has readable progress
    if (this.isBoss && !this.isDefeated()) {
      const barWidth = this._width - 30;
      const x = this._position.x + 5;
      const y = this._position.y - 18;
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(x, y, barWidth, 8);
      ctx.fillStyle = '#c62828';
      ctx.fillRect(x, y, (this.#health / 300) * barWidth, 8);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, barWidth, 8);
      ctx.restore();
    }
  }
}

export default Guard;
