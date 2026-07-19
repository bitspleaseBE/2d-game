import { theme, applyContainerStyles, styleButton, applyMenuAtmosphere } from '../utils/theme.js';
import {
  isCampaignComplete,
  getLevelStars,
  getFurthestLevel,
} from '../utils/preferences.js';
import levelData from '../levels/level-data.js';
import { getMenuBackdropPngUrl, getMenuBackdropUrl } from '../assets.js';

// Pick any unlocked dream after beating the campaign once.

export function showLevelSelectScreen(onPickLevel, onBack) {
  const container = document.getElementById('game-container');
  container.innerHTML = '';

  const screen = document.createElement('div');
  screen.id = 'level-select-screen';

  const title = document.createElement('h1');
  title.textContent = 'Level Select';
  title.style.marginBottom = '12px';
  title.style.fontFamily = theme.fonts.main;
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

  const stars = getLevelStars();
  // Finished campaigns unlock everything; otherwise the furthest dream
  // reached so far marks the end of the list
  const unlockedUpTo = isCampaignComplete() ? 10 : getFurthestLevel();
  for (let levelNumber = 1; levelNumber <= unlockedUpTo; levelNumber += 1) {
    const level = levelData.getLevel(levelNumber);
    const earned = stars[levelNumber] || 0;
    const rating = earned > 0 ? `  ${'★★★'.slice(0, earned)}${'☆☆☆'.slice(earned)}` : '';
    const button = document.createElement('button');
    button.textContent = `${levelNumber}. ${level ? level.name : `Level ${levelNumber}`}${rating}`;
    button.style.minWidth = 'auto';
    button.style.margin = '0';
    button.style.width = '100%';
    button.onclick = () => onPickLevel(levelNumber);
    styleButton(button, theme.colors.secondary, 'secondary');
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
  styleButton(backButton, theme.colors.primary, 'primary');
}

// Welcome screen: scary-dream title composition with atmosphere backdrop.

export function showWelcomeScreen(onStartGame, onContinueGame, onViewHighScores, onStory, onLevelSelect, onSettings) {
  const container = document.getElementById('game-container');
  container.innerHTML = '';

  applyContainerStyles(container);
  container.style.padding = '0';
  container.style.display = 'flex';
  container.style.alignItems = 'stretch';
  container.style.justifyContent = 'center';

  const welcomeScreen = document.createElement('div');
  welcomeScreen.id = 'welcome-screen';
  welcomeScreen.style.width = '100%';
  welcomeScreen.style.minHeight = '100%';
  welcomeScreen.style.display = 'flex';
  welcomeScreen.style.alignItems = 'center';
  welcomeScreen.style.justifyContent = 'center';
  welcomeScreen.style.boxSizing = 'border-box';
  welcomeScreen.style.padding = '48px 24px 36px';

  // PNG first so the screen paints immediately; upgrade to WebP when ready.
  const content = applyMenuAtmosphere(welcomeScreen, getMenuBackdropPngUrl());
  getMenuBackdropUrl().then((url) => {
    const backdrop = welcomeScreen.querySelector('.wandertrap-menu-backdrop');
    if (backdrop && url) backdrop.style.backgroundImage = `url("${url}")`;
  });

  content.style.display = 'flex';
  content.style.flexDirection = 'column';
  content.style.alignItems = 'center';
  content.style.width = '100%';
  content.style.maxWidth = '400px';
  content.style.marginTop = '-4vh';
  content.style.textAlign = 'center';

  const header = document.createElement('div');
  header.style.marginBottom = '28px';
  header.style.width = '100%';
  header.style.display = 'flex';
  header.style.flexDirection = 'column';
  header.style.alignItems = 'center';
  header.style.textAlign = 'center';

  const title = document.createElement('h1');
  title.textContent = 'Wandertrap';
  title.style.margin = '0 0 12px';
  title.style.padding = '0';
  // letter-spacing adds trailing space after the last glyph — pad left to keep optical center
  title.style.paddingLeft = '0.12em';
  title.style.fontFamily = theme.fonts.main;
  title.style.fontSize = theme.fontSize.title;
  title.style.fontWeight = '700';
  title.style.letterSpacing = '0.12em';
  title.style.textAlign = 'center';
  title.style.width = '100%';
  title.style.boxSizing = 'border-box';
  title.style.color = theme.colors.text;
  title.style.textShadow = '0 2px 18px rgba(0, 0, 0, 0.65)';
  title.style.background = 'linear-gradient(180deg, #ffe082 0%, #ffd54f 45%, #f5e6c8 100%)';
  title.style.WebkitBackgroundClip = 'text';
  title.style.WebkitTextFillColor = 'transparent';
  title.style.backgroundClip = 'text';
  header.appendChild(title);

  const subtitle = document.createElement('h2');
  subtitle.textContent = 'Theo fell asleep... and the orcs stole the way home.';
  subtitle.style.margin = '0';
  subtitle.style.padding = '0';
  subtitle.style.width = '100%';
  subtitle.style.maxWidth = '340px';
  subtitle.style.boxSizing = 'border-box';
  subtitle.style.color = theme.colors.textMuted;
  subtitle.style.fontSize = theme.fontSize.subtitle;
  subtitle.style.fontFamily = theme.fonts.subtitle;
  subtitle.style.fontWeight = '400';
  subtitle.style.opacity = '0.75';
  subtitle.style.lineHeight = '1.35';
  subtitle.style.textAlign = 'center';
  header.appendChild(subtitle);

  content.appendChild(header);

  const primaryActions = document.createElement('div');
  primaryActions.style.width = '100%';
  primaryActions.style.marginBottom = '8px';

  if (onContinueGame) {
    const continueButton = document.createElement('button');
    continueButton.textContent = 'Continue';
    continueButton.onclick = onContinueGame;
    styleButton(continueButton, theme.colors.secondary, 'primary');
    primaryActions.appendChild(continueButton);
  }

  const startButton = document.createElement('button');
  startButton.textContent = 'New Game';
  startButton.onclick = onStartGame;
  styleButton(startButton, theme.colors.primary, onContinueGame ? 'secondary' : 'primary');
  primaryActions.appendChild(startButton);

  if (onLevelSelect && (isCampaignComplete() || getFurthestLevel() > 1)) {
    const levelSelectButton = document.createElement('button');
    levelSelectButton.textContent = 'Level Select';
    levelSelectButton.onclick = onLevelSelect;
    styleButton(levelSelectButton, theme.colors.secondary, 'secondary');
    primaryActions.appendChild(levelSelectButton);
  }

  content.appendChild(primaryActions);

  const secondaryActions = document.createElement('div');
  secondaryActions.style.width = '100%';
  secondaryActions.style.marginTop = '10px';
  secondaryActions.style.paddingTop = '14px';
  secondaryActions.style.borderTop = '1px solid rgba(255, 213, 79, 0.22)';

  const storyButton = document.createElement('button');
  storyButton.textContent = 'Story';
  storyButton.onclick = onStory;
  styleButton(storyButton, theme.colors.primary, 'quiet');
  secondaryActions.appendChild(storyButton);

  const highScoresButton = document.createElement('button');
  highScoresButton.textContent = 'High Scores';
  highScoresButton.onclick = onViewHighScores;
  styleButton(highScoresButton, theme.colors.primary, 'quiet');
  secondaryActions.appendChild(highScoresButton);

  const settingsButton = document.createElement('button');
  settingsButton.textContent = 'Settings';
  settingsButton.onclick = onSettings;
  styleButton(settingsButton, theme.colors.primary, 'quiet');
  secondaryActions.appendChild(settingsButton);

  content.appendChild(secondaryActions);

  const controlsHint = document.createElement('p');
  controlsHint.textContent = 'Arrows: move · Space: attack · I: inventory · Esc: menu';
  controlsHint.style.color = theme.colors.textMuted;
  controlsHint.style.fontFamily = theme.fonts.subtitle;
  controlsHint.style.fontSize = '14px';
  controlsHint.style.opacity = '0.45';
  controlsHint.style.margin = '28px 0 0';
  controlsHint.style.letterSpacing = '0.3px';
  content.appendChild(controlsHint);

  container.appendChild(welcomeScreen);
}
