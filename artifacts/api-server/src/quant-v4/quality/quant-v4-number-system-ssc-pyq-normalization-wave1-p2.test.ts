import assert from "node:assert/strict";

import {
  getQuantV4SpecializedProfileSelectionContract,
} from "../common/specialized-profile-selection";
import {
  QUANT_V4_PYQ_OBSERVATION_REGISTRY_AUTHORITY,
  listRegisteredCountablePyqObservations,
} from "./quant-v4-pyq-observation-registry-p2";
import {
  QUANT_V4_NUMBER_SYSTEM_SSC_WAVE1_COUNTABLE_PYQ_OBSERVATIONS,
  QUANT_V4_NUMBER_SYSTEM_SSC_WAVE1_PYQ_MIGRATION_AUTHORITY,
  QUANT_V4_NUMBER_SYSTEM_SSC_WAVE1_SOURCE_LIMITATIONS,
} from "./quant-v4-pyq-observations-number-system-ssc-wave1-p2";
import { validatePyqObservationSet } from "./quant-v4-pyq-frequency-evidence-p2";

const observations = QUANT_V4_NUMBER_SYSTEM_SSC_WAVE1_COUNTABLE_PYQ_OBSERVATIONS;
validatePyqObservationSet(observations);

assert.equal(
  QUANT_V4_NUMBER_SYSTEM_SSC_WAVE1_PYQ_MIGRATION_AUTHORITY,
  "QUANT-V4-NUMBER-SYSTEM-SSC-PYQ-NORMALIZATION-WAVE1-P2",
);
assert.equal(QUANT_V4_PYQ_OBSERVATION_REGISTRY_AUTHORITY, "QUANT-V4-PYQ-OBSERVATION-REGISTRY-P2");
assert.equal(observations.length, 10);
assert.ok(observations.every((entry) => entry.packageId === "NUM-001"));
assert.ok(observations.every((entry) => entry.examId === "SSC_CGL_TIER_I"));
assert.ok(observations.every((entry) => entry.evidenceKind === "VERIFIED_PYQ_COLLECTION"));
assert.ok(observations.every((entry) => !entry.heldDate && !entry.shift));
assert.equal(new Set(observations.map((entry) => entry.paperId)).size, 1, "Unresolved paper identity must not be inflated into fake distinct papers.");
assert.equal(new Set(observations.map((entry) => entry.questionRef)).size, 10);
assert.ok(observations.every((entry) => entry.sourceRef.includes("QUANT-V4-NUMBER-SYSTEM-SSC-PYQ-NORMALIZATION-WAVE1-P2.md")));

const cp003 = observations.filter((entry) => entry.subtopic.startsWith("NUM-CP-003"));
const cp006 = observations.filter((entry) => entry.subtopic.startsWith("NUM-CP-006"));
assert.equal(cp003.length, 9);
assert.equal(cp006.length, 1);
assert.deepEqual(QUANT_V4_NUMBER_SYSTEM_SSC_WAVE1_SOURCE_LIMITATIONS.cpCoverage, ["NUM-CP-003", "NUM-CP-006"]);
assert.equal(QUANT_V4_NUMBER_SYSTEM_SSC_WAVE1_SOURCE_LIMITATIONS.exactPaperIdentityResolved, false);
assert.equal(QUANT_V4_NUMBER_SYSTEM_SSC_WAVE1_SOURCE_LIMITATIONS.selectionCalibrationAllowed, false);

// Independent exact-math checks for the ten retained source fixtures.
assert.equal(2525, 101 * 25, "2010 Q67 repeated-block factorization failed.");
for (let a = 1; a <= 15; a += 2) {
  for (let b = 1; b <= 15; b += 2) {
    assert.equal(Math.abs((a ** 4 - b ** 4) % 8), 0, "2010 Q69 odd fourth-power divisibility failed.");
  }
}
for (let n = 1; n <= 100; n += 1) {
  assert.equal((n ** 3 - n) % 6, 0, "2010 Q70 n^3-n divisibility failed.");
}
assert.equal(121212, 10101 * 12, "2011 Q46 six-digit repeated-block factorization failed.");
assert.equal((2 ** 16 - 1) % 17, 0, "2011 Q49 power-expression divisibility failed.");
assert.equal(9999 % 345, 339, "2011 Q52 remainder check failed.");
assert.equal(345 - (9999 % 345), 6, "2011 Q52 least-addition answer failed.");
assert.equal((5n ** 71n + 5n ** 72n + 5n ** 73n) % 155n, 0n, "2011 Q54 power-sum divisibility failed.");
assert.equal(303375 % 25, 0, "2013 Q26 divisibility-by-25 check failed.");
for (let tens = 1; tens <= 9; tens += 1) {
  for (let units = 0; units <= 9; units += 1) {
    const difference = (10 * tens + units) - (10 * units + tens);
    assert.equal(Math.abs(difference % 9), 0, "2013 Q30 reversed-digit difference check failed.");
  }
}
const a = 3n ** 333n + 1n;
const b = 3n ** 334n + 1n;
function gcd(left: bigint, right: bigint): bigint {
  let x = left < 0n ? -left : left;
  let y = right < 0n ? -right : right;
  while (y !== 0n) {
    const remainder = x % y;
    x = y;
    y = remainder;
  }
  return x;
}
assert.equal(gcd(a, b), 2n, "2013 Q31 HCF check failed.");

const registered = listRegisteredCountablePyqObservations({
  packageId: "NUM-001",
  examIds: ["SSC_CGL_TIER_I"],
});
assert.equal(registered.length, 10);
assert.deepEqual(registered.map((entry) => entry.observationId), observations.map((entry) => entry.observationId));

const contract = getQuantV4SpecializedProfileSelectionContract("NUM-001", "SSC_CGL_TIER_I");
assert.equal(contract.normalizedCountableObservationCount, 10);
assert.equal(contract.selectionStatus, "EVIDENCE_ACCUMULATING_SELECTION_PENDING");
assert.equal(contract.empiricalEvidenceStatus, "NORMALIZED_COUNTABLE_EVIDENCE_ACCUMULATING");
assert.equal(contract.profileSelectionCalibrated, false);
assert.equal(contract.deliveryAllowed, true);
assert.ok(contract.blockers.includes("PROFILE_SAMPLE_INSUFFICIENT_FOR_CALIBRATION"));
assert.ok(contract.blockers.includes("CP_QL_DISTRIBUTION_UNPROVEN"));
assert.ok(contract.blockers.includes("DIFFICULTY_REPRESENTATION_UNCALIBRATED"));
assert.ok(contract.blockers.includes("DATED_PAPER_IDENTITY_INCOMPLETE"));
assert.ok(!contract.blockers.includes("NO_NORMALIZED_COUNTABLE_PYQ_EVIDENCE"));

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_NUMBER_SYSTEM_SSC_PYQ_NORMALIZATION_WAVE1_P2",
  authority: QUANT_V4_NUMBER_SYSTEM_SSC_WAVE1_PYQ_MIGRATION_AUTHORITY,
  normalizedObservationCount: observations.length,
  cpCoverage: QUANT_V4_NUMBER_SYSTEM_SSC_WAVE1_SOURCE_LIMITATIONS.cpCoverage,
  exactPaperIdentityResolved: false,
  selectionCalibrationAllowed: false,
}));
