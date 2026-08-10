import { TSD_CP003_NEW_AUTHORITY_CANDIDATES } from "./post-overlap-authority-registry";
import { TSD_CP003_REPRESENTATION_EXTENSION_APPROVALS } from "./representation-extension-approval";

export interface TsdCp003FinalOwnershipCandidate {
  readonly authorityKey: string;
  readonly checkpointId: "TSD-CP-003";
  readonly underlyingSolveModes: readonly string[];
  readonly ownershipStatus: "FINAL_MERGE_SPLIT_CANDIDATE";
  readonly permanentQlId: null;
  readonly englishFreezeStatus: "UNFROZEN";
}

export const TSD_CP003_FINAL_NEW_AUTHORITY_CANDIDATES: readonly TsdCp003FinalOwnershipCandidate[] = Object.freeze(
  TSD_CP003_NEW_AUTHORITY_CANDIDATES.map((authority) => Object.freeze({
    authorityKey: authority.authorityKey,
    checkpointId: "TSD-CP-003" as const,
    underlyingSolveModes: Object.freeze([...authority.underlyingSolveModes]),
    ownershipStatus: "FINAL_MERGE_SPLIT_CANDIDATE" as const,
    permanentQlId: null,
    englishFreezeStatus: "UNFROZEN" as const,
  })),
);

export const TSD_CP003_FINAL_OWNERSHIP_CANDIDATE_SUMMARY = Object.freeze({
  newCp003LearnerAuthorities: TSD_CP003_FINAL_NEW_AUTHORITY_CANDIDATES.length,
  mergedDiscoveryModes: TSD_CP003_FINAL_NEW_AUTHORITY_CANDIDATES.reduce(
    (count, authority) => count + Math.max(0, authority.underlyingSolveModes.length - 1),
    0,
  ),
  approvedPriorRepresentationFamilies: TSD_CP003_REPRESENTATION_EXTENSION_APPROVALS.length,
  distinctPriorRepresentationTargets: new Set(TSD_CP003_REPRESENTATION_EXTENSION_APPROVALS.map((approval) => approval.targetAuthority)).size,
  rejectedStandaloneLearnerAuthorities: 1,
  rejectedSolveModes: Object.freeze(["scheduleBuffer"] as const),
  permanentQlCount: 0,
  englishFreezeStatus: "UNFROZEN" as const,
  questionBankStatus: "NOT_STORED" as const,
  testEligibility: "INELIGIBLE" as const,
  publiclyPublishable: false as const,
});