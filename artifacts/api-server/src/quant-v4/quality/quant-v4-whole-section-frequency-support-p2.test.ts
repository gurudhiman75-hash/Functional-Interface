import assert from "node:assert/strict";

import { QUANT_V4_REGISTERED_PYQ_OBSERVATIONS } from "./quant-v4-pyq-observation-registry-p2";
import {
  QUANT_V4_CGL_TIER_I_COMPLETE_SECTION_SPECS,
  QUANT_V4_CGL_TIER_I_WHOLE_SECTION_P2_AUDIT_POLICY,
  buildQuantV4WholeSectionFrequencyProfile,
} from "./quant-v4-whole-section-frequency-calibration-p2";
import {
  QUANT_V4_WHOLE_SECTION_FREQUENCY_SUPPORT_AUTHORITY,
  buildQuantV4FrequencySupportAssessment,
} from "./quant-v4-whole-section-frequency-support-p2";

const profile = buildQuantV4WholeSectionFrequencyProfile({
  examId: "SSC_CGL_TIER_I",
  observations: QUANT_V4_REGISTERED_PYQ_OBSERVATIONS,
  sections: QUANT_V4_CGL_TIER_I_COMPLETE_SECTION_SPECS,
  policy: QUANT_V4_CGL_TIER_I_WHOLE_SECTION_P2_AUDIT_POLICY,
});
const assessment = buildQuantV4FrequencySupportAssessment(profile);

assert.equal(
  QUANT_V4_WHOLE_SECTION_FREQUENCY_SUPPORT_AUTHORITY,
  "QUANT-V4-WHOLE-SECTION-FREQUENCY-SUPPORT-P2",
);
assert.equal(assessment.sampleQuestionCount, 300);
assert.equal(assessment.completeSectionCount, 12);
assert.equal(assessment.productionWeightingAuthorized, false);

assert.deepEqual(assessment.coreEvidencePackages, [
  "TRG-001",
  "ALG-001",
  "TMW-001",
  "PNL-001",
  "DI-001",
  "TSD-001",
  "GEO-002",
  "NUM-001",
  "GEO-001",
  "MEN-002",
]);

assert.deepEqual(assessment.establishedEvidencePackages, [
  "INT-001",
  "MEN-001",
  "DI-003",
  "RAP-001",
  "ALG-002",
  "AVG-001",
  "PCT-001",
  "DI-005",
]);

assert.deepEqual(assessment.thinEvidencePackages, [
  "SAP",
  "PCT-002",
  "MAL-001",
  "RAP-002",
  "RAP-003",
  "DI-004",
  "PCT-007",
  "SRI-001",
  "SRI-002",
  "TSD-002",
]);

assert.equal(assessment.packages.length, 28);
assert.equal(
  assessment.packages.reduce((sum, entry) => sum + entry.questionCount, 0),
  300,
);
assert.ok(
  assessment.packages.every((entry) =>
    entry.sectionPresenceCount >= 1 &&
    entry.sectionPresenceCount <= 12 &&
    entry.sectionPresenceShare > 0 &&
    entry.sectionPresenceShare <= 1,
  ),
);

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_WHOLE_SECTION_FREQUENCY_SUPPORT_P2",
  sampleQuestions: assessment.sampleQuestionCount,
  completeSections: assessment.completeSectionCount,
  core: assessment.coreEvidencePackages.length,
  established: assessment.establishedEvidencePackages.length,
  thin: assessment.thinEvidencePackages.length,
  productionWeightingAuthorized: assessment.productionWeightingAuthorized,
}));
