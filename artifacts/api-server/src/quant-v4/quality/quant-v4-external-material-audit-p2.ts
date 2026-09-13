export const QUANT_V4_EXTERNAL_MATERIAL_AUDIT_P2 = Object.freeze({
  authority: "QUANT-V4-EXTERNAL-MATERIAL-AUDIT-P2" as const,
  productionPromotionAuthorized: false as const,
  frequencyPromotionAuthorized: false as const,
  requiresHumanGapAdjudication: true as const,
});

export type ExternalMaterialSourceKind =
  | "REAL_PYQ_PDF"
  | "BOOK_PDF"
  | "COACHING_MATERIAL"
  | "DESIGN_REFERENCE"
  | "OTHER";

export type ExternalCoverageClassification =
  | "DIRECT"
  | "VARIANT"
  | "MISSING_EXAM_RELEVANT"
  | "BOUNDARY_OTHER_PACKAGE"
  | "OUT_OF_SCOPE"
  | "UNRESOLVED";

export type ExternalMaterialSource = Readonly<{
  sourceId: string;
  title: string;
  sourceKind: ExternalMaterialSourceKind;
  localFileName: string;
  exam?: string;
  year?: number;
  questionEvidenceEligible: boolean;
  frequencyEvidenceEligible: boolean;
  productionPromotionEligible: false;
  notes?: string;
}>;

export type ExternalMaterialObservation = Readonly<{
  observationId: string;
  sourceId: string;
  sourceLocator: string;
  targetPackageId: string;
  mappedQlId?: string;
  mappedFamily?: string;
  classification: ExternalCoverageClassification;
  examRelevant: boolean;
  rationale: string;
}>;

export const QUANT_V4_EXTERNAL_MATERIAL_SOURCES_P2: readonly ExternalMaterialSource[] = Object.freeze([
  Object.freeze({
    sourceId: "LIB-SSC-CGL-2022-SOLVED-PAPERS",
    title: "30 Yearwise SSC CGL Solved Paper (English) 2022",
    sourceKind: "REAL_PYQ_PDF" as const,
    localFileName: "30 Yearwise SSC CGL Solved Paper (English) 2022.pdf",
    exam: "SSC CGL",
    year: 2022,
    questionEvidenceEligible: true,
    frequencyEvidenceEligible: true,
    productionPromotionEligible: false as const,
    notes: "Uploaded Library source. Question-level evidence may be normalized into the existing Quant V4 PYQ/whole-section corpus.",
  }),
  Object.freeze({
    sourceId: "LIB-SSC-CGL-2023-SOLVED-PAPERS",
    title: "30 Yearwise SSC CGL Solved Paper (English) 2023",
    sourceKind: "REAL_PYQ_PDF" as const,
    localFileName: "30 Yearwise SSC CGL Solved Paper (English) 2023.pdf",
    exam: "SSC CGL",
    year: 2023,
    questionEvidenceEligible: true,
    frequencyEvidenceEligible: true,
    productionPromotionEligible: false as const,
    notes: "Uploaded Library source. Question-level evidence may be normalized into the existing Quant V4 PYQ/whole-section corpus.",
  }),
  Object.freeze({
    sourceId: "LIB-SSC-CGL-2024-SOLVED-PAPERS",
    title: "30 Yearwise SSC CGL Solved Paper (English) 2024",
    sourceKind: "REAL_PYQ_PDF" as const,
    localFileName: "30 Yearwise SSC CGL Solved Paper (English) 2024.pdf",
    exam: "SSC CGL",
    year: 2024,
    questionEvidenceEligible: true,
    frequencyEvidenceEligible: true,
    productionPromotionEligible: false as const,
    notes: "Uploaded Library source. Question-level evidence may be normalized into the existing Quant V4 PYQ/whole-section corpus.",
  }),
  Object.freeze({
    sourceId: "LIB-SPATIAL-MATH-FAMILY-DESIGN",
    title: "Mensuration Trigonometry and Spatial Math Chapter Family Design",
    sourceKind: "DESIGN_REFERENCE" as const,
    localFileName: "MENSURATION_TRIGONOMETRY_AND_SPATIAL_MATH_CHAPTER_FAMILY_DESIGN.md",
    questionEvidenceEligible: false,
    frequencyEvidenceEligible: false,
    productionPromotionEligible: false as const,
    notes: "Design/quality reference only: boundaries, stem standards, explanation standards, diagram rules and TRG-001/TRG-002 ownership.",
  }),
]);

export function summarizeExternalMaterialCoverage(observations: readonly ExternalMaterialObservation[]) {
  const counts: Record<ExternalCoverageClassification, number> = {
    DIRECT: 0,
    VARIANT: 0,
    MISSING_EXAM_RELEVANT: 0,
    BOUNDARY_OTHER_PACKAGE: 0,
    OUT_OF_SCOPE: 0,
    UNRESOLVED: 0,
  };

  for (const observation of observations) counts[observation.classification] += 1;

  const targetCoverageDenominator = counts.DIRECT + counts.VARIANT + counts.MISSING_EXAM_RELEVANT;
  const covered = counts.DIRECT + counts.VARIANT;

  return Object.freeze({
    total: observations.length,
    counts: Object.freeze(counts),
    targetCoverageDenominator,
    covered,
    coverageRate: targetCoverageDenominator === 0 ? null : covered / targetCoverageDenominator,
    missingExamRelevant: counts.MISSING_EXAM_RELEVANT,
    boundaryOtherPackage: counts.BOUNDARY_OTHER_PACKAGE,
    unresolved: counts.UNRESOLVED,
    productionPromotionAuthorized: false as const,
    frequencyPromotionAuthorized: false as const,
  });
}

export function canPromoteFromExternalMaterialAudit() {
  return false as const;
}
