import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { dedup, meshopt, prune, textureCompress } from "@gltf-transform/functions";
import { MeshoptEncoder } from "meshoptimizer";
import sharp from "sharp";
import { statSync } from "node:fs";

const input = process.argv[2] ?? "blenderFiles/pulsethreeJS.gltf";
const output = process.argv[3] ?? "public/models/pulsethreeJS.glb";

// Textures that need their full resolution (close-up text, large wall and floor surfaces).
const HERO_TEXTURES = /Pages|Wall|Floor/;
const HERO_SIZE = 4096;
const DEFAULT_SIZE = 2048;
const HERO_QUALITY = 95;
const DEFAULT_QUALITY = 90;

await MeshoptEncoder.ready;

const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ "meshopt.encoder": MeshoptEncoder });

const document = await io.read(input);

await document.transform(
  dedup(),
  prune(),
  textureCompress({
    encoder: sharp,
    targetFormat: "webp",
    quality: HERO_QUALITY,
    resize: [HERO_SIZE, HERO_SIZE],
    pattern: HERO_TEXTURES,
  }),
  textureCompress({
    encoder: sharp,
    targetFormat: "webp",
    quality: DEFAULT_QUALITY,
    resize: [DEFAULT_SIZE, DEFAULT_SIZE],
    pattern: new RegExp(`^(?!.*(${HERO_TEXTURES.source}))`),
  }),
  meshopt({ encoder: MeshoptEncoder, level: "medium", quantizeTexcoord: 14 }),
);

await io.write(output, document);

const mb = (bytes) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;
console.log(`Wrote ${output} (${mb(statSync(output).size)})`);
