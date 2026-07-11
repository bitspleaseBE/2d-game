// Game settings and configurations
// - This file contains global settings and configurations for the game
// - These settings can be adjusted to change the game's behavior and appearance

// Canvas settings
export const canvasSettings = {
    width: 64*20, // Width of the game canvas
    height: 64*10, // Height of the game canvas
    backgroundColor: '#2c2c2c', // Background color of the canvas
    cellWidth: 64, // Width of each cell in the game
    cellHeight: 64, // Height of each cell in the game
};

// Player settings
export const playerSettings = {
    initialLives: 3, // Initial number of lives for the player
    baseAttackPower: 25, // Fallback damage; actual weapon damage comes from items.js
    speed: 300, // Player movement speed in pixels per second
    respawnProtectionMs: 2000, // Invincibility after respawning, so a guard camping the spawn cannot chain-kill
    defeatPauseMs: 1500, // How long Theo stays down before respawn or game over
    color: '#ff69b4', // Color of the player (funny pink color)
};

// Game settings
export const gameSettings = {
    initialLevel: 1, // Initial level of the game
    maxLevels: 20, // Maximum number of levels in the game (must match levels defined in levels/level-data.js)
    scoreIncrement: 100, // Points added to the score for each successful action
    levelIntroDurationMs: 5200, // How long each level story card stays on screen
};

// Powerup settings (durations are in milliseconds)
export const powerupSettings = {
    healAmount: 25, // Health restored by a health crystal
    speedBoost: 180, // Extra movement speed in pixels per second while boosted
    speedDurationMs: 10000, // Speed crystal effect duration (10 seconds)
    strengthMultiplier: 2, // Attack power multiplier while a strength crystal is active
    strengthDurationMs: 10000, // Strength crystal effect duration (10 seconds)
    invincibilityDurationMs: 10000, // Invincibility crystal effect duration (10 seconds)
    maxEffectDurationMs: 30000, // Cap on stacked duration when re-collecting the same crystal type
    notificationDurationMs: 4000, // Milliseconds a pickup notification stays on screen
};

// Combat settings
export const combatSettings = {
    attackCooldownMs: 400, // Minimum time between two player swings
    knockbackSpeed: 300, // Knockback speed in pixels per second when a guard is hit
    knockbackDurationMs: 120, // How long the knockback push lasts
    healthBarVisibleMs: 3000, // How long a guard's health bar stays visible after taking damage
    corpseLingerMs: 1500, // How long defeated guards lie after the death animation
    corpseFadeMs: 300, // Fade corpses during the final part of the linger window
    projectileSpeed: 480, // Arrow speed in pixels per second
    projectileRangeCells: 7, // Maximum arrow flight distance
    archerCooldownMs: 1500, // Time between orc archer shots
    archerKeepDistanceCells: 2, // Archers try to back away inside this range
    archerRangeCells: 6, // Line-of-sight range for archer shots
    archerHealth: 60,
    archerDamage: 5,
};

// Boss settings ('B' cells in level layouts). Bosses are tanky and hit harder,
// but they are slower than the player and telegraph danger with a permanent
// health bar, so a fight is winnable by kiting instead of trading hits.
export const bossSettings = {
    health: 300, // Six regular swings (or three with a strength crystal)
    damage: 20, // Contact damage per hit (the hurt window limits this to ~1 hit/second)
    speed: 45, // Pixels per second — slower than a guard, much slower than the player
    width: 128, // Drawn size in pixels
    height: 128,
    detectionRangeCells: 6, // How far the boss spots the player, in cells
    scoreValue: 500, // Score awarded for defeating a boss
};

// Fog of war settings (levels with fogOfWar: true in level-data.js)
export const fogSettings = {
    revealRadius: 160, // Pixels around the player that are fully lit (2.5 cells)
    exploredAlpha: 0.55, // Darkness over explored areas outside the light radius
    unexploredAlpha: 1, // Darkness over never-visited areas
};

// Entity settings
export const entitySettings = {
    enemyWidth: 91, // Width of the enemy
    enemyHeight: 91, // Height of the enemy
    obstacleColor: '#c62828', // Color of obstacles (Carmen red)
    powerupColor: '#1565c0', // Color of powerups (Darker formal blue)
    guardColor: '#ff69b4', // Color of guards (funny pink color)
    explosiveColor: '#ffd54f', // Color of explosives (Yellow)
    exitColor: '#4caf50', // Color of the exit (Green)
    explosiveTriggerRange: 96, // Distance at which a hidden trap arms itself
    explosiveFuseMs: 1500, // Time between arming and detonation
    explosiveBlastRadius: 96, // Blast radius in pixels
    explosivePlayerDamage: 30, // Damage the blast deals to the player
    explosiveGuardDamage: 100, // Damage the blast deals to guards
};

// Trap settings (spike traps 'S', dart shooters '^v<>', crumbling floors 'F')
export const trapSettings = {
    // Spike trap: retracted -> warning (tips telegraph) -> extended, on a loop
    spikeRetractedMs: 1400, // Time spikes stay down (safe to cross)
    spikeWarningMs: 500, // Telegraph before the spikes come up
    spikeExtendedMs: 900, // Time spikes stay up (dangerous)
    spikePlayerDamage: 15, // Damage per hit; the player's hurt window throttles repeats
    spikeGuardDamage: 30, // Damage to a guard, once per extension cycle
    // Dart shooter: wall-mounted, fires along its facing direction
    dartCooldownMs: 2200, // Time between shots
    dartSpeed: 360, // Slower than arrows (480) so darts can be dodged
    dartDamage: 10, // Damage a dart deals to the player
    dartRangeCells: 6, // Dart flight distance in cells
    dartActivationRangeCells: 8, // Only fires while the player is this close
    // Crumbling floor: cracks underfoot, then becomes an impassable pit
    crumbleDelayMs: 800, // Time between the first step and collapse
    crumbleCollapseDamage: 20, // Damage dealt if the player is still on it at collapse
};

// Sound settings
export const soundSettings = {
    mute: false, // Mute/unmute game sounds
    volume: 0.5, // Volume level of game sounds (0.0 to 1.0)
};

// Control settings
export const controlSettings = {
    up: 'ArrowUp', // Key for moving up
    down: 'ArrowDown', // Key for moving down
    left: 'ArrowLeft', // Key for moving left
    right: 'ArrowRight', // Key for moving right
    attack: ' ', // Key for attacking (Space bar)
    esc: 'Escape', // Key for going back to the welcome screen
    axe: 'x', // Key for axe
    potion: 'u', // Key for drinking a potion from the inventory
    inventory: 'i', // Key for opening/closing the inventory
};

// Add more settings as needed for other aspects of the game