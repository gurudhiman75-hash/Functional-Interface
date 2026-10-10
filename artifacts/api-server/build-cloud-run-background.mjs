// Build the scheduled one-shot worker separately from the HTTP entrypoint.
// This is NOT run by the API at startup and has no setInterval pollers.
import { createRequire } from "node:module";
import { build } from "esbuild";
import esbuildPluginPino from "esbuild-plugin-pino";
import path from "node:path";
import { fileURLToPath } from "node:url";

// esbuild-plugin-pino 2.x uses require() in its setup callback while this
// build script itself is ESM. Match the proven production build-runtime.mjs
// compatibility setup BEFORE invoking esbuild, not only in the output banner.
globalThis.require = createRequire(import.meta.url);

const root = path.dirname(fileURLToPath(import.meta.url));
await build({
  entryPoints: [path.join(root, "src/cloud-run-background.ts")],
  outdir: path.join(root, "dist"),
  // esbuild-plugin-pino appends its own transport/worker entry points.
  // A constant name makes all of those entries collide with our worker.
  // Keep the source worker output cloud-run-background.mjs while giving
  // plugin-supplied entries unique names, as in build-runtime.mjs.
  entryNames: "[name]",
  chunkNames: "background-[name]-[hash]",
  format: "esm",
  outExtension: { ".js": ".mjs" },
  platform: "node",
  target: "node22",
  bundle: true,
  splitting: true,
  logLevel: "info",
  sourcemap: false,
  external: [
    "*.node", "firebase-admin", "postgres", "drizzle-orm", "drizzle-orm/postgres-js",
    "drizzle-orm/pg-core", "bcrypt", "argon2", "sharp",
  ],
  plugins: [esbuildPluginPino({ transports: ["pino-pretty"] })],
  banner: {
    js: "import { createRequire as __require } from 'node:module'; globalThis.require = __require(import.meta.url);",
  },
});
