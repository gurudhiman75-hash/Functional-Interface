// Build the four-engine deterministic registry in an isolated worker bundle,
// not in the request-serving API. Package allowlisting comes from the registry.
import { build } from "esbuild";
import { mkdir, copyFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(here, "dist");
await mkdir(dist, { recursive: true });
await build({
  entryPoints: [path.resolve(here, "src/question-studio/universal-generation-worker.ts")],
  outfile: path.resolve(dist, "question-studio-universal-worker.mjs"),
  platform: "node",
  target: "node22",
  format: "esm",
  bundle: true,
  sourcemap: false,
  minify: false,
  logLevel: "info",
  external: ["*.node", "sharp", "better-sqlite3", "sqlite3", "canvas", "postgres"],
  banner: {
    js: "import { createRequire as __examtreeUniversalRequire } from 'node:module'; globalThis.require = __examtreeUniversalRequire(import.meta.url);",
  },
});
await copyFile(
  path.resolve(here, "universal-question-studio-worker-service.mjs"),
  path.resolve(dist, "universal-question-studio-worker-service.mjs"),
);
console.info("[universal-studio-build] four-engine isolated generation worker built");
