import assert from "node:assert/strict";
import { SUFFICIENCY_CLASSES } from "../foundation/index.ts";
import {
  DSF_CP011_TMW_SOLVE_MODES,
  generateDsfCp011TmwBatch,
  normalizeDsfCp011TmwSurface,
} from "./time-work-pipes-runtime-v1.ts";

const questions = generateDsfCp011TmwBatch(Array.from({ length: 250 }, (_, seed) => seed));

assert.equal(questions.length, 250);
assert.deepEqual(new Set(questions.map((question) => question.canonicalAnswer)), new Set(SUFFICIENCY_CLASSES));
assert.deepEqual(new Set(questions.map((question) => question.solveModeId)), new Set(DSF_CP011_TMW_SOLVE_MODES));
assert.deepEqual(
  new Set(questions.map((question) => question.targetKind)),
  new Set(["COMPLETION_TIME", "WORK_RATE", "FRACTION_COMPLETED", "PIPE_FILL_TIME"]),
);
assert.deepEqual(new Set(questions.map((question) => question.sourceDomain)), new Set(["TIME_AND_WORK", "PIPES_AND_CISTERNS"]));
assert.deepEqual(new Set(questions.map((question) => question.proof.sourceSolver)), new Set(["solveTmwCp001", "solveTmwCp009"]));
assert.deepEqual(new Set(questions.map((question) => question.difficulty)), new Set(["Easy", "Medium", "Hard"]));

const expectedContexts = new Set([
  "DOCUMENTS", "PACKAGING", "PAINTING", "INSPECTION", "LOADING", "ASSEMBLY",
  "WATER_TANK", "RESERVOIR", "STORAGE_TANK", "PROCESS_TANK", "SERVICE_TANK", "COLLECTION_TANK",
]);
assert.deepEqual(new Set(questions.map((question) => question.contextId)), expectedContexts);

for (const question of questions) {
  assert.equal(question.packageId, "DSF-001");
  assert.equal(question.checkpointId, "DSF-CP-011");
  assert.equal(question.qlId, "DSF-QL-001");
  assert.equal(question.sourceChapterId, "TMW-001");
  assert.equal(question.answerContractId, "DS_STANDARD_5");
  assert.equal(question.options.length, 5);
  assert.equal(question.options.filter((option) => option.isCorrect).length, 1);
  assert.equal(question.options[question.correctIndex]?.semanticClass, question.canonicalAnswer);
  assert.equal(question.proof.canonicalArithmeticOwnedByDsf, false);
  assert(question.proof.statementIWorldCount > 0);
  assert(question.proof.statementIIWorldCount > 0);
  assert(question.proof.togetherWorldCount > 0);

  if (question.sourceDomain === "TIME_AND_WORK") {
    assert.equal(question.sourceCapability, "TMW-001/foundation/cp001-solver::solveTmwCp001");
    assert.equal(question.proof.sourceSolver, "solveTmwCp001");
    assert.equal(question.proof.baseWorldCount, 66);
  } else {
    assert.equal(question.sourceCapability, "TMW-001/foundation/cp009-solver::solveTmwCp009");
    assert.equal(question.proof.sourceSolver, "solveTmwCp009");
    assert([30, 42].includes(question.proof.baseWorldCount));
  }

  assert.equal(question.lifecycle.contentStatus, "CP011_EXPANSION_REVIEW_CANDIDATE");
  assert.equal(question.lifecycle.questionStudioDiscoverable, false);
  assert.equal(question.lifecycle.questionBankWritable, false);
  assert.equal(question.lifecycle.testEligible, false);
  assert.equal(question.lifecycle.publiclyPublishable, false);
}

const generationIdentities = new Set(questions.map((question) => question.generationIdentity));
assert.equal(generationIdentities.size, questions.length, "TMW generation identities must remain unique");

const normalizedStems = new Set(questions.map((question) => normalizeDsfCp011TmwSurface(question.stem)));
assert(
  normalizedStems.size >= 24,
  `Expected at least 24 perceptually different TMW/Pipes stem surfaces, found ${normalizedStems.size}`,
);

const structuralFingerprints = new Set(questions.map((question) => question.studentSurfaceFingerprint));
assert(
  structuralFingerprints.size >= 60,
  `Expected at least 60 distinct TMW/Pipes student-facing structural fingerprints, found ${structuralFingerprints.size}`,
);

const fingerprintCounts = new Map<string, number>();
for (const question of questions) {
  fingerprintCounts.set(question.studentSurfaceFingerprint, (fingerprintCounts.get(question.studentSurfaceFingerprint) ?? 0) + 1);
}
const largestFingerprintCluster = Math.max(...fingerprintCounts.values());
assert(
  largestFingerprintCluster <= 10,
  `A single TMW/Pipes student-facing structure repeated ${largestFingerprintCluster} times in a 250-question audit`,
);

const classCounts = Object.fromEntries(SUFFICIENCY_CLASSES.map((semanticClass) => [
  semanticClass,
  questions.filter((question) => question.canonicalAnswer === semanticClass).length,
]));

const solveModeCounts = Object.fromEntries(DSF_CP011_TMW_SOLVE_MODES.map((solveMode) => [
  solveMode,
  questions.filter((question) => question.solveModeId === solveMode).length,
]));

console.log(JSON.stringify({
  status: "PASS_DSF_CP011_TIME_WORK_PIPES_BREADTH_AND_REALNESS_AUDIT",
  auditedQuestions: questions.length,
  sourceChapterId: "TMW-001",
  sourceSolvers: [...new Set(questions.map((question) => question.proof.sourceSolver))].sort(),
  solveModeCounts,
  contexts: [...new Set(questions.map((question) => question.contextId))].sort(),
  classCounts,
  normalizedStemCount: normalizedStems.size,
  structuralFingerprintCount: structuralFingerprints.size,
  largestFingerprintCluster,
  distinctGenerationIdentities: generationIdentities.size,
}, null, 2));
