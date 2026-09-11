import assert from "node:assert/strict";

import { getQuantV4SpecializedProfileSelectionContract } from "../common/specialized-profile-selection";
import {
  buildQuantV4PyqFrequencyProfile,
  canReplaceProvisionalSimulationWeights,
  validatePyqObservationSet,
} from "./quant-v4-pyq-frequency-evidence-p2";
import {
  QUANT_V4_REGISTERED_PYQ_OBSERVATIONS,
  listRegisteredCountablePyqObservations,
} from "./quant-v4-pyq-observation-registry-p2";
import {
  QUANT_V4_CGL_2023_S1_FULL_QUANT_SECTION_WAVE4_AUTHORITY,
  QUANT_V4_CGL_2023_S1_FULL_QUANT_SECTION_WAVE4_COUNTABLE_PYQ_OBSERVATIONS,
  QUANT_V4_CGL_2023_S1_FULL_QUANT_SECTION_WAVE4_SOURCE_LIMITATIONS,
} from "./quant-v4-pyq-observations-cgl-2023-07-27-s1-full-quant-section-wave4-p2";
import {
  QUANT_V4_CGL_TIER_I_COMPLETE_SECTION_SPECS,
  QUANT_V4_CGL_TIER_I_WHOLE_SECTION_P2_AUDIT_POLICY,
  buildQuantV4WholeSectionFrequencyProfile,
  canPromoteWholeSectionFrequencyWeights,
} from "./quant-v4-whole-section-frequency-calibration-p2";

const PAPER_ID = "SSC-CGL-2023-TIER-I-2023-07-27-S1";
const observations = QUANT_V4_CGL_2023_S1_FULL_QUANT_SECTION_WAVE4_COUNTABLE_PYQ_OBSERVATIONS;

assert.equal(
  QUANT_V4_CGL_2023_S1_FULL_QUANT_SECTION_WAVE4_AUTHORITY,
  "QUANT-V4-CGL-2023-07-27-S1-FULL-QUANT-SECTION-WAVE4-P2",
);
assert.equal(observations.length, 25);
validatePyqObservationSet(observations);
assert.ok(observations.every((entry) => entry.examId === "SSC_CGL_TIER_I"));
assert.ok(observations.every((entry) => entry.evidenceKind === "VERIFIED_PYQ_COLLECTION"));
assert.ok(observations.every((entry) => entry.paperId === PAPER_ID));
assert.ok(observations.every((entry) => entry.heldDate === "2023-07-27"));
assert.ok(observations.every((entry) => entry.shift === "Shift 1"));
assert.equal(QUANT_V4_CGL_2023_S1_FULL_QUANT_SECTION_WAVE4_SOURCE_LIMITATIONS.wholeSectionNormalized, true);
assert.equal(QUANT_V4_CGL_2023_S1_FULL_QUANT_SECTION_WAVE4_SOURCE_LIMITATIONS.completeSectionQuestionCount, 25);
assert.equal(QUANT_V4_CGL_2023_S1_FULL_QUANT_SECTION_WAVE4_SOURCE_LIMITATIONS.exactPaperDuplicatesReused, 0);
assert.equal(QUANT_V4_CGL_2023_S1_FULL_QUANT_SECTION_WAVE4_SOURCE_LIMITATIONS.frequencyCalibrationAllowed, false);
assert.equal(QUANT_V4_CGL_2023_S1_FULL_QUANT_SECTION_WAVE4_SOURCE_LIMITATIONS.sourceRenderingLimitations.length, 1);

function qnum(questionRef: string | undefined): number {
  return Number(questionRef?.match(/Q(\d+)$/u)?.[1] ?? -1);
}

const section = QUANT_V4_REGISTERED_PYQ_OBSERVATIONS
  .filter((entry) => entry.examId === "SSC_CGL_TIER_I" && entry.paperId === PAPER_ID)
  .sort((a, b) => qnum(a.questionRef) - qnum(b.questionRef));
