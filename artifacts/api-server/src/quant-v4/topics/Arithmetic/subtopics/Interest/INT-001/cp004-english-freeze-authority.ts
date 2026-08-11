import {
  INT_CP004_QL_IDS,
  INT_CP004_REGISTRY,
  type Cp004RegistryEntry,
  type IntCp004QlId,
} from "./cp004-frequency-math";

export const INT_CP004_ENGLISH_FREEZE_ID = "INT-CP-004-EN-v1-frozen" as const;

export const INT_CP004_ENGLISH_FREEZE_APPROVAL = Object.freeze({
  approvalAuthority: "EXPLICIT_USER_EDITORIAL_SIGN_OFF" as const,
  approvalDate: "2026-08-07" as const,
  approvalCommentId: 5218194545 as const,
  approvedSourceBranch: "feat/int-001-cp004-frequency-broken-periods" as const,
  approvedSourceHead: "9f8790d3ec0f630d37fd5e832fc5740f1c1928d9" as const,
  approvedAuthorityVersion: "INT-CP-004-MATH-AUTHORITY-v1" as const,
  approvedGeneratorVersion: "INT-CP-004-EXAM-GENERATOR-v1" as const,
  approvedSolverVersion: "INT-CP-004-CANONICAL-SOLVER-v1" as const,
  approvedVerifierVersion: "INT-CP-004-RELATION-VERIFIER-v1" as const,
  approvedEditorialVersion: "INT-CP-004-EDITORIAL-REMEDIATION-v3" as const,
  approvedWorkflowRunId: 31186746512 as const,
  approvedArtifactId: 8997051817 as const,
  approvedArtifactDigest: "sha256:5be96c82b904083b8312380ff218dbaf7bb291b868fbde3b2967137bd4b9686b" as const,
  approvedReviewMarkdownSha256: "cee76ec6e1b44cf53467c4229cbe9ef360021fe992365f9378b09f91687baaf5" as const,
  approvedReviewDataSha256: "d8cc8d9c09b7dce91eeee2752819a4c46fc78fd5633fe454ee8be55f20d53da1" as const,
  approvedRegistrySha256: "a7de3966fd4d2471fbee203f532c9ed4084336a5312ba7d7ec328ccdce260b67" as const,
  qlRange: "INT-QL-067..INT-QL-085" as const,
  qlCount: 19 as const,
  reviewQuestionCount: 76 as const,
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

export type IntCp004EnglishFreezeId = typeof INT_CP004_ENGLISH_FREEZE_ID;

export interface IntCp004EnglishFrozenRegistryEntry extends Cp004RegistryEntry {
  readonly freezeId: IntCp004EnglishFreezeId;
  readonly sourceGeneratorVersion: typeof INT_CP004_ENGLISH_FREEZE_APPROVAL.approvedGeneratorVersion;
  readonly allocationStatus: "PRODUCT_OWNER_APPROVED_INACTIVE_ENGLISH_IMPLEMENTATION";
  readonly permanentIdentityFrozen: true;
  readonly learnerContentFrozen: true;
  readonly maturity: "ENGLISH_IMPLEMENTATION_FROZEN";
  readonly reviewStatus: "APPROVED_ENGLISH_FROZEN";
  readonly approvalCommentId: typeof INT_CP004_ENGLISH_FREEZE_APPROVAL.approvalCommentId;
  readonly approvedSourceHead: typeof INT_CP004_ENGLISH_FREEZE_APPROVAL.approvedSourceHead;
  readonly enabled: false;
  readonly stagingStatus: "NOT_STAGED";
  readonly registrationStatus: "NOT_REGISTERED";
  readonly questionStudioDiscoverable: false;
  readonly questionBankStatus: "NOT_STORED";
  readonly testEligibility: "INELIGIBLE";
  readonly publiclyPublishable: false;
}

if (INT_CP004_QL_IDS.length !== INT_CP004_ENGLISH_FREEZE_APPROVAL.qlCount) {
  throw new Error("INT-CP-004 approved English QL count changed after sign-off.");
}
if (INT_CP004_QL_IDS[0] !== "INT-QL-067" || INT_CP004_QL_IDS.at(-1) !== "INT-QL-085") {
  throw new Error("INT-CP-004 approved English QL range changed after sign-off.");
}

export const INT_CP004_ENGLISH_FROZEN_REGISTRY: readonly IntCp004EnglishFrozenRegistryEntry[] =
  Object.freeze(INT_CP004_REGISTRY.map((entry) => Object.freeze({
    ...entry,
    freezeId: INT_CP004_ENGLISH_FREEZE_ID,
    sourceGeneratorVersion: INT_CP004_ENGLISH_FREEZE_APPROVAL.approvedGeneratorVersion,
    allocationStatus: "PRODUCT_OWNER_APPROVED_INACTIVE_ENGLISH_IMPLEMENTATION" as const,
    permanentIdentityFrozen: true as const,
    learnerContentFrozen: true as const,
    maturity: "ENGLISH_IMPLEMENTATION_FROZEN" as const,
    reviewStatus: "APPROVED_ENGLISH_FROZEN" as const,
    approvalCommentId: INT_CP004_ENGLISH_FREEZE_APPROVAL.approvalCommentId,
    approvedSourceHead: INT_CP004_ENGLISH_FREEZE_APPROVAL.approvedSourceHead,
    enabled: false as const,
    stagingStatus: "NOT_STAGED" as const,
    registrationStatus: "NOT_REGISTERED" as const,
    questionStudioDiscoverable: false as const,
    questionBankStatus: "NOT_STORED" as const,
    testEligibility: "INELIGIBLE" as const,
    publiclyPublishable: false as const,
  })));

const frozenRegistryByQl = new Map<IntCp004QlId, IntCp004EnglishFrozenRegistryEntry>(
  INT_CP004_ENGLISH_FROZEN_REGISTRY.map((entry) => [entry.qlId, entry]),
);

export function getIntCp004EnglishFrozenRegistryEntry(
  qlId: IntCp004QlId,
): IntCp004EnglishFrozenRegistryEntry {
  const entry = frozenRegistryByQl.get(qlId);
  if (!entry) throw new Error(`Unknown frozen INT-CP-004 English QL '${qlId}'.`);
  return entry;
}
