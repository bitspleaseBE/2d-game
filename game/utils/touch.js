// On-screen touch controls: a D-pad on the left, action buttons on the right.
// Shown on touch-capable devices in landscape (or with ?touch=1 in the URL).

export function shouldShowTouchControls() {
  if (typeof window === 'undefined') return false;
  if (new URLSearchParams(window.location.search).has('touch')) return true;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

export function isLandscapeViewport() {
  return window.innerWidth >= window.innerHeight;
}

export function shouldShowTouchControlsNow() {
  return shouldShowTouchControls() && isLandscapeViewport();
}

function makeButton(id, label, size) {
  const btn = document.createElement('button');
  btn.id = id;
  btn.textContent = label;
  btn.style.width = `${size}px`;
  btn.style.height = `${size}px`;
  btn.style.borderRadius = '50%';
  btn.style.border = '2px solid rgba(255, 255, 255, 0.5)';
  btn.style.backgroundColor = 'rgba(0, 0, 0, 0.35)';
  btn.style.color = 'rgba(255, 255, 255, 0.9)';
  btn.style.fontSize = `${Math.floor(size / 2.6)}px`;
  btn.style.fontFamily = 'monospace';
  btn.style.touchAction = 'none';
  btn.style.userSelect = 'none';
  btn.style.webkitUserSelect = 'none';
  btn.style.cursor = 'pointer';
  btn.style.padding = '0';
  return btn;
}

export function createTouchControls(game) {
  const overlay = document.createElement('div');
  overlay.id = 'touch-controls';
  overlay.style.position = 'absolute';
  overlay.style.inset = '0';
  overlay.style.pointerEvents = 'none';
  overlay.style.zIndex = '10';

  const holdDirection = (btn, direction) => {
    btn.style.pointerEvents = 'auto';
    btn.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      if (!game.started || game.paused || game.isGameOver) return;
      game.movePlayer(direction);
      game.pressedDirections.add(direction);
    });
    for (const type of ['pointerup', 'pointerleave', 'pointercancel']) {
      btn.addEventListener(type, () => game.pressedDirections.delete(direction));
    }
  };

  const tapAction = (btn, action) => {
    btn.style.pointerEvents = 'auto';
    btn.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      action();
    });
  };

  const dpad = document.createElement('div');
  dpad.style.position = 'absolute';
  dpad.style.left = '16px';
  dpad.style.bottom = '16px';
  dpad.style.display = 'grid';
  dpad.style.gridTemplateColumns = 'repeat(3, 56px)';
  dpad.style.gridTemplateRows = 'repeat(3, 56px)';
  dpad.style.gap = '4px';

  const placements = {
    up: { row: 1, col: 2, label: '▲' },
    left: { row: 2, col: 1, label: '◀' },
    right: { row: 2, col: 3, label: '▶' },
    down: { row: 3, col: 2, label: '▼' },
  };
  for (const [direction, spec] of Object.entries(placements)) {
    const btn = makeButton(`touch-btn-${direction}`, spec.label, 56);
    btn.style.gridRow = String(spec.row);
    btn.style.gridColumn = String(spec.col);
    holdDirection(btn, direction);
    dpad.appendChild(btn);
  }
  overlay.appendChild(dpad);

  const actions = document.createElement('div');
  actions.style.position = 'absolute';
  actions.style.right = '16px';
  actions.style.bottom = '16px';
  actions.style.display = 'flex';
  actions.style.alignItems = 'flex-end';
  actions.style.gap = '10px';

  const inventoryBtn = makeButton('touch-btn-inventory', 'INV', 52);
  tapAction(inventoryBtn, () => game.toggleInventory());
  actions.appendChild(inventoryBtn);

  const potionBtn = makeButton('touch-btn-potion', 'POT', 52);
  tapAction(potionBtn, () => game.playerDrinkPotion());
  actions.appendChild(potionBtn);

  const pickBtn = makeButton('touch-btn-pick', 'PICK', 52);
  tapAction(pickBtn, () => game.playerPick());
  actions.appendChild(pickBtn);

  const weaponBtn = makeButton('touch-btn-weapon', 'WPN', 52);
  tapAction(weaponBtn, () => game.cycleWeapon());
  actions.appendChild(weaponBtn);

  const attackBtn = makeButton('touch-btn-attack', 'ATK', 72);
  tapAction(attackBtn, () => game.playerAttack());
  actions.appendChild(attackBtn);

  // Pause/menu next to the sound toggle in the top-right (the top-left is
  // HUD territory); routed through a synthetic Escape so it follows the
  // keyboard path exactly
  const menuBtn = makeButton('touch-btn-menu', '☰', 44);
  menuBtn.style.position = 'absolute';
  menuBtn.style.top = '12px';
  menuBtn.style.right = '64px';
  tapAction(menuBtn, () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
  });
  overlay.appendChild(menuBtn);

  overlay.appendChild(actions);
  return overlay;
}

export function syncTouchControlsVisibility(overlay) {
  if (!overlay) return;
  overlay.style.display = shouldShowTouchControlsNow() ? 'block' : 'none';
}

export function installTouchControlVisibilityListener(overlay) {
  const update = () => syncTouchControlsVisibility(overlay);
  window.addEventListener('resize', update);
  window.addEventListener('orientationchange', update);
  update();
}
