import assert from "node:assert/strict";
import { SUFFICIENCY_CLASSES } from "../foundation/index.ts";
import {
  DSF_CP013_SEATING_RUNTIME_VERSION,
  DSF_CP013_SEATING_SOLVE_MODES,
  DSF_CP013_SEATING_WORLD_COUNTS,
  generateDsfCp013SeatingBatch,
  normalizeDsfCp013SeatingSurface,
} from "./seating-runtime-v1.ts";

assert.deepEqual(DSF_CP013_SEATING_WORLD_COUNTS, { NORTH: 120, SOUTH: 120 });

const questions = generateDsfCp013SeatingBatch(Array.from({ length: 300 }, (_, seed) => seed));
assert.equal(questions.length, 300);
assert.deepEqual(new Set(questions.map((question) => question.canonicalAnswer)), new Set(SUFFICIENCY_CLASSES));
assert.deepEqual(new Set(questions.map((question) => question.solveModeId)), new Set(DSF_CP013_SEATING_SOLVE_MODES));
assert.deepEqual(new Set(questions.map((question) => question.facing)), new Set(["NORTH", "SOUTH"]));
assert.deepEqual(new Set(questions.map((question) => question.difficulty)), new Set(["Easy", "Medium", "Hard"]));
assert.deepEqual(
  new Set(questions.map((question) => question.contextId)),
  new Set(["TRAINING_ROW", "SEMINAR_ROW", "WAITING_BENCH", "INTERVIEW_ROW", "BRIEFING_ROW", "CONFERENCE_ROW"]),
);

for (const mode of DSF_CP013_SEATING_SOLVE_MODES) {
  const modeQuestions = questions.filter((question) => question.solveModeId === mode);
  assert.equal(modeQuestions.length, 75, `${mode} must contribute exactly 75 questions`);
  assert.deepEqual(new Set(modeQuestions.map((question) => question.canonicalAnswer)), new Set(SUFFICIENCY_CLASSES), `${mode} must realize all five canonical DS classes`);
}
for (const semanticClass of SUFFICIENCY_CLASSES) {
  assert.equal(questions.filter((question) => question.canonicalAnswer === semanticClass).length, 60, `${semanticClass} must appear exactly 60 times`);
}

for (const question of questions) {
  assert.equal(question.runtimeVersion, DSF_CP013_SEATING_RUNTIME_VERSION);
  assert.equal(question.packageId, "DSF-001");
  assert.equal(question.checkpointId, "DSF-CP-013");
  assert.equal(question.qlId, "DSF-QL-001");
  assert.equal(question.domainFamily, "REASONING");
  assert.equal(question.sourceChapterId, "SEA-001");
  assert.equal(question.sourceWorldCount, 120);
  assert.equal(question.solverOracleParity, true);
  assert(question.sourceCapabilities.includes("SEA-001/solver/production-solver::solveLinear"));
  assert(question.sourceCapabilities.includes("SEA-001/solver/independent-oracle::enumerateLinearOracle"));
  assert.equal(question.options.length, 5);
  assert.equal(question.options.filter((option) => option.isCorrect).length, 1);
  assert(question.correctIndex >= 0 && question.correctIndex < 5);
  assert.equal(question.options[question.correctIndex]?.semanticClass, question.canonicalAnswer);
  assert.equal(question.proof.baseWorldCount, 120);
  assert(question.proof.statementIWorldCount > 0);
  assert(question.proof.statementIIWorldCount > 0);
  assert(question.proof.togetherWorldCount > 0);
  assert.equal(question.proof.productionOracleParity, true);
  assert.equal(question.lifecycle.contentStatus, "CP013_REASONING_WAVE2_REVIEW_CANDIDATE");
  assert.equal(question.lifecycle.questionStudioDiscoverable, false);
  assert.equal(question.lifecycle.questionBankWritable, false);
  assert.equal(question.lifecycle.testEligible, false);
  assert.equal(question.lifecycle.mockTestEligible, false);
  assert.equal(question.lifecycle.publiclyPublishable, false);
  assert(question.explanation.includes("Statement I"));
  assert(question.explanation.includes("Statement II"));
  assert(question.explanation.includes("Together"));
}

const identities = new Set(questions.map((question) => question.generationIdentity));
assert.equal(identities.size, questions.length, "Seating generation identities must be unique");

const normalizedStems = new Set(questions.map((question) => normalizeDsfCp013SeatingSurface(question.stem)));
assert(normalizedStems.size >= 60, `Expected at least 60 normalized Seating stems, found ${normalizedStems.size}`);

const structuralFingerprints = new Set(questions.map((question) => question.studentSurfaceFingerprint));
assert(structuralFingerprints.size >= 100, `Expected at least 100 Seating structural fingerprints, found ${structuralFingerprints.size}`);

const fingerprintCounts = new Map<string, number>();
for (const question of questions) fingerprintCounts.set(question.studentSurfaceFingerprint, (fingerprintCounts.get(question.studentSurfaceFingerprint) ?? 0) + 1);
const largestFingerprintCluster = Math.max(...fingerprintCounts.values());
assert(largestFingerprintCluster <= 8, `A Seating structure repeated ${largestFingerprintCluster} times in the 300-question audit`);

console.log(JSON.stringify({
  status: "PASS_DSF_CP013_SEATING_SOURCE_BOUND_BREADTH_AUDIT",
  auditedQuestions: questions.length,
  worldCounts: DSF_CP013_SEATING_WORLD_COUNTS,
  solveModeCounts: Object.fromEntries(DSF_CP013_SEATING_SOLVE_MODES.map((mode) => [mode, questions.filter((question) => question.solveModeId === mode).length])),
  classCounts: Object.fromEntries(SUFFICIENCY_CLASSES.map((semanticClass) => [semanticClass, questions.filter((question) => question.canonicalAnswer === semanticClass).length])),
  facingCounts: Object.fromEntries(["NORTH", "SOUTH"].map((facing) => [facing, questions.filter((question) => question.facing === facing).length])),
  difficultyCounts: Object.fromEntries(["Easy", "Medium", "Hard"].map((difficulty) => [difficulty, questions.filter((question) => question.difficulty === difficulty).length])),
  contexts: [...new Set(questions.map((question) => question.contextId))].sort(),
  normalizedStemCount: normalizedStems.size,
  structuralFingerprintCount: structuralFingerprints.size,
  largestFingerprintCluster,
  distinctGenerationIdentities: identities.size,
}, null, 2));
