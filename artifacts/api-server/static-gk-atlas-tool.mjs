import { spawnSync } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const root = path.dirname(fileURLToPath(import.meta.url));
const srcRoot = path.join(root, "src", "static-gk-visual-atlas");
const outRoot = path.join(root, "dist", "static-gk-visual-atlas-tools");

const TOOLS = {
  normalize: "devtools/normalize-admin-geojson.ts",
  receipt: "devtools/build-admin-ingest-receipt.ts",
  validate: "devtools/validate-admin-ingest.ts",
  "export-tropic-scene": "devtools/export-tropic-scene.ts",
  "export-tropic-contact-sheet": "devtools/export-tropic-contact-sheet.ts",
  "export-standard-meridian-contact-sheet": "devtools/export-standard-meridian-contact-sheet.ts",
};

const TESTS = [
  "tests/lesson-manifests.test.ts",
  "tests/tropic-cancer-compiler.test.ts",
  "tests/standard-meridian-compiler.test.ts",
  "tests/tropic-svg-renderer.test.ts",
  "tests/standard-meridian-svg-renderer.test.ts",
];

async function bundle(entryRelative, outputName) {
  await mkdir(outRoot, { recursive: true });
  const outfile = path.join(outRoot, `${outputName}.mjs`);
  await build({
    entryPoints: [path.join(srcRoot, entryRelative)],
    outfile,
    bundle: true,
    platform: "node",
    format: "esm",
    target: "node22",
    sourcemap: false,
    logLevel: "warning",
  });
  return outfile;
}

function runNode(args) {
  const result = spawnSync(process.execPath, args, { cwd: root, stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exitCode = result.status ?? 1;
}

async function runTests() {
  const outputs = [];
  for (const testPath of TESTS) {
    const outputName = path.basename(testPath, ".ts");
    outputs.push(await bundle(testPath, outputName));
  }
  runNode(["--test", ...outputs]);
}

async function main() {
  const [, , command, ...args] = process.argv;
  if (!command) {
    throw new Error(
      `Usage: node static-gk-atlas-tool.mjs <${[...Object.keys(TOOLS), "test"].join("|")}> [arguments...]`,
    );
  }
  if (command === "test") {
    await runTests();
    return;
  }
  const entry = TOOLS[command];
  if (!entry) throw new Error(`Unknown Static GK Visual Atlas tool: ${command}`);
  const outfile = await bundle(entry, command);
  runNode([outfile, ...args]);
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`[static-gk-visual-atlas] tool runner failed: ${message}\n`);
  process.exitCode = 1;
});
