import { theme, applyContainerStyles, styleButton } from '../utils/theme.js';
import { isCampaignComplete } from '../utils/preferences.js';
import levelData from '../levels/level-data.js';

// Pick any unlocked dream after beating the campaign once.

export function showLevelSelectScreen(onPickLevel, onBack) {
  const container = document.getElementById('game-container');
  container.innerHTML = '';

  const screen = document.createElement('div');
  screen.id = 'level-select-screen';

  const title = document.createElement('h1');
  title.textContent = 'Level Select';
  title.style.marginBottom = '12px';
  screen.appendChild(title);

  const subtitle = document.createElement('p');
  subtitle.textContent = 'Replay any dream Theo has already braved.';
  subtitle.style.fontFamily = theme.fonts.subtitle;
  subtitle.style.fontSize = '18px';
  subtitle.style.opacity = '0.85';
  subtitle.style.marginBottom = '24px';
  screen.appendChild(subtitle);

  const grid = document.createElement('div');
  grid.style.display = 'grid';
  grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(220px, 1fr))';
  grid.style.gap = '12px';
  grid.style.maxWidth = '960px';
  grid.style.margin = '0 auto 24px';

  for (let levelNumber = 1; levelNumber <= 10; levelNumber += 1) {
    const level = levelData.getLevel(levelNumber);
    const button = document.createElement('button');
    button.textContent = `${levelNumber}. ${level ? level.name : `Level ${levelNumber}`}`;
    button.style.minWidth = 'auto';
    button.style.margin = '0';
    button.style.width = '100%';
    button.onclick = () => onPickLevel(levelNumber);
    styleButton(button, theme.colors.secondary);
    grid.appendChild(button);
  }

  screen.appendChild(grid);

  const backButton = document.createElement('button');
  backButton.textContent = 'Back';
  backButton.onclick = onBack;
  screen.appendChild(backButton);

  container.appendChild(screen);
  applyContainerStyles(container);
  title.style.fontSize = theme.fontSize.title;
  styleButton(backButton);
}

// Welcome screen logic
// - Display game title
// - Provide buttons to start the game, view high scores, and adjust sound settings

export function showWelcomeScreen(onStartGame, onContinueGame, onViewHighScores, onExit, onStory, onLevelSelect, onSettings) {
  const container = document.getElementById('game-container');
  container.innerHTML = '';

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

  if (onLevelSelect && isCampaignComplete()) {
    const levelSelectButton = document.createElement('button');
    levelSelectButton.textContent = 'Level Select';
    levelSelectButton.onclick = onLevelSelect;
    welcomeScreen.appendChild(levelSelectButton);
    styleButton(levelSelectButton, theme.colors.accent);
  }

  const storyButton = document.createElement('button');
  storyButton.textContent = 'Story';
  storyButton.onclick = onStory;
  welcomeScreen.appendChild(storyButton);
  styleButton(storyButton, theme.colors.primary);

  const highScoresButton = document.createElement('button');
  highScoresButton.textContent = 'High Scores';
  highScoresButton.onclick = onViewHighScores;
  welcomeScreen.appendChild(highScoresButton);

  const settingsButton = document.createElement('button');
  settingsButton.textContent = 'Settings';
  settingsButton.onclick = onSettings;
  welcomeScreen.appendChild(settingsButton);

  const exitButton = document.createElement('button');
  exitButton.textContent = 'Exit';
  exitButton.onclick = onExit;
  welcomeScreen.appendChild(exitButton);

  const controlsHint = document.createElement('p');
  controlsHint.textContent = 'Arrows: move · Space: attack · I: inventory · Esc: menu';
  controlsHint.style.color = theme.colors.text;
  controlsHint.style.fontFamily = theme.fonts.subtitle;
  controlsHint.style.fontSize = '18px';
  controlsHint.style.opacity = '0.8';
  controlsHint.style.marginTop = '30px';
  welcomeScreen.appendChild(controlsHint);

  container.appendChild(welcomeScreen);

  applyContainerStyles(container);
  title.style.fontSize = theme.fontSize.title;
  title.style.marginBottom = '20px';

  styleButton(startButton);
  styleButton(highScoresButton);
  styleButton(settingsButton);
  styleButton(exitButton);
}
