import Phaser from 'phaser';
import { gameConfig } from './game/config.js';

/**
 * Embeddable entry point for 3SD Go!
 *
 * Mounts the game into a container you control (an element id string or an
 * HTMLElement). Returns the Phaser.Game instance — call `game.destroy(true)` when
 * the page/component unmounts so the WebGL context and audio are released.
 *
 * The container should have a real size (e.g. width/height or aspect-ratio in CSS);
 * the canvas scales to FIT inside it at a 1280x720 aspect ratio.
 *
 *   import { mountThreeSdGame } from '.../src/embed.js';
 *   const game = mountThreeSdGame(containerEl);
 *   // later: game.destroy(true);
 */
export function mountThreeSdGame(parent) {
  return new Phaser.Game({ ...gameConfig, parent });
}
