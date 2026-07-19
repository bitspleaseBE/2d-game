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
  #deathElapsedMs = 0;
  #ranged = false;
  #rangedCooldownMs = 0;
  // Contact-attack telegraph: windup counts down, then the strike is "ready"
  // for a short grace window during which touching the player lands the hit
  #windupMs = 0;
  #strikeGraceMs = 0;
  // Archer telegraph: time left drawing the bow before the arrow releases
  #drawMs = null;
  // Where the player was last spotted; the guard walks there to investigate
  // after losing line of sight instead of forgetting instantly
  #lastSeen = null;
  // Idle wandering between sightings: current direction (null = stand) and
  // time until the next change of heart. The guard stays leashed near its
  // spawn post so corridors keep their designed coverage.
  #patrolDirection = null;
  #patrolMs = 0;
  #home;
  // Committed chase/path axis ('x' | 'y'). Kept until that axis is aligned
  // or a wall forces a switch, so facing cannot thrash every frame.
  #chaseAxis = null;
  // Leash hysteresis: once past the outer radius, keep walking home until
  // inside the inner radius (avoids ping-pong facing at the leash edge).
  #returningHome = false;
  #aiMode = "idle";
  #facingFlips = 0;

  #isBoss;

  constructor(x, y, type, assets, { boss = false, ranged = false, healthScale = 1 } = {}) {
    super(
      x,
      y,
      type,
      assets,
      boss ? bossSettings.width : entitySettings.enemyWidth,
      boss ? bossSettings.height : entitySettings.enemyHeight
    );
    this.#isBoss = boss;
    this.#ranged = ranged && !boss;
    this.#home = { x, y };
    this.animator = new Animator(guardSpriteManifest);
    this.movement = ["down", "up", "left", "right"][randomInt(0, 3)];
    this.animator.setDirection(this.movement);
    this.action = "idle";
    this.damage = boss ? bossSettings.damage : this.#ranged ? combatSettings.archerDamage : 10;
    this.#maxHealth = boss
      ? bossSettings.health
      : Math.round((this.#ranged ? combatSettings.archerHealth : 100) * healthScale);
    this.#health = this.#maxHealth;
    this.#speed = boss ? bossSettings.speed : this.#ranged ? 70 : 60; // pixels per second
    this.#detectionRange = (boss
      ? bossSettings.detectionRangeCells
      : this.#ranged
        ? combatSettings.archerRangeCells
        : 5) * canvasSettings.cellWidth;
    if (this.#ranged && this._sprites.bowAttack) this._sprites.attack = this._sprites.bowAttack;
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
      bowAttack: assets[`${this._type}_Bow_Attack`],
      death: assets[`${this._type}_Death`],
      hurt: assets[`${this._type}_Hurt`],
      idle: assets[`${this._type}_Idle`],
      run: assets[`${this._type}_Run`],
      runAttack: assets[`${this._type}_Run_Attack`],
      walk: assets[`${this._type}_Walk`],
      walkAttack: assets[`${this._type}_Walk_Attack`],
    };
  }

  isRanged() {
    return this.#ranged;
  }

  getCenter() {
    return {
      x: this._position.x + this._width / 2,
      y: this._position.y + this._height / 2,
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

  // Movement collision box: a corridor-friendly square centered under the
  // drawn body (sprites render 10px up-left of the position with generous
  // padding). Centering it keeps the visible orc in the middle of a path
  // instead of letting its sprite ride along wall edges.
  getMoveBox(x = this._position.x, y = this._position.y) {
    const size = canvasSettings.cellWidth * 0.75;
    const centerX = x + this._width / 2 - 10;
    const centerY = y + this._height / 2 - 10;
    return { x: centerX - size / 2, y: centerY - size / 2, width: size, height: size };
  }

  moveTowards(target, walls, deltaMs = 1000 / 60) {
    if (this.isDefeated()) return;
    // Hold still (and keep facing) during the contact telegraph / strike so
    // near-diagonal overlaps cannot flip up-down-up-down every frame.
    if (this.#windupMs > 0 || this.#strikeGraceMs > 0) return;

    const targetCenter = {
      x: target.x + (target.width || 0) / 2,
      y: target.y + (target.height || 0) / 2,
    };
    const own = this.getMoveBox();
    const dx = targetCenter.x - (own.x + own.width / 2);
    const dy = targetCenter.y - (own.y + own.height / 2);

    // Already on top of the target — start the windup without reshuffling facing.
    if (isColliding(own, target) || (Math.abs(dx) < 1 && Math.abs(dy) < 1)) {
      this.#chaseAxis = null;
      this.beginWindup();
      this.idle();
      return;
    }

    if (!this.#stepOnAxes(dx, dy, walls, deltaMs, target)) {
      this.idle();
    }
  }

  // Axis-aligned walk that commits to one axis until it is aligned (or a
  // wall forces a switch). Prevents left/right and up/down thrashing.
  #stepOnAxes(dx, dy, walls, deltaMs, stopTarget = null) {
    if (this.#chaseAxis === "x" && Math.abs(dx) < 1) this.#chaseAxis = null;
    if (this.#chaseAxis === "y" && Math.abs(dy) < 1) this.#chaseAxis = null;
    if (!this.#chaseAxis) {
      this.#chaseAxis = Math.abs(dx) >= Math.abs(dy) ? "x" : "y";
    }

    const axes = [this.#chaseAxis, this.#chaseAxis === "x" ? "y" : "x"];
    const step = this.#speed * (deltaMs / 1000);

    for (const axis of axes) {
      const remaining = axis === "x" ? dx : dy;
      if (Math.abs(remaining) < 1) continue;
      const distance = Math.sign(remaining) * Math.min(step, Math.abs(remaining));
      const next = axis === "x"
        ? { x: this._position.x + distance, y: this._position.y }
        : { x: this._position.x, y: this._position.y + distance };
      const nextBox = this.getMoveBox(next.x, next.y);
      const facing = axis === "x"
        ? (distance > 0 ? "right" : "left")
        : (distance > 0 ? "down" : "up");

      if (stopTarget && isColliding(nextBox, stopTarget)) {
        this.#chaseAxis = axis;
        this.#face(facing);
        this.beginWindup();
        return true;
      }
      if (walls.some((wall) => isColliding(nextBox, wall.getHitBox()))) {
        continue;
      }

      this.#chaseAxis = axis;
      this.#face(facing);
      this._position = next;
      this.walk();
      return true;
    }
    return false;
  }

  #face(direction) {
    if (!direction || direction === this.movement) return;
    this.#facingFlips += 1;
    this.movement = direction;
    this.animator.setDirection(direction);
  }

  getAiDebugInfo() {
    return {
      mode: this.#aiMode,
      facing: this.movement,
      axis: this.#chaseAxis,
      patrol: this.#patrolDirection,
      returningHome: this.#returningHome,
      facingFlips: this.#facingFlips,
      home: { ...this.#home },
      pos: { ...this._position },
    };
  }

  detectPlayer(playerPosition, walls) {
    if (this.isDefeated()) return false;
    const dx = playerPosition.x - this._position.x;
    const dy = playerPosition.y - this._position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance === 0) return true;

    if (distance <= this.#detectionRange) {
      const step = {
        x: dx / distance,
        y: dy / distance,
      };

      // March the guard's (centered) collision box toward the player; any
      // wall it would cross breaks the line of sight
      const checkPosition = this.getMoveBox();
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

  // Called while overlapping the player: starts the contact-attack windup
  // (the telegraph) unless one is already running or ready to land
  beginWindup() {
    if (this.isDefeated()) return;
    if (this.#windupMs <= 0 && this.#strikeGraceMs <= 0) {
      this.#windupMs = combatSettings.guardWindupMs;
      this.attack();
    }
  }

  // The strike lands once, in the grace window right after the windup ends.
  // The caller decides whether the player is still in reach — stepping away
  // during the telegraph makes the hit whiff.
  consumeStrike() {
    if (this.#strikeGraceMs <= 0) return false;
    this.#strikeGraceMs = 0;
    return true;
  }

  isWindingUp() {
    return this.#windupMs > 0;
  }

  isDrawingBow() {
    return this.#drawMs !== null;
  }

  // Apply damage from the player. `fromDirection` is the direction the
  // player was facing, so the guard is knocked back away from the swing.
  // `knockbackMultiplier` scales the push (the axe shoves twice as hard).
  takeDamage(amount, fromDirection = null, knockbackMultiplier = 1) {
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
      if (push) {
        this.#knockback = {
          ...push,
          msLeft: combatSettings.knockbackDurationMs,
          multiplier: knockbackMultiplier,
        };
      }
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
    return (
      this.isDefeated() &&
      this.animator.isComplete("dead") &&
      this.#deathElapsedMs >= combatSettings.corpseLingerMs
    );
  }

  defeat() {
    this.#health = 0;
    this.#deathElapsedMs = 0;
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
    this.#rangedCooldownMs = Math.max(0, this.#rangedCooldownMs - deltaMs);
    if (this.#windupMs > 0) {
      this.#windupMs -= deltaMs;
      if (this.#windupMs <= 0) this.#strikeGraceMs = combatSettings.guardStrikeGraceMs;
    } else {
      this.#strikeGraceMs = Math.max(0, this.#strikeGraceMs - deltaMs);
    }

    if (this.isDefeated()) {
      this.#deathElapsedMs += deltaMs;
      return null;
    }

    // A knockback push overrides normal movement while it lasts
    if (this.#knockback) {
      this.#applyKnockback(walls, deltaMs);
      return null;
    }

    if (this.#ranged) {
      return this.#updateRanged(playerPosition, walls, deltaMs);
    }

    if (this.detectPlayer(playerPosition, walls)) {
      this.#aiMode = "chase";
      this.#returningHome = false;
      this.#lastSeen = { x: playerPosition.x, y: playerPosition.y };
      this.moveTowards(playerPosition, walls, deltaMs);
    } else if (this.#isBoss) {
      // Bosses anchor their arena: no wandering, no chasing shadows
      this.#aiMode = "idle";
      this.#chaseAxis = null;
      this.idle();
    } else if (this.#lastSeen) {
      this.#aiMode = "investigate";
      this.#investigate(walls, deltaMs);
    } else {
      this.#patrol(walls, deltaMs);
    }
    return null;
  }

  // Walk to where the player was last spotted; on arrival (or when a wall
  // blocks the way) give up, look around, and go back to patrolling
  #investigate(walls, deltaMs) {
    const dx = this.#lastSeen.x - this._position.x;
    const dy = this.#lastSeen.y - this._position.y;
    if (Math.hypot(dx, dy) < canvasSettings.cellWidth / 2) {
      this.#lastSeen = null;
      this.lookAround();
      return;
    }
    if (!this.#stepToward(this.#lastSeen, walls, deltaMs)) {
      this.#lastSeen = null;
      this.lookAround();
    }
  }

  // Bored-watchman wandering: amble in one direction for a couple of
  // seconds, sometimes just stand and turn in place, repeat
  #patrol(walls, deltaMs) {
    this.#patrolMs -= deltaMs;
    if (this.#patrolMs <= 0 && !this.#returningHome) {
      this.#patrolMs = randomInt(1600, 3200);
      this.#chaseAxis = null;
      const roll = randomInt(0, 4);
      this.#patrolDirection = roll === 0 ? null : ["up", "down", "left", "right"][roll - 1];
      if (!this.#patrolDirection) {
        this.#aiMode = "look";
        this.lookAround();
      }
    }
    if (!this.#patrolDirection && !this.#returningHome) {
      this.#aiMode = "idle";
      return;
    }

    // Leashed to the spawn post with hysteresis so the guard does not
    // flip outward/home every frame at the boundary.
    const fromHome = Math.hypot(this._position.x - this.#home.x, this._position.y - this.#home.y);
    const leashOut = canvasSettings.cellWidth * 2.5;
    const leashIn = canvasSettings.cellWidth * 0.6;

    if (this.#returningHome) {
      if (fromHome <= leashIn) {
        this.#returningHome = false;
        this.#chaseAxis = null;
        this.#patrolDirection = null;
        this.#patrolMs = randomInt(500, 1000);
        this.#aiMode = "idle";
        this.idle();
        return;
      }
      this.#aiMode = "return";
      if (!this.#stepToward(this.#home, walls, deltaMs * 0.6)) {
        // Blocked on the way home — pause, then try a fresh patrol leg
        this.#returningHome = false;
        this.#chaseAxis = null;
        this.#patrolDirection = null;
        this.#patrolMs = randomInt(400, 900);
        this.#aiMode = "idle";
        this.idle();
      }
      return;
    }

    if (fromHome > leashOut) {
      this.#returningHome = true;
      this.#chaseAxis = null;
      this.#aiMode = "return";
      this.#stepToward(this.#home, walls, deltaMs * 0.6);
      return;
    }

    this.#aiMode = "patrol";
    const step = {
      up: { x: 0, y: -1 },
      down: { x: 0, y: 1 },
      left: { x: -1, y: 0 },
      right: { x: 1, y: 0 },
    }[this.#patrolDirection];
    const target = {
      x: this._position.x + step.x * canvasSettings.cellWidth * 10,
      y: this._position.y + step.y * canvasSettings.cellHeight * 10,
    };
    // Patrolling ambles at 60% speed. A wall ends the leg early.
    if (!this.#stepToward(target, walls, deltaMs * 0.6)) {
      this.#chaseAxis = null;
      this.#patrolDirection = null;
      this.#patrolMs = randomInt(400, 900);
      this.#aiMode = "idle";
      this.idle();
    }
  }

  // One movement step toward a point, blocked by walls. Returns false when
  // the path is blocked. Shared by investigate and patrol.
  #stepToward(point, walls, deltaMs) {
    const dx = point.x - this._position.x;
    const dy = point.y - this._position.y;
    if (Math.abs(dx) < 1 && Math.abs(dy) < 1) {
      this.#chaseAxis = null;
      this.idle();
      return true; // close enough — treat as arrived rather than blocked
    }
    return this.#stepOnAxes(dx, dy, walls, deltaMs);
  }

  #updateRanged(playerPosition, walls, deltaMs) {
    const targetCenter = {
      x: playerPosition.x + playerPosition.width / 2,
      y: playerPosition.y + playerPosition.height / 2,
    };
    const ownCenter = this.getCenter();
    const dx = targetCenter.x - ownCenter.x;
    const dy = targetCenter.y - ownCenter.y;
    const distance = Math.hypot(dx, dy) || 1;

    if (this.detectPlayer(playerPosition, walls)) {
      if (distance < combatSettings.archerKeepDistanceCells * canvasSettings.cellWidth) {
        this.#retreatFrom(dx, dy, walls, deltaMs);
      } else {
        // Face the player only when standing to shoot — use committed axis.
        if (this.#chaseAxis === "x" && Math.abs(dx) < 1) this.#chaseAxis = null;
        if (this.#chaseAxis === "y" && Math.abs(dy) < 1) this.#chaseAxis = null;
        if (!this.#chaseAxis) this.#chaseAxis = Math.abs(dx) >= Math.abs(dy) ? "x" : "y";
        this.#face(this.#chaseAxis === "x"
          ? (dx > 0 ? "right" : "left")
          : (dy > 0 ? "down" : "up"));
        this.idle();
      }
      // The shot is telegraphed: the archer draws for a moment (visible
      // indicator) before the arrow actually releases
      if (this.#drawMs !== null) {
        this.#drawMs -= deltaMs;
        if (this.#drawMs <= 0) {
          this.#drawMs = null;
          this.#rangedCooldownMs = combatSettings.archerCooldownMs;
          return {
            x: ownCenter.x,
            y: ownCenter.y,
            direction: { x: dx / distance, y: dy / distance },
            damage: combatSettings.archerArrowDamage,
          };
        }
      } else if (this.#rangedCooldownMs <= 0) {
        this.#drawMs = combatSettings.archerDrawMs;
        this.attack();
      }
      return null;
    }

    // Losing sight of the player cancels the draw
    this.#drawMs = null;
    this.idle();
    return null;
  }

  #retreatFrom(dx, dy, walls, deltaMs) {
    // Step away on the committed axis (opposite of the vector toward player).
    if (!this.#stepOnAxes(-dx, -dy, walls, deltaMs)) this.idle();
  }

  #applyKnockback(walls, deltaMs) {
    const distance = combatSettings.knockbackSpeed * (this.#knockback.multiplier || 1) * (deltaMs / 1000);
    const next = {
      x: this._position.x + this.#knockback.x * distance,
      y: this._position.y + this.#knockback.y * distance,
    };
    const blocked = walls.some((wall) => isColliding(this.getMoveBox(next.x, next.y), wall.getHitBox()));
    if (!blocked) {
      this._position = next;
    }
    this.#knockback.msLeft -= deltaMs;
    if (this.#knockback.msLeft <= 0 || blocked) this.#knockback = null;
  }

  draw(ctx) {
    const frame = this.animator.getFrame(this.movement);

    ctx.save();
    if (this.isDefeated() && this.animator.isComplete("dead")) {
      const fadeStart = combatSettings.corpseLingerMs - combatSettings.corpseFadeMs;
      const fadeElapsed = Math.max(0, this.#deathElapsedMs - fadeStart);
      ctx.globalAlpha = 1 - Math.min(1, fadeElapsed / combatSettings.corpseFadeMs);
    }
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
    ctx.restore();

    this.#drawHealthBar(ctx);
    this.#drawTelegraph(ctx);
  }

  // AI debug overlay: mode, facing, leash state, and flip count
  drawDebug(ctx) {
    if (this.isDefeated()) return;
    const info = this.getAiDebugInfo();
    const x = this._position.x - 4;
    const y = this._position.y - 36;
    const lines = [
      info.mode,
      `face:${info.facing} axis:${info.axis || "-"}`,
      info.returningHome ? "RETURNING" : `patrol:${info.patrol || "-"}`,
      `flips:${info.facingFlips}`,
    ];
    ctx.save();
    ctx.font = "10px monospace";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    const jittering = info.facingFlips > 8 && (info.mode === "patrol" || info.mode === "return");
    ctx.fillStyle = jittering ? "rgba(180,0,0,0.75)" : "rgba(0,0,0,0.7)";
    ctx.fillRect(x - 2, y - 2, 118, lines.length * 11 + 4);
    ctx.fillStyle = jittering ? "#ff8a80" : "#b2ff59";
    lines.forEach((line, i) => ctx.fillText(line, x, y + i * 11));
    // Home leash ring
    ctx.strokeStyle = "rgba(255,235,59,0.45)";
    ctx.beginPath();
    ctx.arc(info.home.x + this._width / 2, info.home.y + this._height / 2, canvasSettings.cellWidth * 2.5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // The attack telegraph: a bold '!' pops above the guard while a contact
  // strike winds up (red) or an archer draws the bow (amber), so every hit
  // is announced before it lands
  #drawTelegraph(ctx) {
    if (this.isDefeated()) return;
    const windingUp = this.isWindingUp();
    const drawing = this.isDrawingBow();
    if (!windingUp && !drawing) return;

    const x = this._position.x + this._width / 2 - 10;
    const y = this._position.y - 26;
    ctx.save();
    ctx.font = "bold 26px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineWidth = 4;
    ctx.strokeStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillStyle = windingUp ? "#ff5252" : "#ffd54f";
    ctx.strokeText("!", x, y);
    ctx.fillText("!", x, y);
    ctx.restore();
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
