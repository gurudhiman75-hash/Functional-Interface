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
  QUANT_V4_CGL_2023_S2_FULL_QUANT_SECTION_WAVE2_AUTHORITY,
  QUANT_V4_CGL_2023_S2_FULL_QUANT_SECTION_WAVE2_COUNTABLE_PYQ_OBSERVATIONS,
  QUANT_V4_CGL_2023_S2_FULL_QUANT_SECTION_WAVE2_SOURCE_LIMITATIONS,
} from "./quant-v4-pyq-observations-cgl-2023-07-27-s2-full-quant-section-wave2-p2";

const PAPER_ID = "SSC-CGL-2023-TIER-I-2023-07-27-S2";
const PRIOR_PAPER_ID = "SSC-CGL-2024-TIER-I-2024-09-09-S1";
const observations = QUANT_V4_CGL_2023_S2_FULL_QUANT_SECTION_WAVE2_COUNTABLE_PYQ_OBSERVATIONS;

assert.equal(QUANT_V4_CGL_2023_S2_FULL_QUANT_SECTION_WAVE2_AUTHORITY, "QUANT-V4-CGL-2023-07-27-S2-FULL-QUANT-SECTION-WAVE2-P2");
assert.equal(observations.length, 24);
validatePyqObservationSet(observations);
assert.ok(observations.every((entry) => entry.examId === "SSC_CGL_TIER_I"));
assert.ok(observations.every((entry) => entry.evidenceKind === "VERIFIED_PYQ_COLLECTION"));
assert.ok(observations.every((entry) => entry.paperId === PAPER_ID));
assert.ok(observations.every((entry) => entry.heldDate === "2023-07-27"));
assert.ok(observations.every((entry) => entry.shift === "Shift 2"));
assert.equal(QUANT_V4_CGL_2023_S2_FULL_QUANT_SECTION_WAVE2_SOURCE_LIMITATIONS.wholeSectionNormalized, true);
assert.equal(QUANT_V4_CGL_2023_S2_FULL_QUANT_SECTION_WAVE2_SOURCE_LIMITATIONS.completeSectionQuestionCount, 25);
assert.equal(QUANT_V4_CGL_2023_S2_FULL_QUANT_SECTION_WAVE2_SOURCE_LIMITATIONS.priorObservationReused, "CGL-T1-XTOP-W1-2023-07-27-S2-Q29");
assert.equal(QUANT_V4_CGL_2023_S2_FULL_QUANT_SECTION_WAVE2_SOURCE_LIMITATIONS.frequencyCalibrationAllowed, false);

function questionNumber(questionRef: string | undefined): number {
  return Number(questionRef?.match(/Q(\d+)$/u)?.[1] ?? -1);
}
function sectionFor(paperId: string) {
  return QUANT_V4_REGISTERED_PYQ_OBSERVATIONS
    .filter((entry) => entry.examId === "SSC_CGL_TIER_I" && entry.paperId === paperId)
    .sort((a, b) => questionNumber(a.questionRef) - questionNumber(b.questionRef));
}

const section = sectionFor(PAPER_ID);
assert.equal(section.length, 25);
assert.deepEqual(section.map((entry) => questionNumber(entry.questionRef)), Array.from({ length: 25 }, (_, index) => 26 + index));
assert.equal(new Set(section.map((entry) => `${entry.paperId}:${entry.questionRef}`)).size, 25);
assert.equal(section.filter((entry) => entry.questionRef?.endsWith("Q29")).length, 1);
assert.equal(section.filter((entry) => entry.observationId === "CGL-T1-XTOP-W1-2023-07-27-S2-Q29").length, 1);
assert.equal(observations.some((entry) => entry.questionRef?.endsWith("Q29")), false);

const packageCounts = Object.fromEntries([...section.reduce((counts, entry) => {
  const packageId = String(entry.packageId);
  counts.set(packageId, (counts.get(packageId) ?? 0) + 1);
  return counts;
}, new Map<string, number>()).entries()].sort(([left], [right]) => left.localeCompare(right)));
assert.deepEqual(packageCounts, {
  "ALG-001": 2, "DI-001": 1, "DI-003": 1, "GEO-001": 1, "GEO-002": 2,
  "INT-001": 1, "MEN-002": 2, "NUM-001": 1, "PNL-001": 2, "RAP-001": 1,
  "RAP-003": 1, "SAP": 2, "TMW-001": 4, "TRG-001": 2, "TSD-001": 2,
});
assert.equal(Object.values(packageCounts).reduce((sum, count) => sum + count, 0), 25);
assert.equal(Object.keys(packageCounts).length, 15);

