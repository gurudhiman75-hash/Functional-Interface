// Build the scheduled one-shot worker separately from the HTTP entrypoint.
// This is NOT run by the API at startup and has no setInterval pollers.
import { build } from "esbuild";
import esbuildPluginPino from "esbuild-plugin-pino";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
await build({
  entryPoints: [path.join(root, "src/cloud-run-background.ts")],
  outdir: path.join(root, "dist"),
  entryNames: "cloud-run-background",
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
