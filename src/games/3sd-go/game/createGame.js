import { GameSession } from './states.js';
import { FruitWorld } from '../fruit/world.js';
import { Spawner } from '../fruit/spawner.js';
import { Merger } from '../fruit/merge.js';
import { Danger } from '../systems/danger.js';
import { Input } from '../systems/input.js';
import { Hud } from '../ui/hud.js';
import { drawStage } from '../ui/stage.js';

export function createGame(scene) {
  const session = new GameSession();
  const world = new FruitWorld(scene);
  const spawner = new Spawner(session, world);
  const merger = new Merger(scene, session, world);
  const danger = new Danger(session, world);
  const input = new Input(scene, session, world);
  const hud = new Hud(scene, session, world, danger);

  const ctx = {
    scene,
    session,
    world,
    spawner,
    merger,
    danger,
    input,
    hud,
    accumulator: 0,
    mount() {
      scene.matter.world.autoUpdate = false;
      drawStage(scene);
      world.mount();
      merger.bind();
      input.bind();
      hud.build();
    },
  };

  return ctx;
}
