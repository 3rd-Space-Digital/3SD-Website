import { OrbitControls, useGLTF } from "@react-three/drei";
import { useControls } from "leva";
import { useMemo } from "react";
import { MeshBasicNodeMaterial } from "three/webgpu";
import {
  BLENDER_FPS,
  PORTRAIT_END_PULLBACK,
  findCameraPath,
} from "./cameraPath";
import { ScrollCamera } from "./ScrollCamera";

const uvAttributeName = (channel) =>
  channel === 0 ? "uv" : channel < 4 ? `uv${channel}` : `texcoord_${channel}`;

const isUVAttribute = (name) =>
  name === "uv" || /^uv\d$/.test(name) || name.startsWith("texcoord_");

// GLTFLoader only maps TEXCOORD_0-3 to uv-uv3, so bakes on later UV maps render blank.
const moveBakedUVToPrimary = (geometry, channel) => {
  if (channel === 0 || geometry.userData.bakedUV) return;

  const bakedUV = geometry.getAttribute(uvAttributeName(channel));
  if (!bakedUV) return;

  for (const name of Object.keys(geometry.attributes)) {
    if (isUVAttribute(name)) geometry.deleteAttribute(name);
  }
  geometry.setAttribute("uv", bakedUV);
  geometry.userData.bakedUV = true;
};

const useBakedScene = (scene) =>
  useMemo(() => {
    const converted = new Map();

    scene.traverse((child) => {
      if (!child.isMesh || child.material.isMeshBasicNodeMaterial) return;

      const source = child.material;
      let entry = converted.get(source);

      if (!entry) {
        const channel = source.map?.channel ?? 0;
        if (source.map) source.map.channel = 0;

        entry = {
          channel,
          material: new MeshBasicNodeMaterial({
            name: source.name,
            map: source.map,
            color: source.map ? 0xffffff : source.color,
            side: source.side,
            transparent: source.transparent,
            alphaTest: source.alphaTest,
            toneMapped: false,
          }),
        };
        converted.set(source, entry);
        source.dispose();
      }

      moveBakedUVToPrimary(child.geometry, entry.channel);
      child.material = entry.material;
    });

    return scene;
  }, [scene]);

export const Experience = ({ modelUrl, scrollSection, onFrame }) => {
  const gltf = useGLTF(modelUrl);
  const bakedScene = useBakedScene(gltf.scene);
  const path = useMemo(() => findCameraPath(gltf), [gltf]);

  const {
    freeCam,
    smoothing,
    fps,
    scrub,
    scrubFrame,
    portraitPullback,
  } = useControls(
      "Camera path",
      {
        freeCam: { value: !path, label: "free look" },
        smoothing: { value: 3, min: 0.5, max: 20, step: 0.1 },
        fps: { value: BLENDER_FPS, min: 1, max: 120, step: 1 },
        scrub: false,
        scrubFrame: {
          value: 0,
          min: 0,
          max: path ? Math.round(path.clip.duration * BLENDER_FPS) : 250,
          step: 1,
          label: "frame",
        },
        portraitPullback: {
          value: PORTRAIT_END_PULLBACK.distance,
          min: 0,
          max: 5,
          step: 0.05,
          label: "phone end lift",
        },
      },
      [path],
    );

  const useScrollPath = path && !freeCam;

  return (
    <>
      {useScrollPath ? (
        <ScrollCamera
          scrollSection={scrollSection}
          root={bakedScene}
          path={path}
          fps={fps}
          smoothing={smoothing}
          scrub={scrub}
          scrubFrame={scrubFrame}
          portraitPullback={portraitPullback}
          onFrame={onFrame}
        />
      ) : (
        <OrbitControls makeDefault target={[-1.4, 4.5, 3.5]} />
      )}
      <primitive object={bakedScene} />
    </>
  );
};