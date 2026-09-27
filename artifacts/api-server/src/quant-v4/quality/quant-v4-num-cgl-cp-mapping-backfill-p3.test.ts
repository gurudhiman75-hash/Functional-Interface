import assert from "node:assert/strict";

import {
  QUANT_V4_REGISTERED_PYQ_OBSERVATIONS,
} from "./quant-v4-pyq-observation-registry-p2";
import {
  buildQuantV4SpecializedCalibrationReadiness,
} from "./quant-v4-specialized-profile-calibration-readiness-p3";

const expectedMappings = new Map([
  ["HCF_RATIO_TO_LCM_MCQ", "NUM-CP-006"],
  ["PALINDROME_DIVISIBILITY_COUNT_MCQ", "NUM-CP-003"],
  ["MISSING_DIGITS_DIVISIBILITY_BY_9_MCQ", "NUM-CP-003"],
  ["DIVISIBILITY_BY_44_OPTION_FILTER_MCQ", "NUM-CP-003"],
  ["LEAST_ADDITION_FOR_DIVISIBILITY_MCQ", "NUM-CP-003"],
  ["MISSING_DIGIT_DIVISIBILITY_BY_8_AND_5_MCQ", "NUM-CP-003"],
  ["MISSING_DIGIT_DIVISIBILITY_BY_6_LEAST_MCQ", "NUM-CP-003"],
] as const);

const cglNum = QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.filter(
  (entry) => entry.examId === "SSC_CGL_TIER_I" && entry.packageId === "NUM-001",
);

for (const [representation, cpId] of expectedMappings) {
  const row = cglNum.find((entry) => entry.representation === representation);
  assert.ok(row, `Missing NUM evidence row for ${representation}.`);
  assert.match(
    row.subtopic,
    new RegExp(`^${cpId}\\b`, "u"),
    `${representation} must retain explicit ${cpId} ownership.`,
  );
}

const readiness = buildQuantV4SpecializedCalibrationReadiness({
  packageId: "NUM-001",
  examProfile: "SSC_CGL_TIER_I",
});

assert.equal(readiness.countableObservationCount, 26);
assert.ok(readiness.canonicalCpMappedObservationCount >= expectedMappings.size);
assert.ok(readiness.canonicalCpCoverage.includes("NUM-CP-003"));
assert.ok(readiness.canonicalCpCoverage.includes("NUM-CP-006"));
assert.equal(
  readiness.canonicalCpCoverage.includes("NUM-CP-005"),
  false,
  "NUM-CP-005 must remain uncovered until direct source evidence supports it.",
);
assert.equal(readiness.selectionCalibrationAuthorized, false);
assert.ok(readiness.blockers.includes("CALIBRATION_POLICY_NOT_ADOPTED"));
assert.ok(readiness.blockers.includes("DIFFICULTY_EVIDENCE_NOT_NORMALIZED"));

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_NUM_CGL_CP_MAPPING_BACKFILL_P3",
  mappedRepresentations: Object.fromEntries(expectedMappings),
  readiness,
}));
