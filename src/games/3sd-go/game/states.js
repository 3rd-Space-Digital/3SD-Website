import { HIGH_SCORE_KEY } from './constants.js';

// The only states the loop is allowed to be in.
export const GameState = Object.freeze({
  START: 'start',
  RUNNING: 'running',
  GAMEOVER: 'gameover',
});

function readHighScore() {
  try {
    const value = Number(localStorage.getItem(HIGH_SCORE_KEY));
    if (!Number.isFinite(value) || value <= 0) return 0;
    return Math.floor(value);
  } catch {
    return 0;
  }
}

function writeHighScore(score) {
  try {
    localStorage.setItem(HIGH_SCORE_KEY, String(score));
  } catch {
    // Private mode and blocked storage still leave the score in memory.
  }
}

/**
 * Run data shared by every system. Systems append intents; the loop applies them
 * at the start of the frame so pointer handlers never change rules mid-step.
 */
export class GameSession {
  constructor() {
    this.state = GameState.START;
    this.score = 0;
    this.highScore = readHighScore();
    this.currentTier = null;
    this.nextTier = null;
    // 0 means only the smallest fruit can drop. Merges raise this.
    this.highestTierCreated = 0;
    this.dropReadyAt = 0;
    this.dropRequested = false;
    this.aim = null;
    this.pending = [];
  }

  push(intent) {
    this.pending.push(intent);
  }

  drain() {
    const pending = this.pending;
    this.pending = [];
    return pending;
  }

  beginRun(time) {
    this.state = GameState.RUNNING;
    this.score = 0;
    this.currentTier = null;
    this.nextTier = null;
    this.highestTierCreated = 0;
    this.dropReadyAt = time;
    this.dropRequested = false;
    this.aim = null;
  }

  endRun() {
    if (this.state !== GameState.RUNNING) return;
    this.state = GameState.GAMEOVER;
    this.dropRequested = false;
    this.currentTier = null;
  }

  addScore(points) {
    this.score += points;
    if (this.score > this.highScore) {
      this.highScore = this.score;
      writeHighScore(this.highScore);
    }
  }

  noteCreatedTier(tier) {
    if (tier > this.highestTierCreated) {
      this.highestTierCreated = tier;
    }
  }
}
