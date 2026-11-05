import { playfield } from '../game/constants.js';
import { GameState } from '../game/states.js';
import { aimFor } from '../fruit/aim.js';

export class Input {
  constructor(scene, session, world) {
    this.scene = scene;
    this.session = session;
    this.world = world;
    this.seenPointer = false;
  }

  bind() {
    this.scene.input.on('pointermove', () => {
      this.seenPointer = true;
    });

    this.scene.input.on('pointerdown', (pointer) => {
      this.seenPointer = true;
      if (this.session.state !== GameState.RUNNING) return;
      if (isPointerOverUi(this.scene, pointer)) return;
      this.session.dropRequested = true;
    });
  }

  tick(time) {
    if (this.session.state !== GameState.RUNNING || this.session.currentTier == null) {
      this.world.hidePreview();
      this.session.aim = null;
      return;
    }

    if (time < this.session.dropReadyAt) {
      this.world.hidePreview();
      this.session.aim = null;
      return;
    }

    const field = playfield();
    const pointerX = this.seenPointer
      ? this.scene.input.activePointer.x
      : (field.left + field.right) / 2;
    const aim = aimFor(pointerX, this.session.currentTier);
    const blocked = this.world.overlaps(aim.x, aim.y, aim.radius);
    this.session.aim = { x: aim.x, y: aim.y, blocked };
    this.world.showPreview(this.session.currentTier, aim.x, aim.y, aim.radius, blocked);
  }
}

function isPointerOverUi(scene, pointer) {
  const hits = scene.input.hitTestPointer(pointer);
  return hits.some((obj) => obj.getData && obj.getData('ui'));
}
