import { theme, applyContainerStyles, styleButton } from '../utils/theme.js';

// Welcome screen logic
// - Display game title
// - Provide buttons to start the game, view high scores, and adjust sound settings
// - Style: background color, text color, font size, button styles
// - Include sound control (mute/unmute button)

export function showWelcomeScreen(onStartGame, onContinueGame, onViewHighScores, onExit, onStory) {
    const container = document.getElementById('game-container');
    container.innerHTML = ''; // Clear previous content

    const welcomeScreen = document.createElement('div');
    welcomeScreen.id = 'welcome-screen';

    const title = document.createElement('h1');
    title.textContent = 'Welcome to Wandertrap!';
    title.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.5)';
    title.style.background = 'linear-gradient(45deg, #FFD700, #FFA500)';
    title.style.WebkitBackgroundClip = 'text';
    title.style.WebkitTextFillColor = 'transparent';
    title.style.display = 'inline-block';
    welcomeScreen.appendChild(title);

    const subtitle = document.createElement('h2');
    subtitle.textContent = 'Theo fell asleep... and the orcs stole the way home.';
    subtitle.style.color = theme.colors.primary;
    subtitle.style.fontSize = theme.fontSize.subtitle;
    subtitle.style.fontFamily = theme.fonts.subtitle;
    subtitle.style.marginBottom = '30px';
    welcomeScreen.appendChild(subtitle);

    
    if (onContinueGame) {
        const continueButton = document.createElement('button');
        continueButton.textContent = 'Continue';
        continueButton.onclick = onContinueGame;
        welcomeScreen.appendChild(continueButton);
        styleButton(continueButton, theme.colors.secondary);
    }

    const startButton = document.createElement('button');
    startButton.textContent = 'New Game';
    startButton.onclick = onStartGame;
    welcomeScreen.appendChild(startButton);

    const storyButton = document.createElement('button');
    storyButton.textContent = 'Story';
    storyButton.onclick = onStory;
    welcomeScreen.appendChild(storyButton);
    styleButton(storyButton, theme.colors.primary);

    const highScoresButton = document.createElement('button');
    highScoresButton.textContent = 'High Scores';
    highScoresButton.onclick = onViewHighScores;
    welcomeScreen.appendChild(highScoresButton);

    const exitButton = document.createElement('button');
    exitButton.textContent = 'Exit';
    exitButton.onclick = onExit;
    welcomeScreen.appendChild(exitButton);

    const controlsHint = document.createElement('p');
    controlsHint.textContent = 'Arrows: move · Space: sword · X: axe · P: disarm trap · U: potion · Esc: pause';
    controlsHint.style.color = theme.colors.text;
    controlsHint.style.fontFamily = theme.fonts.subtitle;
    controlsHint.style.fontSize = '18px';
    controlsHint.style.opacity = '0.8';
    controlsHint.style.marginTop = '30px';
    welcomeScreen.appendChild(controlsHint);

    container.appendChild(welcomeScreen);

    // Apply styles
    applyContainerStyles(container);
    title.style.fontSize = theme.fontSize.title;
    title.style.marginBottom = '20px';

    styleButton(startButton);
    styleButton(highScoresButton);
    styleButton(exitButton);
}