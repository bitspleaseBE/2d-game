import { shouldShowTouchControls } from './touch.js';

// Prompt mobile players to rotate to landscape — Wandertrap is built for wide screens.

function isPortraitViewport() {
  return window.innerHeight > window.innerWidth;
}

function shouldWarnPortrait() {
  if (!isPortraitViewport()) return false;
  return shouldShowTouchControls() || window.matchMedia('(max-width: 900px)').matches;
}

export function installOrientationGuard() {
  if (typeof document === 'undefined') return;

  const overlay = document.createElement('div');
  overlay.id = 'orientation-notice';
  overlay.style.cssText = [
    'display:none',
    'position:fixed',
    'inset:0',
    'z-index:10000',
    'align-items:center',
    'justify-content:center',
    'padding:32px',
    'text-align:center',
    'background:rgba(8, 4, 2, 0.96)',
    'color:#d4af37',
    'font-family:Arial,sans-serif',
  ].join(';');

  overlay.innerHTML = `
    <div style="max-width:420px">
      <p style="font-size:56px;margin:0 0 16px">↻</p>
      <h2 style="margin:0 0 12px;font-size:28px;font-family:Luminari,fantasy">Rotate your device</h2>
      <p style="margin:0;font-size:18px;line-height:1.5;opacity:0.9">
        Wandertrap plays best in landscape. Turn your phone sideways to continue.
      </p>
    </div>
  `;

  document.body.appendChild(overlay);

  const update = () => {
    overlay.style.display = shouldWarnPortrait() ? 'flex' : 'none';
  };

  window.addEventListener('resize', update);
  window.addEventListener('orientationchange', update);
  update();
}
