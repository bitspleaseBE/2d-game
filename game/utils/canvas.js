import { canvasSettings } from './settings.js';

// helper functions for the canvas

export function clearCanvas(canvas, context) {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

export function clearContainer(container) {
  container.innerHTML = '';
}

// Scale the fixed-size game canvas to fit landscape viewports while keeping
// the native 1280×640 drawing buffer pixel-perfect.
export function applyLandscapeCanvasLayout(container, canvas) {
  container.style.position = 'relative';
  container.style.width = '100vw';
  container.style.height = '100vh';
  container.style.overflow = 'hidden';
  container.style.display = 'flex';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'center';
  container.style.backgroundColor = '#000';

  fitCanvasToContainer(canvas, container);
}

export function fitCanvasToContainer(canvas, container) {
  const nativeWidth = canvasSettings.width;
  const nativeHeight = canvasSettings.height;
  const aspect = nativeWidth / nativeHeight;

  const update = () => {
    const maxWidth = container.clientWidth || window.innerWidth;
    const maxHeight = container.clientHeight || window.innerHeight;

    let displayWidth = maxWidth;
    let displayHeight = displayWidth / aspect;
    if (displayHeight > maxHeight) {
      displayHeight = maxHeight;
      displayWidth = displayHeight * aspect;
    }

    canvas.style.width = `${Math.floor(displayWidth)}px`;
    canvas.style.height = `${Math.floor(displayHeight)}px`;
    canvas.style.display = 'block';
    canvas.style.margin = '0';
    canvas.style.imageRendering = 'pixelated';
  };

  update();

  if (!canvas._layoutListenerAttached) {
    canvas._layoutListenerAttached = true;
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
  }
}

// Wrap the canvas in a relatively positioned stage so touch overlays line up.
export function mountGameStage(container, canvas) {
  let stage = container.querySelector('#game-stage');
  if (!stage) {
    stage = document.createElement('div');
    stage.id = 'game-stage';
    stage.style.position = 'relative';
    stage.style.display = 'inline-block';
    stage.style.lineHeight = '0';
    container.appendChild(stage);
  } else {
    stage.innerHTML = '';
  }

  stage.appendChild(canvas);
  applyLandscapeCanvasLayout(container, canvas);
  return stage;
}

export function removeGameOverlays(container) {
  container.querySelector('#touch-controls')?.remove();
  container.querySelector('#in-game-sound-toggle')?.remove();
}
