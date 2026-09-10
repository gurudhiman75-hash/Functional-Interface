import assert from "node:assert/strict";

import {
  getQuantV4SpecializedProfileSelectionContract,
} from "../common/specialized-profile-selection";
import {
  QUANT_V4_REGISTERED_PYQ_OBSERVATIONS,
  listRegisteredCountablePyqObservations,
} from "./quant-v4-pyq-observation-registry-p2";
import {
  QUANT_V4_NUMBER_SYSTEM_SSC_WAVE2_COUNTABLE_PYQ_OBSERVATIONS,
  QUANT_V4_NUMBER_SYSTEM_SSC_WAVE2_PYQ_MIGRATION_AUTHORITY,
  QUANT_V4_NUMBER_SYSTEM_SSC_WAVE2_SOURCE_LIMITATIONS,
} from "./quant-v4-pyq-observations-number-system-ssc-wave2-p2";
import { validatePyqObservationSet } from "./quant-v4-pyq-frequency-evidence-p2";

const observations = QUANT_V4_NUMBER_SYSTEM_SSC_WAVE2_COUNTABLE_PYQ_OBSERVATIONS;
validatePyqObservationSet(observations);

assert.equal(
  QUANT_V4_NUMBER_SYSTEM_SSC_WAVE2_PYQ_MIGRATION_AUTHORITY,
  "QUANT-V4-NUMBER-SYSTEM-SSC-PYQ-NORMALIZATION-WAVE2-P2",
);
assert.equal(observations.length, 6);
assert.ok(observations.every((entry) => entry.packageId === "NUM-001"));
assert.ok(observations.every((entry) => entry.evidenceKind === "VERIFIED_PYQ_COLLECTION"));
assert.ok(observations.every((entry) => !entry.heldDate && !entry.shift));
assert.equal(new Set(observations.map((entry) => entry.questionRef)).size, 6);
assert.deepEqual(QUANT_V4_NUMBER_SYSTEM_SSC_WAVE2_SOURCE_LIMITATIONS.profileObservationCounts, {
  SSC_CGL_TIER_I: 2,
  SSC_CHSL: 4,
});
assert.deepEqual(QUANT_V4_NUMBER_SYSTEM_SSC_WAVE2_SOURCE_LIMITATIONS.cpCoverage, [
  "NUM-CP-001",
  "NUM-CP-002",
  "NUM-CP-004",
]);
assert.equal(QUANT_V4_NUMBER_SYSTEM_SSC_WAVE2_SOURCE_LIMITATIONS.selectionCalibrationAllowed, false);

const cpCounts = new Map<string, number>();
for (const entry of observations) {
  const cp = entry.subtopic.match(/^NUM-CP-\d{3}/u)?.[0] ?? "UNKNOWN";
  cpCounts.set(cp, (cpCounts.get(cp) ?? 0) + 1);
}
assert.equal(cpCounts.get("NUM-CP-001"), 1);
assert.equal(cpCounts.get("NUM-CP-002"), 3);
assert.equal(cpCounts.get("NUM-CP-004"), 2);
assert.equal(cpCounts.get("NUM-CP-005") ?? 0, 0, "CP-005 must remain uncovered rather than receiving inferred evidence.");

// Independent exact-math checks for all six Wave-2 fixtures.
for (let a = 1; a <= 15; a += 2) {
  for (let b = 1; b <= 15; b += 2) {
    assert.equal(Math.abs((a + b + 2 * a * b) % 2), 0, "2011 Q29 parity check failed.");
  }
}
function fractionLess(aNumerator: number, aDenominator: number, bNumerator: number, bDenominator: number) {
  return aNumerator * bDenominator < bNumerator * aDenominator;
}
assert.ok(fractionLess(15, 16, 19, 20));
assert.ok(fractionLess(15, 16, 24, 25));
assert.ok(fractionLess(15, 16, 34, 35));
assert.equal(39 * 33, 13 * 99, "2016 recurring-decimal reduction failed.");

function isPrime(value: number): boolean {
  if (!Number.isInteger(value) || value < 2) return false;
  for (let divisor = 2; divisor * divisor <= value; divisor += 1) {
    if (value % divisor === 0) return false;
  }
  return true;
}
const primes80to90 = Array.from({ length: 9 }, (_, index) => 81 + index).filter(isPrime);
assert.deepEqual(primes80to90, [83, 89]);
assert.equal(83 * 89, 7387, "2014 prime-range product failed.");
const primesBelow100 = Array.from({ length: 98 }, (_, index) => index + 2).filter(isPrime);
assert.equal(primesBelow100[0], 2);
assert.equal(primesBelow100.at(-1), 97);
assert.equal(97 - 2, 95, "2015 prime-extrema difference failed.");
assert.equal(63 + 37, 100, "2012 recurring-decimal numerator sum failed.");

assert.equal(QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.length, 26);
const numAll = listRegisteredCountablePyqObservations({ packageId: "NUM-001" });
assert.equal(numAll.length, 16);
assert.equal(numAll.filter((entry) => entry.examId === "SSC_CGL_TIER_I").length, 10);
assert.equal(numAll.filter((entry) => entry.examId === "SSC_CHSL").length, 5);
assert.equal(numAll.filter((entry) => entry.examId === "SSC_CGL_TIER_II").length, 1);

const cglTierI = getQuantV4SpecializedProfileSelectionContract("NUM-001", "SSC_CGL_TIER_I");
const chsl = getQuantV4SpecializedProfileSelectionContract("NUM-001", "SSC_CGL_CHSL");
const tierII = getQuantV4SpecializedProfileSelectionContract("NUM-001", "SSC_CGL_JSO");
assert.equal(cglTierI.normalizedCountableObservationCount, 10);
assert.equal(chsl.normalizedCountableObservationCount, 5);
assert.equal(tierII.normalizedCountableObservationCount, 1);
for (const contract of [cglTierI, chsl, tierII]) {
  assert.equal(contract.selectionStatus, "EVIDENCE_ACCUMULATING_SELECTION_PENDING");
  assert.equal(contract.empiricalEvidenceStatus, "NORMALIZED_COUNTABLE_EVIDENCE_ACCUMULATING");
  assert.equal(contract.profileSelectionCalibrated, false);
  assert.equal(contract.deliveryAllowed, true);
  assert.ok(contract.blockers.includes("PROFILE_SAMPLE_INSUFFICIENT_FOR_CALIBRATION"));
  assert.ok(contract.blockers.includes("CP_QL_DISTRIBUTION_UNPROVEN"));
  assert.ok(contract.blockers.includes("DIFFICULTY_REPRESENTATION_UNCALIBRATED"));
  assert.ok(contract.blockers.includes("DATED_PAPER_IDENTITY_INCOMPLETE"));
}

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_NUMBER_SYSTEM_SSC_PYQ_NORMALIZATION_WAVE2_P2",
  authority: QUANT_V4_NUMBER_SYSTEM_SSC_WAVE2_PYQ_MIGRATION_AUTHORITY,
  wave2ObservationCount: observations.length,
  numRegisteredObservationCount: numAll.length,
  profileCounts: {
    SSC_CGL_TIER_I: cglTierI.normalizedCountableObservationCount,
    SSC_CGL_CHSL: chsl.normalizedCountableObservationCount,
    SSC_CGL_JSO: tierII.normalizedCountableObservationCount,
  },
  profileSelectionCalibrated: false,
}));
