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
  QUANT_V4_CGL_2024_S1_FULL_QUANT_SECTION_WAVE1_AUTHORITY,
  QUANT_V4_CGL_2024_S1_FULL_QUANT_SECTION_WAVE1_COUNTABLE_PYQ_OBSERVATIONS,
  QUANT_V4_CGL_2024_S1_FULL_QUANT_SECTION_WAVE1_SOURCE_LIMITATIONS,
} from "./quant-v4-pyq-observations-cgl-2024-s1-full-quant-section-wave1-p2";

const PAPER_ID = "SSC-CGL-2024-TIER-I-2024-09-09-S1";
const observations = QUANT_V4_CGL_2024_S1_FULL_QUANT_SECTION_WAVE1_COUNTABLE_PYQ_OBSERVATIONS;
assert.equal(QUANT_V4_CGL_2024_S1_FULL_QUANT_SECTION_WAVE1_AUTHORITY, "QUANT-V4-CGL-2024-S1-FULL-QUANT-SECTION-WAVE1-P2");
assert.equal(observations.length, 24);
validatePyqObservationSet(observations);
assert.ok(observations.every((entry) => entry.examId === "SSC_CGL_TIER_I"));
assert.ok(observations.every((entry) => entry.evidenceKind === "VERIFIED_PYQ_COLLECTION"));
assert.ok(observations.every((entry) => entry.paperId === PAPER_ID));
assert.ok(observations.every((entry) => entry.heldDate === "2024-09-09"));
assert.ok(observations.every((entry) => entry.shift === "Shift 1"));
assert.equal(QUANT_V4_CGL_2024_S1_FULL_QUANT_SECTION_WAVE1_SOURCE_LIMITATIONS.wholeSectionNormalized, true);
assert.equal(QUANT_V4_CGL_2024_S1_FULL_QUANT_SECTION_WAVE1_SOURCE_LIMITATIONS.frequencyCalibrationAllowed, false);

const section = QUANT_V4_REGISTERED_PYQ_OBSERVATIONS
  .filter((entry) => entry.examId === "SSC_CGL_TIER_I" && entry.paperId === PAPER_ID)
  .sort((a, b) => Number(a.questionRef?.match(/Q(\d+)$/u)?.[1] ?? 0) - Number(b.questionRef?.match(/Q(\d+)$/u)?.[1] ?? 0));
assert.equal(section.length, 25);
assert.deepEqual(section.map((entry) => Number(entry.questionRef?.match(/Q(\d+)$/u)?.[1] ?? -1)), Array.from({ length: 25 }, (_, index) => 51 + index));
assert.equal(new Set(section.map((entry) => `${entry.paperId}:${entry.questionRef}`)).size, 25);
assert.equal(section.filter((entry) => entry.questionRef?.endsWith("Q51")).length, 1);
assert.equal(section.filter((entry) => entry.observationId === "CGL-T1-XTOP-W1-2024-09-09-S1-Q51").length, 1);

const packageCounts = Object.fromEntries([...section.reduce((counts, entry) => {
  const packageId = String(entry.packageId);
  counts.set(packageId, (counts.get(packageId) ?? 0) + 1);
  return counts;
}, new Map<string, number>()).entries()].sort(([left], [right]) => left.localeCompare(right)));
assert.deepEqual(packageCounts, {
  "ALG-001": 2, "ALG-002": 2, "AVG-001": 1, "DI-001": 4, "GEO-001": 2, "GEO-002": 2,
  "INT-001": 1, "MEN-002": 1, "NUM-001": 1, "PCT-002": 1, "PNL-001": 2, "TMW-001": 2,
  "TRG-001": 3, "TSD-001": 1,
});
assert.equal(Object.values(packageCounts).reduce((sum, count) => sum + count, 0), 25);
assert.equal(Object.keys(packageCounts).length, 14);

