export type QuantExternalSourceTier =
  | "A_REAL_EXAM_PYQ"
  | "B_TARGET_EXAM_BOOK"
  | "C_ADJACENT_EXAM_BOOK"
  | "D_INTERNAL_REFERENCE"
  | "E_UNQUALIFIED";

export type QuantExternalSourceIngestionStatus =
  | "READY"
  | "INDEX_WEAK"
  | "PAGE_EXTRACTION_REQUIRED"
  | "NOT_RELEVANT_TO_PACKAGE"
  | "BLOCKED";

export type QuantExternalCoverageDisposition =
  | "DIRECTLY_COVERED"
  | "COVERED_WITH_VARIATION"
  | "MISSING_ARCHETYPE"
  | "OWNED_BY_OTHER_PACKAGE"
  | "OUT_OF_TARGET_SCOPE"
  | "AMBIGUOUS_SOURCE_ITEM"
  | "EXTRACTION_FAILURE";

export type QuantExternalSource = Readonly<{
  sourceId: string;
  title: string;
  tier: QuantExternalSourceTier;
  targetExams: readonly string[];
  packages: readonly string[];
  ingestionStatus: QuantExternalSourceIngestionStatus;
  countInTargetCoverageDenominator: boolean;
  notes: string;
}>;

export type QuantExternalCoverageObservation = Readonly<{
  observationId: string;
  sourceId: string;
  sourceLocator: string;
  packageId: string;
  proposedFamily: string;
  disposition: QuantExternalCoverageDisposition;
  mappedQlIds: readonly string[];
  confidence: "HIGH" | "MEDIUM" | "LOW";
  notes: string;
}>;

export const QUANT_V4_EXTERNAL_SOURCE_AUDIT_V1 = Object.freeze({
  version: "QUANT_V4_EXTERNAL_SOURCE_AUDIT_V1" as const,
  principles: Object.freeze([
    "Uploaded books are evidence, not automatic package authority.",
    "Real-exam PYQs and target-exam books are reported separately from adjacent-exam material.",
    "A source contributes to a package denominator only when its source scope and item are relevant to that package.",
    "OWNED_BY_OTHER_PACKAGE is not a coverage failure for the audited package.",
    "OUT_OF_TARGET_SCOPE is not a coverage failure for the target exam profile.",
    "EXTRACTION_FAILURE is an ingestion defect and must never be counted as mathematical non-coverage.",
    "A book chapter name is not a coverage unit; the unit is the materially distinct exam-form/archetype represented by a question.",
    "No external-source result changes production activation or frequency weighting by itself.",
  ]),
  coverageDenominatorDispositions: Object.freeze([
    "DIRECTLY_COVERED",
    "COVERED_WITH_VARIATION",
    "MISSING_ARCHETYPE",
  ] as const),
  coveredDispositions: Object.freeze([
    "DIRECTLY_COVERED",
    "COVERED_WITH_VARIATION",
  ] as const),
});

export const QUANT_V4_EXTERNAL_SOURCES_V1: readonly QuantExternalSource[] = Object.freeze([
  Object.freeze({
    sourceId: "BOOK-RAKESH-YADAV-MATHS-7300",
    title: "Rakesh Yadav Maths 7300 Book PDF",
    tier: "B_TARGET_EXAM_BOOK" as const,
    targetExams: ["SSC", "Railway"],
    packages: ["ALL_QUANT_BY_SECTION"],
    ingestionStatus: "PAGE_EXTRACTION_REQUIRED" as const,
    countInTargetCoverageDenominator: true,
    notes: "High-value SSC-style book source. Project text index is weak/scanned; audit must use page-level extraction/inspection and must not treat failed text search as absence.",
  }),
  Object.freeze({
    sourceId: "BOOK-ARUN-SHARMA-QA-CAT-2018",
    title: "Arun Sharma - How to Prepare for Quantitative Aptitude for the CAT (2018)",
    tier: "C_ADJACENT_EXAM_BOOK" as const,
    targetExams: ["CAT", "MBA entrances", "general quantitative aptitude"],
    packages: ["SELECTIVE_CROSS_EXAM_ONLY"],
    ingestionStatus: "NOT_RELEVANT_TO_PACKAGE" as const,
    countInTargetCoverageDenominator: false,
    notes: "Useful as an adjacent-exam difficulty/novelty control where a matching topic exists. It must not define SSC TRG completeness and currently shows no reliable dedicated trigonometry retrieval in the Project index.",
  }),
  Object.freeze({
    sourceId: "INTERNAL-MENSURATION-TRIG-SPATIAL-DESIGN",
    title: "Mensuration, Trigonometry and Spatial Math Chapter Family Design",
    tier: "D_INTERNAL_REFERENCE" as const,
    targetExams: ["SSC", "Banking", "Punjab state exams"],
    packages: ["MEN-001", "MEN-002", "TRG-001", "TRG-002"],
    ingestionStatus: "READY" as const,
    countInTargetCoverageDenominator: false,
    notes: "Internal ownership/design authority. It validates package boundaries but is not external evidence of market/book coverage.",
  }),
]);

export function sourceById(sourceId: string) {
  return QUANT_V4_EXTERNAL_SOURCES_V1.find((source) => source.sourceId === sourceId) ?? null;
}

export function summarizeExternalCoverage(
  observations: readonly QuantExternalCoverageObservation[],
  sourceTier?: QuantExternalSourceTier,
) {
  const eligible = observations.filter((observation) => {
    const source = sourceById(observation.sourceId);
    if (!source || !source.countInTargetCoverageDenominator) return false;
    if (sourceTier && source.tier !== sourceTier) return false;
    return (QUANT_V4_EXTERNAL_SOURCE_AUDIT_V1.coverageDenominatorDispositions as readonly string[])
      .includes(observation.disposition);
  });

  const covered = eligible.filter((observation) =>
    (QUANT_V4_EXTERNAL_SOURCE_AUDIT_V1.coveredDispositions as readonly string[])
      .includes(observation.disposition),
  );

  return Object.freeze({
    eligible: eligible.length,
    covered: covered.length,
    missing: eligible.filter((observation) => observation.disposition === "MISSING_ARCHETYPE").length,
    coverageRate: eligible.length === 0 ? null : covered.length / eligible.length,
  });
}
