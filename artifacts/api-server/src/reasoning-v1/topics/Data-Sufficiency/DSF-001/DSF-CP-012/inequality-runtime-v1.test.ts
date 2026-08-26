import assert from "node:assert/strict";
import { SUFFICIENCY_CLASSES } from "../foundation/index.ts";
import {
  DSF_CP012_INEQUALITY_SOLVE_MODES,
  generateDsfCp012InequalityBatch,
  normalizeDsfCp012InequalitySurface,
} from "./inequality-runtime-v1.ts";

const questions = generateDsfCp012InequalityBatch(Array.from({ length: 300 }, (_, seed) => seed));
assert.equal(questions.length, 300);
assert.deepEqual(new Set(questions.map((question) => question.canonicalAnswer)), new Set(SUFFICIENCY_CLASSES));
assert.deepEqual(new Set(questions.map((question) => question.solveModeId)), new Set(DSF_CP012_INEQUALITY_SOLVE_MODES));
assert.deepEqual(new Set(questions.map((question) => question.difficulty)), new Set(["Easy", "Medium", "Hard"]));
assert.deepEqual(
  new Set(questions.map((question) => question.contextId)),
  new Set(["SYMBOLIC_VALUES", "SCORE_COMPARISON", "WEIGHT_COMPARISON", "HEIGHT_COMPARISON", "PRICE_COMPARISON", "RANK_VALUE_COMPARISON"]),
);

for (const mode of DSF_CP012_INEQUALITY_SOLVE_MODES) {
  const modeQuestions = questions.filter((question) => question.solveModeId === mode);
  assert.equal(modeQuestions.length, 100, `${mode} must contribute exactly 100 questions`);
  assert.deepEqual(new Set(modeQuestions.map((question) => question.canonicalAnswer)), new Set(SUFFICIENCY_CLASSES), `${mode} must realize all five canonical DS classes`);
}
for (const semanticClass of SUFFICIENCY_CLASSES) {
  assert.equal(questions.filter((question) => question.canonicalAnswer === semanticClass).length, 60, `${semanticClass} must appear exactly 60 times`);
}

for (const question of questions) {
  assert.equal(question.packageId, "DSF-001");
  assert.equal(question.checkpointId, "DSF-CP-012");
  assert.equal(question.qlId, "DSF-QL-001");
  assert.equal(question.domainFamily, "REASONING");
  assert.equal(question.sourceChapterId, "REAS-INEQ");
  assert(question.sourceCapabilities.includes("lib/reasoning/inequality-foundation::resolveInequalityRelation"));
  assert.equal(question.options.length, 5);
  assert.equal(question.options.filter((option) => option.isCorrect).length, 1);
  assert.equal(question.options[question.correctIndex]?.semanticClass, question.canonicalAnswer);
  assert.equal(question.proof.baseWorldCount, 256);
  assert(question.proof.statementIWorldCount > 0);
  assert(question.proof.statementIIWorldCount > 0);
  assert(question.proof.togetherWorldCount > 0);
  assert.equal(question.lifecycle.contentStatus, "CP012_REASONING_WAVE1_REVIEW_CANDIDATE");
  assert.equal(question.lifecycle.questionStudioDiscoverable, false);
  assert.equal(question.lifecycle.questionBankWritable, false);
  assert.equal(question.lifecycle.testEligible, false);
  assert.equal(question.lifecycle.publiclyPublishable, false);
}

const identities = new Set(questions.map((question) => question.generationIdentity));
assert.equal(identities.size, questions.length, "Inequality generation identities must remain unique");

const normalizedStems = new Set(questions.map((question) => normalizeDsfCp012InequalitySurface(question.stem)));
assert(normalizedStems.size >= 45, `Expected at least 45 normalized Inequality stem surfaces, found ${normalizedStems.size}`);

const structuralFingerprints = new Set(questions.map((question) => question.studentSurfaceFingerprint));
assert(structuralFingerprints.size >= 90, `Expected at least 90 Inequality structural fingerprints, found ${structuralFingerprints.size}`);

const fingerprintCounts = new Map<string, number>();
for (const question of questions) fingerprintCounts.set(question.studentSurfaceFingerprint, (fingerprintCounts.get(question.studentSurfaceFingerprint) ?? 0) + 1);
const largestFingerprintCluster = Math.max(...fingerprintCounts.values());
assert(largestFingerprintCluster <= 9, `An Inequality structure repeated ${largestFingerprintCluster} times in the 300-question audit`);

console.log(JSON.stringify({
  status: "PASS_DSF_CP012_INEQUALITY_SOURCE_BOUND_BREADTH_AUDIT",
  auditedQuestions: questions.length,
  solveModeCounts: Object.fromEntries(DSF_CP012_INEQUALITY_SOLVE_MODES.map((mode) => [mode, questions.filter((question) => question.solveModeId === mode).length])),
  classCounts: Object.fromEntries(SUFFICIENCY_CLASSES.map((semanticClass) => [semanticClass, questions.filter((question) => question.canonicalAnswer === semanticClass).length])),
  contexts: [...new Set(questions.map((question) => question.contextId))].sort(),
  normalizedStemCount: normalizedStems.size,
  structuralFingerprintCount: structuralFingerprints.size,
  largestFingerprintCluster,
  distinctGenerationIdentities: identities.size,
}, null, 2));
