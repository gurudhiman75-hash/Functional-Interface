export type ExternalMaterialAuditDisposition =
  | "DIRECTLY_COVERED"
  | "COVERED_WITH_VARIATION"
  | "MISSING_ARCHETYPE"
  | "OUT_OF_SCOPE"
  | "NEEDS_MANUAL_REVIEW";

export type ExternalMaterialAuditOwnership =
  | "TRG-001"
  | "TRG-002"
  | "OTHER_QUANT_PACKAGE"
  | "OUT_OF_SCOPE"
  | "UNRESOLVED";

export type ExternalMaterialSource = Readonly<{
  sourceId: string;
  title: string;
  sourceType: "BOOK" | "COACHING_PDF" | "PYQ_COMPILATION" | "NOTES";
  evidenceRole: "COVERAGE_CHALLENGE_ONLY";
  productionAuthority: false;
}>;

export type ExternalMaterialObservation = Readonly<{
  observationId: string;
  sourceId: string;
  sourceLocation: string;
  sourceQuestionLabel: string;
  ownership: ExternalMaterialAuditOwnership;
  disposition: ExternalMaterialAuditDisposition;
  mappedPackageId?: string;
  mappedQlId?: string;
  archetype: string;
  notes: string;
}>;

export const QUANT_V4_EXTERNAL_MATERIAL_AUDIT_P2 = Object.freeze({
  version: "QUANT_V4_EXTERNAL_MATERIAL_AUDIT_P2" as const,
  purpose: "Challenge implemented Quant packages against uploaded books, coaching material and PYQ compilations." as const,
  evidenceRole: "COVERAGE_CHALLENGE_ONLY" as const,
  productionAuthority: false as const,
  canChangeFrequencyWeights: false as const,
  canAuthorizeActivation: false as const,
  dispositions: [
    "DIRECTLY_COVERED",
    "COVERED_WITH_VARIATION",
    "MISSING_ARCHETYPE",
    "OUT_OF_SCOPE",
    "NEEDS_MANUAL_REVIEW",
  ] as const,
  requiredWorkflow: [
    "REGISTER_SOURCE",
    "EXTRACT_QUESTION_ARCHETYPES",
    "ASSIGN_PACKAGE_OWNERSHIP",
    "MAP_TO_EXISTING_RUNTIME_OR_QL",
    "RECORD_GAPS_WITH_EVIDENCE",
    "REMEDIATE_ONLY_CONFIRMED_EXAM_RELEVANT_GAPS",
    "RETEST_AFTER_REMEDIATION",
  ] as const,
});

export const QUANT_V4_EXTERNAL_MATERIAL_SOURCES_P2: readonly ExternalMaterialSource[] = Object.freeze([
  Object.freeze({
    sourceId: "BOOK-DISHA-SSC-MATHEMATICS-GUIDE",
    title: "Disha SSC Mathematics Guide in English",
    sourceType: "BOOK",
    evidenceRole: "COVERAGE_CHALLENGE_ONLY",
    productionAuthority: false,
  }),
  Object.freeze({
    sourceId: "BOOK-RAKESH-YADAV-MATHS-7300",
    title: "Rakesh Yadav Maths 7300",
    sourceType: "PYQ_COMPILATION",
    evidenceRole: "COVERAGE_CHALLENGE_ONLY",
    productionAuthority: false,
  }),
]);
