import Phaser from 'phaser';
import { createGame } from '../game/createGame.js';
import { tick } from '../game/loop.js';
import { FACE_ASSETS } from '../fruit/catalog.js';
import { SFX_BOOM, SFX_DROP, SFX_MERGE } from '../game/constants.js';
import popSfx from '../assets/soundfx/pop_.mp3';
import vineBoomSfx from '../assets/soundfx/vine-boom.mp3';
import dropSfx from '../assets/soundfx/442265__crafty_juggler__pop-sound.mp3';

export class GameScene extends Phaser.Scene {
  constructor() {
    super('game');
  }

  preload() {
    for (const asset of FACE_ASSETS) {
      this.load.image(asset.key, asset.url);
    }
    this.load.audio(SFX_MERGE, popSfx);
    this.load.audio(SFX_BOOM, vineBoomSfx);
    this.load.audio(SFX_DROP, dropSfx);
  }

  create() {
    this.ctx = createGame(this);
    this.ctx.mount();
  }

  update(time, delta) {
    tick(this.ctx, time, delta);
  }
}
