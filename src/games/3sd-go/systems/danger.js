import { OVERFLOW_GRACE_MS, OVERFLOW_HOLD_MS, playfield } from '../game/constants.js';
import { GameState } from '../game/states.js';

export class Danger {
  constructor(session, world) {
    this.session = session;
    this.world = world;
    this.pressure = 0;
  }

  tick(time, frame) {
    if (this.session.state !== GameState.RUNNING) return;

    const line = playfield().dangerY;
    let peak = 0;

    for (const fruit of this.world.fruits) {
      if (!fruit.alive) continue;
      if (time - fruit.bornAt < OVERFLOW_GRACE_MS) {
        fruit.overflowMs = 0;
        continue;
      }

      const top = fruit.node.y - fruit.radius;
      if (top < line) {
        fruit.overflowMs += frame;
        peak = Math.max(peak, fruit.overflowMs / OVERFLOW_HOLD_MS);
      } else {
        fruit.overflowMs = 0;
      }
    }

    this.pressure = Math.min(1, peak);
    if (peak >= 1) {
      this.session.endRun();
      this.world.hidePreview();
    }
  }
}
