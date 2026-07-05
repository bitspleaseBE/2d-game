import Entity from './entity.js';
import { canvasSettings } from "../utils/settings.js";

class Player extends Entity {
  #health;
  #speed;
  #isHurt = false;
  #hurtInterval = null;

  constructor(x, y, assets) {
    super(x, y, 'player', assets);
    this.#health = 100;
    this.#speed = 5;
    this.attackPower = 50;
    this.explosives = [];
    this.keys = [];
    this.powerups = [];

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
    // Ignore hits during the invulnerability window after being hurt
    if (this.#isHurt || this.#health <= 0) return;
    this.#health -= amount;
    this.hurtAnimation();
  }

  respawn(x, y) {
    this._position = { x, y };
    this.#health = 100;
    this.#isHurt = false;
    if (this.#hurtInterval) {
      clearInterval(this.#hurtInterval);
      this.#hurtInterval = null;
    }
    this.visible = true;
    this.action = "idle";
    this.movement = "down";
  }

  moveLeft() {
    this._position.x -= this.#speed;
    this.action = "walk";
    this.movement = "left";
  }

  moveRight() {
    this._position.x += this.#speed;
    this.action = "walk";
    this.movement = "right";
  }

  moveUp() {
    this._position.y -= this.#speed;
    this.action = "walk";
    this.movement = "up";
  }

  moveDown() {
    this._position.y += this.#speed;
    this.action = "walk";
    this.movement = "down";
  }

  attack() {
    this.action = "attack";
    // Implement attack logic here
  }

  pick() {
    this.action = "pick";
    // TODO: Implement actual object detection and picking logic
    // This would involve checking for collisions with pickable entities
    // and handling the pickup if a valid object is found
  }

  axe() {
    this.action = "axe";
    // Implement axe logic here
  }

  potion() {
    this.action = "potion";
    // Implement potion logic here
  }

  collectExplosive(explosive) {
    this.explosives.push(explosive);
  }

  collectKey(key) {
    this.keys.push(key);
  }

  collectPowerup(powerup) {
    this.powerups.push(powerup);
  }

  applyPowerup(effect) {
    this.powerups.push(effect);
    if (effect === "health") {
      this.#health = Math.min(100, this.#health + 25);
    }
  }

  update() {
    this.frameCount++;
    if (this.frameCount >= 10) {
      // Adjust frame rate as needed
      let frames_per_action = 6;
      if (
        this.action === "walk" ||
        this.action === "idle" ||
        this.action === "jump"
      ) {
        frames_per_action = 6;
      } else if (this.action === "attack" || this.action === "duck") {
        frames_per_action = 4;
      } else if (
        this.action === "pick" ||
        this.action === "axe" ||
        this.action === "potion"
      ) {
        // The actions sprite sheet (Player_Actions.png) only has 2 columns
        frames_per_action = 2;
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
        nextPosition.x -= this.#speed;
        break;
      case 'right':
        nextPosition.x += this.#speed;
        break;
      case 'up':
        nextPosition.y -= this.#speed;
        break;
      case 'down':
        nextPosition.y += this.#speed;
        break;
    }
    return nextPosition;
  }

  hurtAnimation() {
    if (this.#isHurt) return;

    this.#isHurt = true;
    this.action = "idle"; // Freeze the player

    let flickerCount = 0;
    const maxFlickers = 10;
    const flickerDuration = 100; // milliseconds

    this.#hurtInterval = setInterval(() => {
      this.visible = !this.visible; // Toggle visibility
      flickerCount++;

      if (flickerCount >= maxFlickers) {
        clearInterval(this.#hurtInterval);
        this.#hurtInterval = null;
        this.#isHurt = false;
        this.visible = true; // Ensure player is visible after flickering
      }
    }, flickerDuration);
  }

  draw(ctx) {
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
        // spriteY = 11 * spriteHeight;
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

    // Movement frames are 32px and action frames 48px, but the character is
    // drawn at the same pixel size in both; the extra 16px of an action frame
    // is empty space for the tool swing. Scale every frame by the same factor
    // and center it on the cell so the character never changes size.
    const pixelScale = canvasSettings.cellWidth / 32;
    const destWidth = spriteWidth * pixelScale;
    const destHeight = spriteHeight * pixelScale;
    const offsetX = (canvasSettings.cellWidth - destWidth) / 2;
    const offsetY = (canvasSettings.cellHeight - destHeight) / 2;

    ctx.save();
    if (this.movement === "left") {
      ctx.scale(-1, 1);
      ctx.drawImage(
        spriteSheet,
        spriteX,
        spriteY,
        spriteWidth,
        spriteHeight,
        -(this._position.x + offsetX) - destWidth,
        this._position.y + offsetY,
        destWidth,
        destHeight
      );
    } else {
      ctx.drawImage(
        spriteSheet,
        spriteX,
        spriteY,
        spriteWidth,
        spriteHeight,
        this._position.x + offsetX,
        this._position.y + offsetY,
        destWidth,
        destHeight
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
