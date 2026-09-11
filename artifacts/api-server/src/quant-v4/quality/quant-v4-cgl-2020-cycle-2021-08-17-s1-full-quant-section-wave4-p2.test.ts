import assert from "node:assert/strict";

import { getQuantV4SpecializedProfileSelectionContract } from "../common/specialized-profile-selection";
import {
  buildQuantV4PyqFrequencyProfile,
  canReplaceProvisionalSimulationWeights,
  validatePyqObservationSet,
} from "./quant-v4-pyq-frequency-evidence-p2";
import {
  QUANT_V4_REGISTERED_PYQ_OBSERVATIONS,
} from "./quant-v4-pyq-observation-registry-p2";
import {
  QUANT_V4_CGL_2020_CYCLE_2021_08_17_S1_FULL_QUANT_SECTION_WAVE4_AUTHORITY,
  QUANT_V4_CGL_2020_CYCLE_2021_08_17_S1_FULL_QUANT_SECTION_WAVE4_COUNTABLE_PYQ_OBSERVATIONS,
  QUANT_V4_CGL_2020_CYCLE_2021_08_17_S1_FULL_QUANT_SECTION_WAVE4_SOURCE_LIMITATIONS,
} from "./quant-v4-pyq-observations-cgl-2020-cycle-2021-08-17-s1-full-quant-section-wave4-p2";
import {
  QUANT_V4_CGL_TIER_I_COMPLETE_SECTION_SPECS,
  QUANT_V4_CGL_TIER_I_WHOLE_SECTION_P2_AUDIT_POLICY,
  buildQuantV4WholeSectionFrequencyProfile,
  canPromoteWholeSectionFrequencyWeights,
} from "./quant-v4-whole-section-frequency-calibration-p2";

const PAPER_ID = "SSC-CGL-2020-TIER-I-2021-08-17-S1";
const observations = QUANT_V4_CGL_2020_CYCLE_2021_08_17_S1_FULL_QUANT_SECTION_WAVE4_COUNTABLE_PYQ_OBSERVATIONS;

assert.equal(
  QUANT_V4_CGL_2020_CYCLE_2021_08_17_S1_FULL_QUANT_SECTION_WAVE4_AUTHORITY,
  "QUANT-V4-CGL-2020-CYCLE-2021-08-17-S1-FULL-QUANT-SECTION-WAVE4-P2",
);
assert.equal(observations.length, 25);
validatePyqObservationSet(observations);
assert.ok(observations.every((entry) => entry.examId === "SSC_CGL_TIER_I"));
assert.ok(observations.every((entry) => entry.evidenceKind === "VERIFIED_PYQ_COLLECTION"));
assert.ok(observations.every((entry) => entry.paperId === PAPER_ID));
assert.ok(observations.every((entry) => entry.heldDate === "2021-08-17"));
assert.ok(observations.every((entry) => entry.shift === "Shift 1"));
assert.ok(observations.every((entry) => entry.questionRef?.startsWith("CRACKU-SSC-CGL-2020-CYCLE-2021-08-17-S1-Q")));
assert.equal(QUANT_V4_CGL_2020_CYCLE_2021_08_17_S1_FULL_QUANT_SECTION_WAVE4_SOURCE_LIMITATIONS.examCycle, "SSC CGL 2020");
assert.equal(QUANT_V4_CGL_2020_CYCLE_2021_08_17_S1_FULL_QUANT_SECTION_WAVE4_SOURCE_LIMITATIONS.wholeSectionNormalized, true);
assert.equal(QUANT_V4_CGL_2020_CYCLE_2021_08_17_S1_FULL_QUANT_SECTION_WAVE4_SOURCE_LIMITATIONS.completeSectionQuestionCount, 25);
assert.equal(QUANT_V4_CGL_2020_CYCLE_2021_08_17_S1_FULL_QUANT_SECTION_WAVE4_SOURCE_LIMITATIONS.exactPaperDuplicatesReused, 0);
assert.equal(QUANT_V4_CGL_2020_CYCLE_2021_08_17_S1_FULL_QUANT_SECTION_WAVE4_SOURCE_LIMITATIONS.frequencyCalibrationAllowed, false);

function qnum(questionRef: string | undefined): number {
  return Number(questionRef?.match(/Q(\d+)$/u)?.[1] ?? -1);
}

const section = QUANT_V4_REGISTERED_PYQ_OBSERVATIONS
  .filter((entry) => entry.examId === "SSC_CGL_TIER_I" && entry.paperId === PAPER_ID)
  .sort((left, right) => qnum(left.questionRef) - qnum(right.questionRef));
assert.equal(section.length, 25);
assert.deepEqual(section.map((entry) => qnum(entry.questionRef)), Array.from({ length: 25 }, (_, index) => 51 + index));
assert.equal(new Set(section.map((entry) => `${entry.paperId}:${entry.questionRef}`)).size, 25);

const packageCounts = Object.fromEntries(
  [...section.reduce((map, entry) => {
    const packageId = String(entry.packageId);
    map.set(packageId, (map.get(packageId) ?? 0) + 1);
    return map;
  }, new Map<string, number>()).entries()].sort(([left], [right]) => left.localeCompare(right)),
);
assert.deepEqual(packageCounts, {
  "ALG-001": 3,
  "AVG-001": 1,
  "DI-001": 4,
  "GEO-001": 2,
  "GEO-002": 2,
  "INT-001": 1,
  "MEN-002": 1,
  "NUM-001": 1,
  "PCT-002": 1,
  "PNL-001": 2,
  "RAP-001": 1,
  SAP: 1,
  "TMW-001": 1,
  "TRG-001": 3,
  "TSD-001": 1,
});
assert.equal(Object.values(packageCounts).reduce((sum, count) => sum + count, 0), 25);
assert.equal(Object.keys(packageCounts).length, 15);

