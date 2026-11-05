import { PALETTE, VIEW_HEIGHT, VIEW_WIDTH, playfield } from '../game/constants.js';
import { FRUITS, createFruitNode, fruitByTier, paintFruit } from '../fruit/catalog.js';
import { leaderboardRows } from './leaderboard.js';
import { GameState } from '../game/states.js';
import { FONT, formatScore, makeButton, makeText } from './widgets.js';

const SCORE_BUBBLE = { x: 180, y: 138, r: 102 };
const NEXT_BUBBLE = { x: 1100, y: 138, r: 102 };
const CARD = { x: 22, y: 292, w: 324, h: 292 };
const EVOLUTION = { x: 1108, y: 500, orbit: 104 };

export class Hud {
  constructor(scene, session, world, danger) {
    this.scene = scene;
    this.session = session;
    this.world = world;
    this.danger = danger;
  }

  build() {
    this.drawBubbles();
    this.drawCard();
    this.drawEvolution();
    this.drawLiveGuides();
    this.drawOverlay();

    this.restart = makeButton(this.scene, 180, 648, 200, 52, 'Restart', 40);
    this.restart.onClick(() => this.session.push({ type: 'startRun' }));
    this.restart.setVisible(false);
    this.paintRows();
    this.paintOverlay();
  }

  tick() {
    const session = this.session;
    this.scoreValue.setText(formatScore(session.score));
    this.highValue.setText(`High Score: ${formatScore(session.highScore)}`);
    this.paintNext();
    this.paintRows();
    this.paintGuide();
    this.paintDanger();
    this.paintEvolutionLocks();
    this.paintEvolutionRing();
    this.paintOverlay();
    this.restart.setVisible(session.state === GameState.RUNNING);
  }

  drawBubbles() {
    const g = this.scene.add.graphics().setDepth(20);
    drawBubble(g, SCORE_BUBBLE);
    drawBubble(g, NEXT_BUBBLE);

    this.scoreValue = makeText(this.scene, SCORE_BUBBLE.x, SCORE_BUBBLE.y - 22, '0', 48, PALETTE.ink, 22);
    this.highValue = makeText(this.scene, SCORE_BUBBLE.x, SCORE_BUBBLE.y + 22, 'High Score: 0', 16, PALETTE.inkSoft, 22);
    this.scoreLabel = makeText(this.scene, SCORE_BUBBLE.x, SCORE_BUBBLE.y + 68, 'Score!', 32, PALETTE.accent, 22);
    this.scoreLabel.setStroke('#7a3f10', 5);

    this.nextNode = createFruitNode(this.scene, NEXT_BUBBLE.x, NEXT_BUBBLE.y - 8, FRUITS[0]).setDepth(22);
    this.nextShine = this.scene.add.circle(NEXT_BUBBLE.x, NEXT_BUBBLE.y - 8, 4, 0xffffff, 0.4).setDepth(23);
    this.nextNode.setVisible(false);
    this.nextShine.setVisible(false);
    this.nextLabel = makeText(this.scene, NEXT_BUBBLE.x, NEXT_BUBBLE.y + 68, 'Next!', 32, PALETTE.accent, 22);
    this.nextLabel.setStroke('#7a3f10', 5);
    this.nextTierShown = -1;
  }

  drawCard() {
    const g = this.scene.add.graphics().setDepth(20);
    g.fillStyle(0x000000, 0.06);
    g.fillRoundedRect(CARD.x + 3, CARD.y + 5, CARD.w, CARD.h, 18);
    g.fillStyle(PALETTE.card, 1);
    g.fillRoundedRect(CARD.x, CARD.y, CARD.w, CARD.h, 18);
    g.lineStyle(3, PALETTE.cardEdge, 1);
    g.strokeRoundedRect(CARD.x, CARD.y, CARD.w, CARD.h, 18);

    const title = makeText(this.scene, CARD.x + 36, CARD.y + 32, 'Global Leaderboard', 18, PALETTE.ink, 22);
    title.setOrigin(0, 0.5);

    this.rows = [];
    for (let i = 0; i < 4; i += 1) {
      const y = CARD.y + 84 + i * 48;
      const medal = this.scene.add.circle(CARD.x + 32, y, 13, 0xf5c542).setDepth(22);
      const name = makeText(this.scene, CARD.x + 56, y, '', 18, PALETTE.ink, 22);
      name.setOrigin(0, 0.5);
      const score = makeText(this.scene, CARD.x + CARD.w - 20, y, '', 18, PALETTE.ink, 22);
      score.setOrigin(1, 0.5);
      this.rows.push({ medal, name, score });
    }
  }

