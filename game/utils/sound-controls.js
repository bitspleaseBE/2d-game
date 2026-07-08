import { theme } from './theme.js';
import { isSoundMuted, toggleSoundMuted } from './preferences.js';

// Small mute/unmute control reused on menu screens and during gameplay.

export function createSoundToggleButton({ compact = false } = {}) {
  const button = document.createElement('button');
  button.type = 'button';
  button.setAttribute('aria-label', 'Toggle sound');
  button.style.cursor = 'pointer';
  button.style.border = `2px solid ${theme.colors.text}`;
  button.style.borderRadius = compact ? '50%' : theme.button.borderRadius;
  button.style.backgroundColor = 'rgba(0, 0, 0, 0.55)';
  button.style.color = theme.colors.text;
  button.style.fontFamily = theme.fonts.subtitle;
  button.style.transition = 'transform 0.2s ease';

  if (compact) {
    button.style.width = '44px';
    button.style.height = '44px';
    button.style.fontSize = '20px';
    button.style.padding = '0';
  } else {
    button.style.padding = '10px 18px';
    button.style.fontSize = '18px';
    button.style.minWidth = 'auto';
    button.style.margin = '0';
  }

  const refresh = () => {
    const muted = isSoundMuted();
    button.textContent = muted ? '🔇 Sound off' : '🔊 Sound on';
    button.setAttribute('aria-pressed', String(muted));
    if (compact) button.textContent = muted ? '🔇' : '🔊';
  };

  button.addEventListener('click', () => {
    toggleSoundMuted();
    refresh();
  });

  refresh();
  return button;
}
