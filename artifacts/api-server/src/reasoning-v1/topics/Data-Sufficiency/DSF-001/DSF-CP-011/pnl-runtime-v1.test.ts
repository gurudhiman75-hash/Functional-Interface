import assert from "node:assert/strict";
import { SUFFICIENCY_CLASSES } from "../foundation/index.ts";
import {
  DSF_CP011_PNL_SOLVE_MODES,
  generateDsfCp011PnlBatch,
  normalizeDsfCp011PnlSurface,
} from "./pnl-runtime-v1.ts";

const questions = generateDsfCp011PnlBatch(Array.from({ length: 250 }, (_, seed) => seed));

assert.equal(questions.length, 250);
assert.deepEqual(new Set(questions.map((question) => question.canonicalAnswer)), new Set(SUFFICIENCY_CLASSES));
assert.deepEqual(new Set(questions.map((question) => question.solveModeId)), new Set(DSF_CP011_PNL_SOLVE_MODES));
assert.deepEqual(
  new Set(questions.map((question) => question.targetKind)),
  new Set([
    "SELLING_PRICE",
    "COST_PRICE",
    "PROFIT_LOSS_RATE",
    "DISCOUNT_SELLING_PRICE",
    "DISCOUNT_PERCENT",
    "MARKED_PRICE",
  ]),
);
assert.deepEqual(
  new Set(questions.map((question) => question.contextId)),
  new Set(["BOOKSHOP", "GARMENT_STORE", "ELECTRONICS_COUNTER", "FURNITURE_OUTLET", "SPORTS_SHOP", "STATIONERY_WHOLESALER"]),
);
assert.deepEqual(new Set(questions.map((question) => question.difficulty)), new Set(["Easy", "Medium", "Hard"]));
assert.deepEqual(new Set(questions.map((question) => question.sourceDomain)), new Set(["PROFIT_LOSS", "DISCOUNT"]));
assert.deepEqual(new Set(questions.map((question) => question.proof.sourceSolver)), new Set(["solveFundamental", "solveDiscount"]));

for (const question of questions) {
  assert.equal(question.packageId, "DSF-001");
  assert.equal(question.checkpointId, "DSF-CP-011");
  assert.equal(question.qlId, "DSF-QL-001");
  assert.equal(question.sourceChapterId, "PNL-001");
  assert.equal(question.answerContractId, "DS_STANDARD_5");
  assert.equal(question.options.length, 5);
  assert.equal(question.options.filter((option) => option.isCorrect).length, 1);
  assert.equal(question.options[question.correctIndex]?.semanticClass, question.canonicalAnswer);
  assert.equal(question.proof.canonicalArithmeticOwnedByDsf, false);
  assert(question.proof.statementIWorldCount > 0);
  assert(question.proof.statementIIWorldCount > 0);
  assert(question.proof.togetherWorldCount > 0);
  if (question.sourceDomain === "PROFIT_LOSS") {
    assert.equal(question.sourceCapability, "PNL-001/foundation/solver::solveFundamental");
    assert.equal(question.proof.sourceSolver, "solveFundamental");
    assert.equal(question.proof.baseWorldCount, 154);
    assert(["CP_RATE_TO_SP", "SP_RATE_TO_CP", "CP_SP_TO_RATE"].includes(question.proof.sourceTaskMode));
  } else {
    assert.equal(question.sourceCapability, "PNL-001/foundation/discount-solver::solveDiscount");
    assert.equal(question.proof.sourceSolver, "solveDiscount");
    assert.equal(question.proof.baseWorldCount, 104);
    assert(["MP_DISCOUNT_TO_SP", "MP_SP_TO_DISCOUNT", "SP_DISCOUNT_TO_MP"].includes(question.proof.sourceTaskMode));
  }
  assert.equal(question.lifecycle.contentStatus, "CP011_EXPANSION_REVIEW_CANDIDATE");
  assert.equal(question.lifecycle.questionStudioDiscoverable, false);
  assert.equal(question.lifecycle.questionBankWritable, false);
  assert.equal(question.lifecycle.testEligible, false);
  assert.equal(question.lifecycle.publiclyPublishable, false);
}

const generationIdentities = new Set(questions.map((question) => question.generationIdentity));
assert.equal(generationIdentities.size, questions.length, "PNL generation identities must remain unique");

const normalizedStems = new Set(questions.map((question) => normalizeDsfCp011PnlSurface(question.stem)));
assert(
  normalizedStems.size >= 20,
  `Expected at least 20 perceptually different PNL stem surfaces, found ${normalizedStems.size}`,
);

const structuralFingerprints = new Set(questions.map((question) => question.studentSurfaceFingerprint));
assert(
  structuralFingerprints.size >= 60,
  `Expected at least 60 distinct PNL student-facing structural fingerprints, found ${structuralFingerprints.size}`,
);

const fingerprintCounts = new Map<string, number>();
for (const question of questions) {
  fingerprintCounts.set(question.studentSurfaceFingerprint, (fingerprintCounts.get(question.studentSurfaceFingerprint) ?? 0) + 1);
}
const largestFingerprintCluster = Math.max(...fingerprintCounts.values());
assert(
  largestFingerprintCluster <= 10,
  `A single PNL student-facing structure repeated ${largestFingerprintCluster} times in a 250-question audit`,
);

const classCounts = Object.fromEntries(SUFFICIENCY_CLASSES.map((semanticClass) => [
  semanticClass,
  questions.filter((question) => question.canonicalAnswer === semanticClass).length,
]));

const solveModeCounts = Object.fromEntries(DSF_CP011_PNL_SOLVE_MODES.map((solveMode) => [
  solveMode,
  questions.filter((question) => question.solveModeId === solveMode).length,
]));

console.log(JSON.stringify({
  status: "PASS_DSF_CP011_PNL_BREADTH_AND_REALNESS_AUDIT",
  auditedQuestions: questions.length,
  sourceChapterId: "PNL-001",
  sourceSolvers: [...new Set(questions.map((question) => question.proof.sourceSolver))].sort(),
  solveModeCounts,
  contexts: [...new Set(questions.map((question) => question.contextId))].sort(),
  classCounts,
  normalizedStemCount: normalizedStems.size,
  structuralFingerprintCount: structuralFingerprints.size,
  largestFingerprintCluster,
  distinctGenerationIdentities: generationIdentities.size,
}, null, 2));
