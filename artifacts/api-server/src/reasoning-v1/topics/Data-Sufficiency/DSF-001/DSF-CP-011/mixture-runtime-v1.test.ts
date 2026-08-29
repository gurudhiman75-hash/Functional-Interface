import assert from "node:assert/strict";
import { SUFFICIENCY_CLASSES } from "../foundation/index.ts";
import {
  DSF_CP011_MIXTURE_SOLVE_MODES,
  generateDsfCp011MixtureBatch,
  normalizeDsfCp011MixtureSurface,
} from "./mixture-runtime-v1.ts";

const questions = generateDsfCp011MixtureBatch(Array.from({ length: 300 }, (_, seed) => seed));

assert.equal(questions.length, 300);
assert.deepEqual(new Set(questions.map(question => question.canonicalAnswer)), new Set(SUFFICIENCY_CLASSES));
assert.deepEqual(new Set(questions.map(question => question.solveModeId)), new Set(DSF_CP011_MIXTURE_SOLVE_MODES));
assert.deepEqual(
  new Set(questions.map(question => question.targetKind)),
  new Set(["MEAN_VALUE", "COMPONENT_RATIO", "SOURCE_VALUE", "COMPONENT_QUANTITY", "ADDED_QUANTITY", "QUANTITY_PAIR"]),
);
assert.deepEqual(
  new Set(questions.map(question => question.contextId)),
  new Set(["RICE_GRADES", "TEA_GRADES", "COFFEE_BEANS", "COOKING_OIL", "SPICE_BLEND", "DRY_FRUIT_BLEND"]),
);
assert.deepEqual(new Set(questions.map(question => question.difficulty)), new Set(["Easy", "Medium", "Hard"]));

for (const question of questions) {
  assert.equal(question.packageId, "DSF-001");
  assert.equal(question.checkpointId, "DSF-CP-011");
  assert.equal(question.qlId, "DSF-QL-001");
  assert.equal(question.sourceChapterId, "MAL-001");
  assert.equal(question.sourceCapability, "MAL-001/foundation/solver::solveMalCp001");
  assert.equal(question.answerContractId, "DS_STANDARD_5");
  assert.equal(question.options.length, 5);
  assert.equal(question.options.filter(option => option.isCorrect).length, 1);
  assert.equal(question.options[question.correctIndex]?.semanticClass, question.canonicalAnswer);
  assert.equal(question.proof.baseWorldCount, 400);
  assert.equal(question.proof.sourceSolver, "solveMalCp001");
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

const classCounts = Object.fromEntries(SUFFICIENCY_CLASSES.map(semanticClass => [
  semanticClass,
  questions.filter(question => question.canonicalAnswer === semanticClass).length,
]));
for (const semanticClass of SUFFICIENCY_CLASSES) assert.equal(classCounts[semanticClass], 60);

const solveModeCounts = Object.fromEntries(DSF_CP011_MIXTURE_SOLVE_MODES.map(solveMode => [
  solveMode,
  questions.filter(question => question.solveModeId === solveMode).length,
]));
for (const solveMode of DSF_CP011_MIXTURE_SOLVE_MODES) assert.equal(solveModeCounts[solveMode], 50);

const generationIdentities = new Set(questions.map(question => question.generationIdentity));
assert.equal(generationIdentities.size, questions.length, "Mixture generation identities must remain unique");

const normalizedStems = new Set(questions.map(question => normalizeDsfCp011MixtureSurface(question.stem)));
assert(
  normalizedStems.size >= 24,
  `Expected at least 24 perceptually different Mixture stem surfaces, found ${normalizedStems.size}`,
);

const structuralFingerprints = new Set(questions.map(question => question.studentSurfaceFingerprint));
assert(
  structuralFingerprints.size >= 80,
  `Expected at least 80 distinct Mixture student-facing structural fingerprints, found ${structuralFingerprints.size}`,
);

const fingerprintCounts = new Map<string, number>();
for (const question of questions) {
  fingerprintCounts.set(question.studentSurfaceFingerprint, (fingerprintCounts.get(question.studentSurfaceFingerprint) ?? 0) + 1);
}
const largestFingerprintCluster = Math.max(...fingerprintCounts.values());
assert(
  largestFingerprintCluster <= 10,
  `A single Mixture student-facing structure repeated ${largestFingerprintCluster} times in a 300-question audit`,
);

console.log(JSON.stringify({
  status: "PASS_DSF_CP011_MIXTURE_ALLIGATION_BREADTH_AND_REALNESS_AUDIT",
  auditedQuestions: questions.length,
  sourceChapterId: "MAL-001",
  sourceSolver: "solveMalCp001",
  solveModeCounts,
  classCounts,
  contexts: [...new Set(questions.map(question => question.contextId))].sort(),
  normalizedStemCount: normalizedStems.size,
  structuralFingerprintCount: structuralFingerprints.size,
  largestFingerprintCluster,
  distinctGenerationIdentities: generationIdentities.size,
}, null, 2));
