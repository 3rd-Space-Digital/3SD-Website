import { DROP_TIER_CAP } from '../game/constants.js';
import { MAX_TIER } from './catalog.js';

/**
 * Drop table.
 * The unlocked ceiling grows with the biggest fruit the player has created,
 * and it never passes DROP_TIER_CAP. Each larger tier weighs (steps above it)^2,
 * so it is strictly less likely than every smaller tier in the same roll.
 *
 * On top of that, a small, steeply-decaying tail lets tiers ABOVE the normal
 * DROP_TIER_CAP drop occasionally — but only up to the highest tier the player has
 * actually created. A tier can never drop before it has been reached naturally.
 * The main tiers keep their exact relative odds; the tail just skims
 * ~RARE_HIGH_TIER_CHANCE of total probability off the top.
 *
 * highest ≤ 4 → no tail; just 0..highest (e.g. 25, 16, 9, 4, 1 at highest 4)
 * highest 7   → 25, 16, 9, 4, 1 (+ tiny chance of 5, 6, 7 only)
 */

// Approximate share of drops that roll above the normally-unlocked ceiling.
const RARE_HIGH_TIER_CHANCE = 0.04;
// Each tier above the ceiling is this fraction as likely as the one below it.
const RARE_DECAY = 0.3;

export function dropWeights(highestTierCreated) {
  const reached = Math.min(MAX_TIER, Math.max(0, highestTierCreated));
  const unlocked = Math.min(DROP_TIER_CAP, reached);
  const weights = [];
  let mainTotal = 0;
  for (let tier = 0; tier <= unlocked; tier += 1) {
    const stepsAbove = unlocked - tier + 1;
    const weight = stepsAbove * stepsAbove;
    weights.push(weight);
    mainTotal += weight;
  }

  // Tail only covers tiers above the normal cap that have already been reached.
  const highCount = reached - unlocked;
  if (highCount > 0 && RARE_HIGH_TIER_CHANCE > 0) {
    // Total weight the tail needs so it ends up as RARE_HIGH_TIER_CHANCE of everything.
    const tailTotal = mainTotal * (RARE_HIGH_TIER_CHANCE / (1 - RARE_HIGH_TIER_CHANCE));
    let geomSum = 0;
    for (let i = 0; i < highCount; i += 1) geomSum += RARE_DECAY ** i;
    const scale = tailTotal / geomSum;
    for (let i = 0; i < highCount; i += 1) {
      weights.push(scale * RARE_DECAY ** i);
    }
  }

  return weights;
}

export function rollDropTier(highestTierCreated, random = Math.random) {
  const weights = dropWeights(highestTierCreated);
  let total = 0;
  for (const weight of weights) total += weight;

  let roll = random() * total;
  for (let tier = 0; tier < weights.length; tier += 1) {
    roll -= weights[tier];
    if (roll < 0) return tier;
  }
  return 0;
}
