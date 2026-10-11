import { TSD_CP005_FINAL_NEW_AUTHORITY_CANDIDATES, TSD_CP005_HELD_CROSS_CHECKPOINT_MODES, TSD_CP005_INTERNAL_QA_MODES } from "./final-ownership-candidate";

export const TSD_CP005_AUTHORITY_APPROVAL = Object.freeze({
  checkpointId: "TSD-CP-005" as const,
  status: "PRODUCT_OWNER_APPROVED_AUTHORITY_BOUNDARY" as const,
  approvedOn: "2026-08-18" as const,
  approvalInstruction: "Yes" as const,
  approvedSourceBranch: "feat/tsd-cp005-post-meeting-discovery" as const,
  approvedSourceHead: "62f73932b763f8535ce9bc162a03798ae74b8be3" as const,
  learnerAuthorityCount: 13 as const,
  heldCrossCheckpointCount: 6 as const,
  heldRepresentationCount: 1 as const,
  internalQaCount: 4 as const,
  firstPermanentQl: "TSD-QL-058" as const,
  lastPermanentQl: "TSD-QL-070" as const,
  nextPermanentQl: "TSD-QL-071" as const,
  englishFreezeStatus: "UNFROZEN" as const,
  questionStudioEnabled: false as const,
  questionBankStatus: "NOT_STORED" as const,
  testEligibility: "INELIGIBLE" as const,
  publiclyPublishable: false as const,
});

export const TSD_CP005_APPROVED_LEARNER_AUTHORITIES = Object.freeze(
  TSD_CP005_FINAL_NEW_AUTHORITY_CANDIDATES.map((authority) => Object.freeze({
    authorityKey: authority.authorityKey,
    underlyingSolveModes: authority.underlyingSolveModes,
    examRepresentations: authority.examRepresentations,
    approvalStatus: "PRODUCT_OWNER_APPROVED" as const,
  })),
);

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(TSD_CP005_APPROVED_LEARNER_AUTHORITIES.length === 13, "CP005 approved learner authority count changed");
assert(new Set(TSD_CP005_APPROVED_LEARNER_AUTHORITIES.map((entry) => entry.authorityKey)).size === 13, "CP005 approved authority keys are not unique");
assert(TSD_CP005_HELD_CROSS_CHECKPOINT_MODES.length === 6, "CP005 cross-checkpoint hold count changed during approval");
assert(TSD_CP005_INTERNAL_QA_MODES.length === 4, "CP005 internal-QA count changed during approval");
