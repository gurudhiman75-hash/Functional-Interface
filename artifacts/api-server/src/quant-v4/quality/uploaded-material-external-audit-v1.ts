export type ExternalAuditCoverage =
  | "DIRECTLY_COVERED"
  | "COVERED_WITH_VARIATION"
  | "MISSING"
  | "OUT_OF_SCOPE";

export type ExternalAuditSourceTier =
  | "REAL_EXAM_PAPER"
  | "SSC_EXAM_BOOK"
  | "GENERAL_APTITUDE_BOOK"
  | "OTHER_REFERENCE";

export type ExternalAuditSource = Readonly<{
  sourceId: string;
  title: string;
  sourceTier: ExternalAuditSourceTier;
  topic: string;
  ownerPackage: string;
  pageRange?: string;
  notes?: string;
}>;

/**
 * Quant V4 external-material audit authority.
 *
 * Uploaded/library books and papers are evidence sources only. They may expose
 * missing exam archetypes, weak variation or ownership errors, but they never
 * authorize production promotion by themselves.
 */
export const QUANT_V4_UPLOADED_MATERIAL_EXTERNAL_AUDIT_V1 = Object.freeze({
  version: "QUANT_V4_UPLOADED_MATERIAL_EXTERNAL_AUDIT_V1" as const,
  coverageClasses: [
    "DIRECTLY_COVERED",
    "COVERED_WITH_VARIATION",
    "MISSING",
    "OUT_OF_SCOPE",
  ] as const,
  evidenceOnly: true as const,
  productionPromotionAuthorized: false as const,
  minimumReviewFields: [
    "sourceId",
    "sourceQuestionRef",
    "normalizedArchetype",
    "ownerPackage",
    "coverageClass",
    "mappedQlIds",
    "notes",
  ] as const,
});

export const QUANT_V4_REGISTERED_EXTERNAL_AUDIT_SOURCES: readonly ExternalAuditSource[] = Object.freeze([
  Object.freeze({
    sourceId: "DISHA-SSC-MATH-TRIG",
    title: "Disha SSC Mathematics Guide in English — Trigonometry and Its Applications",
    sourceTier: "SSC_EXAM_BOOK" as const,
    topic: "Trigonometry and its applications",
    ownerPackage: "TRG-001/TRG-002",
    pageRange: "399-424 (PDF pages approximately 403-428; exercise evidence inspected at PDF 409-413)",
    notes: "Dense SSC-oriented source containing core identities, exact values, compound/cofunction forms, minima, algebraic trig relations, and Heights & Distances applications.",
  }),
  Object.freeze({
    sourceId: "RS-AGGARWAL-HEIGHTS-DISTANCES",
    title: "R.S. Aggarwal Quantitative Aptitude — Heights and Distances",
    sourceTier: "GENERAL_APTITUDE_BOOK" as const,
    topic: "Heights and Distances",
    ownerPackage: "TRG-002",
    pageRange: "870-876 (PDF pages 879-884)",
    notes: "Theory, solved examples and objective exercises including SSC/RRB/Bank-style elevation/depression, tower, ladder, shadow and motion forms.",
  }),
  Object.freeze({
    sourceId: "SSC-CGL-YEARWISE-2022",
    title: "30 Yearwise SSC CGL Solved Paper (English) 2022",
    sourceTier: "REAL_EXAM_PAPER" as const,
    topic: "Whole-section SSC CGL evidence",
    ownerPackage: "MULTI_PACKAGE",
  }),
  Object.freeze({
    sourceId: "SSC-CGL-YEARWISE-2023",
    title: "30 Yearwise SSC CGL Solved Paper (English) 2023",
    sourceTier: "REAL_EXAM_PAPER" as const,
    topic: "Whole-section SSC CGL evidence",
    ownerPackage: "MULTI_PACKAGE",
  }),
  Object.freeze({
    sourceId: "SSC-CGL-YEARWISE-2024",
    title: "30 Yearwise SSC CGL Solved Paper (English) 2024",
    sourceTier: "REAL_EXAM_PAPER" as const,
    topic: "Whole-section SSC CGL evidence",
    ownerPackage: "MULTI_PACKAGE",
  }),
]);

export function classifyExternalAuditCoverage(value: ExternalAuditCoverage) {
  return value;
}
