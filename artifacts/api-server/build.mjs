import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build as esbuild } from "esbuild";
import esbuildPluginPino from "esbuild-plugin-pino";
import { access, mkdir, readFile, writeFile } from "node:fs/promises";

// Plugins (e.g. 'esbuild-plugin-pino') may use `require` to resolve dependencies
globalThis.require = createRequire(import.meta.url);

const artifactDir = path.dirname(fileURLToPath(import.meta.url));

async function buildAll() {
  const distDir = path.resolve(artifactDir, "dist");
  // Avoid deleting the whole output directory on Windows during dev restarts.
  // The previous server process can briefly keep dist files open, which makes
  // `rmdir dist` flaky under nodemon even though esbuild can safely overwrite.
  await mkdir(distDir, { recursive: true });

  const commonConfig = {
    platform: "node",
    bundle: true,
    format: "esm",
    outdir: distDir,
    outExtension: { ".js": ".mjs" },
    logLevel: "info",
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
    sourcemap: "linked",
    plugins: [
      esbuildPluginPino({ transports: ["pino-pretty"] })
    ],
    banner: {
      js: `import { createRequire as __bannerCrReq } from 'node:module';
import __bannerPath from 'node:path';
import __bannerUrl from 'node:url';

globalThis.require = __bannerCrReq(import.meta.url);
globalThis.__filename = __bannerUrl.fileURLToPath(import.meta.url);
globalThis.__dirname = __bannerPath.dirname(globalThis.__filename);
    `,
    },
  };

  // Build main API server
  await esbuild({
    ...commonConfig,
    entryPoints: [path.resolve(artifactDir, "src/index.ts")],
  });

  // Render only runs dist/index.mjs. Validation harnesses and migration tools
  // are intentionally excluded from the constrained production build; their
  // normal local/CI build remains unchanged.
  if (process.env.API_PRODUCTION_ONLY === "1") {
    return;
  }

  // Build db:migrate script
  await esbuild({
    ...commonConfig,
    entryPoints: [path.resolve(artifactDir, "migrate.ts")],
  });

  // Build db:seed script
  await esbuild({
    ...commonConfig,
    entryPoints: [path.resolve(artifactDir, "src/db-init.ts")],
  });

  // Build db:reset script
  await esbuild({
    ...commonConfig,
    entryPoints: [path.resolve(artifactDir, "src/db-reset.ts")],
  });

  // Build db-seed script (legacy alias)
  await esbuild({
    ...commonConfig,
    entryPoints: [path.resolve(artifactDir, "src/db-seed.ts")],
  });

  // Build normalize-questions script
  await esbuild({
    ...commonConfig,
    entryPoints: [path.resolve(artifactDir, "normalize-questions.ts")],
  });

  // Build check-normalization script
  await esbuild({
    ...commonConfig,
    entryPoints: [path.resolve(artifactDir, "check-normalization.ts")],
  });

  // Build populate-global-topics migration script
  await esbuild({
    ...commonConfig,
    entryPoints: [path.resolve(artifactDir, "populate-global-topics.ts")],
  });

  // Build check-schema-drift script
  await esbuild({
    ...commonConfig,
    entryPoints: [path.resolve(artifactDir, "check-schema-drift.ts")],
  });

  // Build seed-english-topics script
  await esbuild({
    ...commonConfig,
    entryPoints: [path.resolve(artifactDir, "seed-english-topics.ts")],
  });

  // Build seating generation validator
  await esbuild({
    ...commonConfig,
    entryPoints: [path.resolve(artifactDir, "validate-seating-generation.ts")],
  });

  // Build seating orientation validator
  await esbuild({
    ...commonConfig,
    entryPoints: [path.resolve(artifactDir, "validate-seating-orientation.ts")],
  });

  // Build seeded generation validator
  await esbuild({
    ...commonConfig,
    entryPoints: [path.resolve(artifactDir, "validate-seeded-generation.ts")],
  });

  // Build reasoning stress test harness
  await esbuild({
    ...commonConfig,
    entryPoints: [path.resolve(artifactDir, "stress-test-reasoning.ts")],
  });

  // Build NS-FRACDEC-001 runtime test harness
  await esbuild({
    ...commonConfig,
    entryPoints: [path.resolve(artifactDir, "src/quant-v3/tests/ns-fracdec-001.test.ts")],
    outdir: path.resolve(distDir, "quant-v3"),
    entryNames: "[name]",
  });

  // Build NS-EXP-001 runtime test harness
  await esbuild({
    ...commonConfig,
    entryPoints: [path.resolve(artifactDir, "src/quant-v3/tests/ns-exp-001.test.ts")],
    outdir: path.resolve(distDir, "quant-v3"),
    entryNames: "[name]",
  });

  // Build NS-CLASS-001 runtime test harness
    await esbuild({
      ...commonConfig,
      entryPoints: [path.resolve(artifactDir, "src/quant-v3/tests/ns-class-001.test.ts")],
      outdir: path.resolve(distDir, "quant-v3"),
      entryNames: "[name]",
    });

    // Build NS-SURD-001 runtime test harness
    await esbuild({
      ...commonConfig,
      entryPoints: [path.resolve(artifactDir, "src/quant-v3/tests/ns-surd-001.test.ts")],
      outdir: path.resolve(distDir, "quant-v3"),
      entryNames: "[name]",
    });
    const nsSurdSourceDir = path.resolve(artifactDir, "src/quant-v3/topics/NumberSystem/subtopics/SurdsAndRationalization/NS-SURD-001");
    const nsSurdDistDir = path.resolve(distDir, "quant-v3");
    for (const fileName of [
      "question-language.library.json",
      "explanation.library.json",
      "variable-ranges.library.json",
      "coverage-targets.library.json",
      "distribution-targets.library.json",
    ]) {
      const raw = await readFile(path.join(nsSurdSourceDir, fileName), "utf8");
      await writeFile(path.join(nsSurdDistDir, fileName), raw.replace(/^\uFEFF/, ""), "utf8");
    }

    const simplSourceDir = path.resolve(artifactDir, "src/quant-v3/topics/SimplificationAndApproximation/SIMPL-001");
    const simplTestPath = path.resolve(artifactDir, "src/quant-v3/tests/simpl-001.test.ts");
    const simplPackageExists = await access(simplSourceDir).then(() => true, () => false);
    if (simplPackageExists) {
      // Build SIMPL-001 runtime test harness
      await esbuild({
        ...commonConfig,
        entryPoints: [simplTestPath],
        outdir: path.resolve(distDir, "quant-v3"),
        entryNames: "[name]",
      });
      const simplDistDir = path.resolve(distDir, "quant-v3");
      for (const fileName of [
        "question-language.library.json",
        "explanation.library.json",
        "variable-ranges.library.json",
        "coverage-targets.library.json",
        "distribution-targets.library.json",
      ]) {
        const raw = await readFile(path.join(simplSourceDir, fileName), "utf8");
        await writeFile(path.join(simplDistDir, fileName), raw.replace(/^\uFEFF/, ""), "utf8");
      }
    }

    const pct001SourceDir = path.resolve(artifactDir, "src/quant-v3/topics/Percentage/subtopics/PercentageFundamentals/PCT-001");
    if (await access(pct001SourceDir).then(() => true, () => false)) {
      // Build PCT-001 runtime test harness
      await esbuild({
        ...commonConfig,
        entryPoints: [path.resolve(artifactDir, "src/quant-v3/tests/pct-001.test.ts")],
        outdir: path.resolve(distDir, "quant-v3"),
        entryNames: "[name]",
      });
      const pct001DistDir = path.resolve(distDir, "quant-v3");
      for (const fileName of [
        "question-language.library.json",
        "explanation.library.json",
        "variable-ranges.library.json",
        "coverage-targets.library.json",
        "distribution-targets.library.json",
      ]) {
        const raw = await readFile(path.join(pct001SourceDir, fileName), "utf8");
        await writeFile(path.join(pct001DistDir, fileName), raw.replace(/^\uFEFF/, ""), "utf8");
      }
    }

    const pct002SourceDir = path.resolve(artifactDir, "src/quant-v3/topics/Percentage/subtopics/PercentageChange/PCT-002");
    if (await access(pct002SourceDir).then(() => true, () => false)) {
      // Build PCT-002 runtime test harness
      await esbuild({
        ...commonConfig,
        entryPoints: [path.resolve(artifactDir, "src/quant-v3/tests/pct-002.test.ts")],
        outdir: path.resolve(distDir, "quant-v3"),
        entryNames: "[name]",
      });
      const pct002DistDir = path.resolve(distDir, "quant-v3");
      for (const fileName of [
        "question-language.library.json",
        "explanation.library.json",
        "variable-ranges.library.json",
        "coverage-targets.library.json",
        "distribution-targets.library.json",
      ]) {
        const raw = await readFile(path.join(pct002SourceDir, fileName), "utf8");
        await writeFile(path.join(pct002DistDir, fileName), raw.replace(/^\uFEFF/, ""), "utf8");
      }
    }

    const pct004SourceDir = path.resolve(artifactDir, "src/quant-v3/topics/Percentage/subtopics/PercentageWordProblems/PCT-004");
    if (await access(pct004SourceDir).then(() => true, () => false)) {
      // Build PCT-004 runtime test harness
      await esbuild({
        ...commonConfig,
        entryPoints: [path.resolve(artifactDir, "src/quant-v3/tests/pct-004.test.ts")],
        outdir: path.resolve(distDir, "quant-v3"),
        entryNames: "[name]",
      });
      const pct004DistDir = path.resolve(distDir, "quant-v3");
      for (const fileName of [
        "question-language.library.json",
        "explanation.library.json",
        "variable-ranges.library.json",
        "coverage-targets.library.json",
        "distribution-targets.library.json",
        "library-authority-map.md",
      ]) {
        const raw = await readFile(path.join(pct004SourceDir, fileName), "utf8");
        await writeFile(path.join(pct004DistDir, fileName), raw.replace(/^\uFEFF/, ""), "utf8");
      }
    }
  }

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
