import { theme, applyContainerStyles, styleButton } from '../utils/theme.js';
import { timeAgo } from '../utils/date.js';
import { getHighScores } from '../utils/storage.js';

// High Score screen
// - Displays the top-10 scores persisted in localStorage
// - Scores are recorded from the game-over / game-won screens

export function showHighScoreScreen(onBack) {
    const container = document.getElementById('game-container');
    container.innerHTML = ''; // Clear previous content

    const highScoreScreen = document.createElement('div');
    highScoreScreen.id = 'high-score-screen';

    const title = document.createElement('h1');
    title.textContent = 'High Scores';
    highScoreScreen.appendChild(title);

    const highScores = getHighScores();

    let table = null;
    if (highScores.length === 0) {
        const empty = document.createElement('p');
        empty.textContent = 'No scores yet — escape the Wandertrap to set one!';
        empty.style.fontSize = theme.fontSize.subtitle;
        empty.style.margin = '40px 0';
        highScoreScreen.appendChild(empty);
    } else {
        table = document.createElement('table');
        const headerRow = document.createElement('tr');
        const headers = ['Name', 'Score', 'When'];
        headers.forEach(headerText => {
            const header = document.createElement('th');
            header.textContent = headerText;
            headerRow.appendChild(header);
        });
        table.appendChild(headerRow);

        highScores.forEach(entry => {
            const row = document.createElement('tr');
            [entry.name, entry.score, timeAgo(entry.timestamp)].forEach(text => {
                const cell = document.createElement('td');
                cell.textContent = text;
                row.appendChild(cell);
            });
            table.appendChild(row);
        });

        highScoreScreen.appendChild(table);
    }

    const backButton = document.createElement('button');
    backButton.textContent = 'Back';
    backButton.onclick = onBack;
    highScoreScreen.appendChild(backButton);

    container.appendChild(highScoreScreen);

    // Apply styles
    applyContainerStyles(container);
    title.style.fontSize = theme.fontSize.title;
    title.style.marginBottom = '20px';
    title.style.color = theme.colors.primary;

    if (table) {
        table.style.margin = '20px auto';
        table.style.borderRadius = '10px';
        table.style.borderCollapse = 'collapse';
        table.style.width = '80%';
        table.style.backgroundColor = theme.colors.background;
        table.style.color = theme.colors.text;

        const ths = table.querySelectorAll('th');
        ths.forEach(th => {
            th.style.border = `1px solid ${theme.colors.primary}`;
            th.style.padding = '12px';
            th.style.backgroundColor = theme.colors.secondary;
            th.style.color = theme.colors.text;
            th.style.fontSize = theme.fontSize.subtitle;
        });

        const tds = table.querySelectorAll('td');
        tds.forEach(td => {
            td.style.border = `1px solid ${theme.colors.secondary}`;
            td.style.padding = '10px';
            td.style.fontSize = theme.fontSize.button;
        });

        // Alternating row colors for better readability
        const rows = table.querySelectorAll('tr:not(:first-child)');
        rows.forEach((row, index) => {
            row.style.backgroundColor = index % 2 === 0 ? theme.colors.background : theme.colors.secondary + '33'; // 33 for 20% opacity
        });
    }

    styleButton(backButton, theme.colors.primary);
}
