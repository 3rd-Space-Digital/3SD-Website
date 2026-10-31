// Names from the Blender export. Leave null to use the first camera / first clip in the file.
export const CAMERA_NAME = null;
export const CLIP_NAME = null;

// Blender scene frame rate (Output Properties > Frame Rate). Used to convert frames to clip time.
export const BLENDER_FPS = 24;

// Scroll offset (0 = top of page, 1 = bottom) -> Blender timeline frame.
// Repeat a frame across two scroll values to hold the camera there (e.g. pause on an object).
// Leave empty to map scroll linearly across the whole animation.
// Frames 0-184 take 184 scroll units, 184-250 take 2 units per frame (132), out of 316 total.
export const STOPS = [
  { scroll: 0, frame: 0 },
  { scroll: 184 / 316, frame: 184 },
  { scroll: 1, frame: 250 },
];

// On portrait (phone) screens, pull the camera back along its view direction over the final frames
// so the pages fit the narrower frame. Ramps in over `rampFrames`, reaching full strength at `fullFrame`.
export const PORTRAIT_END_PULLBACK = {
  fullFrame: 199,
  rampFrames: 15,
  distance: 1.4,
};

export const scrollToFrame = (offset, lastFrame) => {
  if (STOPS.length < 2) return offset * lastFrame;

  if (offset <= STOPS[0].scroll) return STOPS[0].frame;
  for (let i = 1; i < STOPS.length; i++) {
    const a = STOPS[i - 1];
    const b = STOPS[i];
    if (offset <= b.scroll) {
      const span = b.scroll - a.scroll;
      const k = span > 0 ? (offset - a.scroll) / span : 1;
      return a.frame + (b.frame - a.frame) * k;
    }
  }
  return STOPS[STOPS.length - 1].frame;
};

export const findCameraPath = (gltf) => {
  const camera = CAMERA_NAME
    ? gltf.cameras.find((c) => c.name === CAMERA_NAME)
    : gltf.cameras[0];
  const clip = CLIP_NAME
    ? gltf.animations.find((c) => c.name === CLIP_NAME)
    : gltf.animations[0];

  return camera && clip ? { camera, clip } : null;
};
