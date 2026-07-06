import Entity from "./entity.js";
import { canvasSettings, entitySettings, combatSettings, bossSettings } from "../utils/settings.js";
import { isColliding } from "../utils/game.js";
import { randomInt } from "../utils/rng.js";
import Animator from "./animator.js";
import { guardSpriteManifest } from "../assets/sprite-manifest.js";

class Guard extends Entity {
  #speed;
  #detectionRange;
  #health;
  #maxHealth;
  #currentSprite;
  #defeatAwarded = false;
  // Time the health bar stays visible after the last hit
  #healthBarMs = 0;
  // Active knockback push: direction vector plus remaining duration
  #knockback = null;

  #isBoss;

  constructor(x, y, type, assets, { boss = false } = {}) {
    super(
      x,
      y,
      type,
      assets,
      boss ? bossSettings.width : entitySettings.enemyWidth,
      boss ? bossSettings.height : entitySettings.enemyHeight
    );
    this.#isBoss = boss;
    this.animator = new Animator(guardSpriteManifest);
    this.movement = ["down", "up", "left", "right"][randomInt(0, 3)];
    this.animator.setDirection(this.movement);
    this.action = "idle";
    this.damage = boss ? bossSettings.damage : 10;
    this.#maxHealth = boss ? bossSettings.health : 100;
    this.#health = this.#maxHealth;
    this.#speed = boss ? bossSettings.speed : 60; // pixels per second
    this.#detectionRange = (boss ? bossSettings.detectionRangeCells : 5) * canvasSettings.cellWidth;
    this.#currentSprite = this._sprites.idle;
    this.currentFrame = 0;
  }

  isBoss() {
    return this.#isBoss;
  }

  // The sprite frame has generous transparent padding, so contact damage
  // uses a tighter box that matches the visible body instead of the full
  // drawn rectangle
  getHitBox() {
    const insetX = this._width * 0.2;
    const insetY = this._height * 0.2;
    return {
      x: this._position.x + insetX,
      y: this._position.y + insetY,
      width: this._width - insetX * 2,
      height: this._height - insetY * 2,
    };
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

  #setSpriteForAction(action) {
    switch (action) {
      case "attack":
        this.#currentSprite = this._sprites.attack;
        break;
      case "dead":
        this.#currentSprite = this._sprites.death;
        break;
      case "hurt":
        this.#currentSprite = this._sprites.hurt;
        break;
      case "walk":
        this.#currentSprite = this._sprites.walk;
        break;
      case "idle":
      default:
        this.#currentSprite = this._sprites.idle;
        break;
    }
  }

