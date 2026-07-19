import { theme, applyContainerStyles, styleButton } from '../utils/theme.js';
import { appendScoreEntry } from './score-entry.js';
import { endingStoryBeat } from '../story-content.js';
import { playNarration, stopNarration } from '../utils/narration.js';

// Game Won screen
// - Shown when the player clears the final level
// - Displays the final score and options to play again or return to the menu

export function showGameWonScreen(finalScore, onPlayAgain, onMainMenu, storyAssets = {}, dailyShare = null) {
    const container = document.getElementById('game-container');
    container.innerHTML = '';

    const gameWonScreen = document.createElement('div');
    gameWonScreen.id = 'game-won-screen';

    const title = document.createElement('h1');
    title.textContent = 'Theo Wakes at Dawn';
    gameWonScreen.appendChild(title);

    const message = document.createElement('p');
    message.textContent = endingStoryBeat.text;
    gameWonScreen.appendChild(message);

    const scoreDisplay = document.createElement('p');
    scoreDisplay.textContent = `Final Score: ${finalScore}`;
    gameWonScreen.appendChild(scoreDisplay);

    appendScoreEntry(gameWonScreen, finalScore);

    // Daily Dream runs end with a shareable one-liner of today's result
    let shareButton = null;
    if (dailyShare) {
        shareButton = document.createElement('button');
        shareButton.textContent = 'Share Daily Result';
        shareButton.onclick = async () => {
            try {
                await navigator.clipboard.writeText(dailyShare);
                shareButton.textContent = 'Copied to clipboard!';
            } catch {
                shareButton.textContent = dailyShare;
            }
        };
        gameWonScreen.appendChild(shareButton);
    }

    const playAgainButton = document.createElement('button');
    playAgainButton.textContent = 'Play Again';
    playAgainButton.onclick = closeWith(onPlayAgain);
    gameWonScreen.appendChild(playAgainButton);

    const mainMenuButton = document.createElement('button');
    mainMenuButton.textContent = 'Main Menu';
    mainMenuButton.onclick = closeWith(onMainMenu);
    gameWonScreen.appendChild(mainMenuButton);

    container.appendChild(gameWonScreen);

    applyContainerStyles(container);
    container.style.padding = '0';
    gameWonScreen.style.minHeight = '100vh';
    gameWonScreen.style.display = 'flex';
    gameWonScreen.style.flexDirection = 'column';
    gameWonScreen.style.alignItems = 'center';
    gameWonScreen.style.justifyContent = 'center';
    gameWonScreen.style.backgroundSize = 'cover';
    gameWonScreen.style.backgroundPosition = 'center';
    gameWonScreen.style.backgroundImage = storyAssets.endingDawn
        ? `linear-gradient(rgba(8, 4, 2, 0.25), rgba(8, 4, 2, 0.72)), url("${storyAssets.endingDawn.src}")`
        : 'radial-gradient(circle at center, #6d4c1d 0%, #1a0d00 65%)';
    title.style.fontSize = theme.fontSize.title;
    title.style.marginBottom = '20px';
    title.style.textShadow = '0 3px 14px rgba(0, 0, 0, 0.85)';

    message.style.fontSize = theme.fontSize.subtitle;
    message.style.maxWidth = '880px';
    message.style.padding = '20px 28px';
    message.style.marginBottom = '20px';
    message.style.background = 'rgba(12, 9, 18, 0.78)';
    message.style.border = '2px solid rgba(212, 175, 55, 0.75)';
    message.style.borderRadius = '14px';

    scoreDisplay.style.fontSize = theme.fontSize.subtitle;
    scoreDisplay.style.marginBottom = '20px';

    styleButton(playAgainButton, theme.colors.accent);
    styleButton(mainMenuButton, theme.colors.secondary);
    if (shareButton) styleButton(shareButton, theme.colors.primary);

    playNarration(endingStoryBeat.audioId);

    function closeWith(callback) {
        return () => {
            stopNarration();
            callback();
        };
    }
}