assert.equal(7500 / (0.04 * (11 - 6)), 37500);
assert.equal(54000 / 0.8, 67500);
assert.equal(1 / 12 + 1 / 15 + 1 / 10, 1 / 4);
assert.equal(2 / (1 / 12 + 1 / 15 + 1 / 10), 8);
assert.equal(1 / (0.25 / 3), 12);
assert.equal((85 - 80) / 80 * 100, 6.25);
assert.equal(300 - 50, 250);
assert.equal(60 / 12 * 3, 15);
assert.equal(12000 * 1.25, 15000);
assert.equal(196 - 2 * 63, 70);
assert.equal(208 / 13, 16);
assert.equal((6 * 5 / 18) * 828, 1380);
assert.equal((4 * 1) ** 2 / (3 * 1 ** 2), 16 / 3);
assert.equal(21 * 14 / (21 + 14), 8.4);
assert.equal(Math.sqrt(1 - (5 / 13) ** 2), 12 / 13);

const priorSection = sectionFor(PRIOR_PAPER_ID);
assert.equal(priorSection.length, 25);
const currentPackages = new Set(section.map((entry) => entry.packageId));
const priorPackages = new Set(priorSection.map((entry) => entry.packageId));
const sharedPackages = [...currentPackages].filter((packageId) => priorPackages.has(packageId));
assert.equal(currentPackages.size, 15);
assert.equal(priorPackages.size, 14);
assert.equal(sharedPackages.length, 11);
assert.ok(currentPackages.has("SAP"));
assert.ok(currentPackages.has("RAP-001"));
assert.ok(currentPackages.has("RAP-003"));
assert.ok(currentPackages.has("DI-003"));
assert.ok(!priorPackages.has("SAP"));
assert.ok(!priorPackages.has("RAP-001"));
assert.ok(!priorPackages.has("RAP-003"));
assert.ok(!priorPackages.has("DI-003"));

assert.equal(QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.length, 133);
assert.equal(listRegisteredCountablePyqObservations({ packageId: "ALG-001" }).length, 18);
assert.equal(listRegisteredCountablePyqObservations({ packageId: "NUM-001" }).length, 20);
assert.equal(listRegisteredCountablePyqObservations({ packageId: "PNL-001" }).length, 6);
assert.equal(listRegisteredCountablePyqObservations({ packageId: "TMW-001" }).length, 12);
assert.equal(listRegisteredCountablePyqObservations({ packageId: "TSD-001" }).length, 7);
assert.equal(listRegisteredCountablePyqObservations({ packageId: "SAP" }).length, 2);
assert.equal(listRegisteredCountablePyqObservations({ packageId: "RAP-001" }).length, 2);
assert.equal(listRegisteredCountablePyqObservations({ packageId: "RAP-003" }).length, 1);
assert.equal(listRegisteredCountablePyqObservations({ packageId: "DI-003" }).length, 2);

const numCgl = getQuantV4SpecializedProfileSelectionContract("NUM-001", "SSC_CGL_TIER_I");
assert.equal(numCgl.normalizedCountableObservationCount, 14);
assert.equal(numCgl.profileSelectionCalibrated, false);
assert.equal(numCgl.selectionStatus, "EVIDENCE_ACCUMULATING_SELECTION_PENDING");
const tmwCgl = getQuantV4SpecializedProfileSelectionContract("TMW-001", "SSC_CGL_TIER_I");
assert.equal(tmwCgl.normalizedCountableObservationCount, 7);
assert.equal(tmwCgl.profileSelectionCalibrated, false);
assert.equal(tmwCgl.selectionStatus, "EVIDENCE_ACCUMULATING_SELECTION_PENDING");

const cgl = buildQuantV4PyqFrequencyProfile({
  examId: "SSC_CGL_TIER_I",
  observations: QUANT_V4_REGISTERED_PYQ_OBSERVATIONS,
  policy: { minDistinctPapers: 8, minCountableQuestions: 20, minTopicCoverage: 4, requireDatedPaperIdentity: true },
});
assert.equal(cgl.countableQuestionCount, 100);
assert.equal(cgl.distinctPaperCount, 19);
assert.equal(cgl.topicCoverageCount, 11);
assert.equal(cgl.status, "INSUFFICIENT_EMPIRICAL_EVIDENCE");
assert.deepEqual([...cgl.blockers], ["DATED_PAPER_IDENTITY_INCOMPLETE"]);
assert.equal(canReplaceProvisionalSimulationWeights(cgl), false);

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_CGL_2023_S2_FULL_QUANT_SECTION_WAVE2_P2",
  authority: QUANT_V4_CGL_2023_S2_FULL_QUANT_SECTION_WAVE2_AUTHORITY,
  newObservations: observations.length,
  completeSectionQuestions: section.length,
  completeSectionPackages: Object.keys(packageCounts).length,
  previousCompleteSectionPackages: priorPackages.size,
  sharedCompleteSectionPackages: sharedPackages.length,
  registryObservationCount: QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.length,
  cglCountableQuestions: cgl.countableQuestionCount,
  cglDistinctPapers: cgl.distinctPaperCount,
  cglTopicCoverage: cgl.topicCoverageCount,
  cglBlockers: cgl.blockers,
  empiricalWeightingPromoted: false,
}));