  drawEvolution() {
    const g = this.scene.add.graphics().setDepth(3);
    g.fillStyle(0xc6ef6a, 0.5);
    g.fillCircle(EVOLUTION.x, EVOLUTION.y + 6, 150);

    this.drawEvolutionArrow();

    const spots = layoutEvolution();
    this.icons = FRUITS.map((fruit, index) => {
      const spot = spots[index];
      const node = createFruitNode(this.scene, spot.x, spot.y, fruit).setDepth(4);
      const shine = this.scene.add.circle(
        spot.x - spot.radius * 0.28,
        spot.y - spot.radius * 0.28,
        Math.max(2, spot.radius * 0.22),
        0xffffff,
        0.45,
      ).setDepth(5);
      paintFruit(node, shine, fruit, spot.radius / fruit.radius);
      // Locked tiers show a white "?" instead of the face until reached.
      const query = makeText(this.scene, spot.x, spot.y, '?', Math.round(spot.radius * 1.7), '#ffffff', 5);
      query.setStroke('#6b3a0e', Math.max(3, spot.radius * 0.3));
      return { x: spot.x, y: spot.y, radius: spot.radius, node, shine, query, tier: fruit.tier };
    });

    this.ring = this.scene.add.graphics().setDepth(6);
    this.paintEvolutionLocks();
  }

  // Reveal a face only once that tier has been created; otherwise show the "?".
  paintEvolutionLocks() {
    const reached = this.session.highestTierCreated;
    for (const icon of this.icons) {
      const unlocked = icon.tier <= reached;
      icon.node.setVisible(unlocked);
      icon.query.setVisible(!unlocked);
    }
  }

  // Curved arrow sweeping small -> large to show the faces scale up around the circle.
  drawEvolutionArrow() {
    const g = this.scene.add.graphics().setDepth(3);
    const count = FRUITS.length;
    const step = (Math.PI * 2) / count;
    const start = -Math.PI / 2; // smallest sits at the top
    const r = EVOLUTION.orbit + 26;
    const a0 = start + step * 0.25;
    const a1 = start + step * (count - 1) - step * 0.15;

    g.lineStyle(5, 0xffffff, 0.85);
    g.beginPath();
    g.arc(EVOLUTION.x, EVOLUTION.y, r, a0, a1, false);
    g.strokePath();

    // Arrowhead at the large end, pointing along the sweep direction.
    const ex = EVOLUTION.x + Math.cos(a1) * r;
    const ey = EVOLUTION.y + Math.sin(a1) * r;
    const tangent = a1 + Math.PI / 2;
    const size = 13;
    g.fillStyle(0xffffff, 0.95);
    g.beginPath();
    g.moveTo(ex + Math.cos(tangent) * size, ey + Math.sin(tangent) * size);
    g.lineTo(ex + Math.cos(tangent + 2.5) * size, ey + Math.sin(tangent + 2.5) * size);
    g.lineTo(ex + Math.cos(tangent - 2.5) * size, ey + Math.sin(tangent - 2.5) * size);
    g.closePath();
    g.fillPath();
  }

  drawLiveGuides() {
    this.guide = this.scene.add.graphics().setDepth(6);
    this.dangerLine = this.scene.add.graphics().setDepth(14);
    const field = playfield();
    this.warning = makeText(this.scene, (field.left + field.right) / 2, field.dangerY - 22, 'Overflow', 20, '#fffaf0', 15);
    this.warning.setStroke('#9d2030', 4);
    this.warning.setVisible(false);
  }

  drawOverlay() {
    this.dim = this.scene.add.rectangle(VIEW_WIDTH / 2, VIEW_HEIGHT / 2, VIEW_WIDTH, VIEW_HEIGHT, PALETTE.overlay, 0.55)
      .setDepth(400);
    this.dim.setInteractive();
    this.dim.setData('ui', true);

    this.panel = this.scene.add.rectangle(VIEW_WIDTH / 2, 348, 560, 300, PALETTE.card)
      .setStrokeStyle(4, PALETTE.cardEdge)
      .setDepth(401);

    this.overlayTitle = makeText(this.scene, VIEW_WIDTH / 2, 268, '3SD Go!', 42, PALETTE.ink, 402);
    this.overlayBody = this.scene.add.text(VIEW_WIDTH / 2, 360, '', {
      fontFamily: FONT,
      fontSize: '22px',
      fontStyle: 'bold',
      color: PALETTE.inkSoft,
      align: 'center',
      wordWrap: { width: 460 },
      lineSpacing: 6,
      resolution: 2,
    }).setOrigin(0.5).setDepth(402);

    this.play = makeButton(this.scene, VIEW_WIDTH / 2, 452, 220, 56, 'Play', 403);
    this.play.onClick(() => this.session.push({ type: 'startRun' }));
  }

