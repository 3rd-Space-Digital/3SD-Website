/**
 * Fruit (ball) definitions. Physics, scoring, and the drop table read tier, radius, and
 * score. Drawing reads `visual` only.
 *
 * Each ball is a team member's face. `visual` is `{ type: 'image', key }`; the texture is
 * loaded in GameScene.preload from FACE_ASSETS. Do not change radius from inside the
 * renderer — the collider has to match the number stored here.
 *
 * Scores are the triangular sequence from the design notes. Points are awarded when a
 * merge creates that tier. Tier 0 is only dropped, so its score is the catalog value
 * and is not added on a drop.
 */
import hiraFace from '../assets/ballFaces/hiraBallFace.png';
import tomiwaFace from '../assets/ballFaces/tomiwaBallFace.png';
import haashimFace from '../assets/ballFaces/haashimBallFace.png';
import chrisFace from '../assets/ballFaces/chrisBallFace.png';
import annaFace from '../assets/ballFaces/annaBallFace.png';
import prabhasFace from '../assets/ballFaces/prabhasBallFace.png';
import andrewFace from '../assets/ballFaces/andrewBallFace.png';
import noorFace from '../assets/ballFaces/noorBallFace.png';
import ethanFace from '../assets/ballFaces/ethanBallFace.png';
import emekaFace from '../assets/ballFaces/emekaBallFace.png';

// Texture key per member. Keys are referenced by each fruit's visual and loaded in preload.
export const FACE_ASSETS = Object.freeze([
  { key: 'face-hira', url: hiraFace },
  { key: 'face-tomiwa', url: tomiwaFace },
  { key: 'face-haashim', url: haashimFace },
  { key: 'face-chris', url: chrisFace },
  { key: 'face-anna', url: annaFace },
  { key: 'face-prabhas', url: prabhasFace },
  { key: 'face-andrew', url: andrewFace },
  { key: 'face-noor', url: noorFace },
  { key: 'face-ethan', url: ethanFace },
  { key: 'face-emeka', url: emekaFace },
]);

// Global ball-size multiplier. Bump this to rebalance every tier at once; the collider
// reads the scaled radius below, so physics stays in sync automatically.
const SIZE_SCALE = 1;

// Smallest -> largest. The last tier is the "winner" ball.
export const FRUITS = Object.freeze([
  def(0, 'hira', 'Hira', 18, 1, 'face-hira'),
  def(1, 'tomiwa', 'Tomiwa', 25, 3, 'face-tomiwa'),
  def(2, 'haashim', 'Haashim', 33, 6, 'face-haashim'),
  def(3, 'chris', 'Chris', 42, 10, 'face-chris'),
  def(4, 'anna', 'Anna', 52, 15, 'face-anna'),
  def(5, 'prabhas', 'Prabhas', 63, 21, 'face-prabhas'),
  def(6, 'andrew', 'Andrew', 75, 28, 'face-andrew'),
  def(7, 'noor', 'Noor', 88, 36, 'face-noor'),
  def(8, 'ethan', 'Ethan', 100, 45, 'face-ethan'),
  def(9, 'emeka', 'Emeka', 112, 55, 'face-emeka'),
]);

export const MAX_TIER = FRUITS.length - 1;

function def(tier, id, name, radius, score, textureKey) {
  return Object.freeze({
    tier,
    id,
    name,
    radius: radius * SIZE_SCALE,
    score,
    visual: Object.freeze({ type: 'image', key: textureKey }),
  });
}

export function fruitByTier(tier) {
  return FRUITS[tier];
}

/**
 * Create the display object for a fruit. Images become sprites sized by paintFruit;
 * circles remain circles. Kept here so every call site builds the correct object type.
 */
export function createFruitNode(scene, x, y, fruit) {
  if (fruit.visual.type === 'image') {
    return scene.add.image(x, y, fruit.visual.key);
  }
  return scene.add.circle(x, y, fruit.radius, fruit.visual.fill);
}

export function paintFruit(node, shine, fruit, radiusScale = 1) {
  const visual = fruit.visual;
  const radius = fruit.radius * radiusScale;

  if (visual.type === 'image') {
    node.setTexture(visual.key);
    node.setDisplaySize(radius * 2, radius * 2);
    node.clearTint();
    // Faces read better without the glossy highlight used on the old circles.
    if (shine) shine.setFillStyle(0xffffff, 0);
    return radius;
  }

  if (visual.type !== 'circle') {
    throw new Error(`Unsupported fruit visual "${visual.type}" on ${fruit.id}.`);
  }

  node.setRadius(radius);
  node.setFillStyle(visual.fill, 1);
  node.setStrokeStyle(Math.max(2, radius * 0.08), visual.stroke, 1);
  if (shine) {
    shine.setRadius(Math.max(3, radius * 0.22));
    shine.setFillStyle(0xffffff, 0.42);
  }
  return radius;
}
