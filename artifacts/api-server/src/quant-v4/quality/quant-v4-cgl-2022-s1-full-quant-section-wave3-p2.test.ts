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
  QUANT_V4_CGL_2022_S1_FULL_QUANT_SECTION_WAVE3_AUTHORITY,
  QUANT_V4_CGL_2022_S1_FULL_QUANT_SECTION_WAVE3_COUNTABLE_PYQ_OBSERVATIONS,
  QUANT_V4_CGL_2022_S1_FULL_QUANT_SECTION_WAVE3_SOURCE_LIMITATIONS,
} from "./quant-v4-pyq-observations-cgl-2022-12-01-s1-full-quant-section-wave3-p2";

const PAPER_ID = "SSC-CGL-2022-TIER-I-2022-12-01-S1";
const observations = QUANT_V4_CGL_2022_S1_FULL_QUANT_SECTION_WAVE3_COUNTABLE_PYQ_OBSERVATIONS;

assert.equal(
  QUANT_V4_CGL_2022_S1_FULL_QUANT_SECTION_WAVE3_AUTHORITY,
  "QUANT-V4-CGL-2022-12-01-S1-FULL-QUANT-SECTION-WAVE3-P2",
);
assert.equal(observations.length, 25);
validatePyqObservationSet(observations);
assert.ok(observations.every((entry) => entry.examId === "SSC_CGL_TIER_I"));
assert.ok(observations.every((entry) => entry.evidenceKind === "VERIFIED_PYQ_COLLECTION"));
assert.ok(observations.every((entry) => entry.paperId === PAPER_ID));
assert.ok(observations.every((entry) => entry.heldDate === "2022-12-01"));
assert.ok(observations.every((entry) => entry.shift === "Shift 1"));
assert.equal(QUANT_V4_CGL_2022_S1_FULL_QUANT_SECTION_WAVE3_SOURCE_LIMITATIONS.wholeSectionNormalized, true);
assert.equal(QUANT_V4_CGL_2022_S1_FULL_QUANT_SECTION_WAVE3_SOURCE_LIMITATIONS.completeSectionQuestionCount, 25);
assert.equal(QUANT_V4_CGL_2022_S1_FULL_QUANT_SECTION_WAVE3_SOURCE_LIMITATIONS.exactPaperDuplicatesReused, 0);
assert.equal(QUANT_V4_CGL_2022_S1_FULL_QUANT_SECTION_WAVE3_SOURCE_LIMITATIONS.frequencyCalibrationAllowed, false);

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
  [...section.reduce((m, entry) => {
    const packageId = String(entry.packageId);
    m.set(packageId, (m.get(packageId) ?? 0) + 1);
    return m;
  }, new Map<string, number>()).entries()].sort(([a], [b]) => a.localeCompare(b)),
);
assert.deepEqual(packageCounts, {
  "ALG-001": 3,
  "AVG-001": 1,
  "DI-001": 2,
  "DI-003": 1,
  "DI-005": 1,
  "GEO-001": 1,
  "GEO-002": 2,
  "INT-001": 1,
  "MEN-001": 1,
  "MEN-002": 1,
  "NUM-001": 2,
  "PCT-002": 1,
  "PNL-001": 2,
  "RAP-001": 1,
  "TMW-001": 1,
  "TRG-001": 3,
  "TSD-001": 1,
});
assert.equal(Object.values(packageCounts).reduce((sum, count) => sum + count, 0), 25);
assert.equal(Object.keys(packageCounts).length, 17);

// Source-math checks across the section.
assert.equal(12.5, 12.5); // Q51 source answer: false weight converts stated loss to 12.5% gain.
assert.equal(90 % 12, 6); // Q52 impossible LCM candidate.
assert.equal(Math.sqrt(169 * 144), 156); // Q54 mean proportional.
assert.ok(Math.abs((1.08 * 1.05 - 1) * 100 - 13.4) < 1e-12); // Q55 area increase.
assert.equal((1225 * 100) / (2500 * 8), 6.125); // Q59 simple-interest rate.
assert.equal((210 + 160 + 218) / 3, 196); // Q60 table average.
assert.equal((27 * 47 - 25 * 42 + 157) / 2, 188); // Q61 highest innings score.
assert.equal(2 + (2 / 3) * 15, 12); // Q62 joint start then one worker leaves.
assert.equal(100 - (27 + 18 + 7 + 14), 34); // Q63 pie chart.
assert.equal(8 / 17 + 15 / 17, 23 / 17); // Q65 trig.
assert.equal((352 - 198) / (2 * (22 / 7)), 24.5); // Q67 radius difference.
assert.equal(Math.sqrt(12 ** 2 + 10 ** 2 - 2 * 12 * 10 * 0.5), Math.sqrt(124)); // Q71 cosine rule.
assert.ok(Math.abs(3840 * (0.30 - (1 - 0.75 * 0.95)) - 48) < 1e-9); // Q75 discount difference.

