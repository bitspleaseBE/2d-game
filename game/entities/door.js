import Entity from './entity.js';

// Door entity — blocks movement like a wall until the player bumps into it
// while carrying a key. Drawn procedurally (wooden door with a keyhole).

class Door extends Entity {
  constructor(x, y) {
    super(x, y, 'door');
  }

  draw(ctx) {
    const { x, y } = this._position;
    const w = this._width;
    const h = this._height;
    ctx.save();

    // Frame
    ctx.fillStyle = '#3e2723';
    ctx.fillRect(x + 2, y + 2, w - 4, h - 4);
    // Door leaf
    ctx.fillStyle = '#795548';
    ctx.fillRect(x + 8, y + 8, w - 16, h - 10);
    // Planks
    ctx.strokeStyle = '#5d4037';
    ctx.lineWidth = 2;
    for (let i = 1; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(x + 8 + ((w - 16) / 4) * i, y + 8);
      ctx.lineTo(x + 8 + ((w - 16) / 4) * i, y + h - 2);
      ctx.stroke();
    }
    // Keyhole
    ctx.fillStyle = '#ffd54f';
    ctx.beginPath();
    ctx.arc(x + w / 2, y + h / 2, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#3e2723';
    ctx.beginPath();
    ctx.arc(x + w / 2, y + h / 2 - 1, 2.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(x + w / 2 - 1.5, y + h / 2, 3, 6);

    ctx.restore();
  }
}

export default Door;
