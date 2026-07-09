import { theme, applyContainerStyles, styleButton } from '../utils/theme.js';
import { appendScoreEntry } from './score-entry.js';

// Game Over screen
// - Display "Game Over" message
// - Show final score
// - Provide options to restart the game or go to the high score screen
// - Style: background color, text color, font size, button styles

export function showGameOverScreen(finalScore, onTryAgain, onMainMenu, dailyShare = null) {
    const container = document.getElementById('game-container');
    container.innerHTML = ''; // Clear previous content

    const gameOverScreen = document.createElement('div');
    gameOverScreen.id = 'game-over-screen';

    const title = document.createElement('h1');
    title.textContent = 'Game Over';
    gameOverScreen.appendChild(title);

    const message = document.createElement('p');
    message.textContent = 'The dream closed around Theo before he could reclaim every shard.';
    gameOverScreen.appendChild(message);

    const scoreDisplay = document.createElement('p');
    scoreDisplay.textContent = `Your Score: ${finalScore}`;
    gameOverScreen.appendChild(scoreDisplay);

    appendScoreEntry(gameOverScreen, finalScore);

    // Daily Dream runs end with a shareable one-liner of today's result
    if (dailyShare) {
        const shareButton = document.createElement('button');
        shareButton.textContent = 'Share Daily Result';
        shareButton.onclick = async () => {
            try {
                await navigator.clipboard.writeText(dailyShare);
                shareButton.textContent = 'Copied to clipboard!';
            } catch {
                shareButton.textContent = dailyShare;
            }
        };
        gameOverScreen.appendChild(shareButton);
        styleButton(shareButton, theme.colors.accent);
    }

    const tryAgainButton = document.createElement('button');
    tryAgainButton.textContent = 'Try Again';
    tryAgainButton.onclick = onTryAgain;
    gameOverScreen.appendChild(tryAgainButton);

    const mainMenuButton = document.createElement('button');
    mainMenuButton.textContent = 'Main Menu';
    mainMenuButton.onclick = onMainMenu;
    gameOverScreen.appendChild(mainMenuButton);

    container.appendChild(gameOverScreen);

    // Apply styles
    applyContainerStyles(container);
    title.style.fontSize = theme.fontSize.title;
    title.style.marginBottom = '20px';

    message.style.fontSize = theme.fontSize.subtitle;
    message.style.marginBottom = '20px';

    scoreDisplay.style.fontSize = theme.fontSize.subtitle;
    scoreDisplay.style.marginBottom = '20px';

    styleButton(tryAgainButton, theme.colors.primary);
    styleButton(mainMenuButton, theme.colors.secondary);
}