import assert from "node:assert/strict";

import { getQuantV4SpecializedProfileSelectionContract } from "../common/specialized-profile-selection";
import { validatePyqObservationSet } from "./quant-v4-pyq-frequency-evidence-p2";
import { QUANT_V4_REGISTERED_PYQ_OBSERVATIONS } from "./quant-v4-pyq-observation-registry-p2";
import {
  QUANT_V4_TMW_CHSL_WAVE1_COUNTABLE_PYQ_OBSERVATIONS,
  QUANT_V4_TMW_CHSL_WAVE1_PYQ_MIGRATION_AUTHORITY,
  QUANT_V4_TMW_CHSL_WAVE1_SOURCE_LIMITATIONS,
} from "./quant-v4-pyq-observations-tmw-chsl-wave1-p2";

const observations = QUANT_V4_TMW_CHSL_WAVE1_COUNTABLE_PYQ_OBSERVATIONS;

assert.equal(QUANT_V4_TMW_CHSL_WAVE1_PYQ_MIGRATION_AUTHORITY, "QUANT-V4-TMW-CHSL-PYQ-NORMALIZATION-WAVE1-P2");
assert.equal(observations.length, 5);
validatePyqObservationSet(observations);
assert.ok(observations.every((entry) => entry.examId === "SSC_CHSL"));
assert.ok(observations.every((entry) => entry.packageId === "TMW-001"));
assert.ok(observations.every((entry) => entry.evidenceKind === "VERIFIED_PYQ_COLLECTION"));
assert.ok(observations.every((entry) => !entry.heldDate && !entry.shift));
assert.ok(observations.every((entry) => entry.paperId?.includes("IDENTITY-UNRESOLVED")));
assert.equal(new Set(observations.map((entry) => `${entry.examId}:${entry.paperId}:${entry.questionRef}`)).size, 5);
assert.deepEqual(QUANT_V4_TMW_CHSL_WAVE1_SOURCE_LIMITATIONS.packageCounts, { "TMW-001": 5 });
assert.deepEqual(QUANT_V4_TMW_CHSL_WAVE1_SOURCE_LIMITATIONS.profileObservationCounts, { SSC_CHSL: 5 });
assert.deepEqual([...QUANT_V4_TMW_CHSL_WAVE1_SOURCE_LIMITATIONS.cpCoverage], [
  "TMW-CP-002", "TMW-CP-003", "TMW-CP-004", "TMW-CP-005", "TMW-CP-010",
]);
assert.deepEqual([...QUANT_V4_TMW_CHSL_WAVE1_SOURCE_LIMITATIONS.excludedCrossTopicQuestions], ["DISHA-PDF-PAGE-167-Q56"]);
assert.equal(QUANT_V4_TMW_CHSL_WAVE1_SOURCE_LIMITATIONS.selectionCalibrationAllowed, false);
assert.equal(QUANT_V4_TMW_CHSL_WAVE1_SOURCE_LIMITATIONS.frequencyCalibrationAllowed, false);

assert.equal(9 * 4, 12 * 3);
assert.equal((12 - 9) * 20, 12 * 5);
const q57ATime = 30;
const q57BTime = 90;
assert.equal(q57BTime - q57ATime, 60);
assert.equal(q57BTime, 3 * q57ATime);
assert.equal(q57ATime * q57BTime / (q57ATime + q57BTime), 45 / 2);
assert.equal(20 * 30 / (20 + 30), 12);
const q59CommonDenominator = 135;
const q59CycleNumerator = 15 + 9;
assert.equal(q59CycleNumerator * 5, 120);
assert.equal(q59CommonDenominator - q59CycleNumerator * 5, 15);
assert.equal(15 * 9, q59CommonDenominator);
assert.equal(10 + 1, 11);
const q60CommonDenominator = 180;
const q60FillNumerator = 5 + 4;
const q60OutletNumerator = 6;
assert.equal(q60FillNumerator * 20, q60CommonDenominator);
assert.equal(20 - 7, 13);
assert.equal((q60FillNumerator - q60OutletNumerator) * 60, q60CommonDenominator);
assert.equal(13 * 60 / 20, 39);
assert.equal(7 + 39, 46);

const registryObservationIds = new Set(QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.map((entry) => entry.observationId));
assert.ok(observations.every((entry) => registryObservationIds.has(entry.observationId)));

// Specialized-selection contracts are package policy and remain valid local gates;
// global registry/profile totals are tested centrally instead of here.
const tmwChslContract = getQuantV4SpecializedProfileSelectionContract("TMW-001", "SSC_CGL_CHSL");
assert.equal(tmwChslContract.normalizedCountableObservationCount, 5);
assert.equal(tmwChslContract.selectionStatus, "EVIDENCE_ACCUMULATING_SELECTION_PENDING");
assert.equal(tmwChslContract.profileSelectionCalibrated, false);
assert.ok(tmwChslContract.blockers.includes("PROFILE_SAMPLE_INSUFFICIENT_FOR_CALIBRATION"));
assert.ok(tmwChslContract.blockers.includes("DATED_PAPER_IDENTITY_INCOMPLETE"));

const tmwCglContract = getQuantV4SpecializedProfileSelectionContract("TMW-001", "SSC_CGL_TIER_I");
assert.equal(tmwCglContract.selectionStatus, "EVIDENCE_ACCUMULATING_SELECTION_PENDING");
assert.ok(!tmwCglContract.blockers.includes("DATED_PAPER_IDENTITY_INCOMPLETE"));

for (const profile of ["SSC_CGL_JSO", "PUNJAB_STATE", "BANKING_PRELIMS", "BANKING_MAINS"] as const) {
  const contract = getQuantV4SpecializedProfileSelectionContract("TMW-001", profile);
  assert.equal(contract.normalizedCountableObservationCount, 0);
  assert.equal(contract.selectionStatus, "EVIDENCE_GATED_SELECTION_PENDING");
}

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_TMW_CHSL_PYQ_NORMALIZATION_WAVE1_P2",
  authority: QUANT_V4_TMW_CHSL_WAVE1_PYQ_MIGRATION_AUTHORITY,
  wave1ObservationCount: observations.length,
  registeredLocally: observations.every((entry) => registryObservationIds.has(entry.observationId)),
  empiricalWeightingPromoted: false,
}));
