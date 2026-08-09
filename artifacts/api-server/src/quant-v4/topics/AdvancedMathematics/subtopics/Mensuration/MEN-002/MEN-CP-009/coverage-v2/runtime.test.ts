import assert from "node:assert/strict";
import {
  MEN_CP_009_EXPLICIT_SOLVE_MODE_DISPOSITION,
  MEN_CP_009_FROZEN_QLS_V2,
  MEN_CP_009_SURFACE_VOLUME_QLS,
  auditMenCp009CoverageV2,
} from "./registry";
import { buildMenCp009V2ReviewBatch } from "./review-batch";
import { generateMenCp009QuestionV2 } from "./runtime";

const audit = auditMenCp009CoverageV2();
assert.equal(audit.permanentQlCount, 28);
assert.equal(audit.baseQlCount, 24);
assert.equal(audit.coverageQlCount, 4);
assert.equal(audit.firstQlId, "MEN-002-QL-096");
assert.equal(audit.lastQlId, "MEN-002-QL-123");
assert.equal(audit.uniqueQlCount, 28);
assert.equal(audit.contiguousQlRange, true);
assert.equal(audit.explicitSolveModeCount, 8);
assert.equal(audit.uniqueExplicitSolveModeCount, 8);
assert.equal(audit.unresolvedExplicitSolveModeCount, 0);
assert.equal(audit.lifecycleLocked, true);

assert.equal(MEN_CP_009_EXPLICIT_SOLVE_MODE_DISPOSITION.length, 8);
assert.ok(
  MEN_CP_009_EXPLICIT_SOLVE_MODE_DISPOSITION.every(
    (row) =>
      row.disposition.startsWith("IMPLEMENTED") ||
      row.disposition.startsWith("REASSIGNED"),
  ),
);

const packages = MEN_CP_009_FROZEN_QLS_V2.flatMap((definition) =>
  Array.from({ length: 80 }, (_unused, index) =>
    generateMenCp009QuestionV2(definition.qlId, `proof-${index + 1}`),
  ),
);
assert.equal(packages.length, 2240);
assert.ok(packages.every((question) => question.validation.valid));
assert.ok(packages.every((question) => question.verification.valid));
assert.ok(packages.every((question) => question.options.length === 4));
assert.ok(
  packages.every(
    (question) =>
      new Set(question.options.map((option) => option.display)).size === 4,
  ),
);
assert.ok(
  packages.every(
    (question) =>
      question.options.filter((option) => option.isCorrect).length === 1,
  ),
);
assert.ok(
  packages.every(
    (question) =>
      !question.questionStudioDiscoverable &&
      question.questionBankStatus === "NOT_STORED" &&
      question.testEligibility === "INELIGIBLE" &&
      !question.publiclyPublishable,
  ),
);

for (const definition of MEN_CP_009_FROZEN_QLS_V2) {
  const familyPackages = packages.filter(
    (question) => question.permanentQlId === definition.qlId,
  );
  assert.equal(familyPackages.length, 80);
  assert.deepEqual(
    new Set(familyPackages.map((question) => question.correctIndex)),
    new Set([0, 1, 2, 3]),
  );
}

const coveragePackages = packages.filter((question) =>
  MEN_CP_009_SURFACE_VOLUME_QLS.some(
    (definition) => definition.qlId === question.permanentQlId,
  ),
);
assert.equal(coveragePackages.length, 320);
assert.ok(
  coveragePackages.every(
    (question) =>
      "explanation" in question &&
      "optionAnalysis" in question.explanation &&
      question.explanation.optionAnalysis.length === 3,
  ),
);
assert.ok(
  coveragePackages.every(
    (question) =>
      question.diagram.responsive && question.diagram.minWidthPx === 0,
  ),
);

const review = buildMenCp009V2ReviewBatch();
assert.equal(review.rows.length, 112);
assert.deepEqual(review.answerPositions, { A: 28, B: 28, C: 28, D: 28 });
assert.equal(review.uniqueStems, 112);
assert.equal(review.uniqueStemOptionPackages, 112);
assert.ok(review.rows.every((question) => question.validation.valid));
assert.ok(review.rows.every((question) => question.verification.valid));

const deterministicA = generateMenCp009QuestionV2(
  "MEN-002-QL-120",
  "deterministic-proof",
);
const deterministicB = generateMenCp009QuestionV2(
  "MEN-002-QL-120",
  "deterministic-proof",
);
assert.deepEqual(deterministicA, deterministicB);

console.log(
  JSON.stringify(
    {
      authority: audit.authority,
      permanentQlCount: audit.permanentQlCount,
      explicitSolveModesDispositioned: audit.explicitSolveModeCount,
      unresolvedExplicitSolveModes: audit.unresolvedExplicitSolveModeCount,
      deterministicPackages: packages.length,
      validPackages: packages.filter((question) => question.validation.valid).length,
      surfaceVolumePackages: coveragePackages.length,
      reviewRecords: review.rows.length,
      uniqueReviewStems: review.uniqueStems,
      answerPositions: review.answerPositions,
      lifecycle: "ACTIVATION_LOCKED",
    },
    null,
    2,
  ),
);
