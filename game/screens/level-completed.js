import { theme, styleButton } from '../utils/theme.js';

export function showLevelCompletedScreen(currentScore, onNextLevel, onMainMenu, levelCompletion = {}) {
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
    modal.style.boxShadow = '0 0 30px rgba(128, 216, 255, 0.35)';

    const title = document.createElement('h1');
    title.textContent = 'Dream-Shard Reclaimed!';
    title.style.fontSize = theme.fontSize.title;
    title.style.marginBottom = '20px';
    modal.appendChild(title);

    const statusLabel = document.createElement('p');
    statusLabel.textContent = 'Level Completed!';
    statusLabel.style.fontSize = '18px';
    statusLabel.style.textTransform = 'uppercase';
    statusLabel.style.letterSpacing = '2px';
    statusLabel.style.margin = '0 0 18px';
    statusLabel.style.opacity = '0.8';
    modal.appendChild(statusLabel);

    const completedMessage = document.createElement('p');
    completedMessage.textContent = levelCompletion.completedLevel
        ? `${levelCompletion.completedLevel.name} fades behind Theo.`
        : 'A piece of the way home returns to Theo.';
    completedMessage.style.fontSize = '22px';
    completedMessage.style.marginBottom = '14px';
    modal.appendChild(completedMessage);

    // Mastery tally: stars plus the time / no-damage bonus breakdown
    if (levelCompletion.tally) {
        const tally = levelCompletion.tally;

        const stars = document.createElement('p');
        stars.textContent = '★★★'.slice(0, tally.stars) + '☆☆☆'.slice(tally.stars);
        stars.style.fontSize = '34px';
        stars.style.letterSpacing = '6px';
        stars.style.color = '#ffd54f';
        stars.style.margin = '0 0 12px';
        modal.appendChild(stars);

        const totalSeconds = Math.floor(tally.elapsedMs / 1000);
        const timeLabel = `${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2, '0')}`;
        const lines = [
            `Dream time ${timeLabel} — time bonus +${tally.timeBonus}`,
            tally.noDamageBonus > 0
                ? `Untouched! +${tally.noDamageBonus}`
                : 'Theo took a few bumps — no untouched bonus.',
        ];
        if (tally.sneakBonus > 0) {
            lines.push(`Slipped past the Warden! +${tally.sneakBonus}`);
        }
        lines.forEach((text) => {
            const line = document.createElement('p');
            line.textContent = text;
            line.style.fontSize = '16px';
            line.style.opacity = '0.85';
            line.style.margin = '0 0 6px';
            modal.appendChild(line);
        });
    }

    if (levelCompletion.nextLevel) {
        const nextMessage = document.createElement('p');
        nextMessage.textContent = `Next: ${levelCompletion.nextLevel.name} — ${levelCompletion.nextLevel.story}`;
        nextMessage.style.fontSize = '18px';
        nextMessage.style.maxWidth = '640px';
        nextMessage.style.lineHeight = '1.4';
        nextMessage.style.margin = '0 auto 22px';
        modal.appendChild(nextMessage);
    }

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

    styleButton(nextLevelButton, theme.colors.primary);
    styleButton(mainMenuButton, theme.colors.secondary);

    overlay.appendChild(modal);
    container.appendChild(overlay);
}
