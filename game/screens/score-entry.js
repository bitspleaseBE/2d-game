import { theme, styleButton } from '../utils/theme.js';
import { qualifiesForHighScore, addHighScore } from '../utils/storage.js';

// Shared "save your score" widget for the game-over and game-won screens.
// Renders a name input + save button when the score makes the top-10;
// otherwise renders nothing.
export function appendScoreEntry(parent, score) {
    if (!qualifiesForHighScore(score)) return;

    const wrapper = document.createElement('div');
    wrapper.id = 'score-entry';

    const label = document.createElement('p');
    label.textContent = 'You made the high scores! Enter your name:';
    label.style.fontSize = theme.fontSize.button;
    label.style.marginBottom = '10px';
    wrapper.appendChild(label);

    const input = document.createElement('input');
    input.id = 'score-name-input';
    input.type = 'text';
    input.maxLength = 16;
    input.placeholder = 'Your name';
    input.style.padding = '10px';
    input.style.fontSize = theme.fontSize.button;
    input.style.fontFamily = theme.fonts.subtitle;
    input.style.textAlign = 'center';
    input.style.backgroundColor = theme.colors.background;
    input.style.color = theme.colors.text;
    input.style.border = `2px solid ${theme.colors.text}`;
    input.style.borderRadius = theme.button.borderRadius;
    wrapper.appendChild(input);

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save Score';
    styleButton(saveButton, theme.colors.secondary);
    saveButton.onclick = () => {
        addHighScore(input.value.trim(), score);
        label.textContent = 'Score saved!';
        input.remove();
        saveButton.remove();
    };
    wrapper.appendChild(saveButton);

    parent.appendChild(wrapper);
}
