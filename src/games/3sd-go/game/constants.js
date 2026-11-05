export const VIEW_WIDTH = 1280;
export const VIEW_HEIGHT = 720;

// Matter gravity.y is multiplied by the engine scale (0.001) inside the solver.
export const GRAVITY_Y = 1.8;

export const FIXED_STEP_MS = 1000 / 60;
export const MAX_SUBSTEPS = 3;
export const MAX_FRAME_MS = 50;

export const DROP_COOLDOWN_MS = 480;
export const OVERFLOW_GRACE_MS = 700;
export const OVERFLOW_HOLD_MS = 1200;

// Largest tier index that can fall from the top. Bigger fruit only comes from merges.
export const DROP_TIER_CAP = 4;

export const HIGH_SCORE_KEY = 'merge-space-digital.highScore';

// Audio keys (loaded in GameScene.preload).
export const SFX_MERGE = 'sfx-merge';
export const SFX_BOOM = 'sfx-boom';
export const SFX_DROP = 'sfx-drop';

// Outer crate. The opening is the lip; the physics walls sit on the other three sides.
export const BOX = Object.freeze({
  x: 368,
  y: 18,
  width: 544,
  height: 684,
  wall: 26,
  lip: 16,
});

export function playfield() {
  const left = BOX.x + BOX.wall;
  const right = BOX.x + BOX.width - BOX.wall;
  const top = BOX.y + BOX.lip;
  const bottom = BOX.y + BOX.height - BOX.wall;

  return {
    left,
    right,
    top,
    bottom,
    width: right - left,
    height: bottom - top,
    dangerY: top + 118,
  };
}

export const FRUIT_BODY = Object.freeze({
  restitution: 0.12,
  friction: 0.35,
  frictionStatic: 0.55,
  frictionAir: 0.02,
  density: 0.0018,
  slop: 0.02,
  sleepThreshold: 36,
});

export const WALL_BODY = Object.freeze({
  isStatic: true,
  restitution: 0.04,
  friction: 0.9,
  frictionStatic: 1,
  label: 'wall',
});

export const PALETTE = Object.freeze({
  wood: 0xc4894c,
  floorA: 0xf8e3a8,
  floorB: 0xf0d08a,
  crate: 0xf0c84b,
  crateInner: 0xfff8e4,
  ink: '#6b3a0e',
  inkSoft: '#8d4e12',
  accent: '#e8831a',
  bubble: 0xffffff,
  card: 0xfff3d0,
  cardEdge: 0xe7c98a,
  button: 0x43a047,
  buttonEdge: 0x2e7d32,
  danger: 0xff4d5e,
  overlay: 0x3a2412,
});
