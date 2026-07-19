import { theme, applyContainerStyles, styleButton, applyMenuAtmosphere } from '../utils/theme.js';
import { timeAgo } from '../utils/date.js';
import { getHighScores } from '../utils/storage.js';
import { getMenuBackdropPngUrl, getMenuBackdropUrl } from '../assets.js';

// High Score screen
// - Displays the top-10 scores persisted in localStorage
// - Scores are recorded from the game-over / game-won screens

export function showHighScoreScreen(onBack) {
    const container = document.getElementById('game-container');
    container.innerHTML = '';

    applyContainerStyles(container);
    container.style.padding = '0';
    container.style.display = 'flex';
    container.style.alignItems = 'stretch';
    container.style.justifyContent = 'center';

    const highScoreScreen = document.createElement('div');
    highScoreScreen.id = 'high-score-screen';
    highScoreScreen.style.width = '100%';
    highScoreScreen.style.minHeight = '100%';
    highScoreScreen.style.display = 'flex';
    highScoreScreen.style.alignItems = 'center';
    highScoreScreen.style.justifyContent = 'center';
    highScoreScreen.style.boxSizing = 'border-box';
    highScoreScreen.style.padding = '48px 24px 36px';

    const content = applyMenuAtmosphere(highScoreScreen, getMenuBackdropPngUrl());
    getMenuBackdropUrl().then((url) => {
        const backdrop = highScoreScreen.querySelector('.wandertrap-menu-backdrop');
        if (backdrop && url) backdrop.style.backgroundImage = `url("${url}")`;
    });

    content.style.display = 'flex';
    content.style.flexDirection = 'column';
    content.style.alignItems = 'center';
    content.style.width = '100%';
    content.style.maxWidth = '920px';
    content.style.marginTop = '-2vh';
    content.style.textAlign = 'center';

    const title = document.createElement('h1');
    title.textContent = 'High Scores';
    title.style.margin = '0 0 28px';
    title.style.fontFamily = theme.fonts.main;
    title.style.fontSize = '42px';
    title.style.fontWeight = '600';
    title.style.letterSpacing = '2px';
    title.style.color = theme.colors.text;
    title.style.textShadow = '0 2px 14px rgba(0, 0, 0, 0.7)';
    content.appendChild(title);

    const highScores = getHighScores();

    if (highScores.length === 0) {
        const empty = document.createElement('p');
        empty.textContent = 'No scores yet — escape the Wandertrap to set one!';
        empty.style.fontFamily = theme.fonts.subtitle;
        empty.style.fontSize = theme.fontSize.subtitle;
        empty.style.color = theme.colors.textMuted;
        empty.style.opacity = '0.8';
        empty.style.margin = '40px 0';
        content.appendChild(empty);
    } else {
        const table = document.createElement('table');
        const headerRow = document.createElement('tr');
        ['Name', 'Score', 'When'].forEach((headerText) => {
            const header = document.createElement('th');
            header.textContent = headerText;
            headerRow.appendChild(header);
        });
        table.appendChild(headerRow);

        highScores.forEach((entry) => {
            const row = document.createElement('tr');
            [entry.name, entry.score, timeAgo(entry.timestamp)].forEach((text) => {
                const cell = document.createElement('td');
                cell.textContent = text;
                row.appendChild(cell);
            });
            table.appendChild(row);
        });

        table.style.width = '100%';
        table.style.margin = '0 auto 28px';
        table.style.borderCollapse = 'collapse';
        table.style.fontFamily = theme.fonts.subtitle;
        table.style.color = theme.colors.text;
        table.style.backgroundColor = 'rgba(12, 14, 22, 0.55)';
        table.style.backdropFilter = 'blur(3px)';
        table.style.webkitBackdropFilter = 'blur(3px)';
        table.style.border = `1px solid rgba(255, 213, 79, 0.35)`;
        table.style.borderRadius = '4px';
        table.style.overflow = 'hidden';

        table.querySelectorAll('th').forEach((th) => {
            th.style.border = 'none';
            th.style.borderBottom = `1px solid rgba(255, 213, 79, 0.35)`;
            th.style.padding = '16px 28px';
            th.style.backgroundColor = 'rgba(255, 213, 79, 0.12)';
            th.style.color = theme.colors.text;
            th.style.fontFamily = theme.fonts.main;
            th.style.fontSize = '22px';
            th.style.fontWeight = '600';
            th.style.letterSpacing = '2px';
            th.style.textTransform = 'uppercase';
        });

        table.querySelectorAll('td').forEach((td) => {
            td.style.border = 'none';
            td.style.borderBottom = '1px solid rgba(255, 213, 79, 0.12)';
            td.style.padding = '14px 28px';
            td.style.fontSize = '20px';
        });

        table.querySelectorAll('tr:not(:first-child)').forEach((row, index) => {
            row.style.backgroundColor = index % 2 === 0
                ? 'transparent'
                : 'rgba(61, 126, 166, 0.12)';
        });

        // Score column emphasis
        table.querySelectorAll('tr').forEach((row) => {
            const scoreCell = row.children[1];
            if (scoreCell) scoreCell.style.textAlign = 'right';
            const whenCell = row.children[2];
            if (whenCell) {
                whenCell.style.textAlign = 'right';
                whenCell.style.opacity = '0.75';
                whenCell.style.fontSize = '18px';
            }
        });

        content.appendChild(table);
    }

    const backButton = document.createElement('button');
    backButton.textContent = 'Back';
    backButton.onclick = onBack;
    styleButton(backButton, theme.colors.primary, 'primary');
    content.appendChild(backButton);

    container.appendChild(highScoreScreen);
}