  #syncAnimationState() {
    this.action = this.animator.state;
    this.currentFrame = this.animator.frame;
    this.#setSpriteForAction(this.action);
  }

  moveTowards(target, walls, deltaMs = 1000 / 60) {
    if (this.isDefeated()) return;

    const dx = target.x - this._position.x;
    const dy = target.y - this._position.y;

    if (Math.abs(dx) > Math.abs(dy)) {
      this.movement = dx > 0 ? "right" : "left";
    } else {
      this.movement = dy > 0 ? "down" : "up";
    }
    this.animator.setDirection(this.movement);

    const distance = this.#speed * (deltaMs / 1000);
    const nextPosition = {
      ...this._position,
      width: canvasSettings.cellWidth / 2,
      height: canvasSettings.cellHeight / 2
    };
    switch (this.movement) {
      case "up":
        nextPosition.y -= distance;
        break;
      case "down":
        nextPosition.y += distance;
        break;
      case "left":
        nextPosition.x -= distance;
        break;
      case "right":
        nextPosition.x += distance;
        break;
    }

    const willCollideWithWalls = walls.some((wall) =>
      isColliding(nextPosition, wall.getHitBox())
    );

    const willCollideWithPlayer = isColliding(nextPosition, target);
    if (willCollideWithPlayer) {
      this.attack();
    } else if (!willCollideWithWalls) {
      this._position = { x: nextPosition.x, y: nextPosition.y };
      this.walk();
    } else {
      this.idle();
    }
  }

  detectPlayer(playerPosition, walls) {
    if (this.isDefeated()) return false;
    const dx = playerPosition.x - this._position.x;
    const dy = playerPosition.y - this._position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= this.#detectionRange) {
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
        checkPosition.y += step.y * (canvasSettings.cellHeight / 2);

        if (walls.some((wall) => isColliding(checkPosition, wall.getHitBox()))) {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  idle() {
    this.animator.setState("idle");
    this.#syncAnimationState();
  }

  walk() {
    this.animator.setState("walk");
    this.#syncAnimationState();
  }

  attack() {
    this.animator.play("attack", { restart: true, direction: this.movement });
    this.#syncAnimationState();
  }

  hurt() {
    this.animator.play("hurt", { restart: true, direction: this.movement });
    this.#syncAnimationState();
  }

  // Apply damage from the player. `fromDirection` is the direction the
  // player was facing, so the guard is knocked back away from the swing.
  takeDamage(amount, fromDirection = null) {
    if (this.#health <= 0) return false;
    this.#health = Math.max(0, this.#health - amount);
    this.#healthBarMs = combatSettings.healthBarVisibleMs;
    if (this.#health <= 0) {
      this.defeat();
      return true;
    }
    // Bosses are too heavy to be pushed around
    if (fromDirection && !this.#isBoss) {
      const push = {
        up: { x: 0, y: -1 },
        down: { x: 0, y: 1 },
        left: { x: -1, y: 0 },
        right: { x: 1, y: 0 },
      }[fromDirection];
      if (push) this.#knockback = { ...push, msLeft: combatSettings.knockbackDurationMs };
    }
    this.hurt();
    return false;
  }

  getHealth() {
    return this.#health;
  }

  getMaxHealth() {
    return this.#maxHealth;
  }

  isHealthBarVisible() {
    // A boss always shows its health bar, so the danger (and progress
    // against it) is visible before the first hit lands
    return !this.isDefeated() && (this.#isBoss || this.#healthBarMs > 0);
  }

  isDefeated() {
    return this.#health <= 0;
  }

  consumeDefeatAward() {
    if (!this.isDefeated() || this.#defeatAwarded) return false;
    this.#defeatAwarded = true;
    return true;
  }

  isReadyToRemove() {
    return this.isDefeated() && this.animator.isComplete("dead");
  }

  defeat() {
    this.#health = 0;
    this.animator.play("dead", { restart: true, direction: this.movement });
    this.#syncAnimationState();
  }

  lookAround() {
    const directions = ['up', 'right', 'down', 'left'];
    const currentIndex = directions.indexOf(this.movement);
    this.movement = currentIndex !== -1
      ? directions[(currentIndex + 1) % 4]
      : 'up';
    this.animator.setDirection(this.movement);
    this.idle();
  }

  update(playerPosition, walls, deltaMs = 1000 / 60) {
    this.animator.update(deltaMs);
    this.#syncAnimationState();
    this.#healthBarMs = Math.max(0, this.#healthBarMs - deltaMs);

    if (this.isDefeated()) return;

    // A knockback push overrides normal movement while it lasts
    if (this.#knockback) {
      this.#applyKnockback(walls, deltaMs);
      return;
    }

    if (this.detectPlayer(playerPosition, walls)) {
      this.moveTowards(playerPosition, walls, deltaMs);
    } else {
      this.idle();
    }
  }

  #applyKnockback(walls, deltaMs) {
    const distance = combatSettings.knockbackSpeed * (deltaMs / 1000);
    const nextPosition = {
      x: this._position.x + this.#knockback.x * distance,
      y: this._position.y + this.#knockback.y * distance,
      width: canvasSettings.cellWidth / 2,
      height: canvasSettings.cellHeight / 2,
    };
    const blocked = walls.some((wall) => isColliding(nextPosition, wall.getHitBox()));
    if (!blocked) {
      this._position = { x: nextPosition.x, y: nextPosition.y };
    }
    this.#knockback.msLeft -= deltaMs;
    if (this.#knockback.msLeft <= 0 || blocked) this.#knockback = null;
  }

  draw(ctx) {
    const frame = this.animator.getFrame(this.movement);

    ctx.drawImage(
      this.#currentSprite,
      frame.sourceX,
      frame.sourceY,
      frame.frameWidth,
      frame.frameHeight,
      this._position.x - 10,
      this._position.y - 10,
      this._width,
      this._height
    );

    this.#drawHealthBar(ctx);
  }

  // Small health bar above the guard, visible for a few seconds after a hit.
  // A boss bar is wider and permanently visible.
  #drawHealthBar(ctx) {
    if (!this.isHealthBarVisible()) return;

    const barWidth = this.#isBoss ? 96 : 48;
    const barHeight = this.#isBoss ? 8 : 6;
    const barX = this._position.x + (this._width - barWidth) / 2 - 10;
    const barY = this._position.y - 20;
    const ratio = this.#health / this.#maxHealth;

    ctx.save();
    // Fade out during the last second on screen (boss bars never fade)
    ctx.globalAlpha = this.#isBoss ? 1 : Math.min(1, this.#healthBarMs / 1000);
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(barX - 1, barY - 1, barWidth + 2, barHeight + 2);
    ctx.fillStyle = "#555";
    ctx.fillRect(barX, barY, barWidth, barHeight);
    ctx.fillStyle = ratio > 0.5 ? "#4caf50" : ratio > 0.25 ? "#ff9800" : "#c62828";
    ctx.fillRect(barX, barY, barWidth * ratio, barHeight);
    ctx.restore();
  }
}

export default Guard;
