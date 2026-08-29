import assert from "node:assert/strict";
import { SUFFICIENCY_CLASSES } from "../foundation/index.ts";
import {
  DSF_CP011_AVERAGE_SOLVE_MODES,
  generateDsfCp011AverageBatch,
  normalizeDsfCp011Surface,
} from "./average-runtime-v1.ts";

const questions = generateDsfCp011AverageBatch(Array.from({ length: 250 }, (_, seed) => seed));

assert.equal(questions.length, 250);
assert.deepEqual(new Set(questions.map((question) => question.canonicalAnswer)), new Set(SUFFICIENCY_CLASSES));
assert.deepEqual(new Set(questions.map((question) => question.solveModeId)), new Set(DSF_CP011_AVERAGE_SOLVE_MODES));
assert.deepEqual(new Set(questions.map((question) => question.targetKind)), new Set(["TOTAL", "AVERAGE"]));
assert.deepEqual(
  new Set(questions.map((question) => question.contextId)),
  new Set(["CLASS_MARKS", "CRICKET_INNINGS", "PARCEL_WEIGHT", "DAILY_SALES", "WORKER_WAGES", "BOOKS_PER_SHELF"]),
);
assert.deepEqual(new Set(questions.map((question) => question.difficulty)), new Set(["Easy", "Medium", "Hard"]));

for (const question of questions) {
  assert.equal(question.packageId, "DSF-001");
  assert.equal(question.checkpointId, "DSF-CP-011");
  assert.equal(question.qlId, "DSF-QL-001");
  assert.equal(question.sourceChapterId, "AVG-001");
  assert.equal(question.sourceCapability, "AVG-001/foundation/solver::solveAvg001");
  assert.equal(question.answerContractId, "DS_STANDARD_5");
  assert.equal(question.options.length, 5);
  assert.equal(question.options.filter((option) => option.isCorrect).length, 1);
  assert.equal(question.options[question.correctIndex]?.semanticClass, question.canonicalAnswer);
  assert.equal(question.proof.sourceSolver, "solveAvg001");
  assert.equal(question.proof.baseWorldCount, 150);
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
assert.equal(generationIdentities.size, questions.length, "Generation identities must remain unique");

const normalizedStems = new Set(questions.map((question) => normalizeDsfCp011Surface(question.stem)));
assert(
  normalizedStems.size >= 16,
  `Expected at least 16 perceptually different normalized stem surfaces, found ${normalizedStems.size}`,
);

const structuralFingerprints = new Set(questions.map((question) => question.studentSurfaceFingerprint));
assert(
  structuralFingerprints.size >= 40,
  `Expected at least 40 distinct student-facing structure fingerprints, found ${structuralFingerprints.size}`,
);

const fingerprintCounts = new Map<string, number>();
for (const question of questions) {
  fingerprintCounts.set(
    question.studentSurfaceFingerprint,
    (fingerprintCounts.get(question.studentSurfaceFingerprint) ?? 0) + 1,
  );
}
const largestFingerprintCluster = Math.max(...fingerprintCounts.values());
assert(
  largestFingerprintCluster <= 14,
  `A single student-facing structure repeated ${largestFingerprintCluster} times in a 250-question audit`,
);

const classCounts = Object.fromEntries(SUFFICIENCY_CLASSES.map((semanticClass) => [
  semanticClass,
  questions.filter((question) => question.canonicalAnswer === semanticClass).length,
]));

console.log(JSON.stringify({
  status: "PASS_DSF_CP011_AVERAGE_BREADTH_AND_REALNESS_AUDIT",
  auditedQuestions: questions.length,
  sourceChapterId: "AVG-001",
  sourceSolver: "solveAvg001",
  solveModes: [...new Set(questions.map((question) => question.solveModeId))].sort(),
  contexts: [...new Set(questions.map((question) => question.contextId))].sort(),
  classCounts,
  normalizedStemCount: normalizedStems.size,
  structuralFingerprintCount: structuralFingerprints.size,
  largestFingerprintCluster,
  distinctGenerationIdentities: generationIdentities.size,
}, null, 2));
