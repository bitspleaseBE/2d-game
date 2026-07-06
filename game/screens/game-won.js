import { theme, applyContainerStyles, styleButton } from '../utils/theme.js';
import { appendScoreEntry } from './score-entry.js';

// Game Won screen
// - Shown when the player clears the final level
// - Displays the final score and options to play again or return to the menu

export function showGameWonScreen(finalScore, onPlayAgain, onMainMenu) {
    const container = document.getElementById('game-container');
    container.innerHTML = '';

    const gameWonScreen = document.createElement('div');
    gameWonScreen.id = 'game-won-screen';

    const title = document.createElement('h1');
    title.textContent = 'You Escaped the Wandertrap!';
    gameWonScreen.appendChild(title);

    const message = document.createElement('p');
    message.textContent = 'Theo found his way out. Well played!';
    gameWonScreen.appendChild(message);

    const scoreDisplay = document.createElement('p');
    scoreDisplay.textContent = `Final Score: ${finalScore}`;
    gameWonScreen.appendChild(scoreDisplay);

    appendScoreEntry(gameWonScreen, finalScore);

    const playAgainButton = document.createElement('button');
    playAgainButton.textContent = 'Play Again';
    playAgainButton.onclick = onPlayAgain;
    gameWonScreen.appendChild(playAgainButton);

    const mainMenuButton = document.createElement('button');
    mainMenuButton.textContent = 'Main Menu';
    mainMenuButton.onclick = onMainMenu;
    gameWonScreen.appendChild(mainMenuButton);

    container.appendChild(gameWonScreen);

    applyContainerStyles(container);
    title.style.fontSize = theme.fontSize.title;
    title.style.marginBottom = '20px';

    message.style.fontSize = theme.fontSize.subtitle;
    message.style.marginBottom = '20px';

    scoreDisplay.style.fontSize = theme.fontSize.subtitle;
    scoreDisplay.style.marginBottom = '20px';

    styleButton(playAgainButton, theme.colors.accent);
    styleButton(mainMenuButton, theme.colors.secondary);
}
