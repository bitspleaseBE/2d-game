// Game settings and configurations
// - This file contains global settings and configurations for the game
// - These settings can be adjusted to change the game's behavior and appearance
// Canvas settings
const $5e4dc8398ac8b78d$export$ee79b8018014417 = {
    width: 1280,
    height: 640,
    backgroundColor: "#2c2c2c",
    cellWidth: 64,
    cellHeight: 64
};
const $5e4dc8398ac8b78d$export$b54787693599973a = {
    initialLives: 3,
    speed: 300,
    respawnProtectionMs: 2000,
    color: "#ff69b4"
};
const $5e4dc8398ac8b78d$export$46cdd0893df07df1 = {
    initialLevel: 1,
    maxLevels: 10,
    scoreIncrement: 100,
    disarmScore: 50
};
const $5e4dc8398ac8b78d$export$7ce9e21f246bef3b = {
    healAmount: 25,
    speedBoost: 180,
    speedDurationMs: 10000,
    strengthMultiplier: 2,
    strengthDurationMs: 10000,
    invincibilityDurationMs: 10000,
    notificationDurationMs: 4000
};
const $5e4dc8398ac8b78d$export$29a11ee6bb22dbd = {
    attackCooldownMs: 400,
    knockbackSpeed: 300,
    knockbackDurationMs: 120,
    healthBarVisibleMs: 3000
};
const $5e4dc8398ac8b78d$export$b9c8e024d5962062 = {
    health: 300,
    damage: 20,
    speed: 45,
    width: 128,
    height: 128,
    detectionRangeCells: 6,
    scoreValue: 500
};
const $5e4dc8398ac8b78d$export$eb0ef2c2c69404a9 = {
    revealRadius: 160,
    exploredAlpha: 0.55,
    unexploredAlpha: 1
};
const $5e4dc8398ac8b78d$export$eb39dd4a78414223 = {
    enemyWidth: 91,
    enemyHeight: 91,
    obstacleColor: "#c62828",
    powerupColor: "#1565c0",
    guardColor: "#ff69b4",
    explosiveColor: "#ffd54f",
    exitColor: "#4caf50",
    explosiveTriggerRange: 96,
    explosiveFuseMs: 1500,
    explosiveBlastRadius: 96,
    explosivePlayerDamage: 30,
    explosiveGuardDamage: 100
};
const $5e4dc8398ac8b78d$export$970c77a5eb3ea069 = {
    mute: false,
    volume: 0.5
};
const $5e4dc8398ac8b78d$export$582ce1a401bc3f08 = {
    up: "ArrowUp",
    down: "ArrowDown",
    left: "ArrowLeft",
    right: "ArrowRight",
    attack: " ",
    esc: "Escape",
    pick: "p",
    axe: "x",
    potion: "u",
    inventory: "i"
}; // Add more settings as needed for other aspects of the game



// Tiny synthesized sound effects via the Web Audio API — no audio assets
// needed. The AudioContext is created lazily on the first sound, which always
// happens after a user gesture (a key press or button click), so autoplay
// policies never block it. Every call is wrapped so a missing/blocked audio
// backend can never break the game.
let $f0a686cca0390838$var$ctx = null;
function $f0a686cca0390838$var$getContext() {
    if ((0, $5e4dc8398ac8b78d$export$970c77a5eb3ea069).mute) return null;
    try {
        if (!$f0a686cca0390838$var$ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return null;
            $f0a686cca0390838$var$ctx = new AudioCtx();
        }
        if ($f0a686cca0390838$var$ctx.state === "suspended") $f0a686cca0390838$var$ctx.resume().catch(()=>{});
        return $f0a686cca0390838$var$ctx;
    } catch  {
        return null;
    }
}
// Play a simple tone: oscillator + exponential decay envelope
function $f0a686cca0390838$var$tone({ type: type = "square", from: from = 440, to: to = from, duration: duration = 0.1, volume: volume = 0.3, delay: delay = 0 }) {
    const audio = $f0a686cca0390838$var$getContext();
    if (!audio) return;
    try {
        const t0 = audio.currentTime + delay;
        const osc = audio.createOscillator();
        const gain = audio.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(from, t0);
        osc.frequency.exponentialRampToValueAtTime(Math.max(1, to), t0 + duration);
        gain.gain.setValueAtTime(volume * (0, $5e4dc8398ac8b78d$export$970c77a5eb3ea069).volume, t0);
        gain.gain.exponentialRampToValueAtTime(0.001, t0 + duration);
        osc.connect(gain).connect(audio.destination);
        osc.start(t0);
        osc.stop(t0 + duration);
    } catch  {
    // Audio is best-effort; never let it break gameplay
    }
}
// A burst of filtered noise, for impacts and explosions
function $f0a686cca0390838$var$noise({ duration: duration = 0.3, volume: volume = 0.4, delay: delay = 0 }) {
    const audio = $f0a686cca0390838$var$getContext();
    if (!audio) return;
    try {
        const t0 = audio.currentTime + delay;
        const buffer = audio.createBuffer(1, audio.sampleRate * duration, audio.sampleRate);
        const data = buffer.getChannelData(0);
        for(let i = 0; i < data.length; i++)data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
        const src = audio.createBufferSource();
        src.buffer = buffer;
        const gain = audio.createGain();
        gain.gain.setValueAtTime(volume * (0, $5e4dc8398ac8b78d$export$970c77a5eb3ea069).volume, t0);
        gain.gain.exponentialRampToValueAtTime(0.001, t0 + duration);
        src.connect(gain).connect(audio.destination);
        src.start(t0);
    } catch  {
    // best-effort
    }
}
const $f0a686cca0390838$export$dc12ec5f7c61c268 = {
    swing: ()=>$f0a686cca0390838$var$tone({
            type: "sawtooth",
            from: 300,
            to: 80,
            duration: 0.08,
            volume: 0.15
        }),
    hit: ()=>$f0a686cca0390838$var$tone({
            type: "square",
            from: 150,
            to: 60,
            duration: 0.12,
            volume: 0.25
        }),
    hurt: ()=>$f0a686cca0390838$var$tone({
            type: "triangle",
            from: 220,
            to: 110,
            duration: 0.25,
            volume: 0.3
        }),
    pickup: ()=>{
        $f0a686cca0390838$var$tone({
            type: "sine",
            from: 660,
            to: 880,
            duration: 0.08,
            volume: 0.25
        });
        $f0a686cca0390838$var$tone({
            type: "sine",
            from: 880,
            to: 1320,
            duration: 0.1,
            volume: 0.2,
            delay: 0.08
        });
    },
    fuse: ()=>$f0a686cca0390838$var$tone({
            type: "square",
            from: 1200,
            to: 1200,
            duration: 0.05,
            volume: 0.08
        }),
    explosion: ()=>{
        $f0a686cca0390838$var$noise({
            duration: 0.5,
            volume: 0.5
        });
        $f0a686cca0390838$var$tone({
            type: "sine",
            from: 100,
            to: 30,
            duration: 0.5,
            volume: 0.4
        });
    },
    guardDown: ()=>$f0a686cca0390838$var$tone({
            type: "sawtooth",
            from: 200,
            to: 40,
            duration: 0.35,
            volume: 0.3
        }),
    unlock: ()=>{
        $f0a686cca0390838$var$tone({
            type: "square",
            from: 500,
            to: 500,
            duration: 0.06,
            volume: 0.2
        });
        $f0a686cca0390838$var$tone({
            type: "square",
            from: 750,
            to: 750,
            duration: 0.1,
            volume: 0.2,
            delay: 0.08
        });
    },
    disarm: ()=>$f0a686cca0390838$var$tone({
            type: "sine",
            from: 900,
            to: 300,
            duration: 0.25,
            volume: 0.2
        }),
    gulp: ()=>{
        $f0a686cca0390838$var$tone({
            type: "sine",
            from: 300,
            to: 150,
            duration: 0.1,
            volume: 0.25
        });
        $f0a686cca0390838$var$tone({
            type: "sine",
            from: 350,
            to: 180,
            duration: 0.12,
            volume: 0.25,
            delay: 0.12
        });
    },
    chop: ()=>$f0a686cca0390838$var$tone({
            type: "square",
            from: 120,
            to: 50,
            duration: 0.15,
            volume: 0.3
        }),
    levelComplete: ()=>{
        [
            523,
            659,
            784,
            1047
        ].forEach((f, i)=>$f0a686cca0390838$var$tone({
                type: "triangle",
                from: f,
                to: f,
                duration: 0.15,
                volume: 0.25,
                delay: i * 0.12
            }));
    },
    gameOver: ()=>{
        [
            392,
            330,
            262,
            196
        ].forEach((f, i)=>$f0a686cca0390838$var$tone({
                type: "triangle",
                from: f,
                to: f,
                duration: 0.25,
                volume: 0.25,
                delay: i * 0.2
            }));
    }
};



class $7fde6e2b56878ba7$var$Entity {
    _position;
    _width;
    _height;
    _sprites;
    _type;
    constructor(x, y, type, assets, width = (0, $5e4dc8398ac8b78d$export$ee79b8018014417).cellWidth, height = (0, $5e4dc8398ac8b78d$export$ee79b8018014417).cellHeight){
        this._position = {
            x: x,
            y: y
        };
        this._width = width;
        this._height = height;
        this._type = type;
        this._sprites = this.selectSprites(assets);
    }
    getPosition() {
        return {
            ...this._position
        };
    }
    setPosition(x, y) {
        this._position = {
            x: x,
            y: y
        };
    }
    getType() {
        return this._type;
    }
    getHitBox() {
        return {
            x: this._position.x,
            y: this._position.y,
            width: this._width,
            height: this._height
        };
    }
    selectSprites(assets) {
        // This method should be overridden by subclasses to select appropriate sprites
        return {};
    }
    update() {
    // Abstract method to be implemented by subclasses
    }
    draw(ctx) {
    // Abstract method to be implemented by subclasses
    }
}
var $7fde6e2b56878ba7$export$2e2bcd8739ae039 = $7fde6e2b56878ba7$var$Entity;



class $ee42f9705d187e0c$var$Animator {
    constructor(manifest){
        this.manifest = manifest;
        this.state = manifest.defaultState || "idle";
        this.direction = manifest.defaultDirection || "down";
        this.elapsedMs = 0;
        this.frame = 0;
        this.complete = false;
    }
    #definition(state = this.state) {
        const weaponStates = Object.values(this.manifest.weapons || {}).flatMap((weapon)=>Object.entries(weapon.states || {}));
        const weaponState = weaponStates.find(([name])=>name === state);
        return weaponState ? weaponState[1] : this.manifest.states[state];
    }
    setDirection(direction) {
        if (direction) this.direction = direction;
    }
    play(state, { restart: restart = false, direction: direction = null } = {}) {
        if (direction) this.setDirection(direction);
        if (!restart && this.state === state) return;
        this.state = state;
        this.elapsedMs = 0;
        this.frame = 0;
        this.complete = false;
    }
    setState(state, options = {}) {
        const current = this.#definition();
        if (current?.oneShot && !this.complete && !options.force) return;
        this.play(state, options);
    }
    update(deltaMs) {
        const definition = this.#definition();
        if (!definition || this.complete && definition.holdLast) return;
        this.elapsedMs += deltaMs;
        const frameDuration = definition.frameDurationMs || 120;
        const frameCount = definition.frames || 1;
        const nextFrame = Math.floor(this.elapsedMs / frameDuration);
        if (definition.oneShot && nextFrame >= frameCount) {
            this.complete = true;
            if (definition.holdLast) {
                this.frame = frameCount - 1;
                return;
            }
            this.play(definition.returnTo || this.manifest.defaultState || "idle", {
                restart: true
            });
            return;
        }
        this.frame = nextFrame % frameCount;
    }
    isComplete(state = this.state) {
        return this.state === state && this.complete;
    }
    isActiveWindow(state = this.state) {
        const definition = this.#definition(state);
        if (!definition || this.state !== state) return false;
        const start = definition.activeStartMs ?? 0;
        const end = definition.activeEndMs ?? Number.POSITIVE_INFINITY;
        return this.elapsedMs >= start && this.elapsedMs <= end;
    }
    getFrame(direction = this.direction) {
        const definition = this.#definition();
        const rows = definition.rows || {};
        const row = rows[direction] ?? rows.down ?? 0;
        return {
            state: this.state,
            sheet: definition.sheet,
            frameWidth: definition.frameWidth,
            frameHeight: definition.frameHeight,
            sourceX: this.frame * definition.frameWidth,
            sourceY: row * definition.frameHeight,
            flip: direction === "left" && Boolean(definition.flipLeft)
        };
    }
}
var $ee42f9705d187e0c$export$2e2bcd8739ae039 = $ee42f9705d187e0c$var$Animator;


// Sprite sheet metadata. Keep animation layout here so adding a new hero
// weapon or generated sheet does not require rewriting entity draw code.
const $597aa4a7a493a015$export$8fc1e0a9d795944b = {
    down: "down",
    up: "up",
    left: "left",
    right: "right"
};
const $597aa4a7a493a015$export$6006ccb11e63f4a2 = {
    defaultState: "idle",
    defaultDirection: $597aa4a7a493a015$export$8fc1e0a9d795944b.down,
    sheets: {
        movement: "movement",
        actions: "actions"
    },
    states: {
        idle: {
            sheet: "movement",
            frameWidth: 32,
            frameHeight: 32,
            frames: 6,
            frameDurationMs: 150,
            rows: {
                down: 0,
                left: 1,
                right: 1,
                up: 2
            },
            flipLeft: true
        },
        walk: {
            sheet: "movement",
            frameWidth: 32,
            frameHeight: 32,
            frames: 6,
            frameDurationMs: 90,
            rows: {
                down: 0,
                left: 4,
                right: 4,
                up: 2
            },
            flipLeft: true
        },
        attack: {
            sheet: "movement",
            frameWidth: 32,
            frameHeight: 32,
            frames: 4,
            frameDurationMs: 80,
            rows: {
                down: 6,
                left: 7,
                right: 7,
                up: 8
            },
            flipLeft: true,
            oneShot: true,
            returnTo: "idle",
            activeStartMs: 0,
            activeEndMs: 220
        },
        pick: {
            sheet: "actions",
            frameWidth: 48,
            frameHeight: 48,
            frames: 2,
            frameDurationMs: 120,
            rows: {
                down: 1,
                left: 0,
                right: 0,
                up: 2
            },
            flipLeft: true,
            oneShot: true,
            returnTo: "idle"
        },
        potion: {
            sheet: "actions",
            frameWidth: 48,
            frameHeight: 48,
            frames: 2,
            frameDurationMs: 130,
            rows: {
                down: 9,
                left: 9,
                right: 9,
                up: 10
            },
            flipLeft: true,
            oneShot: true,
            returnTo: "idle"
        },
        defeated: {
            sheet: "movement",
            frameWidth: 32,
            frameHeight: 32,
            frames: 6,
            frameDurationMs: 130,
            rows: {
                down: 9,
                left: 9,
                right: 9,
                up: 9
            },
            flipLeft: true,
            oneShot: true,
            holdLast: true
        }
    },
    weapons: {
        axe: {
            actionState: "axe",
            states: {
                axe: {
                    sheet: "actions",
                    frameWidth: 48,
                    frameHeight: 48,
                    frames: 2,
                    frameDurationMs: 110,
                    rows: {
                        down: 10,
                        left: 10,
                        right: 10,
                        up: 10
                    },
                    flipLeft: true,
                    oneShot: true,
                    returnTo: "idle",
                    activeStartMs: 0,
                    activeEndMs: 210
                }
            }
        }
    }
};
const $597aa4a7a493a015$export$2fa9270261de0878 = {
    defaultState: "idle",
    defaultDirection: $597aa4a7a493a015$export$8fc1e0a9d795944b.down,
    states: {
        idle: {
            frameWidth: 64,
            frameHeight: 64,
            frames: 4,
            frameDurationMs: 180,
            rows: {
                down: 0,
                up: 1,
                left: 2,
                right: 3
            }
        },
        walk: {
            frameWidth: 64,
            frameHeight: 64,
            frames: 6,
            frameDurationMs: 95,
            rows: {
                down: 0,
                up: 1,
                left: 2,
                right: 3
            }
        },
        attack: {
            frameWidth: 64,
            frameHeight: 64,
            frames: 8,
            frameDurationMs: 65,
            rows: {
                down: 0,
                up: 1,
                left: 2,
                right: 3
            },
            oneShot: true,
            returnTo: "idle"
        },
        hurt: {
            frameWidth: 64,
            frameHeight: 64,
            frames: 6,
            frameDurationMs: 70,
            rows: {
                down: 0,
                up: 1,
                left: 2,
                right: 3
            },
            oneShot: true,
            returnTo: "idle"
        },
        dead: {
            frameWidth: 64,
            frameHeight: 64,
            frames: 8,
            frameDurationMs: 80,
            rows: {
                down: 0,
                up: 1,
                left: 2,
                right: 3
            },
            oneShot: true,
            holdLast: true
        }
    }
};


// Item catalog
// - Single source of truth for every item that can live in the player's
//   inventory: pickups, guard drops, weapons and runes
// - `icon` refers to a key in the itemAssets loaded by assets.js
// - Weapons and runes are equipped from the inventory screen (one of each);
//   their bonuses are applied by the Player while equipped
const $a3ad18a970f4f422$export$ef94d4ad2585b6fa = {
    key: {
        name: "Key",
        article: "a",
        kind: "key",
        icon: "key",
        description: "Unlocks a locked door \u2014 walk into the door while carrying it."
    },
    potion: {
        name: "Health Potion",
        article: "a",
        kind: "potion",
        icon: "potion",
        healAmount: 50,
        description: "Restores 50 health. Press 'u' or click it here to drink one."
    },
    explosive: {
        name: "Explosive",
        article: "an",
        kind: "explosive",
        icon: "explosive",
        description: "Unstable and powerful. No use for it yet \u2014 handle with care."
    },
    steelSword: {
        name: "Steel Sword",
        article: "a",
        kind: "weapon",
        icon: "steelSword",
        attackBonus: 25,
        description: "A sturdy blade. +25 attack power while equipped."
    },
    warAxe: {
        name: "War Axe",
        article: "a",
        kind: "weapon",
        icon: "warAxe",
        attackBonus: 50,
        description: "Heavy and brutal. +50 attack power while equipped."
    },
    runeHaste: {
        name: "Rune of Haste",
        article: "a",
        kind: "rune",
        icon: "runeHaste",
        speedBonus: 120,
        description: "Ancient stone humming with energy. Move faster while equipped."
    },
    runeMight: {
        name: "Rune of Might",
        article: "a",
        kind: "rune",
        icon: "runeMight",
        attackBonus: 25,
        description: "Burns with orcish rage. +25 attack power while equipped."
    },
    runeWarding: {
        name: "Rune of Warding",
        article: "a",
        kind: "rune",
        icon: "runeWarding",
        description: "A protective sigil. Halves all damage taken while equipped."
    }
};
const $a3ad18a970f4f422$export$ab160d7f98284596 = [
    "potion",
    "potion",
    "steelSword",
    "warAxe",
    "runeHaste",
    "runeMight",
    "runeWarding"
];


