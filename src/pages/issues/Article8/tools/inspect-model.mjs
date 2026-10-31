import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { MeshoptDecoder } from "meshoptimizer";
import sharp from "sharp";

await MeshoptDecoder.ready;

const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ "meshopt.decoder": MeshoptDecoder });

const document = await io.read(process.argv[2] ?? "public/models/pulsethreeJS.glb");
const root = document.getRoot();

console.log("cameras:", root.listCameras().map((c) => c.getName()));
for (const animation of root.listAnimations()) {
  const targets = animation.listChannels().map((c) => `${c.getTargetNode()?.getName()}.${c.getTargetPath()}`);
  console.log("animation:", animation.getName(), targets);
}

for (const texture of root.listTextures()) {
  const { width, height } = await sharp(Buffer.from(texture.getImage())).metadata();
  const kb = (texture.getImage().byteLength / 1024).toFixed(0);
  console.log(`texture: ${texture.getName() || texture.getURI()} ${texture.getMimeType()} ${width}x${height} ${kb} KB`);
}

const texCoords = new Set();
for (const material of root.listMaterials()) {
  const info = material.getBaseColorTextureInfo();
  if (material.getBaseColorTexture()) texCoords.add(info.getTexCoord());
}
console.log("bake UV sets used:", [...texCoords]);
console.log("extensions:", root.listExtensionsUsed().map((e) => e.extensionName));
