import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { routeExplanationExecution } from "../../../../../../common/eev2/routing";
import { instantiatePct001QuestionDefinition } from "../question-definitions/resolver";
import { QUESTION_PACKAGE_ASSET_FILES, loadQuestionPackage } from "./loader";
import { validateQuestionPackage } from "./package-validator";
import { buildQuestionPackageReport } from "./question-package-report";
import { PCT_001_QUESTION_PACKAGE_REGISTRY } from "./registry";
import {
  QuestionPackageNotReadyError,
  resolveQuestionPackage,
} from "./resolver";

const PACKAGE_ROOT = resolve(
  process.cwd(),
  "artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-001/question-packages",
);

assert.equal(PCT_001_QUESTION_PACKAGE_REGISTRY.length, 40);
assert.equal(
  new Set(
    PCT_001_QUESTION_PACKAGE_REGISTRY.map(
      (metadata) => metadata.questionId,
    ),
  ).size,
  40,
);

for (const metadata of PCT_001_QUESTION_PACKAGE_REGISTRY) {
  assert.equal(metadata.status, "PLACEHOLDER");
  assert.equal(metadata.version, "0.0.0");
  assert.equal(metadata.canonicalProblemId, "PCT-CP-002");
  assert.equal(metadata.taskKind, "percentOfKnownNumber");
  assert.ok(
    Object.values(metadata.ownership).every((owner) =>
      owner.startsWith("HUMAN"),
    ),
  );

  const packageDirectory = resolve(PACKAGE_ROOT, metadata.questionId);
  await access(resolve(packageDirectory, "metadata.ts"));
  for (const filename of Object.values(QUESTION_PACKAGE_ASSET_FILES)) {
    const path = resolve(packageDirectory, filename);
    await access(path);
    assert.equal(
      (await readFile(path, "utf8")).trim(),
      "",
      `${metadata.questionId}/${filename} must remain empty`,
    );
  }

  const first = await loadQuestionPackage(metadata, PACKAGE_ROOT);
  const second = await loadQuestionPackage(metadata, PACKAGE_ROOT);
  assert.deepEqual(first, second);
  const validation = validateQuestionPackage(first);
  assert.equal(validation.valid, false);
  assert.equal(validation.generationReady, false);
  assert.equal(
    validation.failures.filter((failure) => failure.code === "EMPTY_ASSET")
      .length,
    7,
  );
  assert.equal(
    validation.failures.filter(
      (failure) => failure.code === "UNAPPROVED_STATUS",
    ).length,
    1,
  );
  await assert.rejects(
    () => resolveQuestionPackage(metadata.questionId, PACKAGE_ROOT),
    (error: unknown) =>
      error instanceof QuestionPackageNotReadyError &&
      error.questionId === metadata.questionId &&
      error.failureCodes.includes("EMPTY_ASSET:stem"),
  );
}

const missingRootPackage = await loadQuestionPackage(
  PCT_001_QUESTION_PACKAGE_REGISTRY[0]!,
  resolve(PACKAGE_ROOT, "does-not-exist"),
);
assert.equal(
  validateQuestionPackage(missingRootPackage).failures.filter(
    (failure) => failure.code === "MISSING_ASSET",
  ).length,
  7,
);

const report = await buildQuestionPackageReport(PACKAGE_ROOT);
assert.equal(report.packageCount, 40);
assert.equal(report.registeredPackages.length, 40);
assert.equal(report.incompletePackages.length, 40);
assert.equal(report.generationReadyPackages.length, 0);
assert.equal(report.statusSummary.PLACEHOLDER, 40);
assert.ok(Object.values(report.assetCoverage).every((count) => count === 0));
assert.ok(
  Object.values(report.missingAssetSummary).every((count) => count === 40),
);
assert.equal(report.fallbackWordingAvailable, false);
assert.equal(report.productionWiring, "NONE");

const baseline = instantiatePct001QuestionDefinition("Q001", "CONTENT-002A");
const repeated = instantiatePct001QuestionDefinition("Q001", "CONTENT-002A");
assert.deepEqual(baseline, repeated);
assert.ok(baseline.validations.every((validation) => validation.valid));
assert.equal(
  baseline.solver.educationalEvidence!.derivedValues.targetQuantity,
  baseline.solver.numericAnswer,
);

const shadow = await routeExplanationExecution(
  {
    mode: "shadow",
    input: baseline.parameters.questionId,
    comparisonTimestamp: "2026-06-22T00:00:00.000Z",
  },
  {
    executeV1() {
      return {
        engine: "v1",
        authoritativeRepresentation: "lines",
        output: { lines: ["legacy"] },
        answer: String(baseline.solver.numericAnswer),
        explanationLines: ["legacy"],
        deterministicIdentity: `${baseline.parameters.questionId}:v1`,
        engineVersion: "teacher-renderer-v1",
        locale: "en",
        detailMode: baseline.plan.detailMode,
        validation: { status: "passed", failureCodes: [] },
      };
    },
    executeV2() {
      return {
        engine: "v2",
        authoritativeRepresentation: "blocks",
        output: { blocks: baseline.blocks, lines: baseline.lines },
        answer: String(baseline.solver.numericAnswer),
        explanationLines: baseline.lines,
        blocks: baseline.blocks,
        deterministicIdentity: `${baseline.parameters.questionId}:v2`,
        engineVersion: "eev2-unit-value-v1",
        locale: "en",
        detailMode: baseline.plan.detailMode,
        validation: { status: "passed", failureCodes: [] },
      };
    },
  },
);
assert.equal(shadow.mode, "shadow");
assert.equal(shadow.shadow.comparison.mathematicalParity, true);
assert.equal(shadow.shadow.comparison.failureStatus.v2, "none");

console.log(
  `CONTENT-002A passed: ${report.packageCount} packages registered, ` +
    `${report.incompletePackages.length} safely incomplete, zero fallbacks.`,
);

