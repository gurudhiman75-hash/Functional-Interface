import { TSD_CP006_FINAL_NEW_AUTHORITY_CANDIDATES } from "./final-ownership-candidate";
import { TSD_CP006_AUTHORITY_OVERLAP_AUDIT, TSD_CP006_OVERLAP_COUNTS } from "./authority-overlap-audit";

export const TSD_CP006_AUTHORITY_APPROVAL = Object.freeze({
  checkpointId: "TSD-CP-006" as const,
  status: "PRODUCT_OWNER_APPROVED_AUTHORITY_BOUNDARY" as const,
  approvedOn: "2026-08-20" as const,
  approvalInstruction: "Approved" as const,
  approvedSourceBranch: "feat/tsd-cp005-studio-cp006-discovery-v1" as const,
  approvedSourceHead: "040099d1e03f3f484a7d0c14d25d76bcab5f2274" as const,
  learnerAuthorityCount: 13 as const,
  mergedCoreModeCount: 11 as const,
  heldCrossCheckpointCount: 2 as const,
  heldAdvancedCount: 2 as const,
  heldRepresentationCount: 3 as const,
  internalQaCount: 3 as const,
  firstPermanentQl: "TSD-QL-071" as const,
  lastPermanentQl: "TSD-QL-083" as const,
  nextPermanentQl: "TSD-QL-084" as const,
  englishFreezeStatus: "UNFROZEN" as const,
  questionStudioEnabled: false as const,
  questionBankStatus: "NOT_STORED" as const,
  testEligibility: "INELIGIBLE" as const,
  publiclyPublishable: false as const,
});

export const TSD_CP006_APPROVED_LEARNER_AUTHORITIES = Object.freeze(
  TSD_CP006_FINAL_NEW_AUTHORITY_CANDIDATES.map((authority) => Object.freeze({
    authorityKey: authority.authorityKey,
    underlyingSolveModes: authority.underlyingSolveModes,
    examRepresentations: authority.examRepresentations,
    sourceSaturationRequirements: authority.sourceSaturationRequirements,
    approvalStatus: "PRODUCT_OWNER_APPROVED" as const,
  })),
);

export const TSD_CP006_HELD_CROSS_CHECKPOINT_MODES = Object.freeze(
  TSD_CP006_AUTHORITY_OVERLAP_AUDIT.filter((entry) => entry.decision === "HOLD_CROSS_CHECKPOINT_OVERLAP"),
);
export const TSD_CP006_HELD_ADVANCED_MODES = Object.freeze(
  TSD_CP006_AUTHORITY_OVERLAP_AUDIT.filter((entry) => entry.decision === "HOLD_ADVANCED_DISCOVERY"),
);
export const TSD_CP006_HELD_REPRESENTATION_MODES = Object.freeze(
  TSD_CP006_AUTHORITY_OVERLAP_AUDIT.filter((entry) => entry.decision === "HOLD_REPRESENTATION_CANDIDATE"),
);
export const TSD_CP006_INTERNAL_QA_MODES = Object.freeze(
  TSD_CP006_AUTHORITY_OVERLAP_AUDIT.filter((entry) => entry.decision === "INTERNAL_QA"),
);

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(TSD_CP006_APPROVED_LEARNER_AUTHORITIES.length === 13, "CP006 approved learner authority count changed");
assert(new Set(TSD_CP006_APPROVED_LEARNER_AUTHORITIES.map((entry) => entry.authorityKey)).size === 13, "CP006 approved authority keys are not unique");
assert(TSD_CP006_OVERLAP_COUNTS.mergedCoreModes === 11, "CP006 merged core count changed during approval");
assert(TSD_CP006_HELD_CROSS_CHECKPOINT_MODES.length === 2, "CP006 cross-checkpoint hold count changed during approval");
assert(TSD_CP006_HELD_ADVANCED_MODES.length === 2, "CP006 advanced hold count changed during approval");
assert(TSD_CP006_HELD_REPRESENTATION_MODES.length === 3, "CP006 representation hold count changed during approval");
assert(TSD_CP006_INTERNAL_QA_MODES.length === 3, "CP006 internal-QA count changed during approval");