assert.equal(section.length, 25);
assert.deepEqual(section.map((entry) => qnum(entry.questionRef)), Array.from({ length: 25 }, (_, i) => 51 + i));
assert.equal(new Set(section.map((entry) => `${entry.paperId}:${entry.questionRef}`)).size, 25);

const packageCounts = Object.fromEntries(
  [...section.reduce((map, entry) => {
    const packageId = String(entry.packageId);
    map.set(packageId, (map.get(packageId) ?? 0) + 1);
    return map;
  }, new Map<string, number>()).entries()].sort(([a], [b]) => a.localeCompare(b)),
);
assert.deepEqual(packageCounts, {
  "ALG-001": 3,
  "DI-003": 1,
  "DI-004": 1,
  "GEO-001": 1,
  "GEO-002": 1,
  "INT-001": 1,
  "MAL-001": 1,
  "MEN-001": 1,
  "MEN-002": 1,
  "NUM-001": 1,
  "PCT-002": 1,
  "PNL-001": 2,
  "RAP-001": 1,
  SAP: 1,
  "TMW-001": 3,
  "TRG-001": 3,
  "TSD-001": 2,
});
assert.equal(Object.values(packageCounts).reduce((sum, count) => sum + count, 0), 25);
assert.equal(Object.keys(packageCounts).length, 17);

// Exact source-math checks across cleanly rendered tasks. Q64 is intentionally excluded because the secondary source rendering is ambiguous.
assert.equal(20 ** 3 - 12 ** 3, 6272); // Q51.
assert.equal(20 ** 3 + 12 ** 3, 9728);
assert.ok(Math.abs((81 / 181) * 100 - 44.751381215469614) < 1e-12); // Q52.
assert.equal(16 ** 3 - 3 * 54 * 16, 1504); // Q53.
assert.equal((18 - 6) * 6, 4 * 18); // Q54.
assert.equal(25 ** 3 - 3 * 20 * 25, 14125); // Q55.
assert.equal(1125 / 5, 225); // Q56, relative speed 18 km/h = 5 m/s.
assert.equal(526 * 20, 10520); // Q57.
assert.equal(6 / 4 - 6 / 6, 0.5); // Q58.
assert.equal(4 / 3, 4 / 3); // Q59.
assert.equal(4500 / 6, 750); // Q62.
assert.equal(27000 * (44 / 3) / 100 * (8 / 12), 2640); // Q65.
assert.equal(80.4 / 20 - (-4.02) + 2.06, 10.1); // Q66.
assert.equal(13 * (7 - 6), 7 + 6); // Q67, exact form of (7/3+2)/(7/3-2)=13.
assert.equal(67 / 15 + 1 / 3 + 1 / 5, 5); // Q68.
assert.equal(792 / (0.75 * 0.88), 1200); // Q69.
assert.ok(13 / 18 < 7 / 9 && 13 / 18 < 5 / 6 && 13 / 18 < 11 / 12); // Q70.
assert.equal(4 * (22 / 7) * 7 ** 2 * 2, 1232); // Q71, ₹2 per cm².
assert.equal(1 / 6 + 1 / 9 + 1 / 11, 73 / 198); // Q72.
assert.equal((2 * 500 + 3 * 750) / 5, 650); // Q73.
assert.equal(0.5 * 1 * 5, 2.5); // Q74, factor of r².
assert.equal(1498 - 1388, 1.25 * (1388 - 1300)); // Q75.
assert.equal(1388 * 1.25, 1735);

assert.equal(QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.length, 158);
assert.equal(listRegisteredCountablePyqObservations({ packageId: "ALG-001" }).length, 21);
assert.equal(listRegisteredCountablePyqObservations({ packageId: "MAL-001" }).length, 1);
assert.equal(listRegisteredCountablePyqObservations({ packageId: "NUM-001" }).length, 21);
assert.equal(listRegisteredCountablePyqObservations({ packageId: "TMW-001" }).length, 15);
assert.equal(listRegisteredCountablePyqObservations({ packageId: "TSD-001" }).length, 9);
assert.equal(listRegisteredCountablePyqObservations({ packageId: "PNL-001" }).length, 8);

