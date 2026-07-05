import Entity from './entity.js';
import { canvasSettings, playerSettings } from "../utils/settings.js";

class Player extends Entity {
  #health;
  #hurtTimer = 0; // frames of invulnerability left after a hit
  #attackCooldown = 0; // frames until the next swing is allowed
  #attackAnimTimer = 0; // frames the attack animation keeps playing
  #actionTimer = 0; // frames a transient action (pick/axe/potion) keeps playing
  // Timed powerup effects, in frames remaining
  #effects = { speed: 0, strength: 0, invincibility: 0 };

  constructor(x, y, assets) {
    super(x, y, 'player', assets);
    this.#health = 100;

    this.currentFrame = 0;
    this.frameCount = 0;
    this.movement = "down";
    this.action = "idle";
    this.visible = true;
  }

  selectSprites(assets) {
    return {
      movement: assets.playerMovement,
      actions: assets.playerActions
    };
  }

  getSpeed() {
    return playerSettings.speed + (this.#effects.speed > 0 ? 3 : 0);
  }

  get attackPower() {
    return playerSettings.attackPower * (this.#effects.strength > 0 ? 2 : 1);
  }

  canAttack() {
    return this.#attackCooldown <= 0;
  }

  // Remaining frames per active effect, for the HUD
  getActiveEffects() {
    const active = {};
    for (const [name, frames] of Object.entries(this.#effects)) {
      if (frames > 0) active[name] = frames;
    }
    return active;
  }

  isInvincible() {
    return this.#effects.invincibility > 0;
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

  // Area in front of the player that an attack sweeps over
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

  takeDamage(amount) {
    // Ignore hits during the invulnerability window after being hurt,
    // or while an invincibility powerup is active
    if (this.#hurtTimer > 0 || this.#health <= 0 || this.isInvincible()) return;
    this.#health -= amount;
    this.#hurtTimer = playerSettings.hurtDuration;
  }

  respawn(x, y) {
    this._position = { x, y };
    this.#health = 100;
    this.#hurtTimer = 0;
    this.#attackCooldown = 0;
    this.#attackAnimTimer = 0;
    this.#actionTimer = 0;
    this.#effects = { speed: 0, strength: 0, invincibility: 0 };
    this.visible = true;
    this.action = "idle";
    this.movement = "down";
  }

  // Walking must not stomp an attack/pick animation that is still playing
  #setWalk() {
    if (this.#attackAnimTimer <= 0 && this.#actionTimer <= 0) {
      this.action = "walk";
    }
  }

  moveLeft() {
    this._position.x -= this.getSpeed();
    this.#setWalk();
    this.movement = "left";
  }

  moveRight() {
    this._position.x += this.getSpeed();
    this.#setWalk();
    this.movement = "right";
  }

  moveUp() {
    this._position.y -= this.getSpeed();
    this.#setWalk();
    this.movement = "up";
  }

  moveDown() {
    this._position.y += this.getSpeed();
    this.#setWalk();
    this.movement = "down";
  }

  // Starts a swing. Returns false while the previous swing is still cooling
  // down, so callers know not to apply damage.
  attack() {
    if (!this.canAttack()) return false;
    this.action = "attack";
    this.currentFrame = 0;
    this.#attackCooldown = playerSettings.attackCooldown;
    this.#attackAnimTimer = Math.min(16, playerSettings.attackCooldown);
    return true;
  }

  #transientAction(action) {
    this.action = action;
    this.currentFrame = 0;
    this.#actionTimer = 30;
  }

  pick() {
    this.#transientAction("pick");
  }

  axe() {
    this.#transientAction("axe");
  }

  potion() {
    this.#transientAction("potion");
  }

  applyPowerup(effect) {
    switch (effect) {
      case "health":
        this.#health = Math.min(100, this.#health + 25);
        break;
      case "speed":
      case "strength":
      case "invincibility":
        this.#effects[effect] = playerSettings.effectDuration;
        break;
    }
  }

  update() {
    // Tick down timers
    if (this.#attackCooldown > 0) this.#attackCooldown--;
    if (this.#attackAnimTimer > 0) {
      this.#attackAnimTimer--;
      if (this.#attackAnimTimer === 0 && this.action === "attack") this.action = "idle";
    }
    if (this.#actionTimer > 0) {
      this.#actionTimer--;
      if (this.#actionTimer === 0 && ["pick", "axe", "potion"].includes(this.action)) {
        this.action = "idle";
      }
    }
    for (const name of Object.keys(this.#effects)) {
      if (this.#effects[name] > 0) this.#effects[name]--;
    }

    // Hurt flicker, frame-based so it pauses with the game and works with
    // the deterministic step() test hook
    if (this.#hurtTimer > 0) {
      this.#hurtTimer--;
      this.visible = Math.floor(this.#hurtTimer / 6) % 2 === 0;
      if (this.#hurtTimer === 0) this.visible = true;
    }

    // Advance the sprite animation
    this.frameCount++;
    if (this.frameCount >= 10) {
      let frames_per_action = 6;
      if (this.action === "attack" || this.action === "duck") {
        frames_per_action = 4;
      } else if (["pick", "axe", "potion"].includes(this.action)) {
        frames_per_action = 4;
      }
      this.currentFrame = (this.currentFrame + 1) % frames_per_action;
      this.frameCount = 0;
    }
  }

  // Add a new method to check for collisions before moving
  checkCollision(direction) {
    const nextPosition = { ...this._position };
    switch (direction) {
      case 'left':
        nextPosition.x -= this.getSpeed();
        break;
      case 'right':
        nextPosition.x += this.getSpeed();
        break;
      case 'up':
        nextPosition.y -= this.getSpeed();
        break;
      case 'down':
        nextPosition.y += this.getSpeed();
        break;
    }
    return nextPosition;
  }

  draw(ctx) {
    // Invincibility aura, drawn even while flickering so the effect reads
    if (this.isInvincible()) {
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.8)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(
        this._position.x + this._width / 2,
        this._position.y + this._height / 2,
        this._width * 0.55,
        0,
        Math.PI * 2
      );
      ctx.stroke();
      ctx.restore();
    }

    if (!this.visible) return;

    let spriteHeight = 32;
    let spriteWidth = 32;
    let spriteX = 0;
    let spriteY = 0;
    let spriteSheet = this._sprites.movement;
    // mapping the sprite sheet to the actions
    switch (this.action) {
      case "walk":
        switch (this.movement) {
          case "left":
            spriteY = 4 * spriteHeight;
            break;
          case "right":
            spriteY = 4 * spriteHeight;
            break;
          case "up":
            spriteY = 2 * spriteHeight;
            break;
          case "down":
            spriteY = 0 * spriteHeight;
            break;
        }
        break;
      case "crawl":
        switch (this.movement) {
          case "down":
            spriteY = 0 * spriteHeight;
            break;
          case "left":
            spriteY = 9 * spriteHeight;
            break;
          case "right":
            spriteY = 9 * spriteHeight;
            break;
          case "up":
            spriteY = 0 * spriteHeight;
            break;
        }
        break;
      case "attack":
        switch (this.movement) {
          case "down":
            spriteY = 6 * spriteHeight;
            break;
          case "left":
            spriteY = 7 * spriteHeight;
            break;
          case "right":
            spriteY = 7 * spriteHeight;
            break;
          case "up":
            spriteY = 8 * spriteHeight;
            break;
        }
        break;
      case "pick":
        spriteHeight = 48;
        spriteWidth = 48;
        spriteSheet = this._sprites.actions;
        switch (this.movement) {
          case "down":
            spriteY = 1 * spriteHeight;
            break;
          case "left":
            spriteY = 0 * spriteHeight;
            break;
          case "right":
            spriteY = 0 * spriteHeight;
            break;
          case "up":
            spriteY = 2 * spriteHeight;
            break;
        }
        break;
      case "axe":
        spriteHeight = 48;
        spriteWidth = 48;
        spriteSheet = this._sprites.actions;
        spriteX = 3 * spriteWidth;
        spriteY = 10 * spriteHeight;
        break;
      case "potion":
        spriteHeight = 48;
        spriteWidth = 48;
        spriteSheet = this._sprites.actions;
        switch (this.movement) {
            case "down":
              spriteY = 9 * spriteHeight;
              break;
            case "left":
              spriteY = 9 * spriteHeight;
              break;
            case "right":
              spriteY = 9 * spriteHeight;
              break;
            case "up":
              spriteY = 10 * spriteHeight;
              break;
          }
          break;
      case "idle":
      default:
        switch (this.movement) {
          case "down":
            spriteY = 0 * spriteHeight;
            break;
          case "left":
            spriteY = 1 * spriteHeight;
            break;
          case "right":
            spriteY = 1 * spriteHeight;
            break;
          case "up":
            spriteY = 2 * spriteHeight;
            break;
        }
        break;
    }

    spriteX = this.currentFrame * spriteWidth;

    ctx.save();
    if (this.movement === "left") {
      ctx.scale(-1, 1);
      ctx.drawImage(
        spriteSheet,
        spriteX,
        spriteY,
        spriteWidth,
        spriteHeight,
        -this._position.x - this._width,
        this._position.y,
        canvasSettings.cellWidth,
        canvasSettings.cellHeight
      );
    } else {
      ctx.drawImage(
        spriteSheet,
        spriteX,
        spriteY,
        spriteWidth,
        spriteHeight,
        this._position.x,
        this._position.y,
        canvasSettings.cellWidth,
        canvasSettings.cellHeight
      );
    }
    ctx.restore();
    // this.drawBoundingBox(ctx);
  }

  drawBoundingBox(ctx) {
    // Hitbox
    ctx.save();
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.strokeRect(
      this._position.x + this._width * 0.25,
      this._position.y + this._height * 0.25,
      this._width * 0.5,
      this._height * 0.5
    );
    ctx.restore();
    ctx.save();

    // Pickup range
    ctx.strokeStyle = 'green';
    ctx.lineWidth = 2;
    ctx.strokeRect(
      this._position.x,
      this._position.y,
      this._width,
      this._height
    );
    ctx.restore();
  }
}

export default Player;
