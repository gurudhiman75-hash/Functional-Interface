import assert from "node:assert/strict";
import { SUFFICIENCY_CLASSES } from "../foundation/index.ts";
import {
  DSF_CP012_BLOOD_BASE_WORLD_COUNT,
  DSF_CP012_BLOOD_RUNTIME_VERSION,
  DSF_CP012_BLOOD_SOLVE_MODES,
  normalizeDsfCp012BloodStem,
} from "./blood-relations-runtime-v2.ts";
import {
  DSF_CP012_BLOOD_EDITORIAL_VERSION,
  generateDsfCp012BloodReviewedBatch,
} from "./blood-relations-editorial-v2.ts";

assert(DSF_CP012_BLOOD_BASE_WORLD_COUNT >= 24, `BLR V2 source universe must contain at least 24 valid oriented-link worlds; found ${DSF_CP012_BLOOD_BASE_WORLD_COUNT}`);

const questions = generateDsfCp012BloodReviewedBatch(Array.from({ length: 300 }, (_, seed) => seed));
assert.equal(questions.length, 300);
assert.deepEqual(new Set(questions.map((question) => question.correctClass)), new Set(SUFFICIENCY_CLASSES));
assert.deepEqual(new Set(questions.map((question) => question.solveMode)), new Set(DSF_CP012_BLOOD_SOLVE_MODES));
assert.deepEqual(new Set(questions.map((question) => question.difficulty)), new Set(["Easy", "Medium", "Hard"]));
assert.deepEqual(
  new Set(questions.map((question) => question.contextId)),
  new Set(["FAMILY_TREE", "FAMILY_GATHERING", "HOUSEHOLD_RECORD", "RELATION_CHAIN", "PEDIGREE_NOTE", "KINSHIP_RECORD"]),
);

for (const mode of DSF_CP012_BLOOD_SOLVE_MODES) {
  const modeQuestions = questions.filter((question) => question.solveMode === mode);
  assert.equal(modeQuestions.length, 150, `${mode} must contribute exactly 150 questions`);
  assert.deepEqual(new Set(modeQuestions.map((question) => question.correctClass)), new Set(SUFFICIENCY_CLASSES), `${mode} must realize all five canonical DS classes`);
}
for (const semanticClass of SUFFICIENCY_CLASSES) {
  assert.equal(questions.filter((question) => question.correctClass === semanticClass).length, 60, `${semanticClass} must appear exactly 60 times`);
}

for (const question of questions) {
  assert.equal(question.runtimeVersion, DSF_CP012_BLOOD_RUNTIME_VERSION);
  assert.equal(question.editorialVersion, DSF_CP012_BLOOD_EDITORIAL_VERSION);
  assert.equal(question.sourceChapterId, "BLR-001");
  assert.equal(question.sourceSolver, "BLR-001/foundation/graph-closure::solveRelationFromGraph");
  assert.equal(question.sourceWorldCount, DSF_CP012_BLOOD_BASE_WORLD_COUNT);
  assert.equal(question.options.length, 5);
  assert(question.correctIndex >= 0 && question.correctIndex < question.options.length);
  assert(question.options[question.correctIndex]?.length > 0);
  assert(question.evaluation.statementI.worldCount > 0);
  assert(question.evaluation.statementII.worldCount > 0);
  assert(question.evaluation.together.worldCount > 0);
  assert.equal(question.evaluation.classification, question.correctClass);
  assert.equal(question.lifecycle.contentStatus, "CP012_REASONING_REVIEW_CANDIDATE");
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
assert.equal(identities.size, questions.length, "BLR V2 generation identities must remain unique");

const normalizedStems = new Set(questions.map((question) => normalizeDsfCp012BloodStem(question.stem)));
assert(normalizedStems.size >= 30, `Expected at least 30 normalized BLR V2 stem surfaces, found ${normalizedStems.size}`);

const structuralFingerprints = new Set(questions.map((question) => question.studentSurfaceFingerprint));
assert(structuralFingerprints.size >= 60, `Expected at least 60 BLR V2 structural fingerprints, found ${structuralFingerprints.size}`);

const fingerprintCounts = new Map<string, number>();
for (const question of questions) fingerprintCounts.set(question.studentSurfaceFingerprint, (fingerprintCounts.get(question.studentSurfaceFingerprint) ?? 0) + 1);
const largestFingerprintCluster = Math.max(...fingerprintCounts.values());
assert(largestFingerprintCluster <= 10, `A BLR V2 structure repeated ${largestFingerprintCluster} times in the 300-question audit`);

console.log(JSON.stringify({
  status: "PASS_DSF_CP012_BLR_V2_SOURCE_BOUND_BREADTH_AUDIT",
  auditedQuestions: questions.length,
  baseWorldCount: DSF_CP012_BLOOD_BASE_WORLD_COUNT,
  solveModeCounts: Object.fromEntries(DSF_CP012_BLOOD_SOLVE_MODES.map((mode) => [mode, questions.filter((question) => question.solveMode === mode).length])),
  classCounts: Object.fromEntries(SUFFICIENCY_CLASSES.map((semanticClass) => [semanticClass, questions.filter((question) => question.correctClass === semanticClass).length])),
  difficultyCounts: Object.fromEntries(["Easy", "Medium", "Hard"].map((difficulty) => [difficulty, questions.filter((question) => question.difficulty === difficulty).length])),
  contexts: [...new Set(questions.map((question) => question.contextId))].sort(),
  normalizedStemCount: normalizedStems.size,
  structuralFingerprintCount: structuralFingerprints.size,
  largestFingerprintCluster,
  distinctGenerationIdentities: identities.size,
}, null, 2));
