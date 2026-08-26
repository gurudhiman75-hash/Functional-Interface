import assert from "node:assert/strict";
import { SUFFICIENCY_CLASSES } from "../foundation/index.ts";
import {
  DSF_CP011_INTEREST_SOLVE_MODES,
  generateDsfCp011InterestBatch,
  normalizeDsfCp011InterestSurface,
} from "./interest-runtime-v1.ts";

const questions = generateDsfCp011InterestBatch(Array.from({ length: 250 }, (_, seed) => seed));

assert.equal(questions.length, 250);
assert.deepEqual(new Set(questions.map((question) => question.canonicalAnswer)), new Set(SUFFICIENCY_CLASSES));
assert.deepEqual(new Set(questions.map((question) => question.solveModeId)), new Set(DSF_CP011_INTEREST_SOLVE_MODES));
assert.deepEqual(
  new Set(questions.map((question) => question.targetKind)),
  new Set(["SIMPLE_INTEREST", "COMPOUND_INTEREST", "COMPOUND_AMOUNT", "CI_MINUS_SI"]),
);
assert.deepEqual(
  new Set(questions.map((question) => question.contextId)),
  new Set(["BANK_DEPOSIT", "POST_OFFICE_SCHEME", "COOPERATIVE_DEPOSIT", "SAVINGS_PLAN", "EDUCATION_FUND", "BUSINESS_RESERVE"]),
);
assert.deepEqual(new Set(questions.map((question) => question.difficulty)), new Set(["Easy", "Medium", "Hard"]));
assert.deepEqual(
  new Set(questions.map((question) => question.proof.sourceSolver)),
  new Set(["simpleInterest", "compoundInterest", "compoundAmount", "siCiDifference"]),
);

for (const question of questions) {
  assert.equal(question.packageId, "DSF-001");
  assert.equal(question.checkpointId, "DSF-CP-011");
  assert.equal(question.qlId, "DSF-QL-001");
  assert.equal(question.sourceChapterId, "INT-001");
  assert.equal(question.sourceDomain, "SIMPLE_COMPOUND_INTEREST");
  assert.equal(question.sourceCapability, "INT-001/cp006-si-ci-relations-runtime-v1");
  assert.equal(question.answerContractId, "DS_STANDARD_5");
  assert.equal(question.options.length, 5);
  assert.equal(question.options.filter((option) => option.isCorrect).length, 1);
  assert.equal(question.options[question.correctIndex]?.semanticClass, question.canonicalAnswer);
  assert.equal(question.proof.baseWorldCount, 120);
  assert.equal(question.proof.canonicalArithmeticOwnedByDsf, false);
  assert(question.proof.statementIWorldCount > 0);
  assert(question.proof.statementIIWorldCount > 0);
  assert(question.proof.togetherWorldCount > 0);
  assert.equal(question.lifecycle.contentStatus, "CP011_EXPANSION_REVIEW_CANDIDATE");
  assert.equal(question.lifecycle.questionStudioDiscoverable, false);
  assert.equal(question.lifecycle.questionBankWritable, false);
  assert.equal(question.lifecycle.testEligible, false);
  assert.equal(question.lifecycle.publiclyPublishable, false);
}

const generationIdentities = new Set(questions.map((question) => question.generationIdentity));
assert.equal(generationIdentities.size, questions.length, "Interest generation identities must remain unique");

const normalizedStems = new Set(questions.map((question) => normalizeDsfCp011InterestSurface(question.stem)));
assert(
  normalizedStems.size >= 20,
  `Expected at least 20 perceptually different Interest stem surfaces, found ${normalizedStems.size}`,
);

const structuralFingerprints = new Set(questions.map((question) => question.studentSurfaceFingerprint));
assert(
  structuralFingerprints.size >= 60,
  `Expected at least 60 distinct Interest student-facing structural fingerprints, found ${structuralFingerprints.size}`,
);

const fingerprintCounts = new Map<string, number>();
for (const question of questions) {
  fingerprintCounts.set(question.studentSurfaceFingerprint, (fingerprintCounts.get(question.studentSurfaceFingerprint) ?? 0) + 1);
}
const largestFingerprintCluster = Math.max(...fingerprintCounts.values());
assert(
  largestFingerprintCluster <= 10,
  `A single Interest student-facing structure repeated ${largestFingerprintCluster} times in a 250-question audit`,
);

const classCounts = Object.fromEntries(SUFFICIENCY_CLASSES.map((semanticClass) => [
  semanticClass,
  questions.filter((question) => question.canonicalAnswer === semanticClass).length,
]));

const solveModeCounts = Object.fromEntries(DSF_CP011_INTEREST_SOLVE_MODES.map((solveMode) => [
  solveMode,
  questions.filter((question) => question.solveModeId === solveMode).length,
]));

console.log(JSON.stringify({
  status: "PASS_DSF_CP011_INTEREST_BREADTH_AND_REALNESS_AUDIT",
  auditedQuestions: questions.length,
  sourceChapterId: "INT-001",
  sourceFunctions: [...new Set(questions.map((question) => question.proof.sourceSolver))].sort(),
  solveModeCounts,
  contexts: [...new Set(questions.map((question) => question.contextId))].sort(),
  classCounts,
  normalizedStemCount: normalizedStems.size,
  structuralFingerprintCount: structuralFingerprints.size,
  largestFingerprintCluster,
  distinctGenerationIdentities: generationIdentities.size,
}, null, 2));
