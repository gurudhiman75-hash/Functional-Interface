import type { ClockTaskId } from "./catalog";
import {
  CLOCK_EFFECTIVE_CANDIDATE_DISPOSITION,
  CLOCK_EFFECTIVE_SOURCE_AUDIT,
  effectiveClockAuthorityClusters,
} from "./exam-natural-governance";

export type ClockSourceSaturationDisposition =
  | "CORE_OR_MERGED_COVERED"
  | "INTENTIONAL_ADVANCED_HOLD"
  | "INTERNAL_ONLY";

export interface ClockSourceSaturationRecord {
  taskId: ClockTaskId;
  disposition: ClockSourceSaturationDisposition;
  cluster: string;
  evidenceLevel: (typeof CLOCK_EFFECTIVE_SOURCE_AUDIT)[ClockTaskId]["evidenceLevel"];
}

export const CLOCK_SOURCE_SATURATION = Object.fromEntries(
  (Object.keys(CLOCK_EFFECTIVE_CANDIDATE_DISPOSITION) as ClockTaskId[]).map((taskId) => {
    const candidate = CLOCK_EFFECTIVE_CANDIDATE_DISPOSITION[taskId];
    const evidence = CLOCK_EFFECTIVE_SOURCE_AUDIT[taskId];
    const disposition: ClockSourceSaturationDisposition =
      candidate.disposition === "INTERNAL_VERIFICATION_ONLY"
        ? "INTERNAL_ONLY"
        : candidate.disposition === "HOLD_FOR_ADVANCED_SOURCE_CONFIRMATION"
          ? "INTENTIONAL_ADVANCED_HOLD"
          : "CORE_OR_MERGED_COVERED";
    return [taskId, {
      taskId,
      disposition,
      cluster: candidate.cluster,
      evidenceLevel: evidence.evidenceLevel,
    }];
  }),
) as Record<ClockTaskId, ClockSourceSaturationRecord>;

/**
 * Source anomalies are retained explicitly so printed guidebook mistakes or
 * merely adjacent examples can never override the exact solver authority.
 */
export const CLOCK_SOURCE_ANOMALIES = {
  STRIKE_COUNT_INTERVAL_CONFLICT: {
    evidenceRefs: ["RS_AGGARWAL_CLOCKS"] as const,
    decision: "DO_NOT_IMPORT_PRINTED_SOLUTION",
    note: "One uploaded strike example transfers total time by strike count, while the adjacent example correctly uses n-1 intervals. CLK-001 keeps n strikes = n-1 equal gaps as mathematical ground truth and treats the conflicting printed solution as source noise.",
  },
  PROGRESSIVE_GAIN_NOT_PIECEWISE_AFFINE: {
    evidenceRefs: ["RS_AGGARWAL_CLOCKS", "CLK_V2_DESIGN"] as const,
    decision: "DO_NOT_OVERCLAIM_SOURCE_MATCH",
    note: "An uploaded question has progressively changing hourly gain (1, 2, 4, 8, ... minutes). That does not directly source the current two-segment constant-rate PIECEWISE_RATE prototype, which therefore remains an advanced hold.",
  },
  INTERCHANGE_EXACT_PAIR_VS_ELAPSED_DURATION: {
    evidenceRefs: ["RS_AGGARWAL_CLOCKS", "DISHA_SSC_CLOCKS"] as const,
    decision: "PROMOTE_ELAPSED_DURATION_ONLY",
    note: "Both sources support the 720/13-minute interchange interval. Arbitrary exact time-pair reconstruction is mathematically valid but is not promoted from that evidence.",
  },
} as const;

export const CLOCK_SOURCE_SATURATION_POLICY = {
  status: "SOURCE_SATURATION_DECISION_COMPLETE_FOR_AUDITED_CORPUS",
  auditedScope: "UPLOADED_CLOCK_CORPUS_PLUS_CLK_V2_SCOPE",
  sourceCandidateRowsHaveDisposition: true,
  directSourceHoldsResolved: true,
  designSparseAnchorsProhibited: true,
  printedSourceAnomaliesIsolated: true,
  sourceSaturationComplete: true,
  authorityCountFrozen: false,
  difficultyAuditComplete: false,
  multilingualRiskAuditComplete: false,
  humanEditorialFreezeComplete: false,
  permanentQlAllocationAllowed: false,
  questionStudioDiscoveryAllowed: false,
  questionBankWritesAllowed: false,
  publicationAllowed: false,
} as const;

export function clockSourceSaturationSummary() {
  const rows = Object.values(CLOCK_SOURCE_SATURATION);
  return {
    sourceCandidateRows: rows.length,
    effectiveAuthorityClusters: effectiveClockAuthorityClusters(),
    coreOrMergedCovered: rows.filter((row) => row.disposition === "CORE_OR_MERGED_COVERED").length,
    intentionalAdvancedHolds: rows.filter((row) => row.disposition === "INTENTIONAL_ADVANCED_HOLD").length,
    internalOnly: rows.filter((row) => row.disposition === "INTERNAL_ONLY").length,
    sourceAnomalies: Object.keys(CLOCK_SOURCE_ANOMALIES).length,
    sourceSaturationComplete: CLOCK_SOURCE_SATURATION_POLICY.sourceSaturationComplete,
  } as const;
}
