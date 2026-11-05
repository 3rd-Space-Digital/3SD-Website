import { FIXED_STEP_MS, MAX_FRAME_MS, MAX_SUBSTEPS } from './constants.js';
import { GameState } from './states.js';

/**
 * Strict frame order. Systems do not call ahead into a later step.
 *
 * 1. State    — play / restart intents from the previous input events
 * 2. Input    — aim the held fruit, arm a drop
 * 3. Spawn    — release a drop into the crate before physics
 * 4. Physics  — fixed Matter steps while the run is live
 * 5. Merge    — same-tier contacts queued during the step
 * 6. Danger   — overflow hold can end the run
 * 7. Present  — visuals and HUD, no rule changes
 */
export function tick(ctx, time, delta) {
  const frame = Math.min(Math.max(delta, 0), MAX_FRAME_MS);

  applyIntents(ctx, time);
  ctx.input.tick(time, frame);
  ctx.spawner.tick(time);

  if (ctx.session.state === GameState.RUNNING) {
    ctx.accumulator += frame;
    let steps = 0;
    while (ctx.accumulator >= FIXED_STEP_MS && steps < MAX_SUBSTEPS) {
      ctx.scene.matter.world.step(FIXED_STEP_MS);
      ctx.merger.flush(time);
      ctx.accumulator -= FIXED_STEP_MS;
      steps += 1;
    }
    ctx.danger.tick(time, frame);
  }

  ctx.world.syncVisuals();
  ctx.hud.tick(time, frame);
}

function applyIntents(ctx, time) {
  for (const intent of ctx.session.drain()) {
    if (intent.type !== 'startRun') continue;
    ctx.world.clearFruits();
    ctx.session.beginRun(time);
    ctx.spawner.fillQueue();
  }
}
