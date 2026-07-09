import { Game } from './game.js';
import { loadPlayerAssets, loadLevelAssets, loadGuardAssets, loadPowerUpsAssets, loadItemAssets, loadProjectileAssets, loadStoryAssetsInBackground, getStoryAssets, getTotalAssetCount } from './assets.js';
import { showSplashScreen, updateSplashScreenProgress } from './screens/splash.js';
import {
  showWelcomeScreen,
  showLevelSelectScreen,
  showGameOverScreen,
  showGameWonScreen,
  showHighScoreScreen,
  showLevelCompletedScreen,
  showStoryScreen,
  showSettingsScreen,
} from './screens/index.js';
import { canvasSettings, controlSettings } from './utils/settings.js';
import { setSeed } from './utils/rng.js';
import { loadSoundPreferences, setCampaignComplete } from './utils/preferences.js';
import { installOrientationGuard } from './utils/orientation.js';

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
        this.pendingStartLevel = null;
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
            loadSoundPreferences();
            installOrientationGuard();

            const totalAssets = getTotalAssetCount();
            let loadedAssets = 0;

            const onProgress = (src, img) => {
                loadedAssets++;
                const progress = Math.min(100, Math.floor((loadedAssets / totalAssets) * 100));
                updateSplashScreenProgress(progress);
            };

            const [playerAssets, levelAssets, guardAssets, powerupsAssets, itemAssets, projectileAssets] = await Promise.all([
                loadPlayerAssets(onProgress),
                loadLevelAssets(onProgress),
                loadGuardAssets(onProgress),
                loadPowerUpsAssets(onProgress),
                loadItemAssets(onProgress),
                loadProjectileAssets(onProgress),
            ]);

            const storyAssets = getStoryAssets();
            loadStoryAssetsInBackground();

            this.assets = { playerAssets, levelAssets, guardAssets, powerupsAssets, itemAssets, projectileAssets, storyAssets };
            this.game = new Game(this.container.id, this.canvas, this.context, this.assets, {
                onGameOver: () => this.showScreen('gameOver'),
                onLevelCompleted: (score, completedLevel, nextLevel) => {
                    this.levelCompletion = { score, completedLevel, nextLevel };
                    this.showScreen('levelCompleted');
                },
                onGameWon: () => {
                    setCampaignComplete();
                    this.showScreen('gameWon');
                },
            });
            this.showScreen('welcome');
            this.setupGameControls();
        } catch (error) {
            console.error('Error initializing game:', error);
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
                    () => this.story(),
                    () => this.levelSelect(),
                    () => this.settings()
                );
                break;
            case 'settings':
                showSettingsScreen(() => this.showScreen('welcome'));
                break;
            case 'levelSelect':
                showLevelSelectScreen(
                    (levelNumber) => this.startFromLevel(levelNumber),
                    () => this.showScreen('welcome')
                );
                break;
            case 'story':
                showStoryScreen(() => this.showScreen('welcome'), this.assets.storyAssets);
                break;
            case 'game':
                console.log('Starting game...');
                if (!this.game) {
                    console.error('Cannot start game: assets are still loading or failed to load.');
                    return;
                }
                if (this.pendingStartLevel) {
                    this.game.start({ fromLevel: this.pendingStartLevel });
                    this.pendingStartLevel = null;
                } else if (!this.game.started) {
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
                showGameWonScreen(this.game.score, () => this.startGame(), () => this.showScreen('welcome'), this.assets.storyAssets);
                break;
            case 'highScore':
                showHighScoreScreen(() => this.showScreen('welcome'));
                break;
            case 'levelCompleted':
                showLevelCompletedScreen(
                    this.game.score,
                    () => this.continueGame(),
                    () => this.showScreen('welcome'),
                    this.levelCompletion
                );
                break;
            default:
                console.error('Unknown screen:', screen);
        }
    }

    story() {
        this.currentScreen = 'story';
        this.showScreen(this.currentScreen);
    }

    settings() {
        this.currentScreen = 'settings';
        this.showScreen(this.currentScreen);
    }

    levelSelect() {
        this.currentScreen = 'levelSelect';
        this.showScreen(this.currentScreen);
    }

    startGame() {
        this.pendingStartLevel = null;
        this.currentScreen = 'game';
        this.showScreen(this.currentScreen);
    }

    startFromLevel(levelNumber) {
        this.pendingStartLevel = levelNumber;
        this.game.started = false;
        this.currentScreen = 'game';
        this.showScreen(this.currentScreen);
    }

    continueGame() {
        this.pendingStartLevel = null;
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

window.__wandertrap = gameEngine;
window.__wandertrap.setSeed = setSeed;
