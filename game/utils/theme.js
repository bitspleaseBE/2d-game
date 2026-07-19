// Theme configuration for the game
// Menu chrome mirrors the in-game inventory panel: dark slate, gold titles,
// muted cyan accents, and green secondary actions — quieter dream UI.

export const theme = {
    colors: {
        background: '#20222c', // Same slate as the inventory panel
        text: '#ffd54f', // Gold titles and borders
        textMuted: '#c5d4e0', // Cool muted body copy over mist
        primary: '#3d7ea6', // Blue action tint
        secondary: '#3d8b5f', // Green secondary tint
        accent: '#80d8ff', // Cyan highlights (matches HUD labels)
        scrim: 'rgba(8, 10, 18, 0.72)',
    },
    fonts: {
        main: '"Cinzel", "Palatino Linotype", serif', // Display titles
        subtitle: '"Spectral", "Georgia", serif', // Readable body / UI
    },
    fontSize: {
        title: '56px',
        subtitle: '22px',
        button: '20px',
        buttonQuiet: '16px',
    },
    spacing: {
        padding: '25px',
    },
    button: {
        minWidth: '260px',
        padding: '14px 28px',
        paddingQuiet: '10px 22px',
        borderRadius: '3px',
    },
};

let menuAtmosphereStylesInjected = false;

function ensureMenuAtmosphereStyles() {
    if (menuAtmosphereStylesInjected || typeof document === 'undefined') return;
    menuAtmosphereStylesInjected = true;

    const style = document.createElement('style');
    style.id = 'wandertrap-menu-atmosphere';
    style.textContent = `
@keyframes wandertrap-fog-drift {
  0% { transform: translate3d(-2%, 0, 0) scale(1.05); opacity: 0.35; }
  50% { transform: translate3d(2%, -1%, 0) scale(1.08); opacity: 0.5; }
  100% { transform: translate3d(-2%, 0, 0) scale(1.05); opacity: 0.35; }
}
.wandertrap-menu-screen {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  min-height: 100%;
  box-sizing: border-box;
}
.wandertrap-menu-backdrop,
.wandertrap-menu-scrim,
.wandertrap-menu-vignette,
.wandertrap-menu-fog {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.wandertrap-menu-backdrop {
  z-index: 0;
  background-color: ${theme.colors.background};
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  transform: scale(1.02);
}
.wandertrap-menu-scrim {
  z-index: 1;
  background: linear-gradient(
    180deg,
    rgba(8, 10, 18, 0.45) 0%,
    rgba(8, 10, 18, 0.55) 40%,
    rgba(6, 8, 14, 0.82) 100%
  );
}
.wandertrap-menu-vignette {
  z-index: 2;
  background: radial-gradient(
    ellipse at center,
    transparent 35%,
    rgba(0, 0, 0, 0.55) 100%
  );
}
.wandertrap-menu-fog {
  z-index: 3;
  background: radial-gradient(
    ellipse at 30% 60%,
    rgba(160, 190, 210, 0.18),
    transparent 55%
  ),
  radial-gradient(
    ellipse at 75% 40%,
    rgba(120, 150, 180, 0.12),
    transparent 50%
  );
  animation: wandertrap-fog-drift 18s ease-in-out infinite;
}
.wandertrap-menu-content {
  position: relative;
  z-index: 4;
}
`;
    document.head.appendChild(style);
}

// Apply shared slate container styles (solid menus / fallbacks).
export function applyContainerStyles(container) {
    container.style.backgroundColor = theme.colors.background;
    container.style.color = theme.colors.text;
    container.style.fontFamily = theme.fonts.subtitle;
    container.style.textAlign = 'center';
    container.style.padding = theme.spacing.padding;
}

/**
 * Layer a scary-dream backdrop, scrim, vignette, and slow fog on a menu screen.
 * @param {HTMLElement} screen - Screen root (e.g. #welcome-screen)
 * @param {string} [backdropUrl] - Optional full-bleed image URL
 * @returns {HTMLElement} Content wrapper to append UI into
 */
export function applyMenuAtmosphere(screen, backdropUrl) {
    ensureMenuAtmosphereStyles();
    screen.classList.add('wandertrap-menu-screen');

    const backdrop = document.createElement('div');
    backdrop.className = 'wandertrap-menu-backdrop';
    if (backdropUrl) {
        backdrop.style.backgroundImage = `url("${backdropUrl}")`;
    }

    const scrim = document.createElement('div');
    scrim.className = 'wandertrap-menu-scrim';

    const vignette = document.createElement('div');
    vignette.className = 'wandertrap-menu-vignette';

    const fog = document.createElement('div');
    fog.className = 'wandertrap-menu-fog';

    const content = document.createElement('div');
    content.className = 'wandertrap-menu-content';

    screen.appendChild(backdrop);
    screen.appendChild(scrim);
    screen.appendChild(vignette);
    screen.appendChild(fog);
    screen.appendChild(content);

    return content;
}

function tintFromColor(color, alpha) {
    // Convert hex #rrggbb into rgba for translucent fills.
    if (typeof color === 'string' && /^#([0-9a-f]{6})$/i.test(color)) {
        const hex = color.slice(1);
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    return color;
}

/**
 * Style a menu button.
 * @param {HTMLButtonElement} button
 * @param {string} [color] - Tint color (primary / secondary hex)
 * @param {'primary'|'secondary'|'quiet'} [variant]
 */
export function styleButton(button, color = theme.colors.primary, variant = 'primary') {
    const isQuiet = variant === 'quiet';
    const fillAlpha = isQuiet ? 0.28 : variant === 'secondary' ? 0.42 : 0.5;
    const hoverAlpha = isQuiet ? 0.4 : 0.62;
    const borderWidth = variant === 'primary' ? '2px' : '1px';
    const baseFill = tintFromColor(color, fillAlpha);
    const hoverFill = tintFromColor(color, hoverAlpha);

    button.style.display = 'block';
    button.style.margin = isQuiet ? '8px auto' : '12px auto';
    button.style.padding = isQuiet ? theme.button.paddingQuiet : theme.button.padding;
    button.style.fontSize = isQuiet ? theme.fontSize.buttonQuiet : theme.fontSize.button;
    button.style.fontFamily = theme.fonts.subtitle;
    button.style.cursor = 'pointer';
    button.style.backgroundColor = baseFill;
    button.style.color = theme.colors.text;
    button.style.border = `${borderWidth} solid ${theme.colors.text}`;
    button.style.borderRadius = theme.button.borderRadius;
    button.style.textTransform = 'uppercase';
    button.style.letterSpacing = isQuiet ? '1.5px' : '2.5px';
    button.style.boxShadow = 'none';
    button.style.transition = 'transform 0.2s ease, background-color 0.2s ease, border-color 0.2s ease';
    button.style.minWidth = theme.button.minWidth;
    button.style.backdropFilter = 'blur(2px)';
    button.style.webkitBackdropFilter = 'blur(2px)';

    if (button.dataset.wandertrapHoverBound !== '1') {
        button.dataset.wandertrapHoverBound = '1';
        button.addEventListener('mouseover', () => {
            button.style.transform = 'translateY(-2px)';
            button.style.backgroundColor = button.dataset.hoverFill || hoverFill;
            button.style.borderColor = '#ffe082';
        });
        button.addEventListener('mouseout', () => {
            button.style.transform = 'translateY(0)';
            button.style.backgroundColor = button.dataset.baseFill || baseFill;
            button.style.borderColor = theme.colors.text;
        });
    }

    button.dataset.baseFill = baseFill;
    button.dataset.hoverFill = hoverFill;
}
