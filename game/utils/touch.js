// On-screen touch controls: a D-pad on the left, action buttons on the right.
// Shown on touch-capable devices (or with ?touch=1 in the URL, which the
// automated tests use). Buttons drive the same input paths as the keyboard:
// directions feed game.pressedDirections, actions call the player methods.

export function shouldShowTouchControls() {
  if (typeof window === 'undefined') return false;
  if (new URLSearchParams(window.location.search).has('touch')) return true;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
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
  overlay.style.pointerEvents = 'none'; // only the buttons catch input
  overlay.style.zIndex = '10';

  const holdDirection = (btn, direction) => {
    btn.style.pointerEvents = 'auto';
    btn.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      game.movePlayer(direction); // immediate nudge, like a key tap
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

  // D-pad, bottom-left
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

  // Action cluster, bottom-right
  const actions = document.createElement('div');
  actions.style.position = 'absolute';
  actions.style.right = '16px';
  actions.style.bottom = '16px';
  actions.style.display = 'flex';
  actions.style.alignItems = 'flex-end';
  actions.style.gap = '10px';

  const axeBtn = makeButton('touch-btn-axe', 'AXE', 52);
  tapAction(axeBtn, () => game.playerAxe());
  actions.appendChild(axeBtn);

  const potionBtn = makeButton('touch-btn-potion', 'POT', 52);
  tapAction(potionBtn, () => game.playerDrinkPotion());
  actions.appendChild(potionBtn);

  const pickBtn = makeButton('touch-btn-pick', 'PICK', 52);
  tapAction(pickBtn, () => game.playerPick());
  actions.appendChild(pickBtn);

  const attackBtn = makeButton('touch-btn-attack', 'ATK', 72);
  tapAction(attackBtn, () => game.playerAttack());
  actions.appendChild(attackBtn);

  overlay.appendChild(actions);
  return overlay;
}
