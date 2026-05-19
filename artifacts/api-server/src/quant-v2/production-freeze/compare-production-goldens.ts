import fs from "node:fs";
import path from "node:path";
import { buildProductionFreeze, PRODUCTION_FREEZE_VERSION } from "./freeze-production";

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function compareArray(
  name: string,
  current: readonly Record<string, unknown>[],
  frozen: readonly Record<string, unknown>[],
) {
  const issues: string[] = [];
  if (current.length !== frozen.length) {
    issues.push(`${name}: count changed ${frozen.length} -> ${current.length}`);
  }
  const limit = Math.min(current.length, frozen.length);
  for (let index = 0; index < limit; index += 1) {
    const left = current[index]!;
    const right = frozen[index]!;
    for (const key of ["signature", "question", "explanation", "answer"]) {
      if (left[key] !== right[key]) {
        issues.push(`${name}[${index}].${key} changed`);
        break;
      }
    }
    const leftSvg = (left.svgRendering as Record<string, unknown> | undefined)?.svgHash;
    const rightSvg = (right.svgRendering as Record<string, unknown> | undefined)?.svgHash;
    if (leftSvg && rightSvg && leftSvg !== rightSvg) {
      issues.push(`${name}[${index}].svgHash changed`);
    }
  }
  return issues;
}

export function compareProductionGoldens(
  rootDir = path.join(process.cwd(), "src/quant-v2/production-freeze"),
) {
  const current = buildProductionFreeze();
  const goldenDir = path.join(rootDir, "goldens");
  const frozenManifest = readJson<Record<string, unknown>>(
    path.join(rootDir, "release-manifest.json"),
  );
  const issues = [
    ...compareArray(
      "english",
      current.goldens.english,
      readJson<Record<string, unknown>[]>(path.join(goldenDir, "elite-english-samples.json")),
    ),
    ...compareArray(
      "hindi",
      current.goldens.hindi,
      readJson<Record<string, unknown>[]>(path.join(goldenDir, "elite-hindi-samples.json")),
    ),
    ...compareArray(
      "punjabi",
      current.goldens.punjabi,
      readJson<Record<string, unknown>[]>(path.join(goldenDir, "elite-punjabi-samples.json")),
    ),
    ...compareArray(
      "edgeCases",
      current.goldens.edgeCases,
      readJson<Record<string, unknown>[]>(path.join(goldenDir, "edge-case-topology-samples.json")),
    ),
    ...compareArray(
      "svg",
      current.goldens.svg,
      readJson<Record<string, unknown>[]>(path.join(goldenDir, "svg-visualization-samples.json")),
    ),
    ...compareArray(
      "multilingualSvg",
      current.goldens.multilingualSvg,
      readJson<Record<string, unknown>[]>(path.join(goldenDir, "multilingual-svg-samples.json")),
    ),
  ];

  if (frozenManifest.snapshotVersion !== PRODUCTION_FREEZE_VERSION) {
    issues.push("release manifest snapshotVersion changed");
  }

  return {
    valid: issues.length === 0,
    issues,
    comparedVersion: PRODUCTION_FREEZE_VERSION,
  };
}

function main() {
  const result = compareProductionGoldens();
  console.log(JSON.stringify(result, null, 2));
  if (!result.valid) {
    process.exitCode = 1;
  }
}

const invokedPath = process.argv[1]?.replace(/\\/gu, "/") ?? "";
if (invokedPath.endsWith("production-compare.mjs") || invokedPath.endsWith("compare-production-goldens.mjs")) {
  main();
}

