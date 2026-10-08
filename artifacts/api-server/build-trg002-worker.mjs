// Small, standalone Cloud Run build. Do not compile the student app, admin SPA,
// migrations, PDF assets, or the full API just to deploy generation compute.
import { build } from "esbuild";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(here, "dist");
await mkdir(dist, { recursive: true });
await build({
  entryPoints: [path.join(here, "src/question-studio/trg002-generation-worker.ts")],
  outfile: path.join(dist, "question-studio-trg002-worker.mjs"),
  platform: "node",
  target: "node22",
  bundle: true,
  format: "esm",
  sourcemap: false,
  minify: false,
  logLevel: "info",
  external: ["*.node", "sharp", "better-sqlite3", "sqlite3", "canvas", "postgres"],
  banner: {
    js: "import { createRequire as __workerRequire } from 'node:module'; globalThis.require = __workerRequire(import.meta.url);",
  },
});
console.log("[question-studio-worker-build] compiled TRG-002 generator only");
