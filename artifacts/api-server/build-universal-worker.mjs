// Build the four-engine deterministic registry in an isolated worker bundle,
// not in the request-serving API. Package allowlisting comes from the registry.
import { build } from "esbuild";
import { mkdir, copyFile, rm } from "node:fs/promises";
import {execFile} from "node:child_process";
import {promisify} from "node:util";
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
await copyFile(
  path.resolve(here, "production-canary-worker-scope.mjs"),
  path.resolve(dist, "production-canary-worker-scope.mjs"),
);
await copyFile(path.resolve(here,"prod-worker-review-scope.mjs"),path.resolve(dist,"prod-worker-review-scope.mjs"));
// Generate the same immutable canonical eligibility manifest as the receiver.
// Production worker independently rejects unsafe or unknown chapter requests.
const manifestBuilder=path.resolve(dist,"qs-worker-chapter-capabilities-builder.mjs");
await build({
  entryPoints:[path.resolve(here,"src/question-studio/build-async-task-capabilities-manifest.ts")],
  bundle:true,platform:"node",format:"esm",outfile:manifestBuilder,logLevel:"info",
  external:["*.node","sharp","better-sqlite3","sqlite3","canvas","postgres"],
});
try {
  await promisify(execFile)(process.execPath,[manifestBuilder],{
    cwd:here,
    env:{...process.env,QUESTION_STUDIO_CAPABILITIES_MANIFEST_OUT:
      path.resolve(dist,"question-studio-capabilities.json")},
    maxBuffer:16*1024*1024,
  });
} finally { await rm(manifestBuilder,{force:true}); }
await copyFile(path.resolve(here,"src/question-studio/prod-chapter-review-policy.mjs"),
               path.resolve(dist,"prod-chapter-review-policy.mjs"));
await copyFile(path.resolve(here,"src/question-studio/prod-chapter-review-runtime.mjs"),
               path.resolve(dist,"prod-chapter-review-runtime.mjs"));
console.info("[universal-studio-build] four-engine isolated generation worker built");
