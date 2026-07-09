import { theme, applyContainerStyles, styleButton } from '../utils/theme.js';
import { createSoundToggleButton } from '../utils/sound-controls.js';
import { getSkipLevelIntros, setSkipLevelIntros } from '../utils/preferences.js';

// Settings screen
// - Toggle sound on/off
// - Skip the level story cards

export function showSettingsScreen(onBack) {
  const container = document.getElementById('game-container');
  container.innerHTML = '';

  const screen = document.createElement('div');
  screen.id = 'settings-screen';

  const title = document.createElement('h1');
  title.textContent = 'Settings';
  title.style.marginBottom = '30px';
  screen.appendChild(title);

  const options = document.createElement('div');
  options.style.display = 'flex';
  options.style.flexDirection = 'column';
  options.style.gap = '24px';
  options.style.alignItems = 'center';
  options.style.marginBottom = '36px';

  options.appendChild(createSoundToggleButton());

  const skipLabel = document.createElement('label');
  skipLabel.style.display = 'flex';
  skipLabel.style.alignItems = 'center';
  skipLabel.style.gap = '8px';
  skipLabel.style.fontFamily = theme.fonts.subtitle;
  skipLabel.style.fontSize = '16px';
  skipLabel.style.cursor = 'pointer';

  const skipCheckbox = document.createElement('input');
  skipCheckbox.type = 'checkbox';
  skipCheckbox.checked = getSkipLevelIntros();
  skipCheckbox.addEventListener('change', () => setSkipLevelIntros(skipCheckbox.checked));

  const skipText = document.createElement('span');
  skipText.textContent = 'Skip level story cards';

  skipLabel.appendChild(skipCheckbox);
  skipLabel.appendChild(skipText);
  options.appendChild(skipLabel);

  screen.appendChild(options);

  const backButton = document.createElement('button');
  backButton.textContent = 'Back';
  backButton.onclick = onBack;
  screen.appendChild(backButton);

  container.appendChild(screen);
  applyContainerStyles(container);
  title.style.fontSize = theme.fontSize.title;
  styleButton(backButton);
}
