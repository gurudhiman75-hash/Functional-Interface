import {
  INT_CP002_FINAL_QL_IDS,
  INT_CP002_FINAL_REGISTRY,
  INT_CP002_RELEASE_CANDIDATE_ID,
  type IntCp002FinalQlId,
  type IntCp002FinalRegistryEntry,
} from "./cp002-final-registry";

export const INT_CP002_ENGLISH_FREEZE_ID = "INT-CP-002-EN-v1-frozen" as const;

export const INT_CP002_ENGLISH_FREEZE_APPROVAL = Object.freeze({
  approvalAuthority: "EXPLICIT_USER_EDITORIAL_SIGN_OFF" as const,
  approvalDate: "2026-08-02" as const,
  approvalCommentId: 5158690713 as const,
  approvedSourceBranch: "feat/int-001-cp002-final-saturation-freeze" as const,
  approvedSourceHead: "1f66170f1ed34c49a1d51397adc5710f98722bb1" as const,
  approvedReleaseCandidateId: INT_CP002_RELEASE_CANDIDATE_ID,
  approvedArtifactId: 8834685873 as const,
  approvedArtifactDigest: "sha256:79ec0160dbbaa310ff50c1bc4f50e8e2db0dd49bb23f8ac9152a9f181d39c22d" as const,
  approvedReviewProjectionSha256: "22c554e9cc1e036bb5ae0847fced41fb950255f4bfca3b0cb89f8ea89146d8c7" as const,
  approvedRegistrySha256: "0de02d78014169a919937613a398ce4d106376173bb90f2bf2f081d3368eb0a1" as const,
  qlRange: "INT-QL-022..INT-QL-052" as const,
  qlCount: 31 as const,
  language: "en" as const,
  locale: "en-IN" as const,
  permanentIdentityFrozen: true as const,
  learnerContentFrozen: true as const,
  solverAuthorityFrozen: true as const,
  enabled: false as const,
  stagingStatus: "NOT_STAGED" as const,
  registrationStatus: "NOT_REGISTERED" as const,
  questionStudioDiscoverable: false as const,
  questionBankStatus: "NOT_STORED" as const,
  testEligibility: "INELIGIBLE" as const,
  publiclyPublishable: false as const,
});

export type IntCp002EnglishFreezeId = typeof INT_CP002_ENGLISH_FREEZE_ID;

export interface IntCp002EnglishFrozenRegistryEntry extends IntCp002FinalRegistryEntry {
  readonly freezeId: IntCp002EnglishFreezeId;
  readonly sourceReleaseCandidateId: typeof INT_CP002_RELEASE_CANDIDATE_ID;
  readonly allocationStatus: "PRODUCT_OWNER_APPROVED_INACTIVE_ENGLISH_IMPLEMENTATION";
  readonly permanentIdentityFrozen: true;
  readonly learnerContentFrozen: true;
  readonly maturity: "ENGLISH_IMPLEMENTATION_FROZEN";
  readonly reviewStatus: "APPROVED_ENGLISH_FROZEN";
  readonly approvalCommentId: typeof INT_CP002_ENGLISH_FREEZE_APPROVAL.approvalCommentId;
  readonly approvedSourceHead: typeof INT_CP002_ENGLISH_FREEZE_APPROVAL.approvedSourceHead;
  readonly questionBankStatus: "NOT_STORED";
  readonly testEligibility: "INELIGIBLE";
}

if (INT_CP002_FINAL_QL_IDS.length !== INT_CP002_ENGLISH_FREEZE_APPROVAL.qlCount) {
  throw new Error("INT-CP-002 approved English QL count changed after sign-off.");
}
if (INT_CP002_FINAL_QL_IDS[0] !== "INT-QL-022" || INT_CP002_FINAL_QL_IDS.at(-1) !== "INT-QL-052") {
  throw new Error("INT-CP-002 approved English QL range changed after sign-off.");
}

export const INT_CP002_ENGLISH_FROZEN_REGISTRY: readonly IntCp002EnglishFrozenRegistryEntry[] =
  Object.freeze(INT_CP002_FINAL_REGISTRY.map((entry) => Object.freeze({
    ...entry,
    freezeId: INT_CP002_ENGLISH_FREEZE_ID,
    sourceReleaseCandidateId: INT_CP002_RELEASE_CANDIDATE_ID,
    allocationStatus: "PRODUCT_OWNER_APPROVED_INACTIVE_ENGLISH_IMPLEMENTATION" as const,
    permanentIdentityFrozen: true as const,
    learnerContentFrozen: true as const,
    maturity: "ENGLISH_IMPLEMENTATION_FROZEN" as const,
    reviewStatus: "APPROVED_ENGLISH_FROZEN" as const,
    approvalCommentId: INT_CP002_ENGLISH_FREEZE_APPROVAL.approvalCommentId,
    approvedSourceHead: INT_CP002_ENGLISH_FREEZE_APPROVAL.approvedSourceHead,
    questionBankStatus: "NOT_STORED" as const,
    testEligibility: "INELIGIBLE" as const,
  })));

const frozenRegistryByQl = new Map<IntCp002FinalQlId, IntCp002EnglishFrozenRegistryEntry>(
  INT_CP002_ENGLISH_FROZEN_REGISTRY.map((entry) => [entry.qlId, entry]),
);

export function getIntCp002EnglishFrozenRegistryEntry(
  qlId: IntCp002FinalQlId,
): IntCp002EnglishFrozenRegistryEntry {
  const entry = frozenRegistryByQl.get(qlId);
  if (!entry) throw new Error(`Unknown frozen INT-CP-002 English QL '${qlId}'.`);
  return entry;
}
