import assert from "node:assert/strict";
import { SUFFICIENCY_CLASSES } from "../foundation/index.ts";
import {
  DSF_CP011_MENSURATION_SOLVE_MODES,
  generateDsfCp011MensurationBatch,
  normalizeDsfCp011MensurationSurface,
} from "./mensuration-runtime-v1.ts";

const questions = generateDsfCp011MensurationBatch(Array.from({ length: 350 }, (_, seed) => seed));

assert.equal(questions.length, 350);
assert.deepEqual(new Set(questions.map(question => question.canonicalAnswer)), new Set(SUFFICIENCY_CLASSES));
assert.deepEqual(new Set(questions.map(question => question.solveModeId)), new Set(DSF_CP011_MENSURATION_SOLVE_MODES));
assert.deepEqual(new Set(questions.map(question => question.targetKind)), new Set(["AREA", "PERIMETER", "CIRCUMFERENCE", "VOLUME"]));
assert.deepEqual(new Set(questions.map(question => question.sourceChapterId)), new Set(["MEN-001", "MEN-002"]));
assert.deepEqual(new Set(questions.map(question => question.difficulty)), new Set(["Easy", "Medium", "Hard"]));

const expectedContexts = new Set([
  "TRIANGULAR_PLOT", "TRIANGULAR_BOARD",
  "RECTANGULAR_FIELD", "RECTANGULAR_FLOOR",
  "CIRCULAR_GARDEN", "CIRCULAR_TRACK",
  "PYRAMID_MODEL", "PYRAMID_STRUCTURE",
  "FRUSTUM_CONTAINER", "FRUSTUM_MODEL",
]);
assert.deepEqual(new Set(questions.map(question => question.contextId)), expectedContexts);

for (const question of questions) {
  assert.equal(question.packageId, "DSF-001");
  assert.equal(question.checkpointId, "DSF-CP-011");
  assert.equal(question.qlId, "DSF-QL-001");
  assert.equal(question.answerContractId, "DS_STANDARD_5");
  assert.equal(question.options.length, 5);
  assert.equal(question.options.filter(option => option.isCorrect).length, 1);
  assert.equal(question.options[question.correctIndex]?.semanticClass, question.canonicalAnswer);
  assert.equal(question.proof.canonicalArithmeticOwnedByDsf, false);
  assert(question.proof.baseWorldCount >= 8);
  assert(question.proof.statementIWorldCount > 0);
  assert(question.proof.statementIIWorldCount > 0);
  assert(question.proof.togetherWorldCount > 0);
  assert.equal(question.lifecycle.contentStatus, "CP011_EXPANSION_REVIEW_CANDIDATE");
  assert.equal(question.lifecycle.questionStudioDiscoverable, false);
  assert.equal(question.lifecycle.questionBankWritable, false);
  assert.equal(question.lifecycle.testEligible, false);
  assert.equal(question.lifecycle.publiclyPublishable, false);
  if (question.sourceChapterId === "MEN-001") {
    assert.equal(question.sourceCapability, "MEN-001/solver::solveMen001");
  } else {
    assert.equal(question.sourceCapability, "MEN-002/cp010-foundation/engine::{buildMenCp010State,solveMenCp010}");
  }
}

const classCounts = Object.fromEntries(SUFFICIENCY_CLASSES.map(semanticClass => [
  semanticClass,
  questions.filter(question => question.canonicalAnswer === semanticClass).length,
]));
for (const semanticClass of SUFFICIENCY_CLASSES) assert.equal(classCounts[semanticClass], 70);

const solveModeCounts = Object.fromEntries(DSF_CP011_MENSURATION_SOLVE_MODES.map(solveMode => [
  solveMode,
  questions.filter(question => question.solveModeId === solveMode).length,
]));
for (const solveMode of DSF_CP011_MENSURATION_SOLVE_MODES) assert.equal(solveModeCounts[solveMode], 50);

const generationIdentities = new Set(questions.map(question => question.generationIdentity));
assert.equal(generationIdentities.size, questions.length, "Mensuration generation identities must remain unique");

const normalizedStems = new Set(questions.map(question => normalizeDsfCp011MensurationSurface(question.stem)));
assert(normalizedStems.size >= 28, `Expected at least 28 Mensuration stem surfaces, found ${normalizedStems.size}`);

const structuralFingerprints = new Set(questions.map(question => question.studentSurfaceFingerprint));
assert(structuralFingerprints.size >= 90, `Expected at least 90 Mensuration structural fingerprints, found ${structuralFingerprints.size}`);

const fingerprintCounts = new Map<string, number>();
for (const question of questions) {
  fingerprintCounts.set(question.studentSurfaceFingerprint, (fingerprintCounts.get(question.studentSurfaceFingerprint) ?? 0) + 1);
}
const largestFingerprintCluster = Math.max(...fingerprintCounts.values());
assert(largestFingerprintCluster <= 10, `A Mensuration student-facing structure repeated ${largestFingerprintCluster} times in a 350-question audit`);

console.log(JSON.stringify({
  status: "PASS_DSF_CP011_MENSURATION_2D_3D_BREADTH_AND_REALNESS_AUDIT",
  auditedQuestions: questions.length,
  sourceChapters: [...new Set(questions.map(question => question.sourceChapterId))].sort(),
  sourceCapabilities: [...new Set(questions.map(question => question.sourceCapability))].sort(),
  solveModeCounts,
  classCounts,
  contexts: [...new Set(questions.map(question => question.contextId))].sort(),
  normalizedStemCount: normalizedStems.size,
  structuralFingerprintCount: structuralFingerprints.size,
  largestFingerprintCluster,
  distinctGenerationIdentities: generationIdentities.size,
}, null, 2));
