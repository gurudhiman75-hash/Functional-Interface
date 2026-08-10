import type { ClockTaskId } from "./catalog";
import { CLOCK_DIFFICULTY_POLICY } from "./difficulty-governance";
import { CLOCK_BOUNDARY_AUDIT, CLOCK_INVERSE_AUDIT } from "./discovery-gates";
import {
  CLOCK_EFFECTIVE_CANDIDATE_DISPOSITION,
  CLOCK_EFFECTIVE_SOURCE_AUDIT,
  effectiveClockAuthorityClusters,
} from "./exam-natural-governance";
import { CLOCK_MULTILINGUAL_RISK_POLICY } from "./multilingual-risk";
import { CLOCK_SOURCE_SATURATION_POLICY } from "./source-saturation";

export const CLOCK_EFFECTIVE_INVERSE_AUDIT = {
  ...CLOCK_INVERSE_AUDIT,
  HAND_INTERCHANGE: {
    status: "ADVANCED_INVERSE_HELD" as const,
    evidenceTaskIds: ["TIME_AFTER_HANDS_INTERCHANGED", "ORIGINAL_FROM_INTERCHANGED"] as const,
    note: "The directly multi-sourced elapsed-duration interchange authority is retained. Exact original-time reconstruction remains an advanced inverse variant until stronger exam-frequency evidence supports promotion.",
  },
};

export const CLOCK_EFFECTIVE_BOUNDARY_AUDIT = {
  ...CLOCK_BOUNDARY_AUDIT,
  HAND_INTERCHANGE: {
    evidenceTaskIds: ["TIME_AFTER_HANDS_INTERCHANGED"] as const,
    obligations: [
      "LESS_THAN_ONE_HOUR_WINDOW",
      "COMBINED_HAND_MOVEMENT_360",
      "PHYSICAL_PAIR_EXISTENCE",
      "DO_NOT_USE_COINCIDENCE_RELATIVE_SPEED",
    ] as const,
    note: "The source-natural elapsed-duration form uses (6 + 0.5)t = 360 for the first interchange within one hour and is independently checked against exact physical hand-pair geometry.",
  },
};

export type ClockEffectiveGapStatus =
  | "CORE_CLUSTER_COVERED"
  | "INTENTIONAL_ADVANCED_HOLD"
  | "UNRESOLVED_SOURCE_BACKED_HOLD"
  | "INTERNAL_ONLY";

export const CLOCK_EFFECTIVE_GAP_AUDIT = Object.fromEntries(
  (Object.keys(CLOCK_EFFECTIVE_CANDIDATE_DISPOSITION) as ClockTaskId[]).map((taskId) => {
    const disposition = CLOCK_EFFECTIVE_CANDIDATE_DISPOSITION[taskId];
    const source = CLOCK_EFFECTIVE_SOURCE_AUDIT[taskId];
    let status: ClockEffectiveGapStatus = "CORE_CLUSTER_COVERED";
    if (disposition.disposition === "INTERNAL_VERIFICATION_ONLY") status = "INTERNAL_ONLY";
    else if (disposition.disposition === "HOLD_FOR_ADVANCED_SOURCE_CONFIRMATION") {
      status = source.evidenceLevel === "DIRECT_SOURCE" || source.evidenceLevel === "DIRECT_MULTI_SOURCE"
        ? "UNRESOLVED_SOURCE_BACKED_HOLD"
        : "INTENTIONAL_ADVANCED_HOLD";
    }
    return [taskId, {
      taskId,
      status,
      cluster: disposition.cluster,
      sourceEvidenceLevel: source.evidenceLevel,
    }];
  }),
) as Record<ClockTaskId, {
  taskId: ClockTaskId;
  status: ClockEffectiveGapStatus;
  cluster: string;
  sourceEvidenceLevel: (typeof CLOCK_EFFECTIVE_SOURCE_AUDIT)[ClockTaskId]["evidenceLevel"];
}>;

const unresolvedSourceBackedHoldCount = Object.values(CLOCK_EFFECTIVE_GAP_AUDIT)
  .filter((record) => record.status === "UNRESOLVED_SOURCE_BACKED_HOLD").length;

export const CLOCK_EFFECTIVE_DISCOVERY_GATE_POLICY = {
  status: "TECHNICAL_DISCOVERY_GATES_COMPLETE__FREEZE_REVIEW_REQUIRED",
  prototypeExecutionComplete: true,
  solverVerifierAgreementComplete: true,
  mergeSplitAuditComplete: true,
  inverseAuditComplete: true,
  boundaryAuditComplete: true,
  gapAuditComplete: true,
  unresolvedSourceBackedHoldsResolved: unresolvedSourceBackedHoldCount === 0,
  sourceSaturationComplete: CLOCK_SOURCE_SATURATION_POLICY.sourceSaturationComplete,
  difficultyAuditComplete: CLOCK_DIFFICULTY_POLICY.difficultyAuditComplete,
  multilingualRiskAuditComplete: CLOCK_MULTILINGUAL_RISK_POLICY.riskAuditComplete,
  noUnexplainedSourceFamily: unresolvedSourceBackedHoldCount === 0,
  discoveryFreezeEligible: true,
  discoveryFrozen: false,
  authorityCountFrozen: false,
  humanEditorialFreezeComplete: false,
  permanentQlAllocationAllowed: false,
} as const;

export function clockEffectiveDiscoveryAuditSummary() {
  const authorityClusters = effectiveClockAuthorityClusters();
  const inverseClusters = Object.keys(CLOCK_EFFECTIVE_INVERSE_AUDIT).sort();
  const boundaryClusters = Object.keys(CLOCK_EFFECTIVE_BOUNDARY_AUDIT).sort();
  const unresolvedSourceBackedHolds = Object.values(CLOCK_EFFECTIVE_GAP_AUDIT)
    .filter((record) => record.status === "UNRESOLVED_SOURCE_BACKED_HOLD")
    .map((record) => record.taskId)
    .sort();
  const intentionalAdvancedHolds = Object.values(CLOCK_EFFECTIVE_GAP_AUDIT)
    .filter((record) => record.status === "INTENTIONAL_ADVANCED_HOLD")
    .map((record) => record.taskId)
    .sort();
  return {
    authorityClusters,
    inverseClusters,
    boundaryClusters,
    unresolvedSourceBackedHolds,
    intentionalAdvancedHolds,
    sourceSaturationComplete: CLOCK_SOURCE_SATURATION_POLICY.sourceSaturationComplete,
    difficultyAuditComplete: CLOCK_DIFFICULTY_POLICY.difficultyAuditComplete,
    multilingualRiskAuditComplete: CLOCK_MULTILINGUAL_RISK_POLICY.riskAuditComplete,
    discoveryFreezeEligible: CLOCK_EFFECTIVE_DISCOVERY_GATE_POLICY.discoveryFreezeEligible,
    discoveryFrozen: CLOCK_EFFECTIVE_DISCOVERY_GATE_POLICY.discoveryFrozen,
  } as const;
}
