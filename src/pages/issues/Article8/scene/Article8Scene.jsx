import { useGLTF } from "@react-three/drei";
import { Canvas, extend } from "@react-three/fiber";
import { Leva, useControls } from "leva";
import { useRef } from "react";
import * as THREE from "three/webgpu";
import { Experience } from "./Experience";
import "./article8.css";

export const preloadArticle8Model = (modelUrl) => useGLTF.preload(modelUrl);

export const Article8Scene = ({
  modelUrl,
  pages: defaultPages = 22.8,
  debug = false,
  className,
  onFrame,
}) => {
  const scrollSection = useRef(null);
  const { pages } = useControls("Camera path", {
    pages: { value: defaultPages, min: 1, max: 60, step: 0.1 },
  });

  return (
    <>
      <Leva hidden={!debug} />
      <section
        ref={scrollSection}
        className={["article8-scroll", className].filter(Boolean).join(" ")}
        style={{ "--article8-pages": pages }}
      >
        <div className="article8-sticky">
          <Canvas
            camera={{ position: [34, 100, 39], fov: 30 }}
            gl={async (props) => {
              extend(THREE);
              const renderer = new THREE.WebGPURenderer(props);
              await renderer.init();
              return renderer;
            }}
          >
            <color attach="background" args={["#000000"]} />
            <Experience modelUrl={modelUrl} scrollSection={scrollSection} onFrame={onFrame} />
          </Canvas>
        </div>
      </section>
    </>
  );
};