const malCgl = getQuantV4SpecializedProfileSelectionContract("MAL-001", "SSC_CGL_TIER_I");
const numCgl = getQuantV4SpecializedProfileSelectionContract("NUM-001", "SSC_CGL_TIER_I");
const tmwCgl = getQuantV4SpecializedProfileSelectionContract("TMW-001", "SSC_CGL_TIER_I");
assert.equal(malCgl.normalizedCountableObservationCount, 1);
assert.equal(numCgl.normalizedCountableObservationCount, 15);
assert.equal(tmwCgl.normalizedCountableObservationCount, 10);
for (const contract of [malCgl, numCgl, tmwCgl]) {
  assert.equal(contract.selectionStatus, "EVIDENCE_ACCUMULATING_SELECTION_PENDING");
  assert.equal(contract.profileSelectionCalibrated, false);
  assert.ok(!contract.blockers.includes("NO_NORMALIZED_COUNTABLE_PYQ_EVIDENCE"));
}

const cgl = buildQuantV4PyqFrequencyProfile({
  examId: "SSC_CGL_TIER_I",
  observations: QUANT_V4_REGISTERED_PYQ_OBSERVATIONS,
  policy: { minDistinctPapers: 8, minCountableQuestions: 20, minTopicCoverage: 4, requireDatedPaperIdentity: true },
});
assert.equal(cgl.countableQuestionCount, 125);
assert.equal(cgl.distinctPaperCount, 20);
assert.equal(cgl.topicCoverageCount, 12);
assert.equal(cgl.status, "INSUFFICIENT_EMPIRICAL_EVIDENCE");
assert.deepEqual([...cgl.blockers], ["DATED_PAPER_IDENTITY_INCOMPLETE"]);
assert.equal(canReplaceProvisionalSimulationWeights(cgl), false);

const wholeSection = buildQuantV4WholeSectionFrequencyProfile({
  examId: "SSC_CGL_TIER_I",
  observations: QUANT_V4_REGISTERED_PYQ_OBSERVATIONS,
  sections: QUANT_V4_CGL_TIER_I_COMPLETE_SECTION_SPECS,
  policy: QUANT_V4_CGL_TIER_I_WHOLE_SECTION_P2_AUDIT_POLICY,
});
assert.equal(wholeSection.completeSectionCount, 4);
assert.equal(wholeSection.completeQuestionCount, 100);
assert.equal(wholeSection.distinctSectionYearCount, 3);
assert.equal(wholeSection.packageCoverageCount, 22);
assert.equal(wholeSection.evidenceStatus, "SECTION_EVIDENCE_ACCUMULATING");
assert.deepEqual([...wholeSection.blockers], ["COMPLETE_SECTION_SAMPLE_BELOW_POLICY"]);
assert.equal(wholeSection.productionPromotionAuthorized, false);
assert.equal(canPromoteWholeSectionFrequencyWeights(wholeSection), false);

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_CGL_2023_S1_FULL_QUANT_SECTION_WAVE4_P2",
  authority: QUANT_V4_CGL_2023_S1_FULL_QUANT_SECTION_WAVE4_AUTHORITY,
  completeSectionQuestions: section.length,
  completeSectionPackages: Object.keys(packageCounts).length,
  registryObservationCount: QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.length,
  cglCountableQuestions: cgl.countableQuestionCount,
  cglDistinctPapers: cgl.distinctPaperCount,
  cglTopicCoverage: cgl.topicCoverageCount,
  completeSections: wholeSection.completeSectionCount,
  wholeSectionBlockers: wholeSection.blockers,
  malCglEvidenceCount: malCgl.normalizedCountableObservationCount,
  empiricalWeightingPromoted: false,
}));
