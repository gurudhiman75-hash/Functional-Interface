import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import {
  buildStabilitySnapshot,
  SEMANTIC_CONTRACT_VERSION,
  STABILITY_VERSION,
} from "../stability/freeze-english-core";

const API_SERVER_DIR = fs.existsSync(
  path.join(process.cwd(), "artifacts/api-server/src/quant-v2"),
)
  ? path.join(process.cwd(), "artifacts/api-server")
  : process.cwd();
const STABILITY_DIR = path.join(API_SERVER_DIR, "src/quant-v2/stability");
const SAMPLE_DIR = path.join(STABILITY_DIR, "reference-samples");

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function assertSampleIntegrity(samples: unknown[], expectedCount: number) {
  assert.equal(samples.length, expectedCount);
  for (const sample of samples as Array<Record<string, unknown>>) {
    assert.equal(typeof sample.stem, "string");
    assert.equal(typeof sample.explanation, "string");
    assert.equal(typeof sample.signature, "string");
    assert.ok(!/(?:^|[|_])-\d|ans=-/u.test(String(sample.signature)));
    assert.ok((sample.stem as string).length > 20);
    assert.ok((sample.explanation as string).includes("="));
    assert.equal(
      (sample.semantic as { semanticContractVersion: string })
        .semanticContractVersion,
      SEMANTIC_CONTRACT_VERSION,
    );
    assert.equal(
      (sample.semantic as { signatureSafe: boolean }).signatureSafe,
      true,
    );
  }
}

test("stability snapshot exports and manifest remain consistent", () => {
  const built = buildStabilitySnapshot();
  const manifest = readJson<Record<string, unknown>>(
    path.join(STABILITY_DIR, "stability-manifest.json"),
  );
  const elite = readJson<unknown[]>(
    path.join(SAMPLE_DIR, "elite-samples.json"),
  );
  const average = readJson<unknown[]>(
    path.join(SAMPLE_DIR, "average-samples.json"),
  );
  const edge = readJson<unknown[]>(
    path.join(SAMPLE_DIR, "edge-case-samples.json"),
  );
  const document = fs.readFileSync(
    path.join(STABILITY_DIR, "v1-english-stability-snapshot.md"),
    "utf8",
  );
  const freezeReport = fs.readFileSync(
    path.join(STABILITY_DIR, "freeze-report.md"),
    "utf8",
  );

  assert.equal(manifest.snapshotVersion, STABILITY_VERSION);
  assert.equal(manifest.semanticContractVersion, SEMANTIC_CONTRACT_VERSION);
  assert.deepEqual(
    manifest.referenceSampleCounts,
    {
      elite: 100,
      average: 100,
      edge: 50,
      total: 250,
    },
  );
  assert.deepEqual(
    manifest.referenceSampleCounts,
    built.manifest.referenceSampleCounts,
  );

  assertSampleIntegrity(elite, 100);
  assertSampleIntegrity(average, 100);
  assertSampleIntegrity(edge, 50);

  const validatorCoverage = manifest.validatorCoverage as Record<string, boolean>;
  for (const key of [
    "canonical",
    "reasoningGraph",
    "semanticStability",
    "presentationPolish",
    "metricCalibration",
  ]) {
    assert.equal(validatorCoverage[key], true, `${key} coverage`);
  }

  for (const contractTerm of [
    "PercentageValue",
    "AbsoluteValue",
    "CountValue",
    "CurrencyValue",
    "RatioValue",
    "Multilingual Compatibility Guarantees",
  ]) {
    assert.ok(document.includes(contractTerm), `${contractTerm} documented`);
  }

  assert.ok(freezeReport.includes("V1 English Core Freeze Report"));
  assert.ok(freezeReport.includes("git tag v1-english-core-stable"));
});

export {};
