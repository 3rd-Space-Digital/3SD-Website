import { BOX, FRUIT_BODY, WALL_BODY, playfield } from '../game/constants.js';
import { createFruitNode, fruitByTier, paintFruit } from './catalog.js';

export class FruitWorld {
  constructor(scene) {
    this.scene = scene;
    this.fruits = [];
    this.nextId = 1;
    this.preview = null;
  }

  mount() {
    const field = playfield();
    const node = createFruitNode(this.scene, field.left, field.top, fruitByTier(0)).setDepth(12);
    const shine = this.scene.add.circle(field.left, field.top, 6, 0xffffff, 0.45).setDepth(13);
    node.setVisible(false);
    shine.setVisible(false);
    this.preview = {
      node,
      shine,
      tier: -1,
      x: field.left,
      y: field.top,
      radius: 18,
      visible: false,
      blocked: false,
    };
    this.buildWalls();
  }

  buildWalls() {
    const field = playfield();
    const thickness = BOX.wall;
    const sideTop = BOX.y;
    const sideHeight = field.bottom - sideTop;
    const sideY = sideTop + sideHeight / 2;

    this.scene.matter.add.rectangle(field.left - thickness / 2, sideY, thickness, sideHeight, WALL_BODY);
    this.scene.matter.add.rectangle(field.right + thickness / 2, sideY, thickness, sideHeight, WALL_BODY);
    this.scene.matter.add.rectangle(
      (field.left + field.right) / 2,
      field.bottom + thickness / 2,
      field.width + thickness * 2,
      thickness,
      WALL_BODY,
    );
  }

  showPreview(tier, x, y, radius, blocked) {
    const preview = this.preview;
    const fruit = fruitByTier(tier);
    if (preview.tier !== tier) {
      paintFruit(preview.node, preview.shine, fruit);
      preview.tier = tier;
    }
    preview.radius = radius;
    preview.x = x;
    preview.y = y;
    preview.blocked = blocked;
    preview.visible = true;
    preview.node.setPosition(x, y);
    preview.node.setVisible(true);
    preview.shine.setVisible(true);
    if (fruit.visual.type === 'image') {
      preview.node.setTint(blocked ? 0xff4d5e : 0xffffff);
    } else {
      const stroke = blocked ? 0xff4d5e : fruit.visual.stroke;
      preview.node.setStrokeStyle(Math.max(3, radius * 0.1), stroke, 1);
    }
  }

  hidePreview() {
    if (!this.preview) return;
    this.preview.visible = false;
    this.preview.node.setVisible(false);
    this.preview.shine.setVisible(false);
  }

  overlaps(x, y, radius) {
    for (const fruit of this.fruits) {
      if (!fruit.alive) continue;
      const dx = fruit.node.x - x;
      const dy = fruit.node.y - y;
      const reach = radius + fruit.radius - 1;
      if (dx * dx + dy * dy < reach * reach) return true;
    }
    return false;
  }

  spawn(x, y, tier, motion) {
    const fruitDef = fruitByTier(tier);
    const node = createFruitNode(this.scene, x, y, fruitDef).setDepth(10);
    const shine = this.scene.add.circle(x, y, fruitDef.radius * 0.22, 0xffffff, 0.42).setDepth(11);
    paintFruit(node, shine, fruitDef);

    this.scene.matter.add.gameObject(node, {
      shape: { type: 'circle', radius: fruitDef.radius },
      restitution: FRUIT_BODY.restitution,
      friction: FRUIT_BODY.friction,
      frictionStatic: FRUIT_BODY.frictionStatic,
      frictionAir: FRUIT_BODY.frictionAir,
      density: FRUIT_BODY.density,
      slop: FRUIT_BODY.slop,
      sleepThreshold: FRUIT_BODY.sleepThreshold,
      label: 'fruit',
    });
    node.setDepth(10);
    shine.setDepth(11);
    node.setVelocity(motion.vx, motion.vy);

    const record = {
      id: this.nextId,
      tier,
      radius: fruitDef.radius,
      node,
      shine,
      alive: true,
      bornAt: motion.time,
      overflowMs: 0,
    };
    this.nextId += 1;
    node.setData('fruit', record);
    this.fruits.push(record);
    return record;
  }

  removeFruit(fruit) {
    fruit.alive = false;
    const index = this.fruits.indexOf(fruit);
    if (index >= 0) this.fruits.splice(index, 1);
    if (fruit.node.body) this.scene.matter.world.remove(fruit.node);
    fruit.shine.destroy();
    fruit.node.destroy();
  }

  clearFruits() {
    for (const fruit of [...this.fruits]) this.removeFruit(fruit);
  }

  syncVisuals() {
    for (const fruit of this.fruits) {
      placeShine(fruit.shine, fruit.node.x, fruit.node.y, fruit.node.rotation, fruit.radius);
    }

    const preview = this.preview;
    if (!preview || !preview.visible) return;
    placeShine(preview.shine, preview.x, preview.y, -0.9, preview.radius);
  }
}

function placeShine(shine, x, y, angle, radius) {
  const offset = radius * 0.36;
  shine.setPosition(x + Math.cos(angle) * offset, y + Math.sin(angle) * offset);
}
