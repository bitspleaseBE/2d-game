import { theme, applyContainerStyles, styleButton } from '../utils/theme.js';

// Daily Dream explainer — three short slides shown before the run starts,
// so the one-attempt rule never surprises anyone.

const SLIDES = [
  {
    icon: '🌙',
    title: 'The same dream for everyone',
    text: 'Each date seeds the dream. Everyone who plays today faces the same orcs, the same crystals, the same drops — tomorrow it all reshuffles.',
  },
  {
    icon: '☝️',
    title: 'One attempt per day',
    text: 'No retries and no mid-run saves. When the run ends — at dawn or in the dark — today\'s result is written in stone.',
  },
  {
    icon: '📋',
    title: 'Share your result',
    text: 'Your score copies to the clipboard as a one-line result. Send it to a friend, set the bar, and come back tomorrow.',
  },
];

export function showDailyIntroScreen(onStart, onBack) {
  const container = document.getElementById('game-container');
  container.innerHTML = '';

  const screen = document.createElement('div');
  screen.id = 'daily-intro-screen';

  const heading = document.createElement('h1');
  heading.textContent = 'The Daily Dream';
  heading.style.marginBottom = '24px';
  screen.appendChild(heading);

  const icon = document.createElement('div');
  icon.style.fontSize = '56px';
  icon.style.marginBottom = '12px';
  screen.appendChild(icon);

  const title = document.createElement('h2');
  title.style.color = theme.colors.primary;
  title.style.fontFamily = theme.fonts.subtitle;
  title.style.fontSize = '26px';
  title.style.marginBottom = '12px';
  screen.appendChild(title);

  const text = document.createElement('p');
  text.style.fontFamily = theme.fonts.subtitle;
  text.style.fontSize = '18px';
  text.style.lineHeight = '1.5';
  text.style.maxWidth = '560px';
  text.style.margin = '0 auto 12px';
  text.style.minHeight = '84px';
  screen.appendChild(text);

  const progress = document.createElement('p');
  progress.style.fontSize = '18px';
  progress.style.letterSpacing = '6px';
  progress.style.opacity = '0.7';
  progress.style.marginBottom = '20px';
  screen.appendChild(progress);

  const nextButton = document.createElement('button');
  screen.appendChild(nextButton);

  const backButton = document.createElement('button');
  backButton.textContent = 'Back';
  backButton.onclick = onBack;
  screen.appendChild(backButton);

  let slideIndex = 0;
  const showSlide = () => {
    const slide = SLIDES[slideIndex];
    icon.textContent = slide.icon;
    title.textContent = slide.title;
    text.textContent = slide.text;
    progress.textContent = SLIDES.map((_, i) => (i === slideIndex ? '●' : '○')).join('');
    nextButton.textContent = slideIndex < SLIDES.length - 1 ? 'Next' : 'Begin the Daily Dream';
  };
  nextButton.onclick = () => {
    if (slideIndex < SLIDES.length - 1) {
      slideIndex += 1;
      showSlide();
    } else {
      onStart();
    }
  };
  showSlide();

  container.appendChild(screen);
  applyContainerStyles(container);
  heading.style.fontSize = theme.fontSize.title;
  styleButton(nextButton, theme.colors.accent);
  styleButton(backButton, theme.colors.secondary);
}