  paintNext() {
    const tier = this.session.nextTier;
    const visible = tier != null && this.session.state !== GameState.START;
    this.nextNode.setVisible(visible);
    this.nextShine.setVisible(visible);
    if (!visible || tier === this.nextTierShown) return;

    const fruit = fruitByTier(tier);
    const scale = Math.min(1, 40 / fruit.radius);
    const radius = paintFruit(this.nextNode, this.nextShine, fruit, scale);
    this.nextNode.setPosition(NEXT_BUBBLE.x, NEXT_BUBBLE.y - 10);
    this.nextShine.setPosition(NEXT_BUBBLE.x - radius * 0.32, NEXT_BUBBLE.y - 10 - radius * 0.32);
    this.nextTierShown = tier;
  }

  paintRows() {
    const rows = leaderboardRows(this.session.score);
    const medals = [0xf5c542, 0xd5d8e0, 0xe0a15a, 0xc4894c];
    this.rows.forEach((view, index) => {
      const row = rows[index];
      view.medal.setFillStyle(medals[index]);
      view.name.setText(row.name);
      view.name.setColor(row.isPlayer ? PALETTE.accent : PALETTE.ink);
      view.score.setText(formatScore(row.score));
      view.score.setColor(row.isPlayer ? PALETTE.accent : PALETTE.ink);
    });
  }

  paintGuide() {
    this.guide.clear();
    const preview = this.world.preview;
    if (!preview || !preview.visible) return;
    const field = playfield();
    this.guide.lineStyle(2, preview.blocked ? PALETTE.danger : 0xffffff, 0.8);
    this.guide.lineBetween(preview.x, preview.y + preview.radius * 0.15, preview.x, field.bottom - 8);
  }

  paintDanger() {
    this.dangerLine.clear();
    const field = playfield();
    const hot = this.danger.pressure;
    const color = hot > 0.05 ? PALETTE.danger : 0xffffff;
    const alpha = 0.5 + hot * 0.5;
    const dash = 14;
    const gap = 10;
    this.dangerLine.lineStyle(4, color, alpha);
    for (let x = field.left + 10; x < field.right - 10; x += dash + gap) {
      this.dangerLine.lineBetween(x, field.dangerY, Math.min(x + dash, field.right - 10), field.dangerY);
    }
    this.warning.setVisible(hot > 0.35 && this.session.state === GameState.RUNNING);
    this.warning.setAlpha(0.45 + hot * 0.55);
  }

  paintEvolutionRing() {
    this.ring.clear();
    const tier = this.session.nextTier;
    if (tier == null || this.session.state === GameState.START) return;
    const icon = this.icons[tier];
    this.ring.lineStyle(4, 0xffffff, 0.95);
    this.ring.strokeCircle(icon.x, icon.y, icon.radius + 6);
  }

  paintOverlay() {
    const state = this.session.state;
    const show = state !== GameState.RUNNING;
    this.dim.setVisible(show);
    this.panel.setVisible(show);
    this.overlayTitle.setVisible(show);
    this.overlayBody.setVisible(show);
    this.play.setVisible(show);

    if (show) this.dim.setInteractive();
    else this.dim.disableInteractive();

    if (state === GameState.START) {
      this.overlayTitle.setText('3SD Go!');
      this.overlayBody.setText('Move the face across the top.\nClick to drop it.\nMatching faces merge into the next size.');
      this.play.caption.setText('Play');
    } else if (state === GameState.GAMEOVER) {
      this.overlayTitle.setText('Game Over');
      this.overlayBody.setText(`The box overflowed.\nScore ${formatScore(this.session.score)}\nBest ${formatScore(this.session.highScore)}`);
      this.play.caption.setText('Play again');
    }
  }
}

function layoutEvolution() {
  const count = FRUITS.length;
  const step = (Math.PI * 2) / count;
  const start = -Math.PI / 2; // smallest at the top, growing clockwise
  return FRUITS.map((_, index) => {
    const angle = start + index * step;
    // Icon size grows with tier so going around the circle clearly scales up.
    // Minimum is kept legible; the max stays clear of the arrow arc.
    const radius = 10 + index * (10 / (count - 1));
    return {
      x: EVOLUTION.x + Math.cos(angle) * EVOLUTION.orbit,
      y: EVOLUTION.y + Math.sin(angle) * EVOLUTION.orbit,
      radius,
    };
  });
}

function drawBubble(g, bubble) {
  g.fillStyle(0x000000, 0.08);
  g.fillCircle(bubble.x + 4, bubble.y + 6, bubble.r);
  g.fillStyle(PALETTE.bubble, 0.94);
  g.fillCircle(bubble.x, bubble.y, bubble.r);
  g.lineStyle(4, 0xf3e2b8, 0.9);
  g.strokeCircle(bubble.x, bubble.y, bubble.r);
}
