import assert from "node:assert/strict";
import { SUFFICIENCY_CLASSES } from "../foundation/index.ts";
import {
  DSF_CP011_TSD_SOLVE_MODES,
  generateDsfCp011TsdBatch,
  normalizeDsfCp011TsdSurface,
} from "./tsd-runtime-v2.ts";

const questions = generateDsfCp011TsdBatch(Array.from({ length: 350 }, (_, seed) => seed));

assert.equal(questions.length, 350);
assert.deepEqual(new Set(questions.map((question) => question.canonicalAnswer)), new Set(SUFFICIENCY_CLASSES));
assert.deepEqual(new Set(questions.map((question) => question.solveModeId)), new Set(DSF_CP011_TSD_SOLVE_MODES));
assert.deepEqual(
  new Set(questions.map((question) => question.targetKind)),
  new Set(["DISTANCE", "SPEED", "TIME", "TRAIN_CLEAR_TIME", "TRAIN_CROSS_TIME", "BOAT_TRAVEL_TIME"]),
);
assert.deepEqual(new Set(questions.map((question) => question.difficulty)), new Set(["Easy", "Medium", "Hard"]));

const expectedContexts = new Set([
  "ROAD_TRIP", "DELIVERY_VAN", "CYCLIST", "RUNNER",
  "PASSENGER_TRAIN", "FREIGHT_TRAIN", "RAILWAY_PLATFORM", "EXPRESS_TRAINS",
  "RIVER_BOAT", "FERRY", "PATROL_BOAT", "CARGO_BOAT",
]);
assert.deepEqual(new Set(questions.map((question) => question.contextId)), expectedContexts);

for (const question of questions) {
  assert.equal(question.packageId, "DSF-001");
  assert.equal(question.checkpointId, "DSF-CP-011");
  assert.equal(question.qlId, "DSF-QL-001");
  assert.equal(question.sourceChapterId, "TSD-001");
  assert.equal(question.answerContractId, "DS_STANDARD_5");
  assert.equal(question.options.length, 5);
  assert.equal(question.options.filter((option) => option.isCorrect).length, 1);
  assert.equal(question.options[question.correctIndex]?.semanticClass, question.canonicalAnswer);
  assert(question.proof.statementIWorldCount > 0);
  assert(question.proof.statementIIWorldCount > 0);
  assert(question.proof.togetherWorldCount > 0);
  assert.equal(question.lifecycle.contentStatus, "CP011_EXPANSION_REVIEW_CANDIDATE");
  assert.equal(question.lifecycle.questionStudioDiscoverable, false);
  assert.equal(question.lifecycle.questionBankWritable, false);
  assert.equal(question.lifecycle.testEligible, false);
  assert.equal(question.lifecycle.publiclyPublishable, false);

  if (question.solveModeId.startsWith("DSF-SM-TSD-")) {
    assert.equal(question.proof.baseWorldCount, 64);
    assert(question.sourceCapabilities.includes("TSD-001/cp001/canonical-solver::solveCp001"));
  } else if (question.solveModeId === "DSF-SM-TRAIN-FIXED-CLEAR-TIME") {
    assert.equal(question.proof.baseWorldCount, 180);
    assert(question.sourceCapabilities.includes("TSD-001/foundation/motion::trainClearTimeAgainstFixedObject"));
  } else if (question.solveModeId === "DSF-SM-TRAIN-TWO-CROSS-TIME") {
    assert.equal(question.proof.baseWorldCount, 256);
    assert(question.sourceCapabilities.includes("TSD-001/foundation/motion::twoTrainCompleteCrossingTime"));
  } else {
    assert.equal(question.proof.baseWorldCount, 144);
    assert(question.sourceCapabilities.includes("TSD-001/foundation/motion::groundSpeedInMedium"));
    assert(question.sourceCapabilities.includes("TSD-001/foundation/motion::durationForUniformMotion"));
  }
}

const classCounts = Object.fromEntries(SUFFICIENCY_CLASSES.map((semanticClass) => [
  semanticClass,
  questions.filter((question) => question.canonicalAnswer === semanticClass).length,
]));
for (const semanticClass of SUFFICIENCY_CLASSES) assert.equal(classCounts[semanticClass], 70);

const solveModeCounts = Object.fromEntries(DSF_CP011_TSD_SOLVE_MODES.map((solveMode) => [
  solveMode,
  questions.filter((question) => question.solveModeId === solveMode).length,
]));
for (const solveMode of DSF_CP011_TSD_SOLVE_MODES) assert.equal(solveModeCounts[solveMode], 50);

const generationIdentities = new Set(questions.map((question) => question.generationIdentity));
assert.equal(generationIdentities.size, questions.length, "TSD generation identities must remain unique");

const normalizedStems = new Set(questions.map((question) => normalizeDsfCp011TsdSurface(question.stem)));
assert(
  normalizedStems.size >= 30,
  `Expected at least 30 perceptually different TSD/train/boat stem surfaces, found ${normalizedStems.size}`,
);

const structuralFingerprints = new Set(questions.map((question) => question.studentSurfaceFingerprint));
assert(
  structuralFingerprints.size >= 100,
  `Expected at least 100 distinct TSD/train/boat student-facing structural fingerprints, found ${structuralFingerprints.size}`,
);

const fingerprintCounts = new Map<string, number>();
for (const question of questions) {
  fingerprintCounts.set(question.studentSurfaceFingerprint, (fingerprintCounts.get(question.studentSurfaceFingerprint) ?? 0) + 1);
}
const largestFingerprintCluster = Math.max(...fingerprintCounts.values());
assert(
  largestFingerprintCluster <= 10,
  `A single TSD/train/boat student-facing structure repeated ${largestFingerprintCluster} times in a 350-question audit`,
);

console.log(JSON.stringify({
  status: "PASS_DSF_CP011_TSD_TRAINS_BOATS_BREADTH_AND_REALNESS_AUDIT",
  auditedQuestions: questions.length,
  sourceChapterId: "TSD-001",
  solveModeCounts,
  classCounts,
  contexts: [...new Set(questions.map((question) => question.contextId))].sort(),
  normalizedStemCount: normalizedStems.size,
  structuralFingerprintCount: structuralFingerprints.size,
  largestFingerprintCluster,
  distinctGenerationIdentities: generationIdentities.size,
  sourceCapabilities: [...new Set(questions.flatMap((question) => question.sourceCapabilities))].sort(),
}, null, 2));
