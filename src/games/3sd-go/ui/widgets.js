import { PALETTE } from '../game/constants.js';

export const FONT = 'Trebuchet MS, Verdana, sans-serif';

export function formatScore(value) {
  return Math.floor(value).toLocaleString('en-US');
}

export function makeText(scene, x, y, text, size, color, depth) {
  const node = scene.add.text(x, y, text, {
    fontFamily: FONT,
    fontSize: `${size}px`,
    fontStyle: 'bold',
    color,
    align: 'center',
    resolution: 2,
  });
  node.setOrigin(0.5);
  node.setDepth(depth);
  return node;
}

export function makeButton(scene, x, y, width, height, label, depth) {
  const bg = scene.add.rectangle(x, y, width, height, PALETTE.button)
    .setStrokeStyle(3, PALETTE.buttonEdge)
    .setDepth(depth);
  bg.setInteractive({ useHandCursor: true });
  bg.setData('ui', true);

  const caption = makeText(scene, x, y, label, 22, '#ffffff', depth + 1);

  bg.on('pointerover', () => bg.setFillStyle(0x4caf50));
  bg.on('pointerout', () => bg.setFillStyle(PALETTE.button));

  return {
    bg,
    caption,
    onClick(fn) {
      bg.on('pointerdown', () => fn());
    },
    setVisible(visible) {
      bg.setVisible(visible);
      caption.setVisible(visible);
      if (visible) bg.setInteractive({ useHandCursor: true });
      else bg.disableInteractive();
    },
  };
}
