import assert from "node:assert/strict";

import {
  QUANT_V4_EXTERNAL_MATERIAL_AUDIT_P2,
  QUANT_V4_EXTERNAL_MATERIAL_SOURCES_P2,
  canPromoteFromExternalMaterialAudit,
  summarizeExternalMaterialCoverage,
  type ExternalMaterialObservation,
} from "./quant-v4-external-material-audit-p2";

assert.equal(QUANT_V4_EXTERNAL_MATERIAL_AUDIT_P2.productionPromotionAuthorized, false);
assert.equal(QUANT_V4_EXTERNAL_MATERIAL_AUDIT_P2.frequencyPromotionAuthorized, false);
assert.equal(canPromoteFromExternalMaterialAudit(), false);

assert.equal(QUANT_V4_EXTERNAL_MATERIAL_SOURCES_P2.length, 4);
assert.equal(QUANT_V4_EXTERNAL_MATERIAL_SOURCES_P2.filter((source) => source.sourceKind === "REAL_PYQ_PDF").length, 3);
assert.equal(QUANT_V4_EXTERNAL_MATERIAL_SOURCES_P2.filter((source) => source.frequencyEvidenceEligible).length, 3);
assert.ok(QUANT_V4_EXTERNAL_MATERIAL_SOURCES_P2.every((source) => source.productionPromotionEligible === false));

const sample: ExternalMaterialObservation[] = [
  {
    observationId: "sample-1",
    sourceId: "LIB-SSC-CGL-2024-SOLVED-PAPERS",
    sourceLocator: "sample locator 1",
    targetPackageId: "TRG-001",
    mappedQlId: "TRG-001-QL-024",
    classification: "DIRECT",
    examRelevant: true,
    rationale: "Existing QL directly covers the observed archetype.",
  },
  {
    observationId: "sample-2",
    sourceId: "LIB-SSC-CGL-2023-SOLVED-PAPERS",
    sourceLocator: "sample locator 2",
    targetPackageId: "TRG-001",
    mappedQlId: "TRG-001-QL-126",
    classification: "VARIANT",
    examRelevant: true,
    rationale: "Same governing family but requires a controlled sibling construction.",
  },
  {
    observationId: "sample-3",
    sourceId: "LIB-SSC-CGL-2022-SOLVED-PAPERS",
    sourceLocator: "sample locator 3",
    targetPackageId: "TRG-001",
    classification: "MISSING_EXAM_RELEVANT",
    examRelevant: true,
    rationale: "No current runtime/authority home demonstrated.",
  },
  {
    observationId: "sample-4",
    sourceId: "LIB-SSC-CGL-2024-SOLVED-PAPERS",
    sourceLocator: "sample locator 4",
    targetPackageId: "TRG-001",
    mappedFamily: "HEIGHTS_AND_DISTANCES",
    classification: "BOUNDARY_OTHER_PACKAGE",
    examRelevant: true,
    rationale: "Exam-relevant trigonometry application belongs to TRG-002, not TRG-001.",
  },
  {
    observationId: "sample-5",
    sourceId: "LIB-SPATIAL-MATH-FAMILY-DESIGN",
    sourceLocator: "design example",
    targetPackageId: "TRG-001",
    classification: "OUT_OF_SCOPE",
    examRelevant: false,
    rationale: "Design reference is not question-frequency evidence.",
  },
];

const summary = summarizeExternalMaterialCoverage(sample);
assert.equal(summary.total, 5);
assert.equal(summary.covered, 2);
assert.equal(summary.targetCoverageDenominator, 3);
assert.equal(summary.coverageRate, 2 / 3);
assert.equal(summary.missingExamRelevant, 1);
assert.equal(summary.boundaryOtherPackage, 1);
assert.equal(summary.productionPromotionAuthorized, false);
assert.equal(summary.frequencyPromotionAuthorized, false);

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_EXTERNAL_MATERIAL_AUDIT_P2",
  registeredSources: QUANT_V4_EXTERNAL_MATERIAL_SOURCES_P2.length,
  productionPromotionAuthorized: false,
  frequencyPromotionAuthorized: false,
}));
