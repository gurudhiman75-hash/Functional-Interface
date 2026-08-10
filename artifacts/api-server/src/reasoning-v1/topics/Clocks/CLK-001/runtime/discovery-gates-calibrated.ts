import type { ClockTaskId } from "./catalog";
import { CLOCK_DIFFICULTY_POLICY } from "./difficulty-governance";
import { CLOCK_ITEM_DIFFICULTY_POLICY } from "./difficulty-item";
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

/**
 * Registry/source decisions, semantic difficulty and multilingual-risk discovery
 * are automated prerequisites. They are deliberately distinct from final source
 * saturation sign-off and human item-level difficulty calibration. Those two
 * human gates remain open, so discovery freeze and permanent QL allocation stay
 * blocked even though the technical audit infrastructure is complete.
 */
export const CLOCK_EFFECTIVE_DISCOVERY_GATE_POLICY = {
  status: "TECHNICAL_DISCOVERY_AUDITS_COMPLETE__HUMAN_GATES_OPEN",
  prototypeExecutionComplete: true,
  solverVerifierAgreementComplete: true,
  mergeSplitAuditComplete: true,
  inverseAuditComplete: true,
  boundaryAuditComplete: true,
  gapAuditComplete: true,
  unresolvedSourceBackedHoldsResolved: unresolvedSourceBackedHoldCount === 0,
  declaredSourceRegistrySaturationComplete: CLOCK_SOURCE_SATURATION_POLICY.sourceSaturationComplete,
  sourceSaturationComplete: false,
  semanticDifficultyAuditComplete: CLOCK_DIFFICULTY_POLICY.difficultyAuditComplete,
  itemLevelDifficultyModelImplemented: CLOCK_ITEM_DIFFICULTY_POLICY.semanticBaselineRequired && CLOCK_ITEM_DIFFICULTY_POLICY.generatedItemFeaturesRequired,
  difficultyHumanCalibrationRequired: CLOCK_ITEM_DIFFICULTY_POLICY.humanCalibrationRequired,
  difficultyAuditComplete: false,
  multilingualRiskAuditComplete: CLOCK_MULTILINGUAL_RISK_POLICY.riskAuditComplete,
  noUnexplainedDeclaredSourceFamily: unresolvedSourceBackedHoldCount === 0,
  discoveryFreezeEligible: false,
  discoveryFrozen: false,
  authorityCountFrozen: false,
  humanEditorialFreezeComplete: false,
  permanentQlAllocationAllowed: false,
  blockingGates: ["SOURCE_SATURATION_SIGN_OFF", "ITEM_LEVEL_DIFFICULTY_HUMAN_CALIBRATION"] as const,
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
    declaredSourceRegistrySaturationComplete: CLOCK_EFFECTIVE_DISCOVERY_GATE_POLICY.declaredSourceRegistrySaturationComplete,
    sourceSaturationComplete: CLOCK_EFFECTIVE_DISCOVERY_GATE_POLICY.sourceSaturationComplete,
    semanticDifficultyAuditComplete: CLOCK_EFFECTIVE_DISCOVERY_GATE_POLICY.semanticDifficultyAuditComplete,
    itemLevelDifficultyModelImplemented: CLOCK_EFFECTIVE_DISCOVERY_GATE_POLICY.itemLevelDifficultyModelImplemented,
    difficultyAuditComplete: CLOCK_EFFECTIVE_DISCOVERY_GATE_POLICY.difficultyAuditComplete,
    multilingualRiskAuditComplete: CLOCK_EFFECTIVE_DISCOVERY_GATE_POLICY.multilingualRiskAuditComplete,
    blockingGates: CLOCK_EFFECTIVE_DISCOVERY_GATE_POLICY.blockingGates,
    discoveryFreezeEligible: CLOCK_EFFECTIVE_DISCOVERY_GATE_POLICY.discoveryFreezeEligible,
    discoveryFrozen: CLOCK_EFFECTIVE_DISCOVERY_GATE_POLICY.discoveryFrozen,
  } as const;
}
