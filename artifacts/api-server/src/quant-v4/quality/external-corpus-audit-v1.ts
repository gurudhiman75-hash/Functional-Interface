export const QUANT_V4_EXTERNAL_CORPUS_AUDIT_V1 = Object.freeze({
  version: "QUANT_V4_EXTERNAL_CORPUS_AUDIT_V1" as const,
  purpose: "Validate Question Studio runtime coverage against uploaded books, PYQ compilations and coaching material without treating those sources as production content.",
  productionPromotionAuthorized: false as const,
});

export type ExternalCorpusCoverageStatus =
  | "DIRECT_RUNTIME_MATCH"
  | "FAMILY_MATCH_RUNTIME_DEMO_NEEDED"
  | "MISSING_CONSTRUCTION_CANDIDATE"
  | "OWNED_BY_OTHER_PACKAGE"
  | "OUT_OF_SCOPE_FOR_TARGET_EXAMS"
  | "SOURCE_PARSE_UNCERTAIN";

export type ExternalCorpusObservation = Readonly<{
  sourceId: string;
  sourceTitle: string;
  sourcePage: number | null;
  sourceQuestion: string;
  examTag: string | null;
  targetPackage: string;
  archetype: string;
  status: ExternalCorpusCoverageStatus;
  mappedQlId?: string | null;
  runtimeEvidence?: string | null;
  note?: string | null;
}>;

export function summarizeExternalCorpusCoverage(observations: readonly ExternalCorpusObservation[]) {
  const byStatus = Object.fromEntries([
    "DIRECT_RUNTIME_MATCH",
    "FAMILY_MATCH_RUNTIME_DEMO_NEEDED",
    "MISSING_CONSTRUCTION_CANDIDATE",
    "OWNED_BY_OTHER_PACKAGE",
    "OUT_OF_SCOPE_FOR_TARGET_EXAMS",
    "SOURCE_PARSE_UNCERTAIN",
  ].map((status) => [status, observations.filter((entry) => entry.status === status).length]));

  const inScope = observations.filter((entry) =>
    entry.status !== "OUT_OF_SCOPE_FOR_TARGET_EXAMS" && entry.status !== "SOURCE_PARSE_UNCERTAIN"
  );
  const demonstrated = inScope.filter((entry) => entry.status === "DIRECT_RUNTIME_MATCH");
  const familyCovered = inScope.filter((entry) =>
    entry.status === "DIRECT_RUNTIME_MATCH" || entry.status === "FAMILY_MATCH_RUNTIME_DEMO_NEEDED"
  );

  return Object.freeze({
    total: observations.length,
    inScope: inScope.length,
    directRuntimeMatches: demonstrated.length,
    familyCoverageCandidates: familyCovered.length,
    directRuntimeCoverageRate: inScope.length ? demonstrated.length / inScope.length : 0,
    familyCoverageRate: inScope.length ? familyCovered.length / inScope.length : 0,
    byStatus: Object.freeze(byStatus),
    productionPromotionAuthorized: false as const,
  });
}

/**
 * Audit policy:
 * - Book/PYQ material is evidence only; never copy source wording into production banks.
 * - Conceptual similarity is not enough for DIRECT_RUNTIME_MATCH.
 * - DIRECT_RUNTIME_MATCH requires a reproducible Question Studio/runtime construction.
 * - FAMILY_MATCH_RUNTIME_DEMO_NEEDED means the authority appears to own the mathematics,
 *   but the exact book construction still needs generated evidence.
 * - MISSING_CONSTRUCTION_CANDIDATE is a gap candidate, not an automatic implementation order.
 * - Package ownership is checked before declaring a gap (e.g. Heights & Distances -> TRG-002).
 */
export const QUANT_V4_EXTERNAL_CORPUS_AUDIT_POLICY_V1 = Object.freeze({
  sourceContentMayBeCopiedToProduction: false as const,
  conceptualCoverageCountsAsRuntimeCoverage: false as const,
  runtimeEvidenceRequiredForDirectMatch: true as const,
  packageOwnershipCheckRequired: true as const,
  humanReviewRequiredBeforeGapPromotion: true as const,
});
