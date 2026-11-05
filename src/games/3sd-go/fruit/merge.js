import Phaser from 'phaser';
import { SFX_BOOM, SFX_MERGE, playfield } from '../game/constants.js';
import { MAX_TIER, fruitByTier } from './catalog.js';

export class Merger {
  constructor(scene, session, world) {
    this.scene = scene;
    this.session = session;
    this.world = world;
    this.queue = [];
  }

  bind() {
    this.scene.matter.world.on('collisionstart', (event) => {
      for (const pair of event.pairs) {
        this.consider(pair.bodyA, pair.bodyB);
      }
    });
  }

  consider(bodyA, bodyB) {
    const a = fruitFromBody(bodyA);
    const b = fruitFromBody(bodyB);
    if (!a || !b || a.id === b.id) return;
    if (!a.alive || !b.alive) return;
    if (a.tier !== b.tier || a.tier >= MAX_TIER) return;

    a.alive = false;
    b.alive = false;
    this.queue.push([a, b]);
  }

  flush(time) {
    if (this.queue.length === 0) return;
    const batch = this.queue.splice(0);
    let madeFinalTier = false;

    for (const [a, b] of batch) {
      const tier = a.tier + 1;
      if (tier === MAX_TIER) madeFinalTier = true;
      const field = playfield();
      const fruit = fruitByTier(tier);
      const x = Phaser.Math.Clamp((a.node.x + b.node.x) / 2, field.left + fruit.radius, field.right - fruit.radius);
      const y = Phaser.Math.Clamp((a.node.y + b.node.y) / 2, field.top + fruit.radius, field.bottom - fruit.radius);
      const va = a.node.getVelocity();
      const vb = b.node.getVelocity();

      this.world.removeFruit(a);
      this.world.removeFruit(b);

      const created = this.world.spawn(x, y, tier, {
        vx: (va.x + vb.x) * 0.35,
        vy: Math.max(-3, (va.y + vb.y) * 0.35 - 1.2),
        time,
      });

      this.session.addScore(fruit.score);
      this.session.noteCreatedTier(tier);
      this.popup(created.node.x, created.node.y - fruit.radius, fruit.score);
    }

    if (batch.length > 0 && this.scene.sound) {
      // One play per flush keeps rapid chain merges from stacking into a loud blast.
      this.scene.sound.play(SFX_MERGE, { volume: 0.5 });
      // Emeka (the final tier) gets the vine boom.
      if (madeFinalTier) this.scene.sound.play(SFX_BOOM, { volume: 1.6 });
    }
  }

  popup(x, y, points) {
    const text = this.scene.add.text(x, y, `+${points}`, {
      fontFamily: 'Trebuchet MS, Verdana, sans-serif',
      fontSize: '28px',
      fontStyle: 'bold',
      color: '#fffaf0',
      stroke: '#6b3a0e',
      strokeThickness: 5,
      resolution: 2,
    }).setOrigin(0.5).setDepth(30);

    this.scene.tweens.add({
      targets: text,
      y: y - 46,
      alpha: 0,
      duration: 680,
      ease: 'Cubic.easeOut',
      onComplete: () => text.destroy(),
    });
  }
}

function fruitFromBody(body) {
  const node = body && body.gameObject;
  if (!node || typeof node.getData !== 'function') return null;
  return node.getData('fruit') || null;
}
