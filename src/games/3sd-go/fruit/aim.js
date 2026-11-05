import Phaser from 'phaser';
import { fruitByTier } from './catalog.js';
import { playfield } from '../game/constants.js';

export function aimFor(pointerX, tier) {
  const field = playfield();
  const radius = fruitByTier(tier).radius;
  const x = Phaser.Math.Clamp(pointerX, field.left + radius + 2, field.right - radius - 2);
  const y = field.top + radius * 0.35;
  return { x, y, radius };
}
