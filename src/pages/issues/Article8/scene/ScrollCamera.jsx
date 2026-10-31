import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { AnimationMixer, MathUtils, Vector3 } from "three/webgpu";
import { PORTRAIT_END_PULLBACK, scrollToFrame } from "./cameraPath";

const backward = new Vector3();

// 0 when the section's top reaches the top of the viewport, 1 when its bottom reaches the bottom.
const sectionProgress = (section) => {
  if (!section) return 0;
  const rect = section.getBoundingClientRect();
  const scrollable = rect.height - window.innerHeight;
  return scrollable > 0 ? MathUtils.clamp(-rect.top / scrollable, 0, 1) : 0;
};

export const ScrollCamera = ({
  scrollSection,
  root,
  path,
  fps,
  smoothing,
  scrub,
  scrubFrame,
  portraitPullback,
  onFrame,
}) => {
  const camera = useThree((state) => state.camera);
  const { camera: blenderCamera, clip } = path;

  const mixer = useMemo(() => new AnimationMixer(root), [root]);
  const action = useMemo(() => mixer.clipAction(clip), [mixer, clip]);

  useEffect(() => {
    action.play();
    action.paused = true;
    return () => action.stop();
  }, [action]);

  useEffect(() => {
    camera.fov = blenderCamera.fov;
    camera.near = blenderCamera.near;
    camera.far = blenderCamera.far;
    camera.updateProjectionMatrix();
  }, [camera, blenderCamera]);

  const time = useRef(null);

  useFrame((_, delta) => {
    const lastFrame = clip.duration * fps;
    const offset = sectionProgress(scrollSection.current);
    const frame = scrub ? scrubFrame : scrollToFrame(offset, lastFrame);
    const target = MathUtils.clamp(frame / fps, 0, clip.duration);

    // Snap on the first frame so a restored scroll position doesn't replay the path.
    time.current =
      scrub || time.current === null
        ? target
        : MathUtils.damp(time.current, target, smoothing, delta);

    action.time = time.current;
    mixer.update(0);
    onFrame?.(time.current * fps);

    blenderCamera.updateWorldMatrix(true, false);
    blenderCamera.matrixWorld.decompose(
      camera.position,
      camera.quaternion,
      camera.scale,
    );

    if (camera.aspect < 1 && portraitPullback > 0) {
      const { fullFrame, rampFrames } = PORTRAIT_END_PULLBACK;
      const ramp = MathUtils.smoothstep(
        time.current * fps,
        fullFrame - rampFrames,
        fullFrame,
      );
      backward.set(0, 0, 1).applyQuaternion(camera.quaternion);
      camera.position.addScaledVector(backward, portraitPullback * ramp);
    }
  });

  return null;
};
