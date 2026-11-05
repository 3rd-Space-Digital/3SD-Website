import { BOX, PALETTE, VIEW_HEIGHT, VIEW_WIDTH, playfield } from '../game/constants.js';

export function drawStage(scene) {
  const g = scene.add.graphics().setDepth(0);
  const field = playfield();

  g.fillStyle(PALETTE.wood, 1);
  g.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);

  const tile = 48;
  const floorTop = 460;
  for (let y = floorTop; y < VIEW_HEIGHT; y += tile) {
    for (let x = 0; x < VIEW_WIDTH; x += tile) {
      const alt = ((x / tile) + ((y - floorTop) / tile)) % 2 === 0;
      g.fillStyle(alt ? PALETTE.floorA : PALETTE.floorB, 1);
      g.fillRect(x, y, tile, tile);
    }
  }

  g.fillStyle(PALETTE.crate, 1);
  g.fillRoundedRect(BOX.x, BOX.y, BOX.width, BOX.height, 22);

  g.fillStyle(PALETTE.crateInner, 1);
  g.fillRect(field.left, field.top, field.width, field.bottom - field.top);

  // Soft squares inside the crate, so the opening reads as a container.
  const cell = 56;
  g.fillStyle(0xfff1cc, 0.65);
  for (let y = field.top; y < field.bottom; y += cell) {
    for (let x = field.left; x < field.right; x += cell) {
      if (((x - field.left) / cell + (y - field.top) / cell) % 2 === 0) {
        g.fillRect(x, y, Math.min(cell, field.right - x), Math.min(cell, field.bottom - y));
      }
    }
  }
}
