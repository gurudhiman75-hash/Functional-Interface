import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import {
  buildProductionFreeze,
  FREEZE_TIMESTAMP,
  LOCALIZATION_CONTRACT_VERSION,
  PRODUCTION_FREEZE_VERSION,
  SEMANTIC_CONTRACT_VERSION,
  SVG_CONTRACT_VERSION,
} from "../production-freeze/freeze-production";
import { compareProductionGoldens } from "../production-freeze/compare-production-goldens";

const API_SERVER_DIR = fs.existsSync(
  path.join(process.cwd(), "artifacts/api-server/src/quant-v2"),
)
  ? path.join(process.cwd(), "artifacts/api-server")
  : process.cwd();
const FREEZE_DIR = path.join(API_SERVER_DIR, "src/quant-v2/production-freeze");
const GOLDEN_DIR = path.join(FREEZE_DIR, "goldens");

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function assertGoldenShape(samples: unknown[], expectedCount: number) {
  assert.equal(samples.length, expectedCount);
  for (const sample of samples as Array<Record<string, unknown>>) {
    assert.equal(typeof sample.question, "string");
    assert.equal(typeof sample.explanation, "string");
    assert.equal(typeof sample.signature, "string");
    assert.ok((sample.question as string).length > 10);
    assert.ok((sample.explanation as string).includes("="));
    assert.ok(sample.reasoningGraph);
    assert.ok(sample.semanticMetadata);
    assert.ok(sample.multilingualRendering);
    assert.ok(sample.metricMetadata);
  }
}

function assertSvgGoldenShape(samples: unknown[], expectedCount: number) {
  assert.equal(samples.length, expectedCount);
  for (const sample of samples as Array<Record<string, unknown>>) {
    const svg = sample.svgRendering as Record<string, unknown>;
    assert.equal(typeof sample.signature, "string");
    assert.equal(typeof svg.svg, "string");
    assert.equal(typeof svg.svgHash, "string");
    assert.ok((svg.svg as string).startsWith("<svg"));
    assert.ok((svg.svg as string).includes("</svg>"));
    assert.ok(Array.isArray(svg.nodeTypes));
  }
}

test("production multilingual freeze artifacts remain stable", () => {
  const built = buildProductionFreeze();
  const manifest = readJson<Record<string, unknown>>(
    path.join(FREEZE_DIR, "release-manifest.json"),
  );
  const validation = readJson<Record<string, unknown>>(
    path.join(FREEZE_DIR, "validation-report.json"),
  );
  const english = readJson<unknown[]>(
    path.join(GOLDEN_DIR, "elite-english-samples.json"),
  );
  const hindi = readJson<unknown[]>(
    path.join(GOLDEN_DIR, "elite-hindi-samples.json"),
  );
  const punjabi = readJson<unknown[]>(
    path.join(GOLDEN_DIR, "elite-punjabi-samples.json"),
  );
  const edge = readJson<unknown[]>(
    path.join(GOLDEN_DIR, "edge-case-topology-samples.json"),
  );
  const svg = readJson<unknown[]>(
    path.join(GOLDEN_DIR, "svg-visualization-samples.json"),
  );
  const multilingualSvg = readJson<unknown[]>(
    path.join(GOLDEN_DIR, "multilingual-svg-samples.json"),
  );
  const snapshotDoc = fs.readFileSync(
    path.join(FREEZE_DIR, "v1-production-multilingual-stable.md"),
    "utf8",
  );
  const rollbackDoc = fs.readFileSync(
    path.join(FREEZE_DIR, "rollback-and-recovery.md"),
    "utf8",
  );
  const extensionDoc = fs.readFileSync(
    path.join(FREEZE_DIR, "future-extension-contracts.md"),
    "utf8",
  );

  assert.equal(manifest.snapshotVersion, PRODUCTION_FREEZE_VERSION);
  assert.equal(manifest.semanticContractVersion, SEMANTIC_CONTRACT_VERSION);
  assert.equal(manifest.localizationContractVersion, LOCALIZATION_CONTRACT_VERSION);
  assert.equal(manifest.svgContractVersion, SVG_CONTRACT_VERSION);
  assert.equal(manifest.freezeTimestamp, FREEZE_TIMESTAMP);
  assert.deepEqual(manifest.supportedLanguages, ["en", "hi", "pa"]);

  assertGoldenShape(english, 200);
  assertGoldenShape(hindi, 200);
  assertGoldenShape(punjabi, 200);
  assertGoldenShape(edge, 100);
  assertSvgGoldenShape(svg, 100);
  assertSvgGoldenShape(multilingualSvg, 300);

  assert.deepEqual(
    (built.validationReport as { goldenCounts: Record<string, number> })
      .goldenCounts,
    (validation as { goldenCounts: Record<string, number> }).goldenCounts,
  );

  const validationStatus = validation.validationStatus as Record<string, boolean>;
  for (const key of [
    "semanticStability",
    "multilingualStability",
    "svgRendering",
    "metricCalibration",
    "pedagogicalContinuity",
    "equationPreservation",
    "regressionGoldens",
  ]) {
    assert.equal(validationStatus[key], true, key);
  }

  for (const term of [
    "Stable Semantic Contracts",
    "Stable Multilingual Contracts",
    "SVG Rendering Guarantees",
    "Future Extension Compatibility",
  ]) {
    assert.ok(snapshotDoc.includes(term), `${term} documented`);
  }
  assert.ok(rollbackDoc.includes("production:validate"));
  assert.ok(extensionDoc.includes("Future Indian Languages"));

  const comparison = compareProductionGoldens(FREEZE_DIR);
  assert.equal(comparison.valid, true, comparison.issues.join("; "));
});

export {};

