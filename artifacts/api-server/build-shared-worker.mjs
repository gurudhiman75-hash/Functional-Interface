// Build an explicit allowlist of isolated chapter entrypoints. Each chapter
// remains a separate worker bundle rather than importing the entire registry.
import { build } from "esbuild";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(here, "dist");
await mkdir(dist, { recursive: true });
for (const [entry, output] of [
  ["trg002-generation-worker.ts", "question-studio-trg002-worker.mjs"],
  ["num001-generation-worker.ts", "question-studio-num001-worker.mjs"],
]) {
  await build({
    entryPoints: [path.join(here, "src/question-studio", entry)],
    outfile: path.join(dist, output),
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
  console.info("[shared-studio-build] " + entry + " -> " + output);
}
