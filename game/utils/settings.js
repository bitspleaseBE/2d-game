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
    speed: 5, // Speed of the player movement (pixels per frame)
    attackPower: 50, // Damage dealt per sword swing
    attackCooldown: 24, // Frames between sword swings (~0.4s at 60 FPS)
    hurtDuration: 60, // Invulnerability window after taking a hit, in frames
    effectDuration: 480, // How long a timed powerup lasts, in frames (~8s)
};

// Game settings
export const gameSettings = {
    initialLevel: 1, // Initial level of the game
    scoreIncrement: 100, // Points for defeating a guard
    powerupScore: 50, // Points for collecting a powerup or key
    disarmScore: 50, // Points for disarming an armed explosive trap
    bossScore: 500, // Points for defeating the boss
    levelBonus: 100, // Level-completion bonus, multiplied by the level number
    guardDropChance: 0.4, // Chance a defeated guard drops a powerup
    controlsHintFrames: 300, // How long the controls hint shows at level start (~5s)
};

// Entity settings
export const entitySettings = {
    enemyWidth: 91, // Width of the enemy
    enemyHeight: 91, // Height of the enemy
    bossWidth: 128, // Width of the boss
    bossHeight: 128, // Height of the boss
    explosiveTriggerRange: 96, // Distance at which a hidden explosive arms itself
    explosiveFuseFrames: 90, // Frames between arming and detonation (~1.5s)
    explosiveBlastRadius: 96, // Blast radius in pixels
    explosivePlayerDamage: 30, // Damage the blast deals to the player
    explosiveGuardDamage: 100, // Damage the blast deals to guards
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
    pick: 'p', // Key for picking
    axe: 'x', // Key for axe
    potion: 'u', // Key for potion
};

// Theme palettes for the level background, keyed by the level's theme name
export const levelThemes = {
    forest: { center: '#3E8948', edge: '#1A3B1F', grid: 'rgba(0, 255, 0, 0.1)' },
    sand: { center: '#D8B863', edge: '#8A6B2F', grid: 'rgba(120, 80, 0, 0.12)' },
    snow: { center: '#DCE8F0', edge: '#8FA9BC', grid: 'rgba(60, 90, 120, 0.12)' },
    dark: { center: '#4A3B5C', edge: '#191024', grid: 'rgba(200, 160, 255, 0.08)' },
};

// Add more settings as needed for other aspects of the game