assert.equal(840 / (12 - 6), 140);
assert.equal(110 / (21 + 1), 5);
assert.equal((3 / 5) / (4 / 25), 15 / 4);
assert.equal(550 * 60 / 100, 330);
assert.equal(330 * 100 / 110, 300);
assert.equal(75 * 2 + 80 * 3, 78 * 5);
assert.equal(34 * 27 / 17, 54);
assert.equal((9 / 16) * (16 / 9) * (25 / 9), 25 / 9);
assert.equal(1 * 1 - 11 * 1 + 10, 0);
assert.equal(10 * 10 - 11 * 10 + 10, 0);

assert.equal(QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.length, 208);
assert.equal(listRegisteredCountablePyqObservations({ packageId: "ALG-001" }).length, 27);
assert.equal(listRegisteredCountablePyqObservations({ packageId: "ALG-002" }).length, 11);
assert.equal(listRegisteredCountablePyqObservations({ packageId: "AVG-001" }).length, 9);
assert.equal(listRegisteredCountablePyqObservations({ packageId: "NUM-001" }).length, 23);
assert.equal(listRegisteredCountablePyqObservations({ packageId: "PNL-001" }).length, 11);
assert.equal(listRegisteredCountablePyqObservations({ packageId: "TMW-001" }).length, 22);
assert.equal(listRegisteredCountablePyqObservations({ packageId: "TSD-001" }).length, 12);
assert.equal(listRegisteredCountablePyqObservations({ packageId: "PCT-002" }).length, 9);

const avgCgl = getQuantV4SpecializedProfileSelectionContract("AVG-001", "SSC_CGL_TIER_I");
assert.equal(avgCgl.normalizedCountableObservationCount, 3);
assert.equal(avgCgl.selectionStatus, "EVIDENCE_ACCUMULATING_SELECTION_PENDING");
assert.ok(!avgCgl.blockers.includes("DATED_PAPER_IDENTITY_INCOMPLETE"));
const numCgl = getQuantV4SpecializedProfileSelectionContract("NUM-001", "SSC_CGL_TIER_I");
assert.equal(numCgl.normalizedCountableObservationCount, 17);
assert.equal(numCgl.selectionStatus, "EVIDENCE_ACCUMULATING_SELECTION_PENDING");
assert.ok(numCgl.blockers.includes("DATED_PAPER_IDENTITY_INCOMPLETE"));
const tmwCgl = getQuantV4SpecializedProfileSelectionContract("TMW-001", "SSC_CGL_TIER_I");
assert.equal(tmwCgl.normalizedCountableObservationCount, 17);
assert.equal(tmwCgl.selectionStatus, "EVIDENCE_ACCUMULATING_SELECTION_PENDING");
assert.ok(!tmwCgl.blockers.includes("DATED_PAPER_IDENTITY_INCOMPLETE"));

const cgl = buildQuantV4PyqFrequencyProfile({
  examId: "SSC_CGL_TIER_I",
  observations: QUANT_V4_REGISTERED_PYQ_OBSERVATIONS,
  policy: { minDistinctPapers: 8, minCountableQuestions: 20, minTopicCoverage: 4, requireDatedPaperIdentity: true },
});
assert.equal(cgl.countableQuestionCount, 175);
assert.equal(cgl.distinctPaperCount, 22);
assert.equal(cgl.topicCoverageCount, 13);
assert.equal(cgl.status, "INSUFFICIENT_EMPIRICAL_EVIDENCE");
assert.deepEqual([...cgl.blockers], ["DATED_PAPER_IDENTITY_INCOMPLETE"]);
assert.equal(canReplaceProvisionalSimulationWeights(cgl), false);

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_CGL_2024_S1_FULL_QUANT_SECTION_WAVE1_P2",
  authority: QUANT_V4_CGL_2024_S1_FULL_QUANT_SECTION_WAVE1_AUTHORITY,
  newObservations: observations.length,
  completeSectionQuestions: section.length,
  completeSectionPackages: Object.keys(packageCounts).length,
  registryObservationCount: QUANT_V4_REGISTERED_PYQ_OBSERVATIONS.length,
  cglCountableQuestions: cgl.countableQuestionCount,
  cglDistinctPapers: cgl.distinctPaperCount,
  cglTopicCoverage: cgl.topicCoverageCount,
  cglBlockers: cgl.blockers,
  empiricalWeightingPromoted: false,
}));
