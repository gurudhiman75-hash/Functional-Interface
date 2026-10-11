import { TSD_CP007_AUTHORITY_OVERLAP_AUDIT, TSD_CP007_OVERLAP_COUNTS } from "./authority-overlap-audit";
import { TSD_CP007_FINAL_NEW_AUTHORITY_CANDIDATES } from "./final-ownership-candidate";

export const TSD_CP007_AUTHORITY_APPROVAL = Object.freeze({
  checkpointId: "TSD-CP-007" as const,
  status: "PRODUCT_OWNER_APPROVED_AUTHORITY_BOUNDARY" as const,
  approvedOn: "2026-08-22" as const,
  approvalInstruction: "Approved" as const,
  approvedSourceBranch: "feat/tsd-cp007-executable-discovery-v1" as const,
  approvedSourceHead: "e00d4dbb9628a1d362ef0a33814a489912b909ac" as const,
  approvedProofRunId: 32508715850 as const,
  learnerAuthorityCount: 11 as const,
  mergedCoreModeCount: 12 as const,
  heldCrossCheckpointCount: 2 as const,
  heldRepresentationCount: 4 as const,
  internalQaCount: 4 as const,
  firstPermanentQl: "TSD-QL-084" as const,
  lastPermanentQl: "TSD-QL-094" as const,
  nextPermanentQl: "TSD-QL-095" as const,
  englishFreezeStatus: "UNFROZEN" as const,
  questionStudioEnabled: false as const,
  questionBankStatus: "NOT_STORED" as const,
  testEligibility: "INELIGIBLE" as const,
  publiclyPublishable: false as const,
});

export const TSD_CP007_APPROVED_LEARNER_AUTHORITIES = Object.freeze(
  TSD_CP007_FINAL_NEW_AUTHORITY_CANDIDATES.map((authority) => Object.freeze({
    authorityKey: authority.authorityKey,
    underlyingSolveModes: authority.underlyingSolveModes,
    examRepresentations: authority.examRepresentations,
    sourceSaturationRequirements: authority.sourceSaturationRequirements,
    approvalStatus: "PRODUCT_OWNER_APPROVED" as const,
  })),
);

export const TSD_CP007_HELD_CROSS_CHECKPOINT_MODES = Object.freeze(
  TSD_CP007_AUTHORITY_OVERLAP_AUDIT.filter((entry) => entry.decision === "HOLD_CROSS_CHECKPOINT_OVERLAP"),
);
export const TSD_CP007_HELD_REPRESENTATION_MODES = Object.freeze(
  TSD_CP007_AUTHORITY_OVERLAP_AUDIT.filter((entry) => entry.decision === "HOLD_REPRESENTATION_CANDIDATE"),
);
export const TSD_CP007_INTERNAL_QA_MODES = Object.freeze(
  TSD_CP007_AUTHORITY_OVERLAP_AUDIT.filter((entry) => entry.decision === "INTERNAL_QA"),
);

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(TSD_CP007_APPROVED_LEARNER_AUTHORITIES.length === 11, "CP007 approved learner authority count changed");
assert(new Set(TSD_CP007_APPROVED_LEARNER_AUTHORITIES.map((entry) => entry.authorityKey)).size === 11, "CP007 approved authority keys are not unique");
assert(TSD_CP007_OVERLAP_COUNTS.mergedCoreModes === 12, "CP007 merged core count changed during approval");
assert(TSD_CP007_HELD_CROSS_CHECKPOINT_MODES.length === 2, "CP007 cross-checkpoint hold count changed during approval");
assert(TSD_CP007_HELD_REPRESENTATION_MODES.length === 4, "CP007 representation hold count changed during approval");
assert(TSD_CP007_INTERNAL_QA_MODES.length === 4, "CP007 internal-QA count changed during approval");