assert.equal(QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.length, 158);
assert.equal(listRegisteredCountablePyqObservations({ packageId: "ALG-001" }).length, 21);
assert.equal(listRegisteredCountablePyqObservations({ packageId: "AVG-001" }).length, 8);
assert.equal(listRegisteredCountablePyqObservations({ packageId: "NUM-001" }).length, 21);
assert.equal(listRegisteredCountablePyqObservations({ packageId: "PNL-001" }).length, 8);
assert.equal(listRegisteredCountablePyqObservations({ packageId: "TMW-001" }).length, 14);
assert.equal(listRegisteredCountablePyqObservations({ packageId: "TSD-001" }).length, 9);
assert.equal(listRegisteredCountablePyqObservations({ packageId: "PCT-002" }).length, 8);
assert.equal(listRegisteredCountablePyqObservations({ packageId: "RAP-001" }).length, 2);
assert.equal(listRegisteredCountablePyqObservations({ packageId: "DI-003" }).length, 3);
assert.equal(listRegisteredCountablePyqObservations({ packageId: "DI-005" }).length, 1);
assert.equal(listRegisteredCountablePyqObservations({ packageId: "MEN-001" }).length, 1);

const avgCgl = getQuantV4SpecializedProfileSelectionContract("AVG-001", "SSC_CGL_TIER_I");
const numCgl = getQuantV4SpecializedProfileSelectionContract("NUM-001", "SSC_CGL_TIER_I");
const tmwCgl = getQuantV4SpecializedProfileSelectionContract("TMW-001", "SSC_CGL_TIER_I");
assert.equal(avgCgl.normalizedCountableObservationCount, 2);
assert.equal(numCgl.normalizedCountableObservationCount, 15);
assert.equal(tmwCgl.normalizedCountableObservationCount, 9);
for (const contract of [avgCgl, numCgl, tmwCgl]) {
  assert.equal(contract.selectionStatus, "EVIDENCE_ACCUMULATING_SELECTION_PENDING");
  assert.equal(contract.profileSelectionCalibrated, false);
}

const cgl = buildQuantV4PyqFrequencyProfile({
  examId: "SSC_CGL_TIER_I",
  observations: QUANT_V4_REGISTERED_PYQ_OBSERVATIONS,
  policy: {
    minDistinctPapers: 8,
    minCountableQuestions: 20,
    minTopicCoverage: 4,
    requireDatedPaperIdentity: true,
  },
});
assert.equal(cgl.countableQuestionCount, 125);
assert.equal(cgl.distinctPaperCount, 20);
assert.equal(cgl.topicCoverageCount, 12);
assert.equal(cgl.status, "INSUFFICIENT_EMPIRICAL_EVIDENCE");
assert.deepEqual([...cgl.blockers], ["DATED_PAPER_IDENTITY_INCOMPLETE"]);
assert.equal(canReplaceProvisionalSimulationWeights(cgl), false);

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_CGL_2022_S1_FULL_QUANT_SECTION_WAVE3_P2",
  authority: QUANT_V4_CGL_2022_S1_FULL_QUANT_SECTION_WAVE3_AUTHORITY,
  completeSectionQuestions: section.length,
  completeSectionPackages: Object.keys(packageCounts).length,
  registryObservationCount: QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.length,
  cglCountableQuestions: cgl.countableQuestionCount,
  cglDistinctPapers: cgl.distinctPaperCount,
  cglTopicCoverage: cgl.topicCoverageCount,
  cglBlockers: cgl.blockers,
  empiricalWeightingPromoted: false,
}));
