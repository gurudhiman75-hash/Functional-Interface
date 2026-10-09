import { execFile } from "node:child_process";
import { createRequire } from "node:module";
import { Worker } from "node:worker_threads";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { mkdir, rm } from "node:fs/promises";
import { promisify } from "node:util";
import { build as esbuild } from "esbuild";
import esbuildPluginPino from "esbuild-plugin-pino";

import { ensureCurrentAffairsFonts } from "./ensure-current-affairs-fonts.mjs";

globalThis.require = createRequire(import.meta.url);
const execFileAsync = promisify(execFile);

const artifactDir = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(artifactDir, "dist");

await mkdir(distDir, { recursive: true });

// CP-041: localized PDF rendering must never depend on whatever fonts happen
// to be installed on the Render host. Download the pinned Google Fonts assets,
// verify exact size + Git blob identity, retain their OFL licenses, then copy
// only verified bytes into the deployed API runtime beside dist/index.mjs.
await ensureCurrentAffairsFonts({
  copyToDir: path.join(distDir, "current-affairs-fonts"),
});

// Render uses this runtime-only builder, not build.mjs. Generate Question
// Studio discovery data in a short-lived child process so the live 512 MiB
// API can answer /capabilities without hydrating the generation graph.
const capabilitiesBuilderPath = path.resolve(
  distDir,
  "build-question-studio-capabilities-manifest.mjs",
);
const capabilitiesManifestPath = path.resolve(
  distDir,
  "question-studio-capabilities.json",
);
await esbuild({
  entryPoints: [
    path.resolve(
      artifactDir,
      "src/question-studio/build-question-studio-capabilities-manifest.ts",
    ),
  ],
  platform: "node",
  bundle: true,
  format: "esm",
  outfile: capabilitiesBuilderPath,
  logLevel: "info",
  sourcemap: false,
  external: [
    "*.node",
    "sharp",
    "better-sqlite3",
    "sqlite3",
    "canvas",
    "bcrypt",
    "argon2",
    "fsevents",
    "postgres",
  ],
});
try {
  await execFileAsync(process.execPath, [capabilitiesBuilderPath], {
    cwd: artifactDir,
    env: {
      ...process.env,
      QUESTION_STUDIO_CAPABILITIES_MANIFEST_OUT: capabilitiesManifestPath,
    },
    maxBuffer: 16 * 1024 * 1024,
  });
} finally {
  await rm(capabilitiesBuilderPath, { force: true });
}

// A separate ESM worker bundle keeps expensive TRG-002 authority imports
// entirely outside the live API/health-check event loop.
await esbuild({
  entryPoints: [path.resolve(artifactDir, "src/question-studio/trg002-generation-worker.ts")],
  platform: "node",
  bundle: true,
  format: "esm",
  outfile: path.resolve(distDir, "question-studio-trg002-worker.mjs"),
  logLevel: "info",
  sourcemap: false,
  external: ["*.node", "sharp", "better-sqlite3", "sqlite3", "canvas", "postgres"],
  banner: {
    js: `import { createRequire as __trgCrReq } from 'node:module';
globalThis.require = __trgCrReq(import.meta.url);`,
  },
});