class $8dc50de6459bd33c$var$Player extends (0, $7fde6e2b56878ba7$export$2e2bcd8739ae039) {
    #health;
    #baseSpeed;
    #attackPower;
    #isHurt = false;
    #hurtInterval = null;
    #effectMs = {
        speed: 0,
        strength: 0,
        invincibility: 0
    };
    constructor(x, y, assets){
        super(x, y, "player", assets);
        this.#health = 100;
        this.#baseSpeed = (0, $5e4dc8398ac8b78d$export$b54787693599973a).speed;
        this.#attackPower = 50;
        this.powerups = [];
        // Item ids (see items.js) mapped to how many the player carries; the pack
        // survives level changes (see Game.initializePlayer) but not a new run
        this.inventory = {};
        // One weapon and one rune can be equipped at a time
        this.equipment = {
            weapon: null,
            rune: null
        };
        this.weaponId = "axe";
        this.animator = new (0, $ee42f9705d187e0c$export$2e2bcd8739ae039)((0, $597aa4a7a493a015$export$6006ccb11e63f4a2));
        this.currentFrame = 0;
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
            height: this._height
        };
    }
    getHitBox() {
        return {
            x: this._position.x + this._width * 0.25,
            y: this._position.y + this._height * 0.25,
            width: this._width * 0.5,
            height: this._height * 0.5
        };
    }
    getAttackBox() {
        const hitBox = this.getHitBox();
        const reach = this._width * 0.6;
        switch(this.movement){
            case "up":
                return {
                    x: hitBox.x,
                    y: hitBox.y - reach,
                    width: hitBox.width,
                    height: reach
                };
            case "down":
                return {
                    x: hitBox.x,
                    y: hitBox.y + hitBox.height,
                    width: hitBox.width,
                    height: reach
                };
            case "left":
                return {
                    x: hitBox.x - reach,
                    y: hitBox.y,
                    width: reach,
                    height: hitBox.height
                };
            case "right":
            default:
                return {
                    x: hitBox.x + hitBox.width,
                    y: hitBox.y,
                    width: reach,
                    height: hitBox.height
                };
        }
    }
    getHealth() {
        return this.#health;
    }
    get attackPower() {
        let power = this.#attackPower;
        // Equipped weapon and rune bonuses
        for (const equippedId of Object.values(this.equipment)){
            const bonus = equippedId && (0, $a3ad18a970f4f422$export$ef94d4ad2585b6fa)[equippedId].attackBonus;
            if (bonus) power += bonus;
        }
        if (this.#effectMs.strength > 0) power *= (0, $5e4dc8398ac8b78d$export$7ce9e21f246bef3b).strengthMultiplier;
        return power;
    }
    getSpeed() {
        let speed = this.#baseSpeed;
        if (this.#effectMs.speed > 0) speed += (0, $5e4dc8398ac8b78d$export$7ce9e21f246bef3b).speedBoost;
        const rune = this.equipment.rune;
        if (rune && (0, $a3ad18a970f4f422$export$ef94d4ad2585b6fa)[rune].speedBonus) speed += (0, $a3ad18a970f4f422$export$ef94d4ad2585b6fa)[rune].speedBonus;
        return speed;
    }
    getActiveEffects() {
        return Object.entries(this.#effectMs).filter(([, ms])=>ms > 0).map(([name, ms])=>({
                name: name,
                secondsLeft: Math.ceil(ms / 1000),
                msLeft: ms
            }));
    }
    hasEffect(name) {
        return this.#effectMs[name] > 0;
    }
    takeDamage(amount) {
        if (this.#effectMs.invincibility > 0) return;
        if (this.#isHurt || this.#health <= 0) return;
        if (this.equipment.rune === "runeWarding") amount = Math.ceil(amount / 2);
        this.#health = Math.max(0, this.#health - amount);
        if (this.#health <= 0) {
            this.defeat();
            return;
        }
        this.hurtAnimation();
    }
    respawn(x, y) {
        this._position = {
            x: x,
            y: y
        };
        this.#health = 100;
        // A short shield after respawning: a guard standing on the spawn point
        // could otherwise drain the fresh life before the player can react
        this.#effectMs = {
            speed: 0,
            strength: 0,
            invincibility: (0, $5e4dc8398ac8b78d$export$b54787693599973a).respawnProtectionMs
        };
        this.#isHurt = false;
        if (this.#hurtInterval) {
            clearInterval(this.#hurtInterval);
            this.#hurtInterval = null;
        }
        this.visible = true;
        this.movement = "down";
        this.animator.play("idle", {
            restart: true,
            direction: "down"
        });
        this.#syncAnimationState();
    }
    setMovement(direction) {
        if (direction) {
            this.movement = direction;
            this.animator.setDirection(direction);
        }
    }
    setWalking(isWalking) {
        this.animator.setState(isWalking ? "walk" : "idle");
        this.#syncAnimationState();
    }
    moveBy(deltaX, deltaY) {
        this._position.x += deltaX;
        this._position.y += deltaY;
        if (deltaX !== 0 || deltaY !== 0) {
            this.setMovement(Math.abs(deltaX) > Math.abs(deltaY) ? deltaX > 0 ? "right" : "left" : deltaY > 0 ? "down" : "up");
            this.setWalking(true);
        }
    }
    moveLeft(distance = this.getSpeed() / 60) {
        this.moveBy(-distance, 0);
    }
    moveRight(distance = this.getSpeed() / 60) {
        this.moveBy(distance, 0);
    }
    moveUp(distance = this.getSpeed() / 60) {
        this.moveBy(0, -distance);
    }
    moveDown(distance = this.getSpeed() / 60) {
        this.moveBy(0, distance);
    }
    attack() {
        this.animator.play("attack", {
            restart: true,
            direction: this.movement
        });
        this.#syncAnimationState();
    }
    pick() {
        this.animator.play("pick", {
            restart: true,
            direction: this.movement
        });
        this.#syncAnimationState();
    }
    axe() {
        const weapon = (0, $597aa4a7a493a015$export$6006ccb11e63f4a2).weapons[this.weaponId];
        this.animator.play(weapon?.actionState || "axe", {
            restart: true,
            direction: this.movement
        });
        this.#syncAnimationState();
    }
    potion() {
        this.animator.play("potion", {
            restart: true,
            direction: this.movement
        });
        this.#syncAnimationState();
    }
    defeat() {
        this.animator.play("defeated", {
            restart: true,
            direction: this.movement
        });
        this.#syncAnimationState();
    }
    isDefeated() {
        return this.#health <= 0;
    }
    isActionActive(action = this.action) {
        return this.animator.isActiveWindow(action);
    }
    // --- Inventory ---------------------------------------------------------
    addItem(itemId) {
        this.inventory[itemId] = (this.inventory[itemId] || 0) + 1;
    }
    hasItem(itemId) {
        return (this.inventory[itemId] || 0) > 0;
    }
    removeItem(itemId) {
        if (!this.hasItem(itemId)) return false;
        this.inventory[itemId] -= 1;
        if (this.inventory[itemId] === 0) delete this.inventory[itemId];
        return true;
    }
    // Carried items in catalog order, for the inventory screen
    getInventoryEntries() {
        return Object.keys((0, $a3ad18a970f4f422$export$ef94d4ad2585b6fa)).filter((id)=>this.hasItem(id)).map((id)=>({
                id: id,
                count: this.inventory[id]
            }));
    }
    // Consume one item and apply its effect. Returns true when consumed.
    useItem(itemId) {
        const item = (0, $a3ad18a970f4f422$export$ef94d4ad2585b6fa)[itemId];
        if (!item || !this.hasItem(itemId)) return false;
        if (item.kind === "potion") {
            this.removeItem(itemId);
            this.#health = Math.min(100, this.#health + item.healAmount);
            return true;
        }
        return false;
    }
    // Equip a weapon or rune from the inventory, or take it off when it is
    // already worn. Returns "equipped", "unequipped" or null when the item
    // cannot be equipped.
    equip(itemId) {
        const item = (0, $a3ad18a970f4f422$export$ef94d4ad2585b6fa)[itemId];
        if (!item || item.kind !== "weapon" && item.kind !== "rune") return null;
        if (!this.hasItem(itemId)) return null;
        if (this.equipment[item.kind] === itemId) {
            this.equipment[item.kind] = null;
            return "unequipped";
        }
        this.equipment[item.kind] = itemId;
        return "equipped";
    }
    applyPowerup(effect) {
        if (!effect) return;
        this.powerups.push(effect);
        switch(effect){
            case "health":
                this.#health = Math.min(100, this.#health + (0, $5e4dc8398ac8b78d$export$7ce9e21f246bef3b).healAmount);
                break;
            case "speed":
                this.#effectMs.speed = (0, $5e4dc8398ac8b78d$export$7ce9e21f246bef3b).speedDurationMs;
                break;
            case "strength":
                this.#effectMs.strength = (0, $5e4dc8398ac8b78d$export$7ce9e21f246bef3b).strengthDurationMs;
                break;
            case "invincibility":
                this.#effectMs.invincibility = (0, $5e4dc8398ac8b78d$export$7ce9e21f246bef3b).invincibilityDurationMs;
                break;
        }
    }
    update(deltaMs = 1000 / 60) {
        for (const name of Object.keys(this.#effectMs))this.#effectMs[name] = Math.max(0, this.#effectMs[name] - deltaMs);
        this.animator.update(deltaMs);
        this.#syncAnimationState();
    }
    checkCollision(direction, distance = this.getSpeed() / 60) {
        const nextPosition = {
            ...this._position
        };
        switch(direction){
            case "left":
                nextPosition.x -= distance;
                break;
            case "right":
                nextPosition.x += distance;
                break;
            case "up":
                nextPosition.y -= distance;
                break;
            case "down":
                nextPosition.y += distance;
                break;
        }
        return nextPosition;
    }
    hurtAnimation() {
        if (this.#isHurt) return;
        this.#isHurt = true;
        let flickerCount = 0;
        const maxFlickers = 10;
        const flickerDuration = 100;
        this.#hurtInterval = setInterval(()=>{
            this.visible = !this.visible;
            flickerCount++;
            if (flickerCount >= maxFlickers) {
                clearInterval(this.#hurtInterval);
                this.#hurtInterval = null;
                this.#isHurt = false;
                this.visible = true;
            }
        }, flickerDuration);
    }
    draw(ctx) {
        if (!this.visible) return;
        const frame = this.animator.getFrame(this.movement);
        const spriteSheet = this._sprites[frame.sheet];
        const pixelScale = (0, $5e4dc8398ac8b78d$export$ee79b8018014417).cellWidth / 32;
        const destWidth = frame.frameWidth * pixelScale;
        const destHeight = frame.frameHeight * pixelScale;
        const offsetX = ((0, $5e4dc8398ac8b78d$export$ee79b8018014417).cellWidth - destWidth) / 2;
        const offsetY = ((0, $5e4dc8398ac8b78d$export$ee79b8018014417).cellHeight - destHeight) / 2;
        ctx.save();
        if (frame.flip) {
            ctx.scale(-1, 1);
            ctx.drawImage(spriteSheet, frame.sourceX, frame.sourceY, frame.frameWidth, frame.frameHeight, -(this._position.x + offsetX) - destWidth, this._position.y + offsetY, destWidth, destHeight);
        } else ctx.drawImage(spriteSheet, frame.sourceX, frame.sourceY, frame.frameWidth, frame.frameHeight, this._position.x + offsetX, this._position.y + offsetY, destWidth, destHeight);
        ctx.restore();
    }
    #syncAnimationState() {
        this.action = this.animator.state;
        this.currentFrame = this.animator.frame;
    }
}
var $8dc50de6459bd33c$export$2e2bcd8739ae039 = $8dc50de6459bd33c$var$Player;


// Level data
// - Define the structure of each level (layout of the labyrinth)
// - Specify positions of obstacles, powerups, explosives, guards
// - Include metadata (level number, difficulty, name)
//
// Layout legend:
//   '#' wall          ' ' floor         'P' player spawn   'X' exit
//   'T' tree (solid, choppable)         'O' boulder (solid, choppable)
//   'G' guard         'B' boss          'C' crystal        'E' explosive
//   'D' locked door (a defeated guard drops the key)
//
// Every layout is 10 rows of exactly 20 characters. Trees and boulders can
// be chopped down (2 hits), so they make soft walls: a shortcut for players
// willing to stop and swing, a detour for those who keep running.
class $89f761b3181b44bd$var$LevelData {
    constructor(){
        this.levels = [];
    }
    addLevel(level) {
        this.levels.push(level);
    }
    getLevel(levelNumber) {
        return this.levels[levelNumber - 1] || null;
    }
}
class $89f761b3181b44bd$var$Level {
    constructor(number, difficulty, layout, name, options = {}){
        this.number = number;
        this.difficulty = difficulty;
        this.layout = layout;
        this.name = name;
        this.theme = options.theme || "forest";
        // With fog of war on, only explored parts of the map are visible
        this.fogOfWar = Boolean(options.fogOfWar);
    }
}
// Rows are written as strings for readability and converted to the
// character arrays the game consumes
const $89f761b3181b44bd$var$parse = (rows)=>rows.map((row)=>row.split(""));
const $89f761b3181b44bd$var$levelData = new $89f761b3181b44bd$var$LevelData();
// 1. The Glade — tutorial: a small maze inside a forest clearing. One tree
// blocks a corridor (teaches chopping), one boulder guards a dead end.
$89f761b3181b44bd$var$levelData.addLevel(new $89f761b3181b44bd$var$Level(1, "easy", $89f761b3181b44bd$var$parse([
    "TTTTTTTTTTTTTTTTTTTT",
    "T##################T",
    "T#  G #PT     C   #T",
    "T# ## #   ####### #T",
    "T#    #O#  C # ## #T",
    "T# ## # ##   #    #T",
    "T#  # #    #   ## #T",
    "T# ## E ##G# X ## #T",
    "T##################T",
    "TTTTTTTTTTTTTTTTTTTT"
]), "The Glade", {
    theme: "forest"
}));
// 2. The Gatehouse — first locked door: defeat a guard to find the key
$89f761b3181b44bd$var$levelData.addLevel(new $89f761b3181b44bd$var$Level(2, "easy", $89f761b3181b44bd$var$parse([
    "####################",
    "#P  #G  #####      #",
    "# # # #   #   #### #",
    "#     # # ## #     #",
    "#########    #D#####",
    "#X G    ######     #",
    "# # ###    #G##### #",
    "#     ###    #   # #",
    "#   #     ##   #   #",
    "####################"
]), "The Gatehouse", {
    theme: "forest"
}));
// 3. The Orchard — rows of trees form choppable gates between corridors:
// chop straight through or walk around via the side openings
$89f761b3181b44bd$var$levelData.addLevel(new $89f761b3181b44bd$var$Level(3, "medium", $89f761b3181b44bd$var$parse([
    "####################",
    "#P  TT   C  TT    C#",
    "#   TT      TT     #",
    "##T####T######T##T##",
    "#   G     E    G   #",
    "#C  TT      TT     #",
    "##T####T######T# ###",
    "#   G     C  G     #",
    "#  TTT      TT    X#",
    "####################"
]), "The Orchard", {
    theme: "forest"
}));
// 4. The Quarry — boulders plug the wall gaps: every shortcut costs two
// swings of the axe, every detour risks a patrol
$89f761b3181b44bd$var$levelData.addLevel(new $89f761b3181b44bd$var$Level(4, "medium", $89f761b3181b44bd$var$parse([
    "####################",
    "#P   #  C  O  G   C#",
    "#    O     #       #",
    "## ###### ####O### #",
    "#  G   #     C   G #",
    "#    O #  E #      #",
    "# #### ##O### ###O##",
    "#  C      #     G  #",
    "#    G    O   C   X#",
    "####################"
]), "The Quarry", {
    theme: "desert"
}));
// 5. The Warden — the first boss guards the open eastern arena. It is slow:
// keep moving, land a swing, and step away before it closes in.
$89f761b3181b44bd$var$levelData.addLevel(new $89f761b3181b44bd$var$Level(5, "medium", $89f761b3181b44bd$var$parse([
    "####################",
    "#P #  C    #      C#",
    "#  # ## ## #  ### ##",
    "# G#  #  # #       #",
    "#  ## # ###    B   #",
    "#     #            #",
    "# ###### ###   ### #",
    "# C #  G   #       #",
    "#   #      ##  X   #",
    "####################"
]), "The Warden", {
    theme: "desert"
}));
// 6. Twin Halls — two halls behind two locked doors: the guards of each
// hall carry the key to the next
$89f761b3181b44bd$var$levelData.addLevel(new $89f761b3181b44bd$var$Level(6, "hard", $89f761b3181b44bd$var$parse([
    "####################",
    "#P   #  G   #  C  G#",
    "#  C #      #      #",
    "# G  #  E   #  ##  #",
    "#    D      D  ## X#",
    "#  ###      #      #",
    "#    #  C   #   G  #",
    "# ## #      # ###  #",
    "#  G #   G  #  C   #",
    "####################"
]), "Twin Halls", {
    theme: "snow"
}));
// 7. The Serpent — one long winding corridor walked in the dark: fog of
// war hides what waits beyond the next bend. Gates of trees and boulders
// plug the wall gaps.
$89f761b3181b44bd$var$levelData.addLevel(new $89f761b3181b44bd$var$Level(7, "hard", $89f761b3181b44bd$var$parse([
    "####################",
    "#P  C      G      G#",
    "################## #",
    "#    G     C      T#",
    "#T##################",
    "# G     E     C    #",
    "##################O#",
    "#  G     C    G    #",
    "#X                T#",
    "####################"
]), "The Serpent", {
    theme: "snow",
    fogOfWar: true
}));
// 8. The Crossroads — four guarded quadrants around a central plaza where
// a boss patrols the loot
$89f761b3181b44bd$var$levelData.addLevel(new $89f761b3181b44bd$var$Level(8, "hard", $89f761b3181b44bd$var$parse([
    "####################",
    "#P   #   C  #     G#",
    "#  G #      #  C   #",
    "#### ## ## ## # ####",
    "#      G           #",
    "#  C     B      E  #",
    "#### ## ## ## # ####",
    "#  G #      #   G  #",
    "#    # C    #    X #",
    "####################"
]), "The Crossroads", {
    theme: "dungeon"
}));
// 9. The Gauntlet — four chambers in a row, each sealed by a locked door;
// every chamber's guards carry the next key
$89f761b3181b44bd$var$levelData.addLevel(new $89f761b3181b44bd$var$Level(9, "expert", $89f761b3181b44bd$var$parse([
    "####################",
    "#P  #C  G#   G# C  #",
    "#   #    #    #    #",
    "# G D  G D  E D  G #",
    "#   #    #    #    #",
    "## ## ## # ## ## ###",
    "#C  #  G #  G #   G#",
    "#   #    #    #  ###",
    "# G #  C #  C #  X##",
    "####################"
]), "The Gauntlet", {
    theme: "dungeon",
    fogOfWar: true
}));
// 10. The Throne — the final boss waits in an inner sanctum behind a locked
// door, with the exit at its back. Sneak past it or bring it down for glory.
$89f761b3181b44bd$var$levelData.addLevel(new $89f761b3181b44bd$var$Level(10, "expert", $89f761b3181b44bd$var$parse([
    "####################",
    "#P   #     C    G  #",
    "# G  # ##########  #",
    "#    # #      X##  #",
    "## # # #  B    ## C#",
    "#  # # #       ##  #",
    "#  #   ####D##### G#",
    "#E ## G    C     ###",
    "#C     ##     G   T#",
    "####################"
]), "The Throne", {
    theme: "dungeon",
    fogOfWar: true
}));
var $89f761b3181b44bd$export$2e2bcd8739ae039 = $89f761b3181b44bd$var$levelData;


// helper functions for the canvas
function $561f00ef01a83395$export$a1c066623ac679d3(canvas, context) {
    context.clearRect(0, 0, canvas.width, canvas.height);
}
function $561f00ef01a83395$export$28e08eff11ac64f6(container) {
    container.innerHTML = "";
}


function $92ec84c877bc9d44$export$5efe44c485c74673(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x && rect1.y < rect2.y + rect2.height && rect1.y + rect1.height > rect2.y;
}


// Seedable random number generator (mulberry32)
// - Drop-in replacement for Math.random so game runs can be reproduced
// - Pass ?seed=123 in the URL (used by automated tests) for deterministic runs
// - Without a seed the generator is seeded randomly, as before
let $2c118fbc300d5c4b$var$state = 0;
function $2c118fbc300d5c4b$var$mulberry32() {
    $2c118fbc300d5c4b$var$state |= 0;
    $2c118fbc300d5c4b$var$state = $2c118fbc300d5c4b$var$state + 0x6d2b79f5 | 0;
    let t = Math.imul($2c118fbc300d5c4b$var$state ^ $2c118fbc300d5c4b$var$state >>> 15, 1 | $2c118fbc300d5c4b$var$state);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
}
function $2c118fbc300d5c4b$export$1471ce584de8ada3(seed) {
    $2c118fbc300d5c4b$var$state = seed | 0;
}
function $2c118fbc300d5c4b$export$4385e60b38654f68() {
    return $2c118fbc300d5c4b$var$mulberry32();
}
function $2c118fbc300d5c4b$export$3c5f89dae98e900b(min, max) {
    return Math.floor($2c118fbc300d5c4b$export$4385e60b38654f68() * (max - min + 1)) + min;
}
function $2c118fbc300d5c4b$var$initialSeed() {
    if (typeof window !== "undefined") {
        const seedParam = new URLSearchParams(window.location.search).get("seed");
        if (seedParam !== null && seedParam !== "" && !Number.isNaN(Number(seedParam))) return Number(seedParam);
    }
    return Math.floor(Math.random() * 2 ** 31);
}
$2c118fbc300d5c4b$export$1471ce584de8ada3($2c118fbc300d5c4b$var$initialSeed());



// Wall entity class
// - Represents the walls in the game
// - Defines properties such as position, width, height
// - May include methods for rendering the wall
// - Could include collision detection logic specific to walls
// - Might have different types of walls (e.g., breakable, unbreakable)
// - Could include methods for special wall behaviors (e.g., secret passages)
class $9fac4e2fdae503de$var$Wall extends (0, $7fde6e2b56878ba7$export$2e2bcd8739ae039) {
    #type;
    constructor(x, y, type, assets){
        super(x, y);
        this.#type = type; // 'normal', 'breakable', 'secret'
        this._sprite = assets.wall;
    }
    getType() {
        return this.#type;
    }
    update() {
    // Update wall state if needed (e.g., for breakable walls)
    }
    draw(ctx) {
        ctx.drawImage(this._sprite, this._position.x, this._position.y, this._width, this._height);
    }
}
var $9fac4e2fdae503de$export$2e2bcd8739ae039 = $9fac4e2fdae503de$var$Wall;




// Explosive entity — a hidden trap
// - Starts hidden. When the player comes close it reveals itself and arms:
//   a short fuse starts burning (the bomb flashes faster and faster).
// - When the fuse runs out it detonates, damaging the player AND any guards
//   inside the blast radius. The game reads the blast via consumeBlast().
// - An armed trap can be disarmed with the pick action before it blows.
// - Drawn procedurally (bomb + fuse spark + expanding blast), no sprite needed.
const $976fbe886af494f7$var$EXPLOSION_ANIMATION_MS = 350;
class $976fbe886af494f7$var$Explosive extends (0, $7fde6e2b56878ba7$export$2e2bcd8739ae039) {
    #state = "hidden";
    #fuseMs = (0, $5e4dc8398ac8b78d$export$eb39dd4a78414223).explosiveFuseMs;
    #explosionMs = $976fbe886af494f7$var$EXPLOSION_ANIMATION_MS;
    #blastConsumed = false;
    constructor(x, y){
        super(x, y, "explosive");
    }
    isHidden() {
        return this.#state === "hidden";
    }
    isArmed() {
        return this.#state === "armed";
    }
    isExploding() {
        return this.#state === "exploding";
    }
    // Finished exploding; safe to remove from the game
    isDone() {
        return this.#state === "done";
    }
    getCenter() {
        return {
            x: this._position.x + this._width / 2,
            y: this._position.y + this._height / 2
        };
    }
    // The blast is applied exactly once, on the frame the fuse runs out.
    // Returns the blast circle on that frame, null otherwise.
    consumeBlast() {
        if (this.#state !== "exploding" || this.#blastConsumed) return null;
        this.#blastConsumed = true;
        return {
            ...this.getCenter(),
            radius: (0, $5e4dc8398ac8b78d$export$eb39dd4a78414223).explosiveBlastRadius
        };
    }
    update(playerHitBox, deltaMs = 1000 / 60) {
        switch(this.#state){
            case "hidden":
                {
                    if (!playerHitBox) break;
                    const center = this.getCenter();
                    const px = playerHitBox.x + playerHitBox.width / 2;
                    const py = playerHitBox.y + playerHitBox.height / 2;
                    const distance = Math.hypot(px - center.x, py - center.y);
                    if (distance <= (0, $5e4dc8398ac8b78d$export$eb39dd4a78414223).explosiveTriggerRange) this.#state = "armed";
                    break;
                }
            case "armed":
                this.#fuseMs -= deltaMs;
                if (this.#fuseMs <= 0) this.#state = "exploding";
                break;
            case "exploding":
                this.#explosionMs -= deltaMs;
                if (this.#explosionMs <= 0) this.#state = "done";
                break;
        }
    }
    draw(ctx) {
        if (this.#state === "hidden" || this.#state === "done") return;
        const center = this.getCenter();
        ctx.save();
        if (this.#state === "armed") {
            // Bomb body
            ctx.fillStyle = "#1c1c1c";
            ctx.beginPath();
            ctx.arc(center.x, center.y + 6, 16, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "#000";
            ctx.lineWidth = 2;
            ctx.stroke();
            // Fuse
            ctx.strokeStyle = "#8B4513";
            ctx.beginPath();
            ctx.moveTo(center.x, center.y - 10);
            ctx.quadraticCurveTo(center.x + 10, center.y - 20, center.x + 14, center.y - 14);
            ctx.stroke();
            // Spark, flickering
            ctx.fillStyle = Math.floor(this.#fuseMs / 130) % 2 === 0 ? "#ffd54f" : "#ff7043";
            ctx.beginPath();
            ctx.arc(center.x + 14, center.y - 14, 4, 0, Math.PI * 2);
            ctx.fill();
            // Red warning flash that speeds up as the fuse burns down
            const flashPeriodMs = this.#fuseMs > (0, $5e4dc8398ac8b78d$export$eb39dd4a78414223).explosiveFuseMs / 2 ? 330 : 130;
            if (this.#fuseMs % flashPeriodMs < flashPeriodMs / 2) {
                ctx.fillStyle = "rgba(255, 40, 40, 0.25)";
                ctx.beginPath();
                ctx.arc(center.x, center.y, (0, $5e4dc8398ac8b78d$export$eb39dd4a78414223).explosiveBlastRadius, 0, Math.PI * 2);
                ctx.fill();
            }
        } else {
            // Expanding blast rings
            const progress = 1 - this.#explosionMs / $976fbe886af494f7$var$EXPLOSION_ANIMATION_MS;
            const radius = (0, $5e4dc8398ac8b78d$export$eb39dd4a78414223).explosiveBlastRadius * progress;
            const alpha = 1 - progress;
            ctx.fillStyle = `rgba(255, 160, 30, ${alpha * 0.7})`;
            ctx.beginPath();
            ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = `rgba(255, 240, 120, ${alpha})`;
            ctx.beginPath();
            ctx.arc(center.x, center.y, radius * 0.55, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }
}
var $976fbe886af494f7$export$2e2bcd8739ae039 = $976fbe886af494f7$var$Explosive;








class $5c1be042cdfa6fbe$var$Guard extends (0, $7fde6e2b56878ba7$export$2e2bcd8739ae039) {
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
    constructor(x, y, type, assets, { boss: boss = false } = {}){
        super(x, y, type, assets, boss ? (0, $5e4dc8398ac8b78d$export$b9c8e024d5962062).width : (0, $5e4dc8398ac8b78d$export$eb39dd4a78414223).enemyWidth, boss ? (0, $5e4dc8398ac8b78d$export$b9c8e024d5962062).height : (0, $5e4dc8398ac8b78d$export$eb39dd4a78414223).enemyHeight);
        this.#isBoss = boss;
        this.animator = new (0, $ee42f9705d187e0c$export$2e2bcd8739ae039)((0, $597aa4a7a493a015$export$2fa9270261de0878));
        this.movement = [
            "down",
            "up",
            "left",
            "right"
        ][(0, $2c118fbc300d5c4b$export$3c5f89dae98e900b)(0, 3)];
        this.animator.setDirection(this.movement);
        this.action = "idle";
        this.damage = boss ? (0, $5e4dc8398ac8b78d$export$b9c8e024d5962062).damage : 10;
        this.#maxHealth = boss ? (0, $5e4dc8398ac8b78d$export$b9c8e024d5962062).health : 100;
        this.#health = this.#maxHealth;
        this.#speed = boss ? (0, $5e4dc8398ac8b78d$export$b9c8e024d5962062).speed : 60; // pixels per second
        this.#detectionRange = (boss ? (0, $5e4dc8398ac8b78d$export$b9c8e024d5962062).detectionRangeCells : 5) * (0, $5e4dc8398ac8b78d$export$ee79b8018014417).cellWidth;
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
            height: this._height - insetY * 2
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
            walkAttack: assets[`${this._type}_Walk_Attack`]
        };
    }
    #setSpriteForAction(action) {
        switch(action){
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
        if (Math.abs(dx) > Math.abs(dy)) this.movement = dx > 0 ? "right" : "left";
        else this.movement = dy > 0 ? "down" : "up";
        this.animator.setDirection(this.movement);
        const distance = this.#speed * (deltaMs / 1000);
        const nextPosition = {
            ...this._position,
            width: (0, $5e4dc8398ac8b78d$export$ee79b8018014417).cellWidth / 2,
            height: (0, $5e4dc8398ac8b78d$export$ee79b8018014417).cellHeight / 2
        };
        switch(this.movement){
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
        const willCollideWithWalls = walls.some((wall)=>(0, $92ec84c877bc9d44$export$5efe44c485c74673)(nextPosition, wall.getHitBox()));
        const willCollideWithPlayer = (0, $92ec84c877bc9d44$export$5efe44c485c74673)(nextPosition, target);
        if (willCollideWithPlayer) this.attack();
        else if (!willCollideWithWalls) {
            this._position = {
                x: nextPosition.x,
                y: nextPosition.y
            };
            this.walk();
        } else this.idle();
    }
    detectPlayer(playerPosition, walls) {
        if (this.isDefeated()) return false;
        const dx = playerPosition.x - this._position.x;
        const dy = playerPosition.y - this._position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance <= this.#detectionRange) {
            const step = {
                x: dx / distance,
                y: dy / distance
            };
            let checkPosition = {
                ...this._position,
                width: (0, $5e4dc8398ac8b78d$export$ee79b8018014417).cellWidth / 2,
                height: (0, $5e4dc8398ac8b78d$export$ee79b8018014417).cellHeight / 2
            };
            for(let i = 0; i < distance; i += (0, $5e4dc8398ac8b78d$export$ee79b8018014417).cellWidth / 2){
                checkPosition.x += step.x * ((0, $5e4dc8398ac8b78d$export$ee79b8018014417).cellWidth / 2);
                checkPosition.y += step.y * ((0, $5e4dc8398ac8b78d$export$ee79b8018014417).cellHeight / 2);
                if (walls.some((wall)=>(0, $92ec84c877bc9d44$export$5efe44c485c74673)(checkPosition, wall.getHitBox()))) return false;
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
        this.animator.play("attack", {
            restart: true,
            direction: this.movement
        });
        this.#syncAnimationState();
    }
    hurt() {
        this.animator.play("hurt", {
            restart: true,
            direction: this.movement
        });
        this.#syncAnimationState();
    }
    // Apply damage from the player. `fromDirection` is the direction the
    // player was facing, so the guard is knocked back away from the swing.
    takeDamage(amount, fromDirection = null) {
        if (this.#health <= 0) return false;
        this.#health = Math.max(0, this.#health - amount);
        this.#healthBarMs = (0, $5e4dc8398ac8b78d$export$29a11ee6bb22dbd).healthBarVisibleMs;
        if (this.#health <= 0) {
            this.defeat();
            return true;
        }
        // Bosses are too heavy to be pushed around
        if (fromDirection && !this.#isBoss) {
            const push = {
                up: {
                    x: 0,
                    y: -1
                },
                down: {
                    x: 0,
                    y: 1
                },
                left: {
                    x: -1,
                    y: 0
                },
                right: {
                    x: 1,
                    y: 0
                }
            }[fromDirection];
            if (push) this.#knockback = {
                ...push,
                msLeft: (0, $5e4dc8398ac8b78d$export$29a11ee6bb22dbd).knockbackDurationMs
            };
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
        this.animator.play("dead", {
            restart: true,
            direction: this.movement
        });
        this.#syncAnimationState();
    }
    lookAround() {
        const directions = [
            "up",
            "right",
            "down",
            "left"
        ];
        const currentIndex = directions.indexOf(this.movement);
        this.movement = currentIndex !== -1 ? directions[(currentIndex + 1) % 4] : "up";
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
        if (this.detectPlayer(playerPosition, walls)) this.moveTowards(playerPosition, walls, deltaMs);
        else this.idle();
    }
    #applyKnockback(walls, deltaMs) {
        const distance = (0, $5e4dc8398ac8b78d$export$29a11ee6bb22dbd).knockbackSpeed * (deltaMs / 1000);
        const nextPosition = {
            x: this._position.x + this.#knockback.x * distance,
            y: this._position.y + this.#knockback.y * distance,
            width: (0, $5e4dc8398ac8b78d$export$ee79b8018014417).cellWidth / 2,
            height: (0, $5e4dc8398ac8b78d$export$ee79b8018014417).cellHeight / 2
        };
        const blocked = walls.some((wall)=>(0, $92ec84c877bc9d44$export$5efe44c485c74673)(nextPosition, wall.getHitBox()));
        if (!blocked) this._position = {
            x: nextPosition.x,
            y: nextPosition.y
        };
        this.#knockback.msLeft -= deltaMs;
        if (this.#knockback.msLeft <= 0 || blocked) this.#knockback = null;
    }
    draw(ctx) {
        const frame = this.animator.getFrame(this.movement);
        ctx.drawImage(this.#currentSprite, frame.sourceX, frame.sourceY, frame.frameWidth, frame.frameHeight, this._position.x - 10, this._position.y - 10, this._width, this._height);
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
var $5c1be042cdfa6fbe$export$2e2bcd8739ae039 = $5c1be042cdfa6fbe$var$Guard;




// Obstacle entity class
// - Represents the obstacles in the game
// - Can be destroyed by the player
// - Can drop powerups when destroyed
// - Can drop explosives when destroyed
// - Can drop keys when destroyed
// - Can drop keys when destroyed
class $ef00117c6c001652$var$Obstacle extends (0, $7fde6e2b56878ba7$export$2e2bcd8739ae039) {
    #health;
    constructor(x, y, type, assets){
        super(x, y, type, assets);
        this.#health = 100;
        if (type === "boulder") this._sprite = assets.boulder;
        else if (type === "tree") {
            const trees = assets.trees || [
                assets.palm1,
                assets.palm2
            ].filter(Boolean);
            this._sprite = trees.length ? trees[(0, $2c118fbc300d5c4b$export$3c5f89dae98e900b)(1, trees.length) - 1] : assets.boulder;
        }
    }
    takeDamage(amount) {
        this.#health -= amount;
        if (this.#health <= 0) return this.destroy();
        return null;
    }
    isDestroyed() {
        return this.#health <= 0;
    }
    destroy() {
        // Implement destruction logic
        console.log("Obstacle destroyed!");
    // Return dropped items (powerups, explosives, keys)
    }
    update() {
    // Update obstacle state if needed
    }
    draw(ctx) {
        if (this.#health > 0) ctx.drawImage(this._sprite, this._position.x, this._position.y, this._width, this._height);
    }
}
var $ef00117c6c001652$export$2e2bcd8739ae039 = $ef00117c6c001652$var$Obstacle;



const $e75d48523a669613$export$be5092f292f06d78 = {
    health: "Red Crystal \u2014 restores 25 health",
    speed: "Blue Crystal \u2014 speed boost for 10 seconds!",
    strength: "Green Crystal \u2014 double attack power for 10 seconds!",
    invincibility: "Yellow Crystal \u2014 invincible for 10 seconds!"
};
// Powerup entity class
// - Represents the powerups in the game
// - Can be collected by the player
// - Can be dropped by guards
// - Can be dropped by obstacles
// - Properties: position, type, collected
// - Methods: collect (mark as collected), update, draw
class $e75d48523a669613$var$Powerup extends (0, $7fde6e2b56878ba7$export$2e2bcd8739ae039) {
    #collected;
    constructor(x, y, type, assets){
        super(x, y, type, assets);
        this.#collected = false;
    }
    selectSprites(assets) {
        switch(this._type){
            case "health":
                return {
                    crystal: assets.redCrystal
                };
            case "speed":
                return {
                    crystal: assets.blueCrystal
                };
            case "strength":
                return {
                    crystal: assets.greenCrystal
                };
            case "invincibility":
                return {
                    crystal: assets.yellowCrystal
                };
            default:
                return {
                    crystal: assets.blueCrystal
                };
        }
    }
    collect() {
        if (!this.#collected) {
            this.#collected = true;
            return this._type;
        }
        return null;
    }
    // ... rest of the Powerup class methods ...
    draw(ctx) {
        if (!this.#collected) ctx.drawImage(this._sprites.crystal, this._position.x, this._position.y, this._width, this._height);
    }
}
var $e75d48523a669613$export$2e2bcd8739ae039 = $e75d48523a669613$var$Powerup;




// Exit entity class
// - Represents the exit in the game
// - Can be collected by the player
// - Properties: position
// - Methods: collect (mark as collected), update, draw
class $e5df31305d7c9e22$var$Exit extends (0, $7fde6e2b56878ba7$export$2e2bcd8739ae039) {
    constructor(x, y, assets){
        super(x, y, "exit", assets);
        this._sprite = assets.exit || assets.yellowRuin;
        this._sparkles = this._createSparkles();
    }
    _createSparkles() {
        const sparkleCount = 20;
        const sparkles = [];
        for(let i = 0; i < sparkleCount; i++)sparkles.push({
            x: this._position.x + (0, $2c118fbc300d5c4b$export$4385e60b38654f68)() * this._width,
            y: this._position.y + (0, $2c118fbc300d5c4b$export$4385e60b38654f68)() * this._height,
            vy: -0.5 + (0, $2c118fbc300d5c4b$export$4385e60b38654f68)() * 0.5 // vertical velocity
        });
        return sparkles;
    }
    _updateSparkles() {
        for (const sparkle of this._sparkles){
            sparkle.y += sparkle.vy;
            if (sparkle.y < this._position.y) sparkle.y = this._position.y + this._height;
        }
    }
    draw(ctx) {
        // Draw a semi-transparent dark rectangle over the current cell
        // Create a radial gradient
        const gradient = ctx.createRadialGradient(this._position.x + this._width / 2, this._position.y + this._height / 2, 0, this._position.x + this._width / 2, this._position.y + this._height / 2, Math.max(this._width, this._height) / 2);
        gradient.addColorStop(0, "rgba(255, 255, 200, 0.5)"); // Lighter in the middle
        gradient.addColorStop(1, "rgba(255, 255, 200, 0.1)"); // Darker at the edges
        ctx.fillStyle = gradient;
        ctx.fillRect(this._position.x, this._position.y, this._width, this._height);
        // Draw the exit sprite
        ctx.drawImage(this._sprite, this._position.x, this._position.y, this._width, this._height);
        // Update and draw sparkles
        this._updateSparkles();
        const sparkleSize = 1;
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        for (const sparkle of this._sparkles){
            ctx.beginPath();
            ctx.arc(sparkle.x, sparkle.y, sparkleSize, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}
var $e5df31305d7c9e22$export$2e2bcd8739ae039 = $e5df31305d7c9e22$var$Exit;




// Drop entity class
// - An item lying on the ground after a guard is defeated
// - Bobs gently so it stands out from the scenery
// - Picked up (into the player's inventory) on contact; see Game.checkCollisions
class $20eac8a262d6586b$var$Drop extends (0, $7fde6e2b56878ba7$export$2e2bcd8739ae039) {
    #ageMs = 0;
    constructor(x, y, itemId, itemAssets){
        super(x, y, itemId, itemAssets);
    }
    selectSprites(assets) {
        return {
            icon: assets[(0, $a3ad18a970f4f422$export$ef94d4ad2585b6fa)[this._type].icon]
        };
    }
    update(deltaMs = 1000 / 60) {
        this.#ageMs += deltaMs;
    }
    draw(ctx) {
        // Drawn smaller than a full cell so it reads as loot, not scenery
        const size = 40;
        const bob = Math.sin(this.#ageMs / 300) * 3;
        ctx.drawImage(this._sprites.icon, this._position.x + (this._width - size) / 2, this._position.y + (this._height - size) / 2 + bob, size, size);
    }
}
var $20eac8a262d6586b$export$2e2bcd8739ae039 = $20eac8a262d6586b$var$Drop;



// Door entity class
// - A locked wooden door that blocks a corridor inside the maze ('D' tile)
// - Blocks the player and guards like a wall while locked
// - Walking into it while carrying a key unlocks it (see Game.checkDoorUnlock);
//   once open it disappears and the corridor is free
class $9e9fb8aeb689d56c$var$Door extends (0, $7fde6e2b56878ba7$export$2e2bcd8739ae039) {
    constructor(x, y, assets){
        super(x, y, "door", assets);
        this.locked = true;
    }
    selectSprites(assets) {
        return {
            door: assets.door
        };
    }
    unlock() {
        this.locked = false;
    }
    draw(ctx) {
        if (!this.locked) return; // an opened door leaves a free passage
        ctx.drawImage(this._sprites.door, this._position.x, this._position.y, this._width, this._height);
        // A padlock signals that the door needs a key
        const lockX = this._position.x + this._width / 2 - 9;
        const lockY = this._position.y + this._height / 2 - 2;
        ctx.save();
        // Shackle
        ctx.strokeStyle = "#cfd8dc";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(lockX + 9, lockY + 2, 6, Math.PI, 0);
        ctx.stroke();
        // Body
        ctx.fillStyle = "#ffd54f";
        ctx.fillRect(lockX, lockY + 2, 18, 14);
        // Keyhole
        ctx.fillStyle = "#5d4037";
        ctx.fillRect(lockX + 7, lockY + 6, 4, 7);
        ctx.restore();
    }
}
var $9e9fb8aeb689d56c$export$2e2bcd8739ae039 = $9e9fb8aeb689d56c$var$Door;



// Per-level visual theme registry.
// Theme entries point at keys in the loaded level-assets object.
const $22420ff5e9ad6429$export$2faeed762aac6741 = "forest";
const $22420ff5e9ad6429$export$ce0e5beb5efeb79 = {
    forest: {
        name: "Forest",
        floor: "grassTile",
        wall: "wall",
        trees: [
            "palm1",
            "palm2",
            "tree1",
            "tree2",
            "tree3"
        ],
        boulder: "boulder",
        exit: "yellowRuin",
        floorFallback: "#2f7d3b"
    },
    desert: {
        name: "Desert Ruins",
        floor: "desertFloor",
        wall: "desertWall",
        trees: [
            "desertTree1",
            "desertTree2"
        ],
        boulder: "desertBoulder",
        exit: "desertExit",
        floorFallback: "#b8904d"
    },
    snow: {
        name: "Frozen Halls",
        floor: "snowFloor",
        wall: "snowWall",
        trees: [
            "snowTree1",
            "snowTree2"
        ],
        boulder: "snowBoulder",
        exit: "snowExit",
        floorFallback: "#d8e7ef"
    },
    dungeon: {
        name: "Dungeon Depths",
        floor: "dungeonFloor",
        wall: "dungeonWall",
        trees: [
            "dungeonObstacle1",
            "dungeonObstacle2"
        ],
        boulder: "dungeonBoulder",
        exit: "dungeonExit",
        floorFallback: "#27262d"
    }
};
const $22420ff5e9ad6429$var$assetFromTheme = (levelAssets, theme, fallbackTheme, key)=>levelAssets[theme[key]] || levelAssets[fallbackTheme[key]];
function $22420ff5e9ad6429$export$89cbf1a0881c8b9c(themeId) {
    return $22420ff5e9ad6429$export$ce0e5beb5efeb79[themeId] || $22420ff5e9ad6429$export$ce0e5beb5efeb79[$22420ff5e9ad6429$export$2faeed762aac6741];
}
function $22420ff5e9ad6429$export$681c25f1d1647c1c(levelAssets, themeId = $22420ff5e9ad6429$export$2faeed762aac6741) {
    const theme = $22420ff5e9ad6429$export$89cbf1a0881c8b9c(themeId);
    const fallbackTheme = $22420ff5e9ad6429$export$ce0e5beb5efeb79[$22420ff5e9ad6429$export$2faeed762aac6741];
    const trees = theme.trees.map((key)=>levelAssets[key]).filter(Boolean);
    return {
        id: $22420ff5e9ad6429$export$ce0e5beb5efeb79[themeId] ? themeId : $22420ff5e9ad6429$export$2faeed762aac6741,
        name: theme.name,
        floor: $22420ff5e9ad6429$var$assetFromTheme(levelAssets, theme, fallbackTheme, "floor"),
        wall: $22420ff5e9ad6429$var$assetFromTheme(levelAssets, theme, fallbackTheme, "wall"),
        trees: trees.length ? trees : fallbackTheme.trees.map((key)=>levelAssets[key]).filter(Boolean),
        boulder: $22420ff5e9ad6429$var$assetFromTheme(levelAssets, theme, fallbackTheme, "boulder"),
        exit: $22420ff5e9ad6429$var$assetFromTheme(levelAssets, theme, fallbackTheme, "exit"),
        floorFallback: theme.floorFallback || fallbackTheme.floorFallback
    };
}


class $966e57966c4ea9d7$export$985739bfa5723e08 {
    constructor(containerId, canvas, context, assets, callbacks = {}){
        this.container = document.getElementById(containerId);
        this.canvas = canvas;
        this.context = context;
        this.player = null;
        this.board = [];
        this.entities = [];
        this.walls = [];
        this.exit = null;
        this.lives = (0, $5e4dc8398ac8b78d$export$b54787693599973a).initialLives;
        this.score = 0;
        this.currentLevel = (0, $5e4dc8398ac8b78d$export$46cdd0893df07df1).initialLevel;
        this.isGameOver = false;
        this.started = false;
        this.paused = false;
        this.assets = assets;
        this.themeAssets = (0, $22420ff5e9ad6429$export$681c25f1d1647c1c)(this.assets.levelAssets);
        this.explosives = [];
        this.guards = [];
        this.obstacles = [];
        this.powerups = [];
        this.playerStart = {
            x: 0,
            y: 0
        };
        this.notifications = [];
        this.drops = [];
        this.doors = [];
        this.inventoryOpen = false;
        this.mouse = {
            x: 0,
            y: 0
        };
        this.inventorySlotRects = [];
        this.onGameOver = callbacks.onGameOver || (()=>{});
        this.onLevelCompleted = callbacks.onLevelCompleted || (()=>{});
        this.onGameWon = callbacks.onGameWon || (()=>{});
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
    }
    initializeBoard() {
        const level = (0, $89f761b3181b44bd$export$2e2bcd8739ae039).getLevel(this.currentLevel);
        if (level) {
            this.walls = [];
            this.doors = [];
            this.exit = null;
            this.board = level.layout;
            this.themeAssets = (0, $22420ff5e9ad6429$export$681c25f1d1647c1c)(this.assets.levelAssets, level.theme);
            this.fogEnabled = level.fogOfWar;
            this.explored = level.layout.map((row)=>row.map(()=>false));
            if (this.fogEnabled) this.notify("Fog of war \u2014 explore to reveal the map!");
            for(let y = 0; y < level.layout.length; y++)for(let x = 0; x < level.layout[y].length; x++){
                if (level.layout[y][x] === "#") this.walls.push(new (0, $9fac4e2fdae503de$export$2e2bcd8739ae039)(x * (0, $5e4dc8398ac8b78d$export$ee79b8018014417).cellWidth, y * (0, $5e4dc8398ac8b78d$export$ee79b8018014417).cellHeight, "normal", this.themeAssets));
                if (level.layout[y][x] === "D") this.doors.push(new (0, $9e9fb8aeb689d56c$export$2e2bcd8739ae039)(x * (0, $5e4dc8398ac8b78d$export$ee79b8018014417).cellWidth, y * (0, $5e4dc8398ac8b78d$export$ee79b8018014417).cellHeight, this.assets.itemAssets));
                if (level.layout[y][x] === "X") this.exit = new (0, $e5df31305d7c9e22$export$2e2bcd8739ae039)(x * (0, $5e4dc8398ac8b78d$export$ee79b8018014417).cellWidth, y * (0, $5e4dc8398ac8b78d$export$ee79b8018014417).cellHeight, this.themeAssets);
            }
        }
    }
    initializePlayer() {
        const level = (0, $89f761b3181b44bd$export$2e2bcd8739ae039).getLevel(this.currentLevel);
        if (level) for(let y = 0; y < level.layout.length; y++){
            for(let x = 0; x < level.layout[y].length; x++)if (level.layout[y][x] === "P") {
                this.playerStart = {
                    x: x * (0, $5e4dc8398ac8b78d$export$ee79b8018014417).cellWidth,
                    y: y * (0, $5e4dc8398ac8b78d$export$ee79b8018014417).cellHeight
                };
                const previousPlayer = this.player;
                this.player = new (0, $8dc50de6459bd33c$export$2e2bcd8739ae039)(this.playerStart.x, this.playerStart.y, this.assets.playerAssets);
                // The pack and equipped gear travel with the player from level
                // to level; a fresh run starts empty (start() clears the player)
                if (previousPlayer) {
                    this.player.inventory = {
                        ...previousPlayer.inventory
                    };
                    this.player.equipment = {
                        ...previousPlayer.equipment
                    };
                }
                this.setupInput();
                return;
            }
        }
    }
    setupInput() {
        // Only register the listener once; initializePlayer runs again on every
        // level change and would otherwise stack duplicate handlers
        if (this.inputSetup) return;
        this.inputSetup = true;
        let actionTimeout;
        const debounceAction = (callback, delay)=>{
            return ()=>{
                clearTimeout(actionTimeout);
                actionTimeout = setTimeout(()=>{
                    this.player.setWalking(false);
                }, delay);
                callback();
            };
        };
        const directionForKey = (key)=>{
            switch(key){
                case (0, $5e4dc8398ac8b78d$export$582ce1a401bc3f08).up:
                    return "up";
                case (0, $5e4dc8398ac8b78d$export$582ce1a401bc3f08).down:
                    return "down";
                case (0, $5e4dc8398ac8b78d$export$582ce1a401bc3f08).left:
                    return "left";
                case (0, $5e4dc8398ac8b78d$export$582ce1a401bc3f08).right:
                    return "right";
                default:
                    return null;
            }
        };
        window.addEventListener("keydown", (event)=>{
            if (!this.started || this.paused || this.isGameOver) return;
            // Stop the space bar (and arrow keys) from scrolling the page
            if (event.key === " " || event.key.startsWith("Arrow")) event.preventDefault();
            if (event.key === (0, $5e4dc8398ac8b78d$export$582ce1a401bc3f08).inventory) {
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
            switch(event.key){
                case (0, $5e4dc8398ac8b78d$export$582ce1a401bc3f08).attack:
                    debounceAction(()=>this.playerAttack(), 250)();
                    break;
                case (0, $5e4dc8398ac8b78d$export$582ce1a401bc3f08).pick:
                    debounceAction(()=>this.playerPick(), 150)();
                    break;
                case (0, $5e4dc8398ac8b78d$export$582ce1a401bc3f08).axe:
                    debounceAction(()=>this.playerAxe(), 250)();
                    break;
                case (0, $5e4dc8398ac8b78d$export$582ce1a401bc3f08).potion:
                    debounceAction(()=>this.playerDrinkPotion(), 500)();
                    break;
            }
        });
        window.addEventListener("keyup", (event)=>{
            const direction = directionForKey(event.key);
            if (direction) this.pressedDirections.delete(direction);
        });
        // Mouse support for the inventory screen (hover = tooltip, click = use)
        this.canvas.addEventListener("mousemove", (event)=>{
            const rect = this.canvas.getBoundingClientRect();
            this.mouse = {
                x: (event.clientX - rect.left) * (this.canvas.width / rect.width),
                y: (event.clientY - rect.top) * (this.canvas.height / rect.height)
            };
        });
        this.canvas.addEventListener("click", ()=>{
            if (!this.inventoryOpen) return;
            const slot = this.inventorySlotRects.find((r)=>this.mouse.x >= r.x && this.mouse.x <= r.x + r.size && this.mouse.y >= r.y && this.mouse.y <= r.y + r.size);
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
        const item = (0, $a3ad18a970f4f422$export$ef94d4ad2585b6fa)[itemId];
        if (item.kind === "weapon" || item.kind === "rune") {
            const result = this.player.equip(itemId);
            if (result === "equipped") this.notify(`${item.name} equipped`);
            if (result === "unequipped") this.notify(`${item.name} unequipped`);
        } else if (item.kind === "potion") this.playerDrinkPotion();
    }
    playerDrinkPotion() {
        if (this.player.useItem("potion")) {
            this.player.potion(); // drink animation
            (0, $f0a686cca0390838$export$dc12ec5f7c61c268).gulp();
            this.notify(`You drank a Health Potion (+${(0, $a3ad18a970f4f422$export$ef94d4ad2585b6fa).potion.healAmount} health)`);
        } else this.notifyOnce("You have no potions \u2014 defeated guards sometimes drop them.");
    }
    getMovementVector() {
        const x = (this.pressedDirections.has("right") ? 1 : 0) - (this.pressedDirections.has("left") ? 1 : 0);
        const y = (this.pressedDirections.has("down") ? 1 : 0) - (this.pressedDirections.has("up") ? 1 : 0);
        if (x === 0 && y === 0) return {
            x: 0,
            y: 0
        };
        const length = Math.hypot(x, y);
        return {
            x: x / length,
            y: y / length
        };
    }
    canPlayerMoveTo(next) {
        const hitBox = this.player.getHitBox();
        const current = this.player.getPosition();
        const nextHitBox = {
            x: next.x + (hitBox.x - current.x),
            y: next.y + (hitBox.y - current.y),
            width: hitBox.width,
            height: hitBox.height
        };
        return !(next.x < 0 || next.y < 0 || next.x > this.canvas.width - (0, $5e4dc8398ac8b78d$export$ee79b8018014417).cellWidth || next.y > this.canvas.height - (0, $5e4dc8398ac8b78d$export$ee79b8018014417).cellHeight || this.walls.some((wall)=>(0, $92ec84c877bc9d44$export$5efe44c485c74673)(nextHitBox, wall.getHitBox())) || this.lockedDoors().some((door)=>(0, $92ec84c877bc9d44$export$5efe44c485c74673)(nextHitBox, door.getHitBox())) || this.obstacles.some((obstacle)=>(0, $92ec84c877bc9d44$export$5efe44c485c74673)(nextHitBox, obstacle.getHitBox())));
    }
    // Doors that still block passage (an opened door is a free corridor)
    lockedDoors() {
        return this.doors.filter((door)=>door.locked);
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
        if (Math.abs(deltaX) > Math.abs(deltaY)) this.player.setMovement(deltaX > 0 ? "right" : "left");
        else this.player.setMovement(deltaY > 0 ? "down" : "up");
        const current = this.player.getPosition();
        let moved = false;
        const nextX = {
            x: current.x + deltaX,
            y: current.y
        };
        if (deltaX !== 0 && this.canPlayerMoveTo(nextX)) {
            this.player.moveBy(deltaX, 0);
            moved = true;
        }
        const afterX = this.player.getPosition();
        const nextY = {
            x: afterX.x,
            y: afterX.y + deltaY
        };
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
        switch(direction){
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
        this.attackCooldownMs = (0, $5e4dc8398ac8b78d$export$29a11ee6bb22dbd).attackCooldownMs;
        this.player.attack();
        (0, $f0a686cca0390838$export$dc12ec5f7c61c268).swing();
        if (!this.player.isActionActive("attack")) return;
        const attackBox = this.player.getAttackBox();
        // Damage guards caught in the swing; defeated guards play their death
        // animation before updateGameState removes them. Survivors are knocked
        // back away from the swing and show their health bar for a few seconds.
        this.guards.forEach((guard)=>{
            if (guard.isDefeated()) return;
            if ((0, $92ec84c877bc9d44$export$5efe44c485c74673)(attackBox, guard.getHitBox())) {
                guard.takeDamage(this.player.attackPower, this.player.movement);
                if (guard.consumeDefeatAward()) {
                    (0, $f0a686cca0390838$export$dc12ec5f7c61c268).guardDown();
                    this.score += guard.isBoss() ? (0, $5e4dc8398ac8b78d$export$b9c8e024d5962062).scoreValue : (0, $5e4dc8398ac8b78d$export$46cdd0893df07df1).scoreIncrement;
                    this.spawnDrop(guard.getPosition());
                } else (0, $f0a686cca0390838$export$dc12ec5f7c61c268).hit();
            }
        });
        // Chop down obstacles (trees, boulders) that are struck
        const obstaclesBefore = this.obstacles.length;
        this.obstacles = this.obstacles.filter((obstacle)=>{
            if ((0, $92ec84c877bc9d44$export$5efe44c485c74673)(attackBox, obstacle.getHitBox())) {
                obstacle.takeDamage(this.player.attackPower);
                return !obstacle.isDestroyed();
            }
            return true;
        });
        if (this.obstacles.length < obstaclesBefore) (0, $f0a686cca0390838$export$dc12ec5f7c61c268).chop();
    }
    playerAxe() {
        if (this.attackCooldownMs > 0) return;
        this.attackCooldownMs = (0, $5e4dc8398ac8b78d$export$29a11ee6bb22dbd).attackCooldownMs;
        this.player.axe();
        (0, $f0a686cca0390838$export$dc12ec5f7c61c268).swing();
        if (!this.player.isActionActive("axe")) return;
        const attackBox = this.player.getAttackBox();
        const obstaclesBefore = this.obstacles.length;
        this.obstacles = this.obstacles.filter((obstacle)=>{
            if ((0, $92ec84c877bc9d44$export$5efe44c485c74673)(attackBox, obstacle.getHitBox())) {
                obstacle.takeDamage(this.player.attackPower);
                return !obstacle.isDestroyed();
            }
            return true;
        });
        if (this.obstacles.length < obstaclesBefore) (0, $f0a686cca0390838$export$dc12ec5f7c61c268).chop();
    }
    // Pick: disarm an armed explosive trap the player is standing near,
    // before its fuse runs out
    playerPick() {
        this.player.pick();
        const playerBox = this.player.getHitBox();
        const px = playerBox.x + playerBox.width / 2;
        const py = playerBox.y + playerBox.height / 2;
        const index = this.explosives.findIndex((explosive)=>{
            if (!explosive.isArmed()) return false;
            const center = explosive.getCenter();
            return Math.hypot(px - center.x, py - center.y) <= (0, $5e4dc8398ac8b78d$export$eb39dd4a78414223).explosiveTriggerRange;
        });
        if (index === -1) return;
        this.explosives.splice(index, 1);
        this.score += (0, $5e4dc8398ac8b78d$export$46cdd0893df07df1).disarmScore;
        (0, $f0a686cca0390838$export$dc12ec5f7c61c268).disarm();
        this.notify(`Trap disarmed! +${(0, $5e4dc8398ac8b78d$export$46cdd0893df07df1).disarmScore} points`);
    }
    initializeEntities() {
        const level = (0, $89f761b3181b44bd$export$2e2bcd8739ae039).getLevel(this.currentLevel);
        if (level) {
            this.explosives = [];
            this.guards = [];
            this.obstacles = [];
            this.powerups = [];
            this.drops = [];
            for(let y = 0; y < level.layout.length; y++)for(let x = 0; x < level.layout[y].length; x++){
                const cell = level.layout[y][x];
                const position = {
                    x: x * (0, $5e4dc8398ac8b78d$export$ee79b8018014417).cellWidth,
                    y: y * (0, $5e4dc8398ac8b78d$export$ee79b8018014417).cellHeight
                };
                switch(cell){
                    case "E":
                        this.explosives.push(new (0, $976fbe886af494f7$export$2e2bcd8739ae039)(position.x, position.y));
                        break;
                    case "G":
                        const randomOrc = (0, $2c118fbc300d5c4b$export$3c5f89dae98e900b)(1, 3);
                        this.guards.push(new (0, $5c1be042cdfa6fbe$export$2e2bcd8739ae039)(position.x, position.y, `orc${randomOrc}`, this.assets.guardAssets));
                        break;
                    case "B":
                        // A boss: bigger, tougher and harder-hitting than a guard
                        this.guards.push(new (0, $5c1be042cdfa6fbe$export$2e2bcd8739ae039)(position.x, position.y, `orc${(0, $2c118fbc300d5c4b$export$3c5f89dae98e900b)(1, 3)}`, this.assets.guardAssets, {
                            boss: true
                        }));
                        break;
                    case "O":
                        this.obstacles.push(new (0, $ef00117c6c001652$export$2e2bcd8739ae039)(position.x, position.y, "boulder", this.themeAssets));
                        break;
                    case "T":
                        this.obstacles.push(new (0, $ef00117c6c001652$export$2e2bcd8739ae039)(position.x, position.y, "tree", this.themeAssets));
                        break;
                    case "C":
                        const powerupTypes = Object.keys((0, $e75d48523a669613$export$be5092f292f06d78));
                        const randomPowerup = (0, $2c118fbc300d5c4b$export$3c5f89dae98e900b)(1, powerupTypes.length);
                        this.powerups.push(new (0, $e75d48523a669613$export$2e2bcd8739ae039)(position.x, position.y, powerupTypes[randomPowerup - 1], this.assets.powerupsAssets));
                        break;
                }
            }
        }
    }
    // Something a defeated guard leaves behind on the ground
    spawnDrop({ x: x, y: y }) {
        let itemId;
        // While any door is still locked and no key is in reach (carried or on
        // the ground), the defeated guard always carries one. This also covers
        // levels with several locked doors: each door gets its key in turn.
        const keyInReach = this.player.hasItem("key") || this.drops.some((drop)=>drop.getType() === "key");
        if (this.lockedDoors().length > 0 && !keyInReach) itemId = "key";
        else itemId = (0, $a3ad18a970f4f422$export$ab160d7f98284596)[(0, $2c118fbc300d5c4b$export$3c5f89dae98e900b)(1, (0, $a3ad18a970f4f422$export$ab160d7f98284596).length) - 1];
        this.drops.push(new (0, $20eac8a262d6586b$export$2e2bcd8739ae039)(x, y, itemId, this.assets.itemAssets));
    }
    // Queue a short-lived message shown at the top of the canvas (e.g. what a
    // picked-up item does); it fades out during its last second on screen
    notify(text) {
        this.notifications.push({
            text: text,
            msLeft: (0, $5e4dc8398ac8b78d$export$7ce9e21f246bef3b).notificationDurationMs
        });
    }
    // Like notify, but skipped while the same message is still on screen
    // (for messages that would otherwise repeat every frame)
    notifyOnce(text) {
        if (!this.notifications.some((n)=>n.text === text)) this.notify(text);
    }
    // Mark every cell within the light radius of the player as explored
    revealAroundPlayer() {
        if (!this.fogEnabled) return;
        const center = this.playerCenter();
        for(let y = 0; y < this.explored.length; y++)for(let x = 0; x < this.explored[y].length; x++){
            if (this.explored[y][x]) continue;
            const cellCenterX = x * (0, $5e4dc8398ac8b78d$export$ee79b8018014417).cellWidth + (0, $5e4dc8398ac8b78d$export$ee79b8018014417).cellWidth / 2;
            const cellCenterY = y * (0, $5e4dc8398ac8b78d$export$ee79b8018014417).cellHeight + (0, $5e4dc8398ac8b78d$export$ee79b8018014417).cellHeight / 2;
            const distance = Math.hypot(cellCenterX - center.x, cellCenterY - center.y);
            if (distance <= (0, $5e4dc8398ac8b78d$export$eb0ef2c2c69404a9).revealRadius) this.explored[y][x] = true;
        }
    }
    playerCenter() {
        const position = this.player.getPosition();
        return {
            x: position.x + (0, $5e4dc8398ac8b78d$export$ee79b8018014417).cellWidth / 2,
            y: position.y + (0, $5e4dc8398ac8b78d$export$ee79b8018014417).cellHeight / 2
        };
    }
    isCellExplored(col, row) {
        return Boolean(this.explored[row] && this.explored[row][col]);
    }
    updateGameState(deltaMs = 1000 / 60) {
        this.attackCooldownMs = Math.max(0, this.attackCooldownMs - deltaMs);
        this.applyMovementInput(deltaMs);
        this.revealAroundPlayer();
        this.checkCollisions();
        this.checkPlayerDeath(deltaMs);
        if (this.isGameOver) return;
        this.notifications = this.notifications.filter((n)=>{
            n.msLeft -= deltaMs;
            return n.msLeft > 0;
        });
        this.player.update(deltaMs);
        this.updateExplosives(deltaMs);
        // Locked doors block guards (and their line of sight) like walls
        const guardBlockers = [
            ...this.walls,
            ...this.lockedDoors()
        ];
        this.guards.forEach((guard)=>guard.update(this.player.getHitBox(), guardBlockers, deltaMs));
        this.guards = this.guards.filter((guard)=>!guard.isReadyToRemove());
        this.obstacles.forEach((obstacle)=>obstacle.update());
        this.powerups.forEach((powerup)=>powerup.update());
        this.drops.forEach((drop)=>drop.update(deltaMs));
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
            height: box.height + margin * 2
        };
    }
    // Walking up to a locked door while carrying a key opens it
    checkDoorUnlock() {
        if (!this.player.hasItem("key")) return;
        const playerBox = this.player.getHitBox();
        for (const door of this.lockedDoors()){
            // The player is stopped flush against the door, so allow a small gap
            const atDoor = (0, $92ec84c877bc9d44$export$5efe44c485c74673)(playerBox, $966e57966c4ea9d7$export$985739bfa5723e08.inflateBox(door.getHitBox(), 10));
            if (atDoor) {
                this.player.removeItem("key");
                door.unlock();
                (0, $f0a686cca0390838$export$dc12ec5f7c61c268).unlock();
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
        const nearDoor = this.lockedDoors().some((door)=>(0, $92ec84c877bc9d44$export$5efe44c485c74673)(playerBox, $966e57966c4ea9d7$export$985739bfa5723e08.inflateBox(door.getHitBox(), (0, $5e4dc8398ac8b78d$export$ee79b8018014417).cellWidth)));
        if (!nearDoor) return;
        const keyOnGround = this.drops.some((drop)=>drop.getType() === "key");
        this.notifyOnce(keyOnGround ? "The door is locked \u2014 pick up the key first!" : "The door is locked \u2014 defeat a guard to find the key.");
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
            (0, $f0a686cca0390838$export$dc12ec5f7c61c268).gameOver();
            return;
        }
        this.player.respawn(this.playerStart.x, this.playerStart.y);
    }
    // Hidden traps arm when the player comes close, burn a fuse, then blast
    // everything (player and guards) inside the radius exactly once
    updateExplosives(deltaMs) {
        const playerHitBox = this.player.getHitBox();
        this.explosives.forEach((explosive)=>{
            const wasHidden = explosive.isHidden();
            explosive.update(playerHitBox, deltaMs);
            if (wasHidden && explosive.isArmed()) {
                (0, $f0a686cca0390838$export$dc12ec5f7c61c268).fuse();
                this.notifyOnce("A trap springs \u2014 run, or disarm it with 'p'!");
            }
            const blast = explosive.consumeBlast();
            if (!blast) return;
            (0, $f0a686cca0390838$export$dc12ec5f7c61c268).explosion();
            const inBlast = (box)=>{
                const cx = box.x + box.width / 2;
                const cy = box.y + box.height / 2;
                return Math.hypot(cx - blast.x, cy - blast.y) <= blast.radius;
            };
            if (inBlast(playerHitBox)) this.damagePlayer((0, $5e4dc8398ac8b78d$export$eb39dd4a78414223).explosivePlayerDamage);
            this.guards.forEach((guard)=>{
                if (guard.isDefeated()) return;
                if (inBlast(guard.getHitBox())) {
                    guard.takeDamage((0, $5e4dc8398ac8b78d$export$eb39dd4a78414223).explosiveGuardDamage);
                    if (guard.consumeDefeatAward()) {
                        this.score += guard.isBoss() ? (0, $5e4dc8398ac8b78d$export$b9c8e024d5962062).scoreValue : (0, $5e4dc8398ac8b78d$export$46cdd0893df07df1).scoreIncrement;
                        this.spawnDrop(guard.getPosition());
                    }
                }
            });
        });
        this.explosives = this.explosives.filter((explosive)=>!explosive.isDone());
    }
    // Route all player damage through one place so the hurt sound plays
    // only when damage actually lands (not while invincible or flashing)
    damagePlayer(amount) {
        const healthBefore = this.player.getHealth();
        this.player.takeDamage(amount);
        if (this.player.getHealth() < healthBefore) (0, $f0a686cca0390838$export$dc12ec5f7c61c268).hurt();
    }
    checkCollisions() {
        const playerPosition = this.player.getHitBox();
        this.guards.forEach((guard)=>{
            if (guard.isDefeated()) return;
            if ((0, $92ec84c877bc9d44$export$5efe44c485c74673)(playerPosition, guard.getHitBox())) this.damagePlayer(guard.damage);
        });
        this.obstacles.forEach((obstacle, index)=>{
            (0, $92ec84c877bc9d44$export$5efe44c485c74673)(playerPosition, obstacle.getHitBox());
        });
        this.powerups.forEach((powerup, index)=>{
            if ((0, $92ec84c877bc9d44$export$5efe44c485c74673)(this.player.getPickupRange(), powerup.getHitBox())) {
                const effect = powerup.collect();
                this.player.applyPowerup(effect);
                if ((0, $e75d48523a669613$export$be5092f292f06d78)[effect]) this.notify((0, $e75d48523a669613$export$be5092f292f06d78)[effect]);
                this.powerups.splice(index, 1);
                this.score += (0, $5e4dc8398ac8b78d$export$46cdd0893df07df1).scoreIncrement;
                (0, $f0a686cca0390838$export$dc12ec5f7c61c268).pickup();
            }
        });
        // Items dropped by defeated guards go into the inventory
        this.drops = this.drops.filter((drop)=>{
            if ((0, $92ec84c877bc9d44$export$5efe44c485c74673)(this.player.getPickupRange(), drop.getHitBox())) {
                this.player.addItem(drop.getType());
                this.notifyPickup(drop.getType());
                (0, $f0a686cca0390838$export$dc12ec5f7c61c268).pickup();
                return false;
            }
            return true;
        });
    }
    notifyPickup(itemId) {
        const item = (0, $a3ad18a970f4f422$export$ef94d4ad2585b6fa)[itemId];
        this.notify(`You picked up ${item.article} ${item.name} \u{2014} press 'i' to inspect your inventory.`);
    }
    checkLevelCompletion() {
        if (!this.isLevelComplete()) return;
        this.score += (0, $5e4dc8398ac8b78d$export$46cdd0893df07df1).scoreIncrement;
        (0, $f0a686cca0390838$export$dc12ec5f7c61c268).levelComplete();
        const nextLevel = (0, $89f761b3181b44bd$export$2e2bcd8739ae039).getLevel(this.currentLevel + 1);
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
        return this.exit && (0, $92ec84c877bc9d44$export$5efe44c485c74673)(this.player.getHitBox(), this.exit.getHitBox());
    }
    render() {
        // Render the game board and entities (player, obstacles, powerups, guards)
        // Clear the canvas
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // Draw the grid
        this.drawGrid();
        // Draw the walls and doors
        this.walls.forEach((wall)=>wall.draw(this.context));
        this.doors.forEach((door)=>door.draw(this.context));
        // Draw the entities
        this.obstacles.forEach((obstacle)=>obstacle.draw(this.context));
        this.powerups.forEach((powerup)=>powerup.draw(this.context));
        this.drops.forEach((drop)=>drop.draw(this.context));
        this.guards.forEach((guard)=>guard.draw(this.context));
        this.explosives.forEach((explosive)=>explosive.draw(this.context));
        // Draw the exit
        if (this.exit) this.exit.draw(this.context);
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
    }
    drawNotifications() {
        const ctx = this.context;
        ctx.save();
        ctx.font = "bold 18px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        this.notifications.forEach((notification, i)=>{
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
            {
                label: "Weapon",
                slot: "weapon"
            },
            {
                label: "Rune",
                slot: "rune"
            }
        ].forEach((equip, i)=>{
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
            ctx.fillText("Nothing yet \u2014 defeat guards to find weapons, runes and potions.", panelX + 24, gridY + 28);
        }
        entries.forEach((entry, i)=>{
            const columns = 9;
            const x = panelX + 24 + i % columns * (slotSize + 10);
            const y = gridY + Math.floor(i / columns) * (slotSize + 10);
            this.drawInventorySlot(x, y, slotSize, entry.id, entry.count);
        });
        // Footer hint
        ctx.font = "14px monospace";
        ctx.fillStyle = "#999";
        ctx.fillText("Click a weapon or rune to equip it \u2014 click a potion to drink it.", panelX + 24, panelY + panelHeight - 24);
        this.drawInventoryTooltip();
        ctx.restore();
    }
    drawInventorySlot(x, y, size, itemId, count) {
        const ctx = this.context;
        this.inventorySlotRects.push({
            x: x,
            y: y,
            size: size,
            itemId: itemId
        });
        const hovered = this.mouse.x >= x && this.mouse.x <= x + size && this.mouse.y >= y && this.mouse.y <= y + size;
        const item = itemId ? (0, $a3ad18a970f4f422$export$ef94d4ad2585b6fa)[itemId] : null;
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
        const hoveredSlot = this.inventorySlotRects.find((r)=>r.itemId && this.mouse.x >= r.x && this.mouse.x <= r.x + r.size && this.mouse.y >= r.y && this.mouse.y <= r.y + r.size);
        if (!hoveredSlot) return;
        const ctx = this.context;
        const item = (0, $a3ad18a970f4f422$export$ef94d4ad2585b6fa)[hoveredSlot.itemId];
        const hint = item.kind === "weapon" || item.kind === "rune" ? "Click to equip or take off" : item.kind === "potion" ? "Click to drink" : null;
        const lines = [
            item.name,
            item.description
        ];
        if (hint) lines.push(hint);
        ctx.font = "14px monospace";
        const boxWidth = Math.max(...lines.map((l)=>ctx.measureText(l).width)) + 24;
        const boxHeight = lines.length * 20 + 16;
        // Keep the tooltip on screen, above-right of the cursor when possible
        const boxX = Math.min(this.mouse.x + 14, this.canvas.width - boxWidth - 4);
        const boxY = Math.max(4, this.mouse.y - boxHeight - 6);
        ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
        ctx.strokeStyle = "#ffd54f";
        ctx.lineWidth = 1;
        ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
        ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
        lines.forEach((line, i)=>{
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
        ctx.fillText(`${"\u2665".repeat(Math.max(0, this.lives))}`, 160, 28);
        // Health bar
        const health = Math.max(0, this.player.getHealth());
        ctx.fillStyle = "#444";
        ctx.fillRect(226, 20, 70, 14);
        ctx.fillStyle = health > 30 ? "#4caf50" : "#c62828";
        ctx.fillRect(226, 20, health / 100 * 70, 14);
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
            const label = effects.map((e)=>`${e.name} ${e.secondsLeft}s`).join("  ");
            ctx.fillText(label, 18, 62);
        }
        ctx.restore();
    }
    drawGrid() {
        const floorPattern = this.themeAssets.floor ? this.context.createPattern(this.themeAssets.floor, "repeat") : null;
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
        for(let y = 0; y < this.explored.length; y++)for(let x = 0; x < this.explored[y].length; x++){
            const alpha = this.explored[y][x] ? (0, $5e4dc8398ac8b78d$export$eb0ef2c2c69404a9).exploredAlpha : (0, $5e4dc8398ac8b78d$export$eb0ef2c2c69404a9).unexploredAlpha;
            fogCtx.fillStyle = `rgba(8, 8, 16, ${alpha})`;
            fogCtx.fillRect(x * (0, $5e4dc8398ac8b78d$export$ee79b8018014417).cellWidth, y * (0, $5e4dc8398ac8b78d$export$ee79b8018014417).cellHeight, (0, $5e4dc8398ac8b78d$export$ee79b8018014417).cellWidth, (0, $5e4dc8398ac8b78d$export$ee79b8018014417).cellHeight);
        }
        // Erase a soft-edged torchlight circle around the player
        const center = this.playerCenter();
        const radius = (0, $5e4dc8398ac8b78d$export$eb0ef2c2c69404a9).revealRadius;
        const torch = fogCtx.createRadialGradient(center.x, center.y, radius * 0.5, center.x, center.y, radius);
        torch.addColorStop(0, "rgba(0, 0, 0, 1)");
        torch.addColorStop(1, "rgba(0, 0, 0, 0)");
        fogCtx.globalCompositeOperation = "destination-out";
        fogCtx.fillStyle = torch;
        fogCtx.fillRect(center.x - radius, center.y - radius, radius * 2, radius * 2);
        fogCtx.globalCompositeOperation = "source-over";
        this.context.drawImage(this.fogCanvas, 0, 0);
    }
    gameLoop(timestamp = performance.now()) {
        // Main game loop
        if (this.isGameOver || this.paused) return;
        if (this.lastFrameTime === null) this.lastFrameTime = timestamp;
        const deltaMs = Math.min(50, timestamp - this.lastFrameTime);
        this.lastFrameTime = timestamp;
        if (this.inventoryOpen) // The world stands still while the player inspects the inventory, but
        // messages keep fading and the screen keeps rendering for hover effects
        this.notifications = this.notifications.filter((n)=>{
            n.msLeft -= deltaMs;
            return n.msLeft > 0;
        });
        else this.updateGameState(deltaMs);
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
        this.lives = (0, $5e4dc8398ac8b78d$export$b54787693599973a).initialLives;
        this.score = 0;
        this.currentLevel = (0, $5e4dc8398ac8b78d$export$46cdd0893df07df1).initialLevel;
        this.notifications = [];
        this.player = null; // a fresh run starts with an empty pack
        this.inventoryOpen = false;
        this.pendingGameOverMs = null;
        this.attackCooldownMs = 0;
        this.pressedDirections.clear();
        this.lastFrameTime = null;
        if (this.rafId) cancelAnimationFrame(this.rafId);
        (0, $561f00ef01a83395$export$28e08eff11ac64f6)(this.container);
        this.container.appendChild(this.canvas);
        this.initializeBoard();
        this.initializePlayer();
        this.initializeEntities();
        this.gameLoop();
    }
    continue() {
        this.started = true;
        this.paused = false;
        this.lastFrameTime = null;
        (0, $561f00ef01a83395$export$28e08eff11ac64f6)(this.container);
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
    step(frames = 1, deltaMs = 1000 / 60) {
        if (!this.player) return;
        for(let i = 0; i < frames; i++){
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
        const guard = new (0, $5c1be042cdfa6fbe$export$2e2bcd8739ae039)(x, y, type, this.assets.guardAssets, options);
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
var $966e57966c4ea9d7$export$2e2bcd8739ae039 = $966e57966c4ea9d7$export$985739bfa5723e08;


// handle the assets
// Load player sprite sheets
// Load enemy sprite sheets
// Load powerup sprite sheets
// Load explosive sprite sheets
// Load guard sprite sheets
// Load obstacle images
// NOTE: asset URLs must be written inline as `new URL('literal', import.meta.url)`.
// Parcel only bundles the referenced file when the first argument is a string
// literal at the call site. Wrapping it in a helper (variable argument) defeats
// static analysis, leaving an unbundled `file://` path that the browser blocks.
function $ecb638e98763caff$var$loadImage(src, onProgress) {
    return new Promise((resolve, reject)=>{
        try {
            const img = new Image();
            img.src = src;
            img.onload = ()=>{
                onProgress(src, img);
                resolve(img);
            };
            img.onerror = (error)=>{
                console.error("Error loading image:", src, error);
                reject(new Error(`Failed to load image: ${src}`));
            };
        } catch (error) {
            console.error("Error loading image:", src, error);
            reject(new Error(`Unexpected error loading image: ${src}`));
        }
    });
}
var $7b0905186a7f08fe$exports = {};
$7b0905186a7f08fe$exports = new URL("Player.6815690b.png", import.meta.url).toString();


var $ee5876757ad709fb$exports = {};
$ee5876757ad709fb$exports = new URL("Player_Actions.216a44f2.png", import.meta.url).toString();


async function $ecb638e98763caff$export$a9303be352ef857(onProgress) {
    console.log("Loading player assets...");
    const playerMovement = await $ecb638e98763caff$var$loadImage(new URL($7b0905186a7f08fe$exports).href, onProgress);
    const playerActions = await $ecb638e98763caff$var$loadImage(new URL($ee5876757ad709fb$exports).href, onProgress);
    return {
        playerMovement: playerMovement,
        playerActions: playerActions
    };
}
var $33df9631d9c3a227$exports = {};
$33df9631d9c3a227$exports = new URL("orc1_attack_full.e8901cb7.png", import.meta.url).toString();


var $99d049d0b8791e25$exports = {};
$99d049d0b8791e25$exports = new URL("orc1_death_full.517faac9.png", import.meta.url).toString();


var $0e85440ee785638c$exports = {};
$0e85440ee785638c$exports = new URL("orc1_hurt_full.0a03d073.png", import.meta.url).toString();


var $d85f62850b2dbefa$exports = {};
$d85f62850b2dbefa$exports = new URL("orc1_idle_full.683e0cd2.png", import.meta.url).toString();


var $0b7c17de8bf9fe9d$exports = {};
$0b7c17de8bf9fe9d$exports = new URL("orc1_run_full.2113618a.png", import.meta.url).toString();


var $9c26a0feede1e7a2$exports = {};
$9c26a0feede1e7a2$exports = new URL("orc1_run_attack_front_full.9a790d5e.png", import.meta.url).toString();


var $3b69fbca2621dac8$exports = {};
$3b69fbca2621dac8$exports = new URL("orc1_walk_full.9e2eb048.png", import.meta.url).toString();


var $7e3206a8c1d3f2fc$exports = {};
$7e3206a8c1d3f2fc$exports = new URL("orc1_walk_attack_front_full.f403533d.png", import.meta.url).toString();


var $8f15266f69fc8d6a$exports = {};
$8f15266f69fc8d6a$exports = new URL("orc2_attack_full.db2a51f4.png", import.meta.url).toString();


var $6edea3404085c8ca$exports = {};
$6edea3404085c8ca$exports = new URL("orc2_death_full.23681610.png", import.meta.url).toString();


var $ddf1d103a4001633$exports = {};
$ddf1d103a4001633$exports = new URL("orc2_hurt_full.1ebea2f5.png", import.meta.url).toString();


var $fb26cd20c95d4613$exports = {};
$fb26cd20c95d4613$exports = new URL("orc2_idle_full.f0324bca.png", import.meta.url).toString();


var $e3dda4fbf7e97abd$exports = {};
$e3dda4fbf7e97abd$exports = new URL("orc2_run_full.f809ff84.png", import.meta.url).toString();


var $e86c05e7cd794ce5$exports = {};
$e86c05e7cd794ce5$exports = new URL("orc2_run_attack_full.3dfd3a4d.png", import.meta.url).toString();


var $232207aae07e9b6e$exports = {};
$232207aae07e9b6e$exports = new URL("orc2_walk_full.f2efa2bf.png", import.meta.url).toString();


var $f750eb3ef5f109c4$exports = {};
$f750eb3ef5f109c4$exports = new URL("orc2_walk_attack_full.3bf0e99a.png", import.meta.url).toString();


var $c670c2ce2b4e1f88$exports = {};
$c670c2ce2b4e1f88$exports = new URL("orc3_attack_full.e28e8832.png", import.meta.url).toString();


var $ee2bacea81337da1$exports = {};
$ee2bacea81337da1$exports = new URL("orc3_death_full.064e76d1.png", import.meta.url).toString();


var $28b3a88ccbe89a6c$exports = {};
$28b3a88ccbe89a6c$exports = new URL("orc3_hurt_full.027c67f8.png", import.meta.url).toString();


var $a603b2f07beb557a$exports = {};
$a603b2f07beb557a$exports = new URL("orc3_idle_full.14825eb4.png", import.meta.url).toString();


var $c7fcaf955f34e312$exports = {};
$c7fcaf955f34e312$exports = new URL("orc3_run_full.efd4d5ee.png", import.meta.url).toString();


var $7b5b0ce81b4cbf7e$exports = {};
$7b5b0ce81b4cbf7e$exports = new URL("orc3_run_attack_full.05b141e4.png", import.meta.url).toString();


var $edf719a605e52444$exports = {};
$edf719a605e52444$exports = new URL("orc3_walk_full.7c14215e.png", import.meta.url).toString();


var $5d0288dbfce8d7b0$exports = {};
$5d0288dbfce8d7b0$exports = new URL("orc3_walk_attack_full.4012527d.png", import.meta.url).toString();


async function $ecb638e98763caff$export$de46def7a5f5a392(onProgress) {
    console.log("Loading guard assets...");
    // ORC 1
    const orc1_Attack = await $ecb638e98763caff$var$loadImage(new URL($33df9631d9c3a227$exports).href, onProgress);
    const orc1_Death = await $ecb638e98763caff$var$loadImage(new URL($99d049d0b8791e25$exports).href, onProgress);
    const orc1_Hurt = await $ecb638e98763caff$var$loadImage(new URL($0e85440ee785638c$exports).href, onProgress);
    const orc1_Idle = await $ecb638e98763caff$var$loadImage(new URL($d85f62850b2dbefa$exports).href, onProgress);
    const orc1_Run = await $ecb638e98763caff$var$loadImage(new URL($0b7c17de8bf9fe9d$exports).href, onProgress);
    const orc1_Run_Attack = await $ecb638e98763caff$var$loadImage(new URL($9c26a0feede1e7a2$exports).href, onProgress);
    const orc1_Walk = await $ecb638e98763caff$var$loadImage(new URL($3b69fbca2621dac8$exports).href, onProgress);
    const orc1_Walk_Attack = await $ecb638e98763caff$var$loadImage(new URL($7e3206a8c1d3f2fc$exports).href, onProgress);
    // ORC 2
    const orc2_Attack = await $ecb638e98763caff$var$loadImage(new URL($8f15266f69fc8d6a$exports).href, onProgress);
    const orc2_Death = await $ecb638e98763caff$var$loadImage(new URL($6edea3404085c8ca$exports).href, onProgress);
    const orc2_Hurt = await $ecb638e98763caff$var$loadImage(new URL($ddf1d103a4001633$exports).href, onProgress);
    const orc2_Idle = await $ecb638e98763caff$var$loadImage(new URL($fb26cd20c95d4613$exports).href, onProgress);
    const orc2_Run = await $ecb638e98763caff$var$loadImage(new URL($e3dda4fbf7e97abd$exports).href, onProgress);
    const orc2_Run_Attack = await $ecb638e98763caff$var$loadImage(new URL($e86c05e7cd794ce5$exports).href, onProgress);
    const orc2_Walk = await $ecb638e98763caff$var$loadImage(new URL($232207aae07e9b6e$exports).href, onProgress);
    const orc2_Walk_Attack = await $ecb638e98763caff$var$loadImage(new URL($f750eb3ef5f109c4$exports).href, onProgress);
    // ORC 3
    const orc3_Attack = await $ecb638e98763caff$var$loadImage(new URL($c670c2ce2b4e1f88$exports).href, onProgress);
    const orc3_Death = await $ecb638e98763caff$var$loadImage(new URL($ee2bacea81337da1$exports).href, onProgress);
    const orc3_Hurt = await $ecb638e98763caff$var$loadImage(new URL($28b3a88ccbe89a6c$exports).href, onProgress);
    const orc3_Idle = await $ecb638e98763caff$var$loadImage(new URL($a603b2f07beb557a$exports).href, onProgress);
    const orc3_Run = await $ecb638e98763caff$var$loadImage(new URL($c7fcaf955f34e312$exports).href, onProgress);
    const orc3_Run_Attack = await $ecb638e98763caff$var$loadImage(new URL($7b5b0ce81b4cbf7e$exports).href, onProgress);
    const orc3_Walk = await $ecb638e98763caff$var$loadImage(new URL($edf719a605e52444$exports).href, onProgress);
    const orc3_Walk_Attack = await $ecb638e98763caff$var$loadImage(new URL($5d0288dbfce8d7b0$exports).href, onProgress);
    return {
        orc1_Attack: orc1_Attack,
        orc1_Death: orc1_Death,
        orc1_Hurt: orc1_Hurt,
        orc1_Idle: orc1_Idle,
        orc1_Run: orc1_Run,
        orc1_Run_Attack: orc1_Run_Attack,
        orc1_Walk: orc1_Walk,
        orc1_Walk_Attack: orc1_Walk_Attack,
        orc2_Attack: orc2_Attack,
        orc2_Death: orc2_Death,
        orc2_Hurt: orc2_Hurt,
        orc2_Idle: orc2_Idle,
        orc2_Run: orc2_Run,
        orc2_Run_Attack: orc2_Run_Attack,
        orc2_Walk: orc2_Walk,
        orc2_Walk_Attack: orc2_Walk_Attack,
        orc3_Attack: orc3_Attack,
        orc3_Death: orc3_Death,
        orc3_Hurt: orc3_Hurt,
        orc3_Idle: orc3_Idle,
        orc3_Run: orc3_Run,
        orc3_Run_Attack: orc3_Run_Attack,
        orc3_Walk: orc3_Walk,
        orc3_Walk_Attack: orc3_Walk_Attack
    };
}
var $d328f3a1b7ea98ef$exports = {};
$d328f3a1b7ea98ef$exports = new URL("grass_tile.0ef9c22b.png", import.meta.url).toString();


var $d2a1f77817272912$exports = {};
$d2a1f77817272912$exports = new URL("stone_wall.0a23402b.png", import.meta.url).toString();


var $34e2e639f1e15b53$exports = {};
$34e2e639f1e15b53$exports = new URL("boulder.59ccd34c.png", import.meta.url).toString();


var $be0d89c5c8920978$exports = {};
$be0d89c5c8920978$exports = new URL("Rock6_1.b0f82242.png", import.meta.url).toString();


var $48fcae066976168b$exports = {};
$48fcae066976168b$exports = new URL("Tree1.6aac84d7.png", import.meta.url).toString();


var $a53553363b9f8422$exports = {};
$a53553363b9f8422$exports = new URL("Tree2.983a0b0c.png", import.meta.url).toString();


var $101bc0a0a3fd00d1$exports = {};
$101bc0a0a3fd00d1$exports = new URL("Tree3.9139b26c.png", import.meta.url).toString();


var $c234bf32b1fbcd1a$exports = {};
$c234bf32b1fbcd1a$exports = new URL("palm_a.f2f937b7.png", import.meta.url).toString();


var $6b9d0f915952db56$exports = {};
$6b9d0f915952db56$exports = new URL("palm_b.11aa6298.png", import.meta.url).toString();


var $035219ed74ae2399$exports = {};
$035219ed74ae2399$exports = new URL("Sand_ruins3.3ff5aa66.png", import.meta.url).toString();


var $35d7449da728e78c$exports = {};
$35d7449da728e78c$exports = new URL("Snow_ruins3.205e00ea.png", import.meta.url).toString();


var $568f356596fe49ee$exports = {};
$568f356596fe49ee$exports = new URL("exit_ruin.aa60df04.png", import.meta.url).toString();


var $bd537204fadf4e51$exports = {};
$bd537204fadf4e51$exports = new URL("floor.0198c309.png", import.meta.url).toString();


var $c538b9a7ba2bd950$exports = {};
$c538b9a7ba2bd950$exports = new URL("wall.d6e9cc70.png", import.meta.url).toString();


var $1970ef339d866ae1$exports = {};
$1970ef339d866ae1$exports = new URL("tree_1.5292babc.png", import.meta.url).toString();


var $1f512d0d91c06de8$exports = {};
$1f512d0d91c06de8$exports = new URL("tree_2.92b00b72.png", import.meta.url).toString();


var $59e10b28b3ffad26$exports = {};
$59e10b28b3ffad26$exports = new URL("boulder.15164de8.png", import.meta.url).toString();


var $ea9f27f5b268c66f$exports = {};
$ea9f27f5b268c66f$exports = new URL("exit.e13f7e57.png", import.meta.url).toString();


var $9a0fc935865e739d$exports = {};
$9a0fc935865e739d$exports = new URL("floor.12d92a2e.png", import.meta.url).toString();


var $a72af804c3b1b501$exports = {};
$a72af804c3b1b501$exports = new URL("wall.4225af43.png", import.meta.url).toString();


var $13dc3fd457829210$exports = {};
$13dc3fd457829210$exports = new URL("tree_1.7ae3f386.png", import.meta.url).toString();


var $4bd7dc79d4d9fc1a$exports = {};
$4bd7dc79d4d9fc1a$exports = new URL("tree_2.d855a676.png", import.meta.url).toString();


var $e533709be707a56e$exports = {};
$e533709be707a56e$exports = new URL("boulder.36a18f78.png", import.meta.url).toString();


var $4f58ebc0cae3ab69$exports = {};
$4f58ebc0cae3ab69$exports = new URL("exit.7804ab62.png", import.meta.url).toString();


var $654490e881a262c6$exports = {};
$654490e881a262c6$exports = new URL("floor.98d4367b.png", import.meta.url).toString();


var $3f984940f91fb4db$exports = {};
$3f984940f91fb4db$exports = new URL("wall.9c6b72f5.png", import.meta.url).toString();


var $acc16e9a1c4e34ad$exports = {};
$acc16e9a1c4e34ad$exports = new URL("obstacle_1.d463bbb4.png", import.meta.url).toString();


var $1cd9ad2d1b538f8c$exports = {};
$1cd9ad2d1b538f8c$exports = new URL("obstacle_2.28d3a5e4.png", import.meta.url).toString();


var $d7fa4579a6f563ca$exports = {};
$d7fa4579a6f563ca$exports = new URL("boulder.128e4b61.png", import.meta.url).toString();


var $d76eb1506b361115$exports = {};
$d76eb1506b361115$exports = new URL("exit.69493db7.png", import.meta.url).toString();


async function $ecb638e98763caff$export$41cc1a8d96039105(onProgress) {
    console.log("Loading level assets...");
    const grassTile = await $ecb638e98763caff$var$loadImage(new URL($d328f3a1b7ea98ef$exports).href, onProgress);
    const wall = await $ecb638e98763caff$var$loadImage(new URL($d2a1f77817272912$exports).href, onProgress);
    const boulder = await $ecb638e98763caff$var$loadImage(new URL($34e2e639f1e15b53$exports).href, onProgress);
    const rock = await $ecb638e98763caff$var$loadImage(new URL($be0d89c5c8920978$exports).href, onProgress);
    const tree1 = await $ecb638e98763caff$var$loadImage(new URL($48fcae066976168b$exports).href, onProgress);
    const tree2 = await $ecb638e98763caff$var$loadImage(new URL($a53553363b9f8422$exports).href, onProgress);
    const tree3 = await $ecb638e98763caff$var$loadImage(new URL($101bc0a0a3fd00d1$exports).href, onProgress);
    const palm1 = await $ecb638e98763caff$var$loadImage(new URL($c234bf32b1fbcd1a$exports).href, onProgress);
    const palm2 = await $ecb638e98763caff$var$loadImage(new URL($6b9d0f915952db56$exports).href, onProgress);
    const sandRuin = await $ecb638e98763caff$var$loadImage(new URL($035219ed74ae2399$exports).href, onProgress);
    const snowRuin = await $ecb638e98763caff$var$loadImage(new URL($35d7449da728e78c$exports).href, onProgress);
    const yellowRuin = await $ecb638e98763caff$var$loadImage(new URL($568f356596fe49ee$exports).href, onProgress);
    const desertFloor = await $ecb638e98763caff$var$loadImage(new URL($bd537204fadf4e51$exports).href, onProgress);
    const desertWall = await $ecb638e98763caff$var$loadImage(new URL($c538b9a7ba2bd950$exports).href, onProgress);
    const desertTree1 = await $ecb638e98763caff$var$loadImage(new URL($1970ef339d866ae1$exports).href, onProgress);
    const desertTree2 = await $ecb638e98763caff$var$loadImage(new URL($1f512d0d91c06de8$exports).href, onProgress);
    const desertBoulder = await $ecb638e98763caff$var$loadImage(new URL($59e10b28b3ffad26$exports).href, onProgress);
    const desertExit = await $ecb638e98763caff$var$loadImage(new URL($ea9f27f5b268c66f$exports).href, onProgress);
    const snowFloor = await $ecb638e98763caff$var$loadImage(new URL($9a0fc935865e739d$exports).href, onProgress);
    const snowWall = await $ecb638e98763caff$var$loadImage(new URL($a72af804c3b1b501$exports).href, onProgress);
    const snowTree1 = await $ecb638e98763caff$var$loadImage(new URL($13dc3fd457829210$exports).href, onProgress);
    const snowTree2 = await $ecb638e98763caff$var$loadImage(new URL($4bd7dc79d4d9fc1a$exports).href, onProgress);
    const snowBoulder = await $ecb638e98763caff$var$loadImage(new URL($e533709be707a56e$exports).href, onProgress);
    const snowExit = await $ecb638e98763caff$var$loadImage(new URL($4f58ebc0cae3ab69$exports).href, onProgress);
    const dungeonFloor = await $ecb638e98763caff$var$loadImage(new URL($654490e881a262c6$exports).href, onProgress);
    const dungeonWall = await $ecb638e98763caff$var$loadImage(new URL($3f984940f91fb4db$exports).href, onProgress);
    const dungeonObstacle1 = await $ecb638e98763caff$var$loadImage(new URL($acc16e9a1c4e34ad$exports).href, onProgress);
    const dungeonObstacle2 = await $ecb638e98763caff$var$loadImage(new URL($1cd9ad2d1b538f8c$exports).href, onProgress);
    const dungeonBoulder = await $ecb638e98763caff$var$loadImage(new URL($d7fa4579a6f563ca$exports).href, onProgress);
    const dungeonExit = await $ecb638e98763caff$var$loadImage(new URL($d76eb1506b361115$exports).href, onProgress);
    return {
        grassTile: grassTile,
        wall: wall,
        boulder: boulder,
        rock: rock,
        tree1: tree1,
        tree2: tree2,
        tree3: tree3,
        palm1: palm1,
        palm2: palm2,
        sandRuin: sandRuin,
        snowRuin: snowRuin,
        yellowRuin: yellowRuin,
        desertFloor: desertFloor,
        desertWall: desertWall,
        desertTree1: desertTree1,
        desertTree2: desertTree2,
        desertBoulder: desertBoulder,
        desertExit: desertExit,
        snowFloor: snowFloor,
        snowWall: snowWall,
        snowTree1: snowTree1,
        snowTree2: snowTree2,
        snowBoulder: snowBoulder,
        snowExit: snowExit,
        dungeonFloor: dungeonFloor,
        dungeonWall: dungeonWall,
        dungeonObstacle1: dungeonObstacle1,
        dungeonObstacle2: dungeonObstacle2,
        dungeonBoulder: dungeonBoulder,
        dungeonExit: dungeonExit
    };
}
var $ffa9455c7aa0d3d0$exports = {};
$ffa9455c7aa0d3d0$exports = new URL("key.2af3611f.png", import.meta.url).toString();


var $5506ebd1d1f53f1b$exports = {};
$5506ebd1d1f53f1b$exports = new URL("potion.7fdd369b.png", import.meta.url).toString();


var $f788a84634dbf880$exports = {};
$f788a84634dbf880$exports = new URL("explosive.c6be1a55.png", import.meta.url).toString();


var $2445d722a81ccf63$exports = {};
$2445d722a81ccf63$exports = new URL("sword_steel.f1d046ab.png", import.meta.url).toString();


var $fa211132f1feab86$exports = {};
$fa211132f1feab86$exports = new URL("axe_war.0a837580.png", import.meta.url).toString();


var $ec53ce0f99b83788$exports = {};
$ec53ce0f99b83788$exports = new URL("rune_haste.6c91306a.png", import.meta.url).toString();


var $a8af952f31ff4867$exports = {};
$a8af952f31ff4867$exports = new URL("rune_might.38be4919.png", import.meta.url).toString();


var $c8ee0dd74fd44830$exports = {};
$c8ee0dd74fd44830$exports = new URL("rune_warding.ef8a6b94.png", import.meta.url).toString();


var $4902e6cb0bd397ab$exports = {};
$4902e6cb0bd397ab$exports = new URL("door.9871e447.png", import.meta.url).toString();


async function $ecb638e98763caff$export$50efb3ab3add3718(onProgress) {
    console.log("Loading item assets...");
    const key = await $ecb638e98763caff$var$loadImage(new URL($ffa9455c7aa0d3d0$exports).href, onProgress);
    const potion = await $ecb638e98763caff$var$loadImage(new URL($5506ebd1d1f53f1b$exports).href, onProgress);
    const explosive = await $ecb638e98763caff$var$loadImage(new URL($f788a84634dbf880$exports).href, onProgress);
    const steelSword = await $ecb638e98763caff$var$loadImage(new URL($2445d722a81ccf63$exports).href, onProgress);
    const warAxe = await $ecb638e98763caff$var$loadImage(new URL($fa211132f1feab86$exports).href, onProgress);
    const runeHaste = await $ecb638e98763caff$var$loadImage(new URL($ec53ce0f99b83788$exports).href, onProgress);
    const runeMight = await $ecb638e98763caff$var$loadImage(new URL($a8af952f31ff4867$exports).href, onProgress);
    const runeWarding = await $ecb638e98763caff$var$loadImage(new URL($c8ee0dd74fd44830$exports).href, onProgress);
    // Not an inventory item, but generated by the same tool: the locked door tile
    const door = await $ecb638e98763caff$var$loadImage(new URL($4902e6cb0bd397ab$exports).href, onProgress);
    return {
        key: key,
        potion: potion,
        explosive: explosive,
        steelSword: steelSword,
        warAxe: warAxe,
        runeHaste: runeHaste,
        runeMight: runeMight,
        runeWarding: runeWarding,
        door: door
    };
}
var $448d47575f3ad9c7$exports = {};
$448d47575f3ad9c7$exports = new URL("Green_crystal2.5f080818.png", import.meta.url).toString();


var $57664d8f8497f7ee$exports = {};
$57664d8f8497f7ee$exports = new URL("health_crystal.b327dfeb.png", import.meta.url).toString();


var $61ce9496069752b9$exports = {};
$61ce9496069752b9$exports = new URL("mana_crystal.ea6ee675.png", import.meta.url).toString();


var $4014bde77eac224a$exports = {};
$4014bde77eac224a$exports = new URL("Yellow_crystal2.13460b75.png", import.meta.url).toString();


async function $ecb638e98763caff$export$3df0938dc8828e8b(onProgress) {
    console.log("Loading powerups assets...");
    const greenCrystal = await $ecb638e98763caff$var$loadImage(new URL($448d47575f3ad9c7$exports).href, onProgress);
    const redCrystal = await $ecb638e98763caff$var$loadImage(new URL($57664d8f8497f7ee$exports).href, onProgress);
    const blueCrystal = await $ecb638e98763caff$var$loadImage(new URL($61ce9496069752b9$exports).href, onProgress);
    const yellowCrystal = await $ecb638e98763caff$var$loadImage(new URL($4014bde77eac224a$exports).href, onProgress);
    return {
        greenCrystal: greenCrystal,
        redCrystal: redCrystal,
        blueCrystal: blueCrystal,
        yellowCrystal: yellowCrystal
    };
}


// Splash screen
// - Display game logo or animation
// - Briefly show before transitioning to the welcome screen
// - Style: background color, logo/animation size and position
function $9e619e15cd5b970b$export$bcd396c5d66a748f(initialise, onComplete) {
    const splashScreen = document.createElement("div");
    splashScreen.id = "splash-screen";
    splashScreen.style.position = "absolute";
    splashScreen.style.top = "0";
    splashScreen.style.left = "0";
    splashScreen.style.width = "100%";
    splashScreen.style.height = "100%";
    splashScreen.style.backgroundColor = "#000";
    splashScreen.style.display = "flex";
    splashScreen.style.justifyContent = "center";
    splashScreen.style.alignItems = "center";
    splashScreen.style.color = "#fff";
    splashScreen.style.fontSize = "24px";
    splashScreen.innerText = "Loading... 0%";
    document.body.appendChild(splashScreen);
    initialise().then(()=>{
        onComplete();
        document.body.removeChild(splashScreen);
    }).catch((error)=>{
        console.error("Failed to initialize game:", error);
        splashScreen.innerText = "Failed to load game. Please refresh the page.";
    });
}
function $9e619e15cd5b970b$export$1c045d0cca6b82bc(progress) {
    console.log("Updating splash screen progress:", progress);
    const splashScreen = document.getElementById("splash-screen");
    if (splashScreen) splashScreen.innerText = `Loading... ${progress}%`;
}


// handle the screens
// Theme configuration for the game
// This file contains styles and colors used across different screens
const $9abc39ad651264ba$export$bca14c5b3b88a9c9 = {
    colors: {
        background: "#1a0d00",
        text: "#d4af37",
        primary: "#8B4513",
        secondary: "#2e8b57",
        accent: "#ff4500"
    },
    fonts: {
        main: '"Luminari", "Papyrus", fantasy',
        subtitle: '"Arial", sans-serif'
    },
    fontSize: {
        title: "52px",
        subtitle: "28px",
        button: "24px"
    },
    spacing: {
        padding: "25px"
    },
    button: {
        minWidth: "265px",
        padding: "15px 35px",
        borderRadius: "4px"
    }
};
function $9abc39ad651264ba$export$be3cc0f1e33e9443(container) {
    container.style.backgroundColor = $9abc39ad651264ba$export$bca14c5b3b88a9c9.colors.background;
    container.style.color = $9abc39ad651264ba$export$bca14c5b3b88a9c9.colors.text;
    container.style.fontFamily = $9abc39ad651264ba$export$bca14c5b3b88a9c9.fonts.main;
    container.style.textAlign = "center";
    container.style.padding = $9abc39ad651264ba$export$bca14c5b3b88a9c9.spacing.padding;
}
function $9abc39ad651264ba$export$a3f040807323755c(button, color = $9abc39ad651264ba$export$bca14c5b3b88a9c9.colors.primary) {
    button.style.display = "block";
    button.style.margin = "20px auto";
    button.style.padding = $9abc39ad651264ba$export$bca14c5b3b88a9c9.button.padding;
    button.style.fontSize = $9abc39ad651264ba$export$bca14c5b3b88a9c9.fontSize.button;
    button.style.cursor = "pointer";
    button.style.backgroundColor = color;
    button.style.color = $9abc39ad651264ba$export$bca14c5b3b88a9c9.colors.text;
    button.style.border = "2px solid " + $9abc39ad651264ba$export$bca14c5b3b88a9c9.colors.text;
    button.style.borderRadius = $9abc39ad651264ba$export$bca14c5b3b88a9c9.button.borderRadius;
    button.style.textTransform = "uppercase";
    button.style.letterSpacing = "2px";
    button.style.boxShadow = "0 0 10px rgba(212, 175, 55, 0.5)";
    button.style.transition = "all 0.3s ease";
    button.style.minWidth = $9abc39ad651264ba$export$bca14c5b3b88a9c9.button.minWidth;
    // Add hover effect
    button.addEventListener("mouseover", ()=>{
        button.style.transform = "scale(1.1)";
    });
    button.addEventListener("mouseout", ()=>{
        button.style.transform = "scale(1)";
    });
}


function $4eaaf7da7949ddd7$export$cea7e42d5654180f(onStartGame, onContinueGame, onViewHighScores, onExit, onStory) {
    const container = document.getElementById("game-container");
    container.innerHTML = ""; // Clear previous content
    const welcomeScreen = document.createElement("div");
    welcomeScreen.id = "welcome-screen";
    const title = document.createElement("h1");
    title.textContent = "Welcome to Wandertrap!";
    title.style.textShadow = "2px 2px 4px rgba(0, 0, 0, 0.5)";
    title.style.background = "linear-gradient(45deg, #FFD700, #FFA500)";
    title.style.WebkitBackgroundClip = "text";
    title.style.WebkitTextFillColor = "transparent";
    title.style.display = "inline-block";
    welcomeScreen.appendChild(title);
    const subtitle = document.createElement("h2");
    subtitle.textContent = "Theo got lost...";
    subtitle.style.color = (0, $9abc39ad651264ba$export$bca14c5b3b88a9c9).colors.primary;
    subtitle.style.fontSize = (0, $9abc39ad651264ba$export$bca14c5b3b88a9c9).fontSize.subtitle;
    subtitle.style.fontFamily = (0, $9abc39ad651264ba$export$bca14c5b3b88a9c9).fonts.subtitle;
    subtitle.style.marginBottom = "30px";
    welcomeScreen.appendChild(subtitle);
    if (onContinueGame) {
        const continueButton = document.createElement("button");
        continueButton.textContent = "Continue";
        continueButton.onclick = onContinueGame;
        welcomeScreen.appendChild(continueButton);
        (0, $9abc39ad651264ba$export$a3f040807323755c)(continueButton, (0, $9abc39ad651264ba$export$bca14c5b3b88a9c9).colors.secondary);
    }
    const startButton = document.createElement("button");
    startButton.textContent = "New Game";
    startButton.onclick = onStartGame;
    welcomeScreen.appendChild(startButton);
    const storyButton = document.createElement("button");
    storyButton.textContent = "Story";
    storyButton.onclick = onStory;
    welcomeScreen.appendChild(storyButton);
    (0, $9abc39ad651264ba$export$a3f040807323755c)(storyButton, (0, $9abc39ad651264ba$export$bca14c5b3b88a9c9).colors.primary);
    const highScoresButton = document.createElement("button");
    highScoresButton.textContent = "High Scores";
    highScoresButton.onclick = onViewHighScores;
    welcomeScreen.appendChild(highScoresButton);
    const exitButton = document.createElement("button");
    exitButton.textContent = "Exit";
    exitButton.onclick = onExit;
    welcomeScreen.appendChild(exitButton);
    const controlsHint = document.createElement("p");
    controlsHint.textContent = "Arrows: move \xb7 Space: sword \xb7 X: axe \xb7 P: disarm trap \xb7 U: potion \xb7 Esc: pause";
    controlsHint.style.color = (0, $9abc39ad651264ba$export$bca14c5b3b88a9c9).colors.text;
    controlsHint.style.fontFamily = (0, $9abc39ad651264ba$export$bca14c5b3b88a9c9).fonts.subtitle;
    controlsHint.style.fontSize = "18px";
    controlsHint.style.opacity = "0.8";
    controlsHint.style.marginTop = "30px";
    welcomeScreen.appendChild(controlsHint);
    container.appendChild(welcomeScreen);
    // Apply styles
    (0, $9abc39ad651264ba$export$be3cc0f1e33e9443)(container);
    title.style.fontSize = (0, $9abc39ad651264ba$export$bca14c5b3b88a9c9).fontSize.title;
    title.style.marginBottom = "20px";
    (0, $9abc39ad651264ba$export$a3f040807323755c)(startButton);
    (0, $9abc39ad651264ba$export$a3f040807323755c)(highScoresButton);
    (0, $9abc39ad651264ba$export$a3f040807323755c)(exitButton);
}




// Persistent high scores, stored in localStorage.
// Every accessor is wrapped so a blocked/absent localStorage (private
// browsing, storage quota) degrades to an empty list instead of crashing.
const $7ffb9f7f833763be$var$STORAGE_KEY = "wandertrap.highScores";
const $7ffb9f7f833763be$var$MAX_SCORES = 10;
function $7ffb9f7f833763be$export$790b222fed6ba671() {
    try {
        const raw = localStorage.getItem($7ffb9f7f833763be$var$STORAGE_KEY);
        const scores = raw ? JSON.parse(raw) : [];
        return Array.isArray(scores) ? scores : [];
    } catch  {
        return [];
    }
}
function $7ffb9f7f833763be$export$738c9e67e16e7083(score) {
    if (score <= 0) return false;
    const scores = $7ffb9f7f833763be$export$790b222fed6ba671();
    if (scores.length < $7ffb9f7f833763be$var$MAX_SCORES) return true;
    return score > scores[scores.length - 1].score;
}
function $7ffb9f7f833763be$export$72d96b9a1a60ac75(name, score) {
    const scores = $7ffb9f7f833763be$export$790b222fed6ba671();
    scores.push({
        name: (name || "Anonymous").slice(0, 16),
        score: score,
        timestamp: new Date().toISOString()
    });
    scores.sort((a, b)=>b.score - a.score);
    const top = scores.slice(0, $7ffb9f7f833763be$var$MAX_SCORES);
    try {
        localStorage.setItem($7ffb9f7f833763be$var$STORAGE_KEY, JSON.stringify(top));
    } catch  {
    // Storage unavailable; the score just isn't persisted
    }
    return top;
}


function $a1973715fa5ee8fe$export$a0ce57c533a476a9(parent, score) {
    if (!(0, $7ffb9f7f833763be$export$738c9e67e16e7083)(score)) return;
    const wrapper = document.createElement("div");
    wrapper.id = "score-entry";
    const label = document.createElement("p");
    label.textContent = "You made the high scores! Enter your name:";
    label.style.fontSize = (0, $9abc39ad651264ba$export$bca14c5b3b88a9c9).fontSize.button;
    label.style.marginBottom = "10px";
    wrapper.appendChild(label);
    const input = document.createElement("input");
    input.id = "score-name-input";
    input.type = "text";
    input.maxLength = 16;
    input.placeholder = "Your name";
    input.style.padding = "10px";
    input.style.fontSize = (0, $9abc39ad651264ba$export$bca14c5b3b88a9c9).fontSize.button;
    input.style.fontFamily = (0, $9abc39ad651264ba$export$bca14c5b3b88a9c9).fonts.subtitle;
    input.style.textAlign = "center";
    input.style.backgroundColor = (0, $9abc39ad651264ba$export$bca14c5b3b88a9c9).colors.background;
    input.style.color = (0, $9abc39ad651264ba$export$bca14c5b3b88a9c9).colors.text;
    input.style.border = `2px solid ${(0, $9abc39ad651264ba$export$bca14c5b3b88a9c9).colors.text}`;
    input.style.borderRadius = (0, $9abc39ad651264ba$export$bca14c5b3b88a9c9).button.borderRadius;
    wrapper.appendChild(input);
    const saveButton = document.createElement("button");
    saveButton.textContent = "Save Score";
    (0, $9abc39ad651264ba$export$a3f040807323755c)(saveButton, (0, $9abc39ad651264ba$export$bca14c5b3b88a9c9).colors.secondary);
    saveButton.onclick = ()=>{
        (0, $7ffb9f7f833763be$export$72d96b9a1a60ac75)(input.value.trim(), score);
        label.textContent = "Score saved!";
        input.remove();
        saveButton.remove();
    };
    wrapper.appendChild(saveButton);
    parent.appendChild(wrapper);
}


function $5fcaaca2d0291048$export$fd5e0515ef81867f(finalScore, onTryAgain, onMainMenu) {
    const container = document.getElementById("game-container");
    container.innerHTML = ""; // Clear previous content
    const gameOverScreen = document.createElement("div");
    gameOverScreen.id = "game-over-screen";
    const title = document.createElement("h1");
    title.textContent = "Game Over";
    gameOverScreen.appendChild(title);
    const message = document.createElement("p");
    message.textContent = "Theo ran out of lives. Better luck next time!";
    gameOverScreen.appendChild(message);
    const scoreDisplay = document.createElement("p");
    scoreDisplay.textContent = `Your Score: ${finalScore}`;
    gameOverScreen.appendChild(scoreDisplay);
    (0, $a1973715fa5ee8fe$export$a0ce57c533a476a9)(gameOverScreen, finalScore);
    const tryAgainButton = document.createElement("button");
    tryAgainButton.textContent = "Try Again";
    tryAgainButton.onclick = onTryAgain;
    gameOverScreen.appendChild(tryAgainButton);
    const mainMenuButton = document.createElement("button");
    mainMenuButton.textContent = "Main Menu";
    mainMenuButton.onclick = onMainMenu;
    gameOverScreen.appendChild(mainMenuButton);
    container.appendChild(gameOverScreen);
    // Apply styles
    (0, $9abc39ad651264ba$export$be3cc0f1e33e9443)(container);
    title.style.fontSize = (0, $9abc39ad651264ba$export$bca14c5b3b88a9c9).fontSize.title;
    title.style.marginBottom = "20px";
    message.style.fontSize = (0, $9abc39ad651264ba$export$bca14c5b3b88a9c9).fontSize.subtitle;
    message.style.marginBottom = "20px";
    scoreDisplay.style.fontSize = (0, $9abc39ad651264ba$export$bca14c5b3b88a9c9).fontSize.subtitle;
    scoreDisplay.style.marginBottom = "20px";
    (0, $9abc39ad651264ba$export$a3f040807323755c)(tryAgainButton, (0, $9abc39ad651264ba$export$bca14c5b3b88a9c9).colors.primary);
    (0, $9abc39ad651264ba$export$a3f040807323755c)(mainMenuButton, (0, $9abc39ad651264ba$export$bca14c5b3b88a9c9).colors.secondary);
}




function $f9376163527bfc93$export$417cd11caced55a8(finalScore, onPlayAgain, onMainMenu) {
    const container = document.getElementById("game-container");
    container.innerHTML = "";
    const gameWonScreen = document.createElement("div");
    gameWonScreen.id = "game-won-screen";
    const title = document.createElement("h1");
    title.textContent = "You Escaped the Wandertrap!";
    gameWonScreen.appendChild(title);
    const message = document.createElement("p");
    message.textContent = "Theo found his way out. Well played!";
    gameWonScreen.appendChild(message);
    const scoreDisplay = document.createElement("p");
    scoreDisplay.textContent = `Final Score: ${finalScore}`;
    gameWonScreen.appendChild(scoreDisplay);
    (0, $a1973715fa5ee8fe$export$a0ce57c533a476a9)(gameWonScreen, finalScore);
    const playAgainButton = document.createElement("button");
    playAgainButton.textContent = "Play Again";
    playAgainButton.onclick = onPlayAgain;
    gameWonScreen.appendChild(playAgainButton);
    const mainMenuButton = document.createElement("button");
    mainMenuButton.textContent = "Main Menu";
    mainMenuButton.onclick = onMainMenu;
    gameWonScreen.appendChild(mainMenuButton);
    container.appendChild(gameWonScreen);
    (0, $9abc39ad651264ba$export$be3cc0f1e33e9443)(container);
    title.style.fontSize = (0, $9abc39ad651264ba$export$bca14c5b3b88a9c9).fontSize.title;
    title.style.marginBottom = "20px";
    message.style.fontSize = (0, $9abc39ad651264ba$export$bca14c5b3b88a9c9).fontSize.subtitle;
    message.style.marginBottom = "20px";
    scoreDisplay.style.fontSize = (0, $9abc39ad651264ba$export$bca14c5b3b88a9c9).fontSize.subtitle;
    scoreDisplay.style.marginBottom = "20px";
    (0, $9abc39ad651264ba$export$a3f040807323755c)(playAgainButton, (0, $9abc39ad651264ba$export$bca14c5b3b88a9c9).colors.accent);
    (0, $9abc39ad651264ba$export$a3f040807323755c)(mainMenuButton, (0, $9abc39ad651264ba$export$bca14c5b3b88a9c9).colors.secondary);
}



function $f85628eac899365c$export$9b9f695373d1284f(timestamp) {
    const now = new Date();
    const past = new Date(timestamp);
    const secondsAgo = Math.floor((now - past) / 1000);
    const intervals = [
        {
            label: "year",
            seconds: 31536000
        },
        {
            label: "month",
            seconds: 2592000
        },
        {
            label: "week",
            seconds: 604800
        },
        {
            label: "day",
            seconds: 86400
        },
        {
            label: "hour",
            seconds: 3600
        },
        {
            label: "minute",
            seconds: 60
        },
        {
            label: "second",
            seconds: 1
        }
    ];
    for (const interval of intervals){
        const count = Math.floor(secondsAgo / interval.seconds);
        if (count >= 1) return `${count} ${interval.label}${count !== 1 ? "s" : ""} ago`;
    }
    return "just now";
}



function $e88b758fff7cc67f$export$f3fb7af558af312e(onBack) {
    const container = document.getElementById("game-container");
    container.innerHTML = ""; // Clear previous content
    const highScoreScreen = document.createElement("div");
    highScoreScreen.id = "high-score-screen";
    const title = document.createElement("h1");
    title.textContent = "High Scores";
    highScoreScreen.appendChild(title);
    const highScores = (0, $7ffb9f7f833763be$export$790b222fed6ba671)();
    let table = null;
    if (highScores.length === 0) {
        const empty = document.createElement("p");
        empty.textContent = "No scores yet \u2014 escape the Wandertrap to set one!";
        empty.style.fontSize = (0, $9abc39ad651264ba$export$bca14c5b3b88a9c9).fontSize.subtitle;
        empty.style.margin = "40px 0";
        highScoreScreen.appendChild(empty);
    } else {
        table = document.createElement("table");
        const headerRow = document.createElement("tr");
        const headers = [
            "Name",
            "Score",
            "When"
        ];
        headers.forEach((headerText)=>{
            const header = document.createElement("th");
            header.textContent = headerText;
            headerRow.appendChild(header);
        });
        table.appendChild(headerRow);
        highScores.forEach((entry)=>{
            const row = document.createElement("tr");
            [
                entry.name,
                entry.score,
                (0, $f85628eac899365c$export$9b9f695373d1284f)(entry.timestamp)
            ].forEach((text)=>{
                const cell = document.createElement("td");
                cell.textContent = text;
                row.appendChild(cell);
            });
            table.appendChild(row);
        });
        highScoreScreen.appendChild(table);
    }
    const backButton = document.createElement("button");
    backButton.textContent = "Back";
    backButton.onclick = onBack;
    highScoreScreen.appendChild(backButton);
    container.appendChild(highScoreScreen);
    // Apply styles
    (0, $9abc39ad651264ba$export$be3cc0f1e33e9443)(container);
    title.style.fontSize = (0, $9abc39ad651264ba$export$bca14c5b3b88a9c9).fontSize.title;
    title.style.marginBottom = "20px";
    title.style.color = (0, $9abc39ad651264ba$export$bca14c5b3b88a9c9).colors.primary;
    if (table) {
        table.style.margin = "20px auto";
        table.style.borderRadius = "10px";
        table.style.borderCollapse = "collapse";
        table.style.width = "80%";
        table.style.backgroundColor = (0, $9abc39ad651264ba$export$bca14c5b3b88a9c9).colors.background;
        table.style.color = (0, $9abc39ad651264ba$export$bca14c5b3b88a9c9).colors.text;
        const ths = table.querySelectorAll("th");
        ths.forEach((th)=>{
            th.style.border = `1px solid ${(0, $9abc39ad651264ba$export$bca14c5b3b88a9c9).colors.primary}`;
            th.style.padding = "12px";
            th.style.backgroundColor = (0, $9abc39ad651264ba$export$bca14c5b3b88a9c9).colors.secondary;
            th.style.color = (0, $9abc39ad651264ba$export$bca14c5b3b88a9c9).colors.text;
            th.style.fontSize = (0, $9abc39ad651264ba$export$bca14c5b3b88a9c9).fontSize.subtitle;
        });
        const tds = table.querySelectorAll("td");
        tds.forEach((td)=>{
            td.style.border = `1px solid ${(0, $9abc39ad651264ba$export$bca14c5b3b88a9c9).colors.secondary}`;
            td.style.padding = "10px";
            td.style.fontSize = (0, $9abc39ad651264ba$export$bca14c5b3b88a9c9).fontSize.button;
        });
        // Alternating row colors for better readability
        const rows = table.querySelectorAll("tr:not(:first-child)");
        rows.forEach((row, index)=>{
            row.style.backgroundColor = index % 2 === 0 ? (0, $9abc39ad651264ba$export$bca14c5b3b88a9c9).colors.background : (0, $9abc39ad651264ba$export$bca14c5b3b88a9c9).colors.secondary + "33"; // 33 for 20% opacity
        });
    }
    (0, $9abc39ad651264ba$export$a3f040807323755c)(backButton, (0, $9abc39ad651264ba$export$bca14c5b3b88a9c9).colors.primary);
}



function $2a764c090a7b52b7$export$f68042e716ec6f25(currentScore, onNextLevel, onMainMenu) {
    const container = document.getElementById("game-container");
    // The game is already paused (animations frozen on the last rendered
    // frame); keep the canvas in place and lay a modal over it instead of
    // clearing the container like the full-page screens do.
    const existing = document.getElementById("level-completed-screen");
    if (existing) existing.remove();
    const overlay = document.createElement("div");
    overlay.id = "level-completed-screen";
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.background = "rgba(0, 0, 0, 0.45)";
    overlay.style.backdropFilter = "blur(8px)";
    overlay.style.webkitBackdropFilter = "blur(8px)";
    overlay.style.zIndex = "10";
    const modal = document.createElement("div");
    modal.style.backgroundColor = (0, $9abc39ad651264ba$export$bca14c5b3b88a9c9).colors.background;
    modal.style.color = (0, $9abc39ad651264ba$export$bca14c5b3b88a9c9).colors.text;
    modal.style.fontFamily = (0, $9abc39ad651264ba$export$bca14c5b3b88a9c9).fonts.main;
    modal.style.textAlign = "center";
    modal.style.padding = (0, $9abc39ad651264ba$export$bca14c5b3b88a9c9).spacing.padding;
    modal.style.border = "2px solid " + (0, $9abc39ad651264ba$export$bca14c5b3b88a9c9).colors.text;
    modal.style.borderRadius = (0, $9abc39ad651264ba$export$bca14c5b3b88a9c9).button.borderRadius;
    modal.style.boxShadow = "0 0 30px rgba(212, 175, 55, 0.5)";
    const title = document.createElement("h1");
    title.textContent = "Level Completed!";
    title.style.fontSize = (0, $9abc39ad651264ba$export$bca14c5b3b88a9c9).fontSize.title;
    title.style.marginBottom = "20px";
    modal.appendChild(title);
    const scoreDisplay = document.createElement("p");
    scoreDisplay.textContent = `Current Score: ${currentScore}`;
    scoreDisplay.style.fontSize = (0, $9abc39ad651264ba$export$bca14c5b3b88a9c9).fontSize.subtitle;
    scoreDisplay.style.marginBottom = "20px";
    modal.appendChild(scoreDisplay);
    const closeModal = (callback)=>()=>{
            overlay.remove();
            callback();
        };
    const nextLevelButton = document.createElement("button");
    nextLevelButton.textContent = "Next Level";
    nextLevelButton.onclick = closeModal(onNextLevel);
    modal.appendChild(nextLevelButton);
    const mainMenuButton = document.createElement("button");
    mainMenuButton.textContent = "Main Menu";
    mainMenuButton.onclick = closeModal(onMainMenu);
    modal.appendChild(mainMenuButton);
    (0, $9abc39ad651264ba$export$a3f040807323755c)(nextLevelButton, (0, $9abc39ad651264ba$export$bca14c5b3b88a9c9).colors.accent);
    (0, $9abc39ad651264ba$export$a3f040807323755c)(mainMenuButton, (0, $9abc39ad651264ba$export$bca14c5b3b88a9c9).colors.secondary);
    overlay.appendChild(modal);
    container.appendChild(overlay);
}



function $64af4ef6f07cbd5e$export$8dbb486e2bbbd474(onBack) {
    const container = document.getElementById("game-container");
    container.innerHTML = ""; // Clear previous content
    const storyScreen = document.createElement("div");
    storyScreen.id = "story-screen";
    // Remove book and pages
    const textContainer = document.createElement("div");
    textContainer.id = "text-container";
    textContainer.style.textAlign = "center";
    storyScreen.appendChild(textContainer);
    const paragraphs = [
        "Meet Theo\u2014a brilliant but clumsy game designer with a passion for crafting the most intricate fantasy campaigns.",
        "One fateful evening, while putting the finishing touches on his masterpiece labyrinth, Theo accidentally spills a can of energy drink onto his keyboard.",
        'Sparks fly, screens flash, and before he can say "critical hit," he\'s zapped into the very world he created!',
        "Blinking in disbelief, Theo finds himself standing at the entrance of his own labyrinth, a sprawling maze filled with mind-bending puzzles, hidden traps, and mythical creatures.",
        "But he's not alone in there.",
        "His former friend-turned-rival, Max, a fellow gamer notorious for stealing ideas, has hacked into Theo's game to claim the labyrinth as his own.",
        "The power surge pulled Max into the game too, but with a devious advantage\u2014he now controls the Minotaur, the maze's most formidable guardian.",
        'Max taunts Theo through ethereal echoes: "Good luck finding your way out, Theo! This maze is mine now, and the Minotaur is eager to meet you!"',
        "Determined to reclaim his creation and return to the real world, Theo must navigate through multiple levels of his labyrinth, solving his own riddles and overcoming challenges he designed to be unbeatable.",
        "Along the way, he'll encounter quirky NPCs, unexpected allies, and maybe even a friendly dragon with a knack for sarcasm.",
        "Can Theo outsmart Max, defeat the Minotaur, and escape the labyrinth?",
        "The twists and turns of his own imagination stand between him and freedom.",
        "Grab your wits, summon your courage, and step into the maze\u2014an epic adventure awaits!"
    ];
    paragraphs.forEach((text, index)=>{
        const paragraph = document.createElement("p");
        paragraph.innerHTML = text;
        paragraph.style.opacity = 0;
        paragraph.style.display = "none";
        paragraph.style.transition = "opacity 1s";
        paragraph.style.fontSize = "28px";
        textContainer.appendChild(paragraph);
    });
    const buttonContainer = document.createElement("div");
    buttonContainer.style.textAlign = "center";
    buttonContainer.style.marginTop = "20px";
    const nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextButton.onclick = showNextParagraph;
    buttonContainer.appendChild(nextButton);
    const skipButton = document.createElement("button");
    skipButton.textContent = "Skip";
    skipButton.onclick = onBack;
    buttonContainer.appendChild(skipButton);
    storyScreen.appendChild(buttonContainer);
    container.appendChild(storyScreen);
    // Apply styles
    (0, $9abc39ad651264ba$export$be3cc0f1e33e9443)(container);
    $64af4ef6f07cbd5e$var$styleStoryScreen(storyScreen, textContainer);
    (0, $9abc39ad651264ba$export$a3f040807323755c)(nextButton, (0, $9abc39ad651264ba$export$bca14c5b3b88a9c9).colors.primary);
    (0, $9abc39ad651264ba$export$a3f040807323755c)(skipButton, (0, $9abc39ad651264ba$export$bca14c5b3b88a9c9).colors.primary);
    let currentParagraph = 0;
    function showNextParagraph() {
        if (currentParagraph < paragraphs.length) {
            if (currentParagraph > 0) {
                textContainer.children[currentParagraph - 1].style.opacity = 0;
                textContainer.children[currentParagraph - 1].style.display = "none";
            }
            textContainer.children[currentParagraph].style.display = "block";
            textContainer.children[currentParagraph].style.opacity = 1;
            currentParagraph++;
        }
    }
    // Automatically show paragraphs with a delay
    function autoShowParagraphs() {
        if (currentParagraph < paragraphs.length) {
            if (currentParagraph > 0) {
                textContainer.children[currentParagraph - 1].style.opacity = 0;
                textContainer.children[currentParagraph - 1].style.display = "none";
            }
            textContainer.children[currentParagraph].style.display = "block";
            textContainer.children[currentParagraph].style.opacity = 1;
            currentParagraph++;
            setTimeout(autoShowParagraphs, 5000); // Adjust delay as needed
        }
    }
    autoShowParagraphs();
}
function $64af4ef6f07cbd5e$var$styleStoryScreen(storyScreen, textContainer) {
    storyScreen.style.position = "relative";
    storyScreen.style.height = "100vh";
    textContainer.style.margin = "50px auto";
    textContainer.style.height = "200px";
    textContainer.style.width = "70%";
    textContainer.style.backgroundColor = (0, $9abc39ad651264ba$export$bca14c5b3b88a9c9).colors.primary;
    textContainer.style.color = (0, $9abc39ad651264ba$export$bca14c5b3b88a9c9).colors.text;
    textContainer.style.padding = "20px";
    textContainer.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";
    textContainer.style.borderRadius = "10px";
}






// Entry point of the game
// - Initialize the game engine
// - Load assets (images, sounds, etc.)
// - Set up the game loop
// - Handle global game state (e.g., current level, player lives, score)
// - Transition between different screens (welcome, game, game over, high score)
class $61d488ce573da83e$var$GameEngine {
    constructor(containerId){
        this.container = document.getElementById(containerId);
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");
        this.canvas.width = (0, $5e4dc8398ac8b78d$export$ee79b8018014417).width;
        this.canvas.height = (0, $5e4dc8398ac8b78d$export$ee79b8018014417).height;
        this.canvas.style.display = "block";
        this.canvas.style.margin = "auto";
        this.container.appendChild(this.canvas);
        this.currentScreen = "splash";
    }
    getCanvas() {
        return this.canvas;
    }
    getContext() {
        return this.context;
    }
    async initialize() {
        try {
            console.log("Initializing game...");
            const totalAssets = 51;
            let loadedAssets = 0;
            const onProgress = (src, img)=>{
                loadedAssets++;
                const progress = Math.floor(loadedAssets / totalAssets * 100);
                (0, $9e619e15cd5b970b$export$1c045d0cca6b82bc)(progress);
            };
            const playerAssets = await (0, $ecb638e98763caff$export$a9303be352ef857)(onProgress);
            const levelAssets = await (0, $ecb638e98763caff$export$41cc1a8d96039105)(onProgress);
            const guardAssets = await (0, $ecb638e98763caff$export$de46def7a5f5a392)(onProgress);
            const powerupsAssets = await (0, $ecb638e98763caff$export$3df0938dc8828e8b)(onProgress);
            const itemAssets = await (0, $ecb638e98763caff$export$50efb3ab3add3718)(onProgress);
            this.assets = {
                playerAssets: playerAssets,
                levelAssets: levelAssets,
                guardAssets: guardAssets,
                powerupsAssets: powerupsAssets,
                itemAssets: itemAssets
            };
            this.game = new (0, $966e57966c4ea9d7$export$985739bfa5723e08)(this.container.id, this.canvas, this.context, this.assets, {
                onGameOver: ()=>this.showScreen("gameOver"),
                onLevelCompleted: ()=>this.showScreen("levelCompleted"),
                onGameWon: ()=>this.showScreen("gameWon")
            });
            this.showScreen("welcome");
            this.setupGameControls();
        } catch (error) {
            console.error("Error initializing game:", error);
            // Re-throw so the splash screen can surface the failure instead of
            // transitioning to a welcome screen backed by an uninitialized game.
            throw error;
        }
    }
    setupGameControls() {
        window.addEventListener("keydown", (event)=>{
            switch(event.key){
                case (0, $5e4dc8398ac8b78d$export$582ce1a401bc3f08).esc:
                    if (this.game && this.game.started) this.game.pause();
                    this.showScreen("welcome");
                    break;
            }
        });
    }
    async showScreen(screen) {
        console.log("Showing screen:", screen);
        switch(screen){
            case "splash":
                (0, $9e619e15cd5b970b$export$bcd396c5d66a748f)(this.initialize.bind(this), ()=>this.showScreen("welcome"));
                break;
            case "welcome":
                (0, $4eaaf7da7949ddd7$export$cea7e42d5654180f)(()=>this.startGame(), this.game && this.game.started ? ()=>this.continueGame() : null, ()=>this.highScore(), ()=>this.gameOver(), ()=>this.story());
                break;
            case "story":
                (0, $64af4ef6f07cbd5e$export$8dbb486e2bbbd474)(()=>this.showScreen("welcome"));
                break;
            case "game":
                console.log("Starting game...");
                if (!this.game) {
                    console.error("Cannot start game: assets are still loading or failed to load.");
                    return;
                }
                if (!this.game.started) this.game.start();
                else this.game.continue();
                break;
            case "gameOver":
                this.game.pause();
                this.game.started = false;
                (0, $5fcaaca2d0291048$export$fd5e0515ef81867f)(this.game.score, ()=>this.startGame(), ()=>this.showScreen("welcome"));
                break;
            case "gameWon":
                (0, $f9376163527bfc93$export$417cd11caced55a8)(this.game.score, ()=>this.startGame(), ()=>this.showScreen("welcome"));
                break;
            case "highScore":
                (0, $e88b758fff7cc67f$export$f3fb7af558af312e)(()=>this.showScreen("welcome"));
                break;
            case "levelCompleted":
                (0, $2a764c090a7b52b7$export$f68042e716ec6f25)(this.game.score, ()=>this.startGame(), ()=>this.showScreen("welcome"));
                break;
            default:
                console.error("Unknown screen:", screen);
        }
    }
    story() {
        this.currentScreen = "story";
        this.showScreen(this.currentScreen);
    }
    startGame() {
        this.currentScreen = "game";
        this.showScreen(this.currentScreen);
    }
    continueGame() {
        this.currentScreen = "game";
        this.showScreen(this.currentScreen);
    }
    gameOver() {
        this.currentScreen = "gameOver";
        this.showScreen(this.currentScreen);
    }
    highScore() {
        this.currentScreen = "highScore";
        this.showScreen(this.currentScreen);
    }
}
const $61d488ce573da83e$var$gameEngine = new $61d488ce573da83e$var$GameEngine("game-container");
$61d488ce573da83e$var$gameEngine.showScreen("splash");
// Exposed for automated (Playwright) tests to inspect game state.
// setSeed makes randomness reproducible mid-run; ?seed=N in the URL
// seeds the RNG at load time.
window.__wandertrap = $61d488ce573da83e$var$gameEngine;
window.__wandertrap.setSeed = (0, $2c118fbc300d5c4b$export$1471ce584de8ada3);


//# sourceMappingURL=index.9cecde61.js.map