// Representative source-math checks across the full section.
assert.ok(Math.abs(45 * (8 / 5) ** 2 - 115.2) < 1e-12); // Q51.
assert.equal(31866 / (36 + 32 + 45) * 32, 9024); // Q58.
const q60Principal = 13650 / 1.30;
assert.equal(q60Principal, 10500);
assert.ok(Math.abs(q60Principal * 1.075 ** 2 - 12134.0625) < 1e-9); // Q60.
assert.ok(Math.abs((640 + 0.15 * 640) * 1.15 - 846.4) < 1e-12); // Q62.
assert.equal(1500 * 0.8 - 991, 209); // Q64.
const q69x = 8;
const q69y = 7;
assert.equal(9482976 % 72, 0);
assert.equal(2 * q69x + 3 * q69y, 37); // Q69.
assert.equal(1 ** 3 + (-2) ** 3 + 0 ** 3, -7); // Q72.
const q74A = 45;
const q74B = 15;
assert.equal(q74A - q74B, 30);
assert.equal(q74A + q74B, 60);
assert.equal(2 * q74A - 3 * q74B, 45); // Q74.
assert.equal(18 ** 2 - (12 ** 2 + (6 * Math.sqrt(6)) ** 2), -36); // Q75.

assert.equal(QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.length, 158);

const avgCgl = getQuantV4SpecializedProfileSelectionContract("AVG-001", "SSC_CGL_TIER_I");
const numCgl = getQuantV4SpecializedProfileSelectionContract("NUM-001", "SSC_CGL_TIER_I");
const tmwCgl = getQuantV4SpecializedProfileSelectionContract("TMW-001", "SSC_CGL_TIER_I");
assert.equal(avgCgl.normalizedCountableObservationCount, 3);
assert.equal(numCgl.normalizedCountableObservationCount, 15);
assert.equal(tmwCgl.normalizedCountableObservationCount, 8);
for (const contract of [avgCgl, numCgl, tmwCgl]) {
  assert.equal(contract.selectionStatus, "EVIDENCE_ACCUMULATING_SELECTION_PENDING");
  assert.equal(contract.profileSelectionCalibrated, false);
}

const genericCgl = buildQuantV4PyqFrequencyProfile({
  examId: "SSC_CGL_TIER_I",
  observations: QUANT_V4_REGISTERED_PYQ_OBSERVATIONS,
  policy: {
    minDistinctPapers: 8,
    minCountableQuestions: 20,
    minTopicCoverage: 4,
    requireDatedPaperIdentity: true,
  },
});
assert.equal(genericCgl.countableQuestionCount, 125);
assert.equal(genericCgl.distinctPaperCount, 20);
assert.equal(genericCgl.topicCoverageCount, 11);
assert.equal(genericCgl.status, "INSUFFICIENT_EMPIRICAL_EVIDENCE");
assert.deepEqual([...genericCgl.blockers], ["DATED_PAPER_IDENTITY_INCOMPLETE"]);
assert.equal(canReplaceProvisionalSimulationWeights(genericCgl), false);

const wholeSection = buildQuantV4WholeSectionFrequencyProfile({
  examId: "SSC_CGL_TIER_I",
  observations: QUANT_V4_REGISTERED_PYQ_OBSERVATIONS,
  sections: QUANT_V4_CGL_TIER_I_COMPLETE_SECTION_SPECS,
  policy: QUANT_V4_CGL_TIER_I_WHOLE_SECTION_P2_AUDIT_POLICY,
});
assert.equal(wholeSection.completeSectionCount, 4);
assert.equal(wholeSection.completeQuestionCount, 100);
assert.equal(wholeSection.distinctSectionYearCount, 4);
assert.equal(wholeSection.packageCoverageCount, 20);
assert.equal(wholeSection.evidenceStatus, "SECTION_EVIDENCE_ACCUMULATING");
assert.deepEqual([...wholeSection.blockers], ["COMPLETE_SECTION_SAMPLE_BELOW_POLICY"]);
assert.equal(wholeSection.productionPromotionAuthorized, false);
assert.equal(canPromoteWholeSectionFrequencyWeights(wholeSection), false);

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_CGL_2020_CYCLE_2021_08_17_S1_FULL_QUANT_SECTION_WAVE4_P2",
  authority: QUANT_V4_CGL_2020_CYCLE_2021_08_17_S1_FULL_QUANT_SECTION_WAVE4_AUTHORITY,
  completeSectionQuestions: section.length,
  completeSectionPackages: Object.keys(packageCounts).length,
  registryObservationCount: QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.length,
  cglCountableQuestions: genericCgl.countableQuestionCount,
  cglDistinctPapers: genericCgl.distinctPaperCount,
  completeSections: wholeSection.completeSectionCount,
  completeSectionQuestionsTotal: wholeSection.completeQuestionCount,
  heldYears: wholeSection.distinctSectionYearCount,
  wholeSectionBlockers: wholeSection.blockers,
  empiricalWeightingPromoted: false,
}));
