import { theme, styleButton } from '../utils/theme.js';

export function showLevelCompletedScreen(currentScore, onNextLevel, onMainMenu) {
    const container = document.getElementById('game-container');

    // The game is already paused (animations frozen on the last rendered
    // frame); keep the canvas in place and lay a modal over it instead of
    // clearing the container like the full-page screens do.
    const existing = document.getElementById('level-completed-screen');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'level-completed-screen';
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.background = 'rgba(0, 0, 0, 0.45)';
    overlay.style.backdropFilter = 'blur(8px)';
    overlay.style.webkitBackdropFilter = 'blur(8px)';
    overlay.style.zIndex = '10';

    const modal = document.createElement('div');
    modal.style.backgroundColor = theme.colors.background;
    modal.style.color = theme.colors.text;
    modal.style.fontFamily = theme.fonts.main;
    modal.style.textAlign = 'center';
    modal.style.padding = theme.spacing.padding;
    modal.style.border = '2px solid ' + theme.colors.text;
    modal.style.borderRadius = theme.button.borderRadius;
    modal.style.boxShadow = '0 0 30px rgba(212, 175, 55, 0.5)';

    const title = document.createElement('h1');
    title.textContent = 'Level Completed!';
    title.style.fontSize = theme.fontSize.title;
    title.style.marginBottom = '20px';
    modal.appendChild(title);

    const scoreDisplay = document.createElement('p');
    scoreDisplay.textContent = `Current Score: ${currentScore}`;
    scoreDisplay.style.fontSize = theme.fontSize.subtitle;
    scoreDisplay.style.marginBottom = '20px';
    modal.appendChild(scoreDisplay);

    const closeModal = (callback) => () => {
        overlay.remove();
        callback();
    };

    const nextLevelButton = document.createElement('button');
    nextLevelButton.textContent = 'Next Level';
    nextLevelButton.onclick = closeModal(onNextLevel);
    modal.appendChild(nextLevelButton);

    const mainMenuButton = document.createElement('button');
    mainMenuButton.textContent = 'Main Menu';
    mainMenuButton.onclick = closeModal(onMainMenu);
    modal.appendChild(mainMenuButton);

    styleButton(nextLevelButton, theme.colors.accent);
    styleButton(mainMenuButton, theme.colors.secondary);

    overlay.appendChild(modal);
    container.appendChild(overlay);
}
