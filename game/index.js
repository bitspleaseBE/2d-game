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
  showDailyIntroScreen,
} from './screens/index.js';
import { canvasSettings, controlSettings } from './utils/settings.js';
import { setSeed } from './utils/rng.js';
import { stopNarration } from './utils/narration.js';
import { loadSoundPreferences, setCampaignComplete, loadRunState } from './utils/preferences.js';
import { dailySeed, getTodayResult, recordTodayResult, shareString } from './utils/daily.js';
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
                onGameOver: () => {
                    this.recordDailyIfNeeded(false);
                    this.showScreen('gameOver');
                },
                onLevelCompleted: (score, completedLevel, nextLevel, tally) => {
                    this.levelCompletion = { score, completedLevel, nextLevel, tally };
                    this.showScreen('levelCompleted');
                },
                onGameWon: () => {
                    this.recordDailyIfNeeded(true);
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
                    // While a game overlay (weapon unlock, level story card) is
                    // up, Escape only dismisses the overlay — the game's own
                    // handler takes care of it
                    if (this.game && this.game.started && !this.game.paused &&
                        (this.game.weaponUnlock || this.game.levelIntro)) {
                        break;
                    }
                    // Leaving the story screen (or a level card) must not let
                    // the narrator keep talking over the menu
                    stopNarration();
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
            case 'welcome': {
                // Continue resumes the paused in-memory run, or — after a
                // refresh — restores the run bookmarked in localStorage
                const savedRun = this.game && !this.game.started ? loadRunState() : null;
                const onContinue = this.game && this.game.started
                    ? () => this.continueGame()
                    : savedRun
                        ? () => this.resumeSavedRun(savedRun)
                        : null;
                showWelcomeScreen(
                    () => this.startGame(),
                    onContinue,
                    () => this.highScore(),
                    () => this.story(),
                    () => this.levelSelect(),
                    () => this.dailyDream(),
                    () => this.settings()
                );
                break;
            }
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
                showGameOverScreen(
                    this.game.score,
                    () => this.startGame(),
                    () => this.showScreen('welcome'),
                    this.game.dailyMode ? shareString() : null
                );
                break;
            case 'gameWon':
                showGameWonScreen(
                    this.game.score,
                    () => this.startGame(),
                    () => this.showScreen('welcome'),
                    this.assets.storyAssets,
                    this.game.dailyMode ? shareString() : null
                );
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
        // A run may still be in progress (paused behind the menu); starting a
        // new game must abandon it, not silently continue it
        if (this.game && this.game.started) {
            if (!window.confirm("Abandon Theo's current dream and start a new game?")) return;
            this.game.started = false;
        }
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

    // Restore a run bookmarked in localStorage (after a page refresh)
    resumeSavedRun(state) {
        this.pendingStartLevel = null;
        this.currentScreen = 'game';
        this.game.restoreRun(state);
    }

    // Start today's Daily Dream: a fresh run on the date-derived seed.
    // A three-slide explainer runs first, so the one-attempt rule is clear
    // before it counts. Results are recorded once; the welcome screen turns
    // the button into a share action after the attempt.
    dailyDream() {
        if (getTodayResult()) return; // already played — welcome handles sharing
        if (this.game && this.game.started) {
            if (!window.confirm("Abandon Theo's current dream for today's Daily Dream?")) return;
            this.game.started = false;
        }
        showDailyIntroScreen(
            () => {
                setSeed(dailySeed());
                this.pendingStartLevel = null;
                this.currentScreen = 'game';
                this.game.start({ daily: true });
            },
            () => this.showScreen('welcome')
        );
    }

    recordDailyIfNeeded(won) {
        if (!this.game || !this.game.dailyMode) return;
        recordTodayResult({
            score: this.game.score,
            levelReached: this.game.currentLevel,
            won,
        });
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
