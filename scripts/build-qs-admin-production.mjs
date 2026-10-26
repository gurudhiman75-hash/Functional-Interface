import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const adminDir = path.join(root, "artifacts", "admin-app");
const outputDir = path.join(root, "dist", "qs-admin-production");
const publicDir = path.join(outputDir, "public");
const adminBuildDir = path.join(adminDir, "dist", "public");

const adminRequire = createRequire(path.join(adminDir, "package.json"));
const apiRequire = createRequire(path.join(root, "artifacts", "api-server", "package.json"));
const vitePackage = adminRequire.resolve("vite/package.json");
const viteCli = path.join(path.dirname(vitePackage), "bin", "vite.js");
const esbuild = apiRequire("esbuild");

const envFile = await readFile(path.join(adminDir, ".env.production"), "utf8");
const firebaseProject = process.env.VITE_FIREBASE_PROJECT_ID ??
  envFile.match(/^VITE_FIREBASE_PROJECT_ID=(.*)$/m)?.[1]?.trim().replace(/^['"]|['"]$/g, "");
if (firebaseProject !== "sarbedutech") {
  throw new Error("Production admin build requires the existing sarbedutech Firebase public configuration.");
}

const result = spawnSync(process.execPath, [viteCli, "build"], {
  cwd: adminDir,
  env: {
    ...process.env,
    VITE_API_URL: "/api",
    VITE_QUESTION_STUDIO_ASYNC_PRODUCTION_CHAPTER: "true",
    VITE_QUESTION_STUDIO_ASYNC_STAGING: "false",
    EXAMTREE_RENDER_BUILD: "1",
  },
  stdio: "inherit",
});
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);

await rm(outputDir, { recursive: true, force: true });
await mkdir(path.join(publicDir, "admin"), { recursive: true });
await cp(adminBuildDir, path.join(publicDir, "admin"), { recursive: true });

const workerOut = path.join(outputDir, "worker.js");
await esbuild.build({
  entryPoints: [path.join(root, "ops", "qs-admin-pages", "worker.mjs")],
  outfile: workerOut,
  bundle: true,
  format: "esm",
  platform: "browser",
  target: "es2022",
  sourcemap: false,
});
await cp(workerOut, path.join(publicDir, "_worker.js"));
await rm(workerOut);

await writeFile(path.join(publicDir, "index.html"), `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=/admin/">
<meta name="robots" content="noindex,nofollow"><title>ExamTree Question Studio</title></head>
<body><a href="/admin/">Open Question Studio</a></body></html>
`);
console.log(`Production Question Studio Pages payload: ${publicDir}`);
console.log("Cloud Run API origin is fixed in the bundled router; staging async is disabled.");