// Smoke-test three questions in the compiled worker with the approved medium-difficulty chapter
// mix. This catches broken bundle paths and actual generator failures before
// a deployment can expose an unusable Generate button.
const workerSmoke = await new Promise((resolve, reject) => {
  const worker = new Worker(path.resolve(distDir, "question-studio-trg002-worker.mjs"), {
    workerData: {
      request: {
        engineId: "quant-v4",
        packageId: "TRG-002",
        exam: "SSC CGL Tier 1",
        subject: "Quantitative Aptitude",
        topic: "Advanced Mathematics",
        subtopic: "Trigonometry — Heights & Distances",
        language: "en",
        difficulty: "Medium",
        count: 3,
        seed: "trg002-build-worker-smoke-three-v1",
      },
      selectedCpIds: [],
      count: 3,
    },
  });
  let settled = false;
  const settle = (error, result) => {
    if (settled) return;
    settled = true;
    clearTimeout(timer);
    void worker.terminate();
    if (error) reject(error);
    else resolve(result);
  };
  const timer = setTimeout(() => settle(new Error("TRG-002 compiled worker smoke timed out")), 120_000);
  worker.once("message", (data) => {
    if (!data?.ok) {
      settle(new Error(data?.error?.message || "TRG-002 compiled worker smoke failed"));
      return;
    }
    settle(null, data.batch);
  });
  worker.once("error", (error) => settle(error));
  worker.once("exit", (code) => { if (code !== 0) settle(new Error("TRG-002 smoke worker exited " + code)); });
});
if (!workerSmoke || workerSmoke.questions?.length !== 3
    || workerSmoke.questions[0]?.packageId !== "TRG-002") {
  throw new Error("TRG-002 compiled worker produced an invalid smoke batch");
}
console.log("[render-build] TRG-002 off-thread Medium English generation smoke passed");

await esbuild({
  entryPoints: [path.resolve(artifactDir, "src/index.ts")],
  platform: "node",
  bundle: true,
  format: "esm",
  // Preserve dynamic-import boundaries as separate root-level chunks. This
  // keeps the large legacy Question Studio/generator graph out of API startup
  // memory while retaining the same routes when they are requested.
  splitting: true,
  chunkNames: "[name]-[hash]",
  // esbuild-plugin-pino adds transport/worker entry points. That makes this a
  // multi-entry build even though the application has one explicit entry.
  // Multi-entry esbuild builds must use outdir rather than outfile.
  outdir: distDir,
  entryNames: "[name]",
  outExtension: { ".js": ".mjs" },
  logLevel: "info",
  sourcemap: false,
  external: [
    "*.node",
    "sharp",
    "better-sqlite3",
    "sqlite3",
    "canvas",
    "bcrypt",
    "argon2",
    "fsevents",
    "re2",
    "farmhash",
    "xxhash-addon",
    "bufferutil",
    "utf-8-validate",
    "ssh2",
    "cpu-features",
    "dtrace-provider",
    "isolated-vm",
    "lightningcss",
    "pg-native",
    "oracledb",
    "mongodb-client-encryption",
    "nodemailer",
    "handlebars",
    "knex",
    "typeorm",
    "protobufjs",
    "onnxruntime-node",
    "@tensorflow/*",
    "@prisma/client",
    "@mikro-orm/*",
    "@grpc/*",
    "@swc/*",
    "@aws-sdk/*",
    "@azure/*",
    "@opentelemetry/*",
    "@google-cloud/*",
    "@google/*",
    "googleapis",
    "firebase-admin",
    "@parcel/watcher",
    "@sentry/profiling-node",
    "@tree-sitter/*",
    "aws-sdk",
    "classic-level",
    "dd-trace",
    "ffi-napi",
    "grpc",
    "hiredis",
    "kerberos",
    "leveldown",
    "miniflare",
    "mysql2",
    "newrelic",
    "odbc",
    "piscina",
    "realm",
    "ref-napi",
    "rocksdb",
    "sass-embedded",
    "sequelize",
    "serialport",
    "snappy",
    "tinypool",
    "usb",
    "workerd",
    "wrangler",
    "zeromq",
    "zeromq-prebuilt",
    "playwright",
    "puppeteer",
    "puppeteer-core",
    "electron",
    "drizzle-orm",
    "drizzle-orm/postgres-js",
    "drizzle-orm/pg-core",
    "postgres",
  ],
  plugins: [esbuildPluginPino({ transports: ["pino-pretty"] })],
  banner: {
    js: `import { createRequire as __bannerCrReq } from 'node:module';
import __bannerPath from 'node:path';
import __bannerUrl from 'node:url';

globalThis.require = __bannerCrReq(import.meta.url);
globalThis.__filename = __bannerUrl.fileURLToPath(import.meta.url);
globalThis.__dirname = __bannerPath.dirname(globalThis.__filename);`,
  },
});
