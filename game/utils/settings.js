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
    speed: 5, // Speed of the player movement
    color: '#ff69b4', // Color of the player (funny pink color)
};

// Game settings
export const gameSettings = {
    initialLevel: 1, // Initial level of the game
    maxLevels: 5, // Maximum number of levels in the game (must match levels defined in levels/level-data.js)
    scoreIncrement: 100, // Points added to the score for each successful action
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

// Add more settings as needed for other aspects of the game