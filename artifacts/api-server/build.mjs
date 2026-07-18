import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { mkdir } from "node:fs/promises";
import { build } from "esbuild";

// Some dependencies resolve optional CommonJS modules at runtime.
globalThis.require = createRequire(import.meta.url);

const artifactDir = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(artifactDir, "dist");

await mkdir(distDir, { recursive: true });

await build({
  entryPoints: [path.resolve(artifactDir, "src/index.ts")],
  outfile: path.resolve(distDir, "index.mjs"),
  platform: "node",
  bundle: true,
  packages: "external",
  format: "esm",
  sourcemap: "linked",
  logLevel: "info",
  banner: {
    js: `import { createRequire as __bannerCrReq } from 'node:module';
import __bannerPath from 'node:path';
import __bannerUrl from 'node:url';

globalThis.require = __bannerCrReq(import.meta.url);
globalThis.__filename = __bannerUrl.fileURLToPath(import.meta.url);
globalThis.__dirname = __bannerPath.dirname(globalThis.__filename);`,
  },
});
