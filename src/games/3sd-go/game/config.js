import Phaser from 'phaser';
import { GRAVITY_Y, VIEW_HEIGHT, VIEW_WIDTH } from './constants.js';
import { GameScene } from '../scenes/GameScene.js';

export const gameConfig = {
  type: Phaser.WEBGL,
  parent: 'game',
  backgroundColor: '#c4894c',
  disableContextMenu: true,
  // Higher-quality face rendering: smooth edges + trilinear mipmaps so balls stay crisp
  // (not shimmery/blurry) as they scale down from the source PNGs.
  render: {
    antialias: true,
    mipmapFilter: 'LINEAR_MIPMAP_LINEAR',
    roundPixels: false,
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: VIEW_WIDTH,
    height: VIEW_HEIGHT,
  },
  physics: {
    default: 'matter',
    matter: {
      gravity: { x: 0, y: GRAVITY_Y },
      enableSleeping: true,
      autoUpdate: false,
      positionIterations: 12,
      velocityIterations: 8,
      constraintIterations: 2,
      debug: false,
    },
  },
  scene: [GameScene],
};
