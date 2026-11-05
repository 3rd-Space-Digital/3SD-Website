import { DROP_COOLDOWN_MS, SFX_DROP } from '../game/constants.js';
import { rollDropTier } from './spawnTable.js';

export class Spawner {
  constructor(session, world) {
    this.session = session;
    this.world = world;
  }

  fillQueue() {
    if (this.session.currentTier == null) {
      this.session.currentTier = rollDropTier(this.session.highestTierCreated);
    }
    if (this.session.nextTier == null) {
      this.session.nextTier = rollDropTier(this.session.highestTierCreated);
    }
  }

  tick(time) {
    if (!this.session.dropRequested) return;
    this.session.dropRequested = false;

    const aim = this.session.aim;
    if (!aim || aim.blocked) return;
    if (time < this.session.dropReadyAt) return;
    if (this.session.currentTier == null) return;

    const tier = this.session.currentTier;
    this.world.spawn(aim.x, aim.y, tier, { vx: 0, vy: 2.2, time });
    if (this.world.scene.sound) this.world.scene.sound.play(SFX_DROP, { volume: 0.5 });
    this.session.currentTier = this.session.nextTier;
    this.session.nextTier = rollDropTier(this.session.highestTierCreated);
    this.session.dropReadyAt = time + DROP_COOLDOWN_MS;
    this.world.hidePreview();
  }
}
