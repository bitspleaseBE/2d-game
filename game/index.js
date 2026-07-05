import { Game } from './game.js';
import { loadPlayerAssets, loadLevelAssets, loadGuardAssets, loadPowerUpsAssets, } from './assets.js';
import { showSplashScreen, updateSplashScreenProgress } from './screens/splash.js';
import { showWelcomeScreen, showGameOverScreen, showGameWonScreen, showHighScoreScreen, showLevelCompletedScreen, showStoryScreen } from './screens/index.js';
import { canvasSettings, controlSettings } from './utils/settings.js';
import { setSeed } from './utils/rng.js';

// Entry point of the game
// - Initialize the game engine
// - Load assets (images, sounds, etc.)
// - Set up the game loop
// - Handle global game state (e.g., current level, player lives, score)
// - Transition between different screens (welcome, game, game over, high score)

class GameEngine {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.canvas.width = canvasSettings.width;
        this.canvas.height = canvasSettings.height;
        this.canvas.style.display = 'block';
        this.canvas.style.margin = 'auto';
        this.container.appendChild(this.canvas);
        
        this.currentScreen = 'splash';
    }

    getCanvas() {
        return this.canvas;
    }

    getContext() {
        return this.context;
    }

    async initialize() {
        try {
            console.log('Initializing game...');
            const totalAssets = 34;
            let loadedAssets = 0;

            const onProgress = (src, img) => {
                loadedAssets++;
                const progress = Math.floor((loadedAssets / totalAssets) * 100);
                updateSplashScreenProgress(progress);
            };

            const playerAssets = await loadPlayerAssets(onProgress);
            const levelAssets = await loadLevelAssets(onProgress);
            const guardAssets = await loadGuardAssets(onProgress);
            const powerupsAssets = await loadPowerUpsAssets(onProgress);

            this.assets = { playerAssets, levelAssets, guardAssets, powerupsAssets };
            this.game = new Game(this.container.id, this.canvas, this.context, this.assets, {
                onGameOver: () => this.showScreen('gameOver'),
                onLevelCompleted: () => this.showScreen('levelCompleted'),
                onGameWon: () => this.showScreen('gameWon'),
            });
            this.showScreen('welcome');
            this.setupGameControls();
        } catch (error) {
            console.error('Error initializing game:', error);
            // Re-throw so the splash screen can surface the failure instead of
            // transitioning to a welcome screen backed by an uninitialized game.
            throw error;
        }
    }

    setupGameControls() {
        window.addEventListener('keydown', (event) => {
            switch (event.key) {
                case controlSettings.esc:
                    if (this.game && this.game.started) {
                        this.game.pause();
                    }
                    this.showScreen('welcome');
                    break;
            }
        });
    }

    async showScreen(screen) {
        console.log('Showing screen:', screen);
        switch (screen) {
            case 'splash':
                showSplashScreen(this.initialize.bind(this), () => this.showScreen('welcome'));
                break;
            case 'welcome':
                showWelcomeScreen(
                    () => this.startGame(),
                    this.game && this.game.started ? () => this.continueGame() : null,
                    () => this.highScore(),
                    () => this.gameOver(),
                    () => this.story()
                );
                break;
            case 'story':
                showStoryScreen(() => this.showScreen('welcome'));
                break;
            case 'game':
                console.log('Starting game...');
                if (!this.game) {
                    console.error('Cannot start game: assets are still loading or failed to load.');
                    return;
                }
                if (!this.game.started) {
                    this.game.start();
                } else {
                    this.game.continue();
                }
                break;
            case 'gameOver':
                this.game.pause();
                this.game.started = false;
                showGameOverScreen(this.game.score, () => this.startGame(), () => this.showScreen('welcome'));
                break;
            case 'gameWon':
                showGameWonScreen(this.game.score, () => this.startGame(), () => this.showScreen('welcome'));
                break;
            case 'highScore':
                showHighScoreScreen(() => this.showScreen('welcome'));
                break;
            case 'levelCompleted':
                showLevelCompletedScreen(this.game.score, () => this.startGame(), () => this.showScreen('welcome'));
                break;
            default:
                console.error('Unknown screen:', screen);
        }
    }

    story() {
        this.currentScreen = 'story';
        this.showScreen(this.currentScreen);
    }

    startGame() {
        this.currentScreen = 'game';
        this.showScreen(this.currentScreen);
    }

    continueGame() {
        this.currentScreen = 'game';
        this.showScreen(this.currentScreen);
    }

    gameOver() {
        this.currentScreen = 'gameOver';
        this.showScreen(this.currentScreen);
    }

    highScore() {
        this.currentScreen = 'highScore';
        this.showScreen(this.currentScreen);
    }
}

const gameEngine = new GameEngine('game-container');
gameEngine.showScreen('splash');

// Exposed for automated (Playwright) tests to inspect game state.
// setSeed makes randomness reproducible mid-run; ?seed=N in the URL
// seeds the RNG at load time.
window.__wandertrap = gameEngine;
window.__wandertrap.setSeed = setSeed;